export interface GeohashResponse {
    placeId: string;
    lat: number;
    lng: number;
    country: {
        short_name: string;
        long_name: string;
    };
    town: {
        short_name: string;
        long_name: string;
    };
}

export interface Bucket {
    entries: {
        [key: string]: PlacesApiResponse;
    };
}

export interface BucketKey {
    bucket: string;
    suffix: string;
}

export interface PlacesApiResponse {
    id: string;
    types: string[];
    formattedAddress: string;
    addressComponents: Array<{
        longText: string;
        shortText: string;
        types?: string[];
    }>;
    location: {
        latitude: number;
        longitude: number;
    };
}
