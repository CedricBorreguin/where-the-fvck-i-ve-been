import React from "react";
import useI18n from "../../../i18n/useI18n";

const InfoPage: React.FC<{
    setPage: React.Dispatch<React.SetStateAction<"timeline" | "info">>;
}> = ({ setPage }) => {
    const { translate } = useI18n();
    const [deviceType, setDeviceType] = React.useState<"android" | "ios">("android");
    return (
        <div className="infoPage">
            <button onClick={() => setPage("timeline")}>
                <span>
                    {"<-"}
                    {translate("back")}
                </span>
            </button>
            <div className="get-timeline-instructions-container">
                <h3>{translate("get_your_timeline")}</h3>
                <div className="device-options">
                    <button
                        type="button"
                        className={`dateModeOption ${deviceType === "android" ? "active" : ""}`}
                        onClick={() => setDeviceType("android")}
                    >
                        {translate("android")}
                    </button>
                    <button
                        type="button"
                        className={`dateModeOption ${deviceType === "ios" ? "active" : ""}`}
                        onClick={() => setDeviceType("ios")}
                    >
                        {translate("ios")}
                    </button>
                </div>
                {deviceType === "android" && (
                    <ol>
                        <li>{translate("android_steps_1")}</li>
                        <li>{translate("android_steps_2")}</li>
                        <li>{translate("android_steps_3")}</li>
                        <li>{translate("android_steps_4")}</li>
                        <li>{translate("android_steps_5")}</li>
                        <li>{translate("android_steps_6")}</li>
                    </ol>
                )}
                {deviceType === "ios" && (
                    <ol>
                        <li>{translate("ios_steps_1")}</li>
                        <li>{translate("ios_steps_2")}</li>
                        <li>{translate("ios_steps_3")}</li>
                        <li>{translate("ios_steps_4")}</li>
                        <li>{translate("ios_steps_5")}</li>
                        <li>{translate("ios_steps_6")}</li>
                        <li>{translate("ios_steps_7")}</li>
                    </ol>
                )}
                <h3>{translate("json_title_def")}</h3>
                <p>{translate("json_description")}</p>
                <p>{translate("json_description_2")}</p>
            </div>
            <h3>{translate("app_title")}</h3>
            <p>Version: 1.1.0</p>
            <div className="developer-info">
                {translate("developed_by")} <p>Cedric Borreguin</p>
                <div className="links">
                    <a
                        href="https://www.instagram.com/cedric_b.tv/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img src="/social/social-icons-instagram.svg" alt="Instagram" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/cedric-borreguin/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img src="/social/social-icons-linkedin.svg" alt="LinkedIn" />
                    </a>
                    <a href="mailto:cborreguin@gmail.com" target="_blank" rel="noreferrer">
                        <img src="/social/social-icons-mail.svg" alt="Email" />
                    </a>
                    <a href="https://www.tiktok.com/@cedricb_" target="_blank" rel="noreferrer">
                        <img src="/social/social-icons-tiktok.svg" alt="TikTok" />
                    </a>
                </div>
            </div>
            <p>
                {translate("source_code_available_on")}{" "}
                <a
                    href="https://github.com/CedricBorreguin/where-the-fvck-i-ve-been"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>
            </p>
        </div>
    );
};

export default InfoPage;
