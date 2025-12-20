import { createContext, useContext } from "react";
import type { VisitSimplified } from "../../schemas/Timeline";

type TimelineContextValue = {
    file: File | null;
    setFile: (file: File | null) => void;
    places: Record<string, VisitSimplified>;
    error: string | null;
};

export const TimelineContext = createContext<TimelineContextValue | null>(null);

export const useTimelineContext = (): TimelineContextValue => {
    const ctx = useContext(TimelineContext);
    if (!ctx) {
        throw new Error("useTimelineContext must be used within a TimelineProvider");
    }
    return ctx;
};
