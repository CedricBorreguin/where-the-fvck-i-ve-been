import React, { useState } from "react";
import { processTranslations, getTranslation } from "./helpers";
import { I18nContext } from "./context";
import type { SupportedLang, Translation } from "./langs";

const SUPPORTED_LANGS = ["es", "en"] as const;
const initialLang = getLocalStorageLang() ?? detectBrowserLang();

function getLocalStorageLang(): SupportedLang | null {
    const lang = localStorage.getItem("lang-code") as SupportedLang;
    if (lang && SUPPORTED_LANGS.includes(lang)) {
        return lang;
    }
    return null;
}

function detectBrowserLang(): SupportedLang {
    const candidates = [...(navigator.languages ?? []), navigator.language].filter(
        Boolean
    ) as string[];

    for (const raw of candidates) {
        const tag = raw.toLowerCase();
        const primary = tag.split("-")[0];

        if ((SUPPORTED_LANGS as readonly string[]).includes(tag)) return tag as SupportedLang;
        if ((SUPPORTED_LANGS as readonly string[]).includes(primary))
            return primary as SupportedLang;
    }

    return "es";
}

const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedLang, setSelectedLang] = useState<SupportedLang>(initialLang);

    return (
        <I18nContext.Provider
            value={{
                selectedLang: selectedLang,
                setSelectedLang: (lang: SupportedLang) => {
                    setSelectedLang(lang);
                    localStorage.setItem("lang-code", lang);
                    document.documentElement.lang = lang;
                    document.head.querySelector("title")!.textContent = getTranslation(
                        "app_title",
                        {},
                        lang
                    );
                },
                translateObject: (value: Translation, vars) =>
                    processTranslations(value, vars, selectedLang),
                translate: (value, vars) => getTranslation(value, vars, selectedLang),
            }}
        >
            {children}
        </I18nContext.Provider>
    );
};

export default I18nProvider;
