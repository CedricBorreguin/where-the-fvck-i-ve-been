import { PREFIX_LENGTH } from "../config/constants";
import { BucketKey } from "../types/geohash";

export function getBucketKey(hash: string): BucketKey {
    return {
        bucket: hash.slice(0, PREFIX_LENGTH),
        suffix: hash.slice(PREFIX_LENGTH),
    };
}

export function groupByBucket(
    hashes: Map<string, string>
): Map<string, { hash: string; placeId: string }[]> {
    const byBucket = new Map<string, { hash: string; placeId: string }[]>();

    for (const [hash, placeId] of hashes) {
        const { bucket } = getBucketKey(hash);
        const existing = byBucket.get(bucket) ?? [];
        byBucket.set(bucket, [...existing, { hash, placeId }]);
    }

    return byBucket;
}
