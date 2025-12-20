import * as logger from "firebase-functions/logger";
import { GeohashResponse, PlacesApiResponse } from "../types/geohash";

function createEmptyGeohashEntry(placeId: string, lat: number, lng: number): GeohashResponse {
    return {
        placeId,
        lat,
        lng,
        country: { short_name: "UNKNOWN", long_name: "UNKNOWN" },
        town: { short_name: "UNKNOWN", long_name: "UNKNOWN" },
    };
}

export function parsePlacesResponse(response: PlacesApiResponse): GeohashResponse {
    const entry = createEmptyGeohashEntry(
        response.id,
        response.location.latitude,
        response.location.longitude
    );

    let countryEntry: { longText: string; shortText: string } | null = null;
    let townEntry: { longText: string; shortText: string } | null = null;
    let adminLevel1Entry: { longText: string; shortText: string } | null = null;

    for (const comp of response.addressComponents) {
        if (comp.types?.includes("country")) {
            countryEntry = {
                shortText: comp.shortText,
                longText: comp.longText,
            };
            continue;
        }
        if (comp.types?.includes("locality")) {
            townEntry = {
                shortText: comp.shortText,
                longText: comp.longText,
            };
            continue;
        }
        if (comp.types?.includes("administrative_area_level_1")) {
            adminLevel1Entry = {
                shortText: comp.shortText,
                longText: comp.longText,
            };
            continue;
        }
    }

    if (countryEntry) {
        entry.country = {
            short_name: countryEntry.shortText,
            long_name: countryEntry.longText,
        };
    }

    if (townEntry) {
        entry.town = {
            short_name: townEntry.shortText,
            long_name: townEntry.longText,
        };
    } else if (adminLevel1Entry) {
        entry.town = {
            short_name: adminLevel1Entry.shortText,
            long_name: adminLevel1Entry.longText,
        };
    }
    return entry;
}

export async function fetchPlaceFromApi(
    placeId: string,
    apiKey: string
): Promise<PlacesApiResponse | null> {
    try {
        const url = `https://places.googleapis.com/v1/places/${placeId}`;

        logger.info(`Fetching place details for placeId ${placeId} from Places API`);
        logger.info(`URL: ${url}`);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "id,addressComponents,formattedAddress,location,types",
            },
        });

        if (!res.ok) {
            logger.error(`Places API request failed for placeId ${placeId}`);
            logger.error(`Status: ${res.status} - ${res.statusText}`);
            return null;
        }

        const data: PlacesApiResponse = await res.json();

        if (!data.location) {
            logger.warn("No location in Places response for placeId", placeId);
            return null;
        }

        return data;
    } catch (error) {
        logger.error(`Error fetching place from API for placeId ${placeId}:`);
        logger.error(error);
        return null;
    }
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchMissingPlaces(
    misses: Map<string, string>,
    apiKey: string
): Promise<Map<string, PlacesApiResponse>> {
    const fetched = new Map<string, PlacesApiResponse>();

    for (const [hash, placeId] of misses) {
        const payload = await fetchPlaceFromApi(placeId, apiKey);
        if (payload) {
            fetched.set(hash, payload);
        }
        await delay(50);
    }

    return fetched;
}
