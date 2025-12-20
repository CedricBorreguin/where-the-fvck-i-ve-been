import { Firestore } from "firebase-admin/firestore";
import { GEOHASH_BUCKETS_COLLECTION } from "../config/constants";
import { Bucket, PlacesApiResponse } from "../types/geohash";
import { getBucketKey } from "../utils/geohash";

export async function fetchBuckets(
    db: Firestore,
    bucketIds: string[]
): Promise<Map<string, Bucket | null>> {
    const bucketRefs = bucketIds.map((b) => db.doc(`${GEOHASH_BUCKETS_COLLECTION}/${b}`));
    const bucketSnaps = await db.getAll(...bucketRefs);

    const buckets = new Map<string, Bucket | null>();
    for (const snap of bucketSnaps) {
        buckets.set(snap.id, snap.exists ? (snap.data() as Bucket) : null);
    }
    return buckets;
}

export function resolveFromBuckets(
    byBucket: Map<string, { hash: string; placeId: string }[]>,
    buckets: Map<string, Bucket | null>
): { hits: Map<string, PlacesApiResponse>; misses: Map<string, string> } {
    const hits = new Map<string, PlacesApiResponse>();
    const misses = new Map<string, string>();

    for (const [bucket, items] of byBucket) {
        const data = buckets.get(bucket);
        const entries = data?.entries ?? {};

        for (const { hash, placeId } of items) {
            const { suffix } = getBucketKey(hash);
            const entry = entries[suffix] ?? null;

            if (entry) {
                hits.set(hash, entry);
            } else {
                misses.set(hash, placeId);
            }
        }
    }

    return { hits, misses };
}

export async function saveToBuckets(
    db: Firestore,
    fetched: Map<string, PlacesApiResponse>
): Promise<void> {
    const writes: Promise<FirebaseFirestore.WriteResult>[] = [];

    for (const [h, payload] of fetched) {
        const { bucket, suffix } = getBucketKey(h);
        const ref = db.doc(`${GEOHASH_BUCKETS_COLLECTION}/${bucket}`);

        writes.push(ref.set({ entries: { [suffix]: payload } }, { merge: true }));
    }

    await Promise.all(writes);
}
