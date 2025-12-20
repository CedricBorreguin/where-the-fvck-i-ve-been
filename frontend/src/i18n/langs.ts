export const SUPPORTED_LANGS = ["es", "en"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export type Translation = Record<SupportedLang, string>;

const langs: { [key in SupportedLang]: { name: string; short: string } } = {
    es: { name: "Español", short: "ES" },
    en: { name: "English", short: "EN" },
};

export default langs;
