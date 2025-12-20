import geohash from "ngeohash";

export type LatLng = { lat: number; lng: number };
export type BBox = { minLat: number; minLng: number; maxLat: number; maxLng: number };

/**
 * Decodes a geohash to an approximate point (the center of the geohash cell).
 * Note: this is NOT necessarily any original visit coordinate.
 */
export function geohashToCenterLatLng(hash: string): LatLng {
    const decoded = geohash.decode(hash) as { latitude: number; longitude: number };
    return { lat: decoded.latitude, lng: decoded.longitude };
}

/**
 * Returns the geohash cell bounds. Useful if you want to render a rectangle or
 * compute your own centroid.
 */
export function geohashToBBox(hash: string): BBox {
    const [minLat, minLng, maxLat, maxLng] = geohash.decode_bbox(hash) as [
        number,
        number,
        number,
        number
    ];
    return { minLat, minLng, maxLat, maxLng };
}

/**
 * Convenience: center computed from the bbox (same idea as geohashToCenterLatLng).
 */
export function geohashBBoxCenter(hash: string): LatLng {
    const b = geohashToBBox(hash);
    return { lat: (b.minLat + b.maxLat) / 2, lng: (b.minLng + b.maxLng) / 2 };
}
