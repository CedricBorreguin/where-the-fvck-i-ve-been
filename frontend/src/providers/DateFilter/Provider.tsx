import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DateFilterContext, type CityEntry, type GeohashEntry } from "./Context";
import { useTimelineContext } from "../Timeline/Context";
import type { VisitSimplified } from "../../schemas/Timeline";
import { API_URL } from "../../components/config";

const DateFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dateMode, setDateMode] = useState<"year" | "month" | "range">("year");
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
    const { places } = useTimelineContext();
    const [usedGeohashes, setUsedGeohashes] = useState<Record<string, GeohashEntry | null>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [visiblePlaces, setVisiblePlaces] = useState<Record<string, boolean>>({});

    const dateLimits = useMemo(() => {
        let minDate: Date | null = null;
        let maxDate: Date | null = null;

        Object.values(places).forEach((visit) => {
            const visitStartDate = new Date(visit.startTime);
            if (!minDate || visitStartDate < minDate) {
                minDate = visitStartDate;
            }
            if (!maxDate || visitStartDate > maxDate) {
                maxDate = visitStartDate;
            }
        });

        return { minDate, maxDate };
    }, [places]);

    const filteredPlaces: Record<string, VisitSimplified> = useMemo(() => {
        if (Object.keys(places).length === 0) {
            return {};
        }

        switch (dateMode) {
            case "year": {
                const result: Record<string, VisitSimplified> = {};
                Object.entries(places).forEach(([placeId, visit]) => {
                    const visitYear = new Date(visit.startTime).getFullYear();
                    if (visitYear === selectedYear) {
                        result[placeId] = visit;
                    }
                });
                return result;
            }
            case "month": {
                const result: Record<string, VisitSimplified> = {};
                Object.entries(places).forEach(([placeId, visit]) => {
                    const visitDate = new Date(visit.startTime);
                    const visitYear = visitDate.getFullYear();
                    const visitMonth = visitDate.getMonth() + 1;
                    if (visitYear === selectedYear && visitMonth === selectedMonth) {
                        result[placeId] = visit;
                    }
                });
                return result;
            }
            case "range": {
                if (!rangeStart || !rangeEnd) {
                    return {};
                }
                const result: Record<string, VisitSimplified> = {};
                Object.entries(places).forEach(([placeId, visit]) => {
                    const visitDate = new Date(visit.startTime);
                    if (visitDate >= rangeStart && visitDate <= rangeEnd) {
                        result[placeId] = visit;
                    }
                });
                return result;
            }
            default:
                return {};
        }
    }, [places, dateMode, selectedYear, selectedMonth, rangeStart, rangeEnd]);

    const loadCitiesEnabled = useMemo(() => {
        if (Object.keys(filteredPlaces).length === 0) {
            console.log("No places to fetch geohash details for.");
            return false;
        }

        const missingGeohashes: { [key: string]: string } = {};
        Object.values(filteredPlaces).forEach((visit) => {
            if (!(visit.geohash in usedGeohashes)) {
                missingGeohashes[visit.geohash] = visit.placeId;
            }
        });

        if (Object.keys(missingGeohashes).length === 0) {
            console.log("All geohash details are already fetched.");
            return false;
        }
        return true;
    }, [filteredPlaces, usedGeohashes]);

    const fetchGeohashDetailsCallback = useCallback(() => {
        if (Object.keys(filteredPlaces).length === 0) {
            console.log("No places to fetch geohash details for.");
            return;
        }

        const missingGeohashes: { [key: string]: string } = {};
        Object.values(filteredPlaces).forEach((visit) => {
            if (!(visit.geohash in usedGeohashes)) {
                missingGeohashes[visit.geohash] = visit.placeId;
            }
        });

        if (Object.keys(missingGeohashes).length === 0) {
            console.log("All geohash details are already fetched.");
            return;
        }

        const fetchGeohashDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        geohashes: missingGeohashes,
                    }),
                });

                const response = (await res.json()) as {
                    data: Record<string, GeohashEntry | null>;
                };

                const newUsedGeohashes = { ...usedGeohashes };
                for (const [hash, details] of Object.entries(response.data)) {
                    newUsedGeohashes[hash] = details;
                }
                setUsedGeohashes(newUsedGeohashes);
            } catch (error) {
                console.error("Error fetching geohash details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGeohashDetails();
    }, [filteredPlaces, usedGeohashes]);

    const distinctCities = useMemo(() => {
        console.log("usedGeohashes", usedGeohashes);
        const cities: Record<string, CityEntry> = {};

        for (const geohashDetail of Object.values(usedGeohashes)) {
            if (!geohashDetail) continue;
            const cityKey = `${geohashDetail.town.long_name}-${geohashDetail.country.long_name}`;
            if (cities[cityKey]) {
                const existing = cities[cityKey];
                cities[cityKey] = {
                    ...existing!,
                    maxLat: Math.max(existing!.maxLat, geohashDetail.lat),
                    minLat: Math.min(existing!.minLat, geohashDetail.lat),
                    maxLng: Math.max(existing!.maxLng, geohashDetail.lng),
                    minLng: Math.min(existing!.minLng, geohashDetail.lng),
                };
            } else {
                cities[cityKey] = {
                    ...geohashDetail,
                    maxLat: geohashDetail.lat,
                    minLat: geohashDetail.lat,
                    maxLng: geohashDetail.lng,
                    minLng: geohashDetail.lng,
                };
            }
        }

        return cities;
    }, [usedGeohashes]);

    const filteredCities = useMemo(() => {
        const cities: Record<string, CityEntry> = {};
        for (const visit of Object.values(filteredPlaces)) {
            const geohashDetail = usedGeohashes[visit.geohash];
            if (!geohashDetail) continue;
            const cityKey = `${geohashDetail.town.long_name}-${geohashDetail.country.long_name}`;
            if (cities[cityKey]) {
                const existing = cities[cityKey];
                cities[cityKey] = {
                    ...existing!,
                    maxLat: Math.max(existing!.maxLat, geohashDetail.lat),
                    minLat: Math.min(existing!.minLat, geohashDetail.lat),
                    maxLng: Math.max(existing!.maxLng, geohashDetail.lng),
                    minLng: Math.min(existing!.minLng, geohashDetail.lng),
                };
            } else {
                cities[cityKey] = {
                    ...geohashDetail,
                    maxLat: geohashDetail.lat,
                    minLat: geohashDetail.lat,
                    maxLng: geohashDetail.lng,
                    minLng: geohashDetail.lng,
                };
            }
        }
        return cities;
    }, [filteredPlaces, usedGeohashes]);

    const hideCity = (cityKey: string) => {
        setVisiblePlaces((prev) => ({ ...prev, [cityKey]: false }));
    };

    const showCity = (cityKey: string) => {
        setVisiblePlaces((prev) => {
            const newState = { ...prev };
            newState[cityKey] = true;
            return newState;
        });
    };

    useEffect(() => {
        console.log("distinctCities", filteredCities);
        setVisiblePlaces(
            Object.keys(filteredCities).reduce((acc, cityKey) => {
                acc[cityKey] = true;
                return acc;
            }, {} as Record<string, boolean>)
        );
    }, [filteredCities]);

    return (
        <DateFilterContext.Provider
            value={{
                dateMode,
                setDateMode,
                selectedYear,
                setSelectedYear,
                selectedMonth,
                setSelectedMonth,
                rangeStart,
                setRangeStart,
                rangeEnd,
                setRangeEnd,
                fetchGeohashDetailsCallback,
                dateLimits,
                loading,
                distinctCities,
                loadCitiesEnabled,
                visibleCities: visiblePlaces,
                hideCity,
                showCity,
                filteredCities,
            }}
        >
            {children}
        </DateFilterContext.Provider>
    );
};

export default DateFilterProvider;
