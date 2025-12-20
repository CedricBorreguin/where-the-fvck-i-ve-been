import React, { useEffect, useState } from "react";
import { TimelineContext } from "./Context";
import { TimelineSchema, type VisitSimplified } from "../../schemas/Timeline";
import geohash from "ngeohash";

const prefixLen = 5;

const parseLatLngString = (latLngString: string): { lat: number; lng: number } => {
    const [latStr, lngStr] = latLngString.replaceAll("°", "").split(",");
    return {
        lat: parseFloat(latStr),
        lng: parseFloat(lngStr),
    };
};

const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [places, setPlaces] = useState<Record<string, VisitSimplified>>({});

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    setError(null);
                    const jsonData = JSON.parse(event.target?.result as string);
                    const result = TimelineSchema.safeParse(jsonData);
                    if (!result.success) {
                        console.error("Invalid riddle data:", result.error);
                        setError("JSON invalido, verifica que seguiste las instrucciones.");
                        return;
                    }
                    const riddleData = result.data;

                    const semanticSegments = riddleData.semanticSegments;

                    const places: Record<string, VisitSimplified> = {};
                    for (const segment of semanticSegments) {
                        if (segment.visit) {
                            const visit = segment.visit;
                            const duration =
                                new Date(segment.endTime).getTime() -
                                new Date(segment.startTime).getTime();
                            if (duration < 30 * 60 * 1000) {
                                // Ignore visits shorter than 30 minutes
                                continue;
                            }

                            if (!places[visit.topCandidate.placeId]) {
                                const { lat, lng } = parseLatLngString(
                                    visit.topCandidate.placeLocation.latLng
                                );
                                const hash = geohash.encode(lat, lng, prefixLen);
                                places[visit.topCandidate.placeId] = {
                                    placeId: visit.topCandidate.placeId,
                                    lat,
                                    lng,
                                    startTime: segment.startTime,
                                    endTime: segment.endTime,
                                    geohash: hash,
                                };
                            }
                        }
                    }

                    console.log("Unique places visited:", Object.keys(places).length);
                    setPlaces(places);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    setPlaces({});
                    setError("JSON invalido, verifica que seguiste las instrucciones.");
                }
            };
            reader.readAsText(file);
        }
    }, [file]);

    return (
        <TimelineContext.Provider
            value={{
                file,
                setFile,
                places,
                error,
            }}
        >
            {children}
        </TimelineContext.Provider>
    );
};

export default TimelineProvider;
