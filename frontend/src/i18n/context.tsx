import React from "react";
import type { SupportedLang, Translation } from "./langs";

export type I18nContextType = {
    selectedLang: SupportedLang;
    setSelectedLang: (lang: SupportedLang) => void;
    translateObject: (value: Translation, vars?: Record<string, string>) => string;
    translate: (value: string, vars?: Record<string, string>) => string;
};

export const I18nContext = React.createContext<I18nContextType>({
    selectedLang: "es",
    setSelectedLang: (lang) => console.log(lang),
    translateObject: (value) => `**${value}**`,
    translate: (value) => `**${value}**`,
});
