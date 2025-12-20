import { createContext, useContext } from "react";

export interface GeohashEntry {
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

export interface CityEntry extends Omit<GeohashEntry, "lat" | "lng"> {
    maxLat: number;
    minLat: number;
    maxLng: number;
    minLng: number;
}

type DateFilterContextValue = {
    dateMode: "year" | "month" | "range";
    setDateMode: (mode: "year" | "month" | "range") => void;
    selectedYear: number;
    setSelectedYear: (year: number) => void;
    selectedMonth: number;
    setSelectedMonth: (month: number) => void;
    rangeStart: Date | null;
    setRangeStart: (date: Date | null) => void;
    rangeEnd: Date | null;
    setRangeEnd: (date: Date | null) => void;
    fetchGeohashDetailsCallback: () => void;
    dateLimits: { minDate: Date | null; maxDate: Date | null };
    loading: boolean;
    distinctCities: Record<string, CityEntry>;
    filteredCities: Record<string, CityEntry>;
    loadCitiesEnabled: boolean;
    visibleCities: Record<string, boolean>;
    hideCity: (cityKey: string) => void;
    showCity: (cityKey: string) => void;
};

export const DateFilterContext = createContext<DateFilterContextValue | null>(null);

export const useDateFilterContext = (): DateFilterContextValue => {
    const ctx = useContext(DateFilterContext);
    if (!ctx) {
        throw new Error("useDateFilterContext must be used within a DateFilterProvider");
    }
    return ctx;
};
