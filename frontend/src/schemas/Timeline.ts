import { z } from "zod";

// Raw Signal Schemas
export const ProbableActivitySchema = z.object({
    confidence: z.number(),
    type: z.string(),
});
export type ProbableActivity = z.infer<typeof ProbableActivitySchema>;

export const ActivityRecordSchema = z.object({
    probableActivities: z.array(ProbableActivitySchema),
    timestamp: z.string(),
});
export type ActivityRecord = z.infer<typeof ActivityRecordSchema>;

export const PositionSchema = z.object({
    LatLng: z.string(),
    accuracyMeters: z.number(),
    altitudeMeters: z.number(),
    source: z.string(),
    speedMetersPerSecond: z.number(),
    timestamp: z.string(),
});
export type Position = z.infer<typeof PositionSchema>;

export const WifiDeviceRecordSchema = z.object({
    mac: z.number(),
    rawRssi: z.number(),
});
export type WifiDeviceRecord = z.infer<typeof WifiDeviceRecordSchema>;

export const WifiScanSchema = z.object({
    deliveryTime: z.string(),
    devicesRecords: z.array(WifiDeviceRecordSchema).optional(),
});
export type WifiScan = z.infer<typeof WifiScanSchema>;

export const RawSignalSchema = z.object({
    activityRecord: ActivityRecordSchema.optional(),
    position: PositionSchema.optional(),
    wifiScan: WifiScanSchema.optional(),
});
export type RawSignal = z.infer<typeof RawSignalSchema>;

// Semantic Segment Schemas
export const LatLngObjectSchema = z.object({
    latLng: z.string(),
});
export type LatLngObject = z.infer<typeof LatLngObjectSchema>;

export const ActivityTopCandidateSchema = z.object({
    probability: z.number(),
    type: z.string(),
});
export type ActivityTopCandidate = z.infer<typeof ActivityTopCandidateSchema>;

export const SemanticActivitySchema = z.object({
    distanceMeters: z.number(),
    end: LatLngObjectSchema,
    start: LatLngObjectSchema,
    topCandidate: ActivityTopCandidateSchema,
});
export type SemanticActivity = z.infer<typeof SemanticActivitySchema>;

export const TripDestinationSchema = z.object({
    identifier: z.object({
        placeId: z.string(),
    }),
});
export type TripDestination = z.infer<typeof TripDestinationSchema>;

export const TimelineMemorySchema = z.object({
    trip: z.object({
        destinations: z.array(TripDestinationSchema),
        distanceFromOriginKms: z.number(),
    }),
});
export type TimelineMemory = z.infer<typeof TimelineMemorySchema>;

export const TimelinePathPointSchema = z.object({
    point: z.string(),
    time: z.string(),
});
export type TimelinePathPoint = z.infer<typeof TimelinePathPointSchema>;

export const VisitTopCandidateSchema = z.object({
    placeId: z.string(),
    placeLocation: LatLngObjectSchema,
    probability: z.number(),
    semanticType: z.string(),
});
export type VisitTopCandidate = z.infer<typeof VisitTopCandidateSchema>;

export type VisitSimplified = {
    placeId: string;
    lat: number;
    lng: number;
    startTime: string;
    endTime: string;
    geohash: string;
};

export const VisitSchema = z.object({
    hierarchyLevel: z.number(),
    probability: z.number(),
    topCandidate: VisitTopCandidateSchema,
});
export type Visit = z.infer<typeof VisitSchema>;

export const SemanticSegmentSchema = z.object({
    activity: SemanticActivitySchema.optional(),
    endTime: z.string(),
    endTimeTimezoneUtcOffsetMinutes: z.number().optional(),
    startTime: z.string(),
    startTimeTimezoneUtcOffsetMinutes: z.number().optional(),
    timelineMemory: TimelineMemorySchema.optional(),
    timelinePath: z.array(TimelinePathPointSchema).optional(),
    visit: VisitSchema.optional(),
});
export type SemanticSegment = z.infer<typeof SemanticSegmentSchema>;

// User Profile Schemas
export const FrequentPlaceSchema = z.object({
    label: z.string().optional(),
    placeId: z.string(),
    placeLocation: z.string(),
});
export type FrequentPlace = z.infer<typeof FrequentPlaceSchema>;

export const TravelModeAffinitySchema = z.object({
    affinity: z.number(),
    mode: z.string(),
});
export type TravelModeAffinity = z.infer<typeof TravelModeAffinitySchema>;

export const PersonaSchema = z.object({
    travelModeAffinities: z.array(TravelModeAffinitySchema),
});
export type Persona = z.infer<typeof PersonaSchema>;

export const UserLocationProfileSchema = z.object({
    frequentPlaces: z.array(FrequentPlaceSchema),
    persona: PersonaSchema,
});
export type UserLocationProfile = z.infer<typeof UserLocationProfileSchema>;

// Root Schema
export const TimelineSchema = z.object({
    rawSignals: z.array(RawSignalSchema),
    semanticSegments: z.array(SemanticSegmentSchema),
    userLocationProfile: UserLocationProfileSchema,
});

export type Timeline = z.infer<typeof TimelineSchema>;
