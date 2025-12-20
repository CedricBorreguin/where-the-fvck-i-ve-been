import ES from "./dictionaries/es";
import EN from "./dictionaries/en";
import type { SupportedLang, Translation } from "./langs";

const VAR_REGEX = /%[A-Za-z0-9-_]*%/g;

const dictionaries: { [key: string]: { [key: string]: string } } = {
    es: ES,
    en: EN,
};

const hasVariables = (string: string) => {
    return [...Array.from(string.matchAll(VAR_REGEX))].length !== 0;
};

export const getTranslation = (
    key: string,
    vars: Record<string, string> = {},
    lang: SupportedLang
) => {
    const dictionary = dictionaries[lang];

    if (!dictionary[key]) {
        console.info("TRANSLATION NOT FOUND FOR: ", `'${key}'`);
        return `**${key}**`;
    }

    if (!hasVariables(dictionary[key])) return dictionary[key];

    return dictionary[key].replaceAll(VAR_REGEX, (match) => vars[match.replaceAll("%", "")] ?? "");
};

export const processTranslations = (
    value: Translation,
    vars: Record<string, string> = {},
    langKey: SupportedLang
): string => {
    if (Object.keys(value).length === 0) {
        console.log(`Wrong object to 'value' variable: ${JSON.stringify(value)}`);
        return "";
    }

    if (!hasVariables(value[langKey])) return value[langKey];
    return value[langKey].replaceAll(VAR_REGEX, (match) => vars[match.replaceAll("%", "")] ?? "");
};
