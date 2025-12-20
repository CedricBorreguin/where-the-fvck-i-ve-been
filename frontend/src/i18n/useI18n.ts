import { useContext } from "react";
import { I18nContext, type I18nContextType } from "./context";

const useI18n: () => I18nContextType = () => {
    const { translate, translateObject, selectedLang, setSelectedLang } = useContext(I18nContext);

    return { translate, translateObject, selectedLang, setSelectedLang };
};

export default useI18n;
