import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "./index.scss";
import { SUPPORTED_LANGS } from "../../i18n/langs";
import useI18n from "../../i18n/useI18n";
import TimelineSettings from "./components/TimelineSettings";
import InfoPage from "./components/InfoPage";

const SettingsModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const { selectedLang, setSelectedLang } = useI18n();
    const [page, setPage] = useState<"timeline" | "info">("timeline");

    return (
        <Modal open={open} onClose={onClose} center classNames={{ modal: "settingsModal" }}>
            <div className="settingsContainer">
                <button
                    type="button"
                    className="language-chooser"
                    onClick={() => {
                        if (selectedLang === "es") {
                            setSelectedLang("en");
                            return;
                        } else {
                            setSelectedLang("es");
                            return;
                        }
                    }}
                >
                    {SUPPORTED_LANGS.map((lang) => (
                        <span key={lang} className={selectedLang === lang ? "active" : ""}>
                            {lang.toUpperCase()}
                        </span>
                    ))}
                </button>
                {page === "timeline" && <TimelineSettings onClose={onClose} setPage={setPage} />}
                {page === "info" && <InfoPage setPage={setPage} />}
            </div>
        </Modal>
    );
};

export default SettingsModal;
