import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

import { HASH_LENGTH } from "./config/constants";
import { GeohashResponse } from "./types/geohash";
import { groupByBucket } from "./utils/geohash";
import { fetchMissingPlaces, parsePlacesResponse } from "./services/geocode";
import { fetchBuckets, resolveFromBuckets, saveToBuckets } from "./services/firestore";

const ALLOWED_DOMAINS = ["http://localhost:5173"];

initializeApp();
setGlobalOptions({ maxInstances: 10 });

function validateGeohashes(geohashes: unknown): Record<string, string> | null {
    if (!geohashes || Object.keys(geohashes).length === 0) {
        return null;
    }

    for (const hash in geohashes as Record<string, unknown>) {
        const placeId = (geohashes as Record<string, unknown>)[hash] as unknown;
        if (typeof hash !== "string" || hash.length !== HASH_LENGTH) {
            return null;
        }
        if (typeof placeId !== "string" || placeId.trim() === "") {
            return null;
        }
    }

    return geohashes as Record<string, string>;
}

export const fetchGeohashDetails = onRequest(
    { secrets: ["GOOGLE_MAPS_API_KEY"], cors: ALLOWED_DOMAINS },
    async (request, response) => {
        const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

        if (!GOOGLE_MAPS_API_KEY) {
            logger.error("Google Maps API key is not set");
            response.status(500).json({ message: "Server configuration error" });
            return;
        }

        const geohashes = validateGeohashes(request.body.geohashes);

        if (!geohashes) {
            response.status(400).json({ message: "Invalid or missing geohashes" });
            return;
        }

        logger.log("Received geohashes:", geohashes);

        const unique = new Map(Object.entries(geohashes));
        const byBucket = groupByBucket(unique);
        const db = getFirestore();

        // Fetch existing entries from Firestore
        const buckets = await fetchBuckets(db, Array.from(byBucket.keys()));
        const { hits, misses } = resolveFromBuckets(byBucket, buckets);

        // Fetch missing entries from Google Places API
        const fetched = await fetchMissingPlaces(misses, GOOGLE_MAPS_API_KEY);

        // Save newly fetched entries to Firestore
        await saveToBuckets(db, fetched);

        // Build response maintaining original order
        const data: Record<string, GeohashResponse | null> = {};
        for (const hash of Object.keys(geohashes)) {
            const dataEntry = hits.get(hash) ?? fetched.get(hash) ?? null;
            data[hash] = dataEntry ? parsePlacesResponse(dataEntry) : null;
        }

        response.status(200).json({ message: "Success", data });
    }
);
