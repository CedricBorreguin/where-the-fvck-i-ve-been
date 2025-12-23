import React, { forwardRef, useState } from "react";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useTimelineContext } from "../../../providers/Timeline/Context";
import { useDateFilterContext } from "../../../providers/DateFilter/Context";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { enUS } from "date-fns/locale/en-US";
import useI18n from "../../../i18n/useI18n";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);
registerLocale("en-US", enUS);

type ExampleCustomInputProps = {
    className?: string;
    value?: string;
    onClick?: () => void;
};

const ExampleCustomInput = forwardRef<HTMLButtonElement, ExampleCustomInputProps>(
    ({ value, onClick, className }, ref) => (
        <button type="button" className={className} onClick={onClick} ref={ref}>
            {value}
        </button>
    )
);
ExampleCustomInput.displayName = "ExampleCustomInput";

const TimelineSettings: React.FC<{
    onClose: () => void;
    setPage: React.Dispatch<React.SetStateAction<"timeline" | "info">>;
}> = ({ onClose, setPage }) => {
    const { selectedLang, translate } = useI18n();
    const { file, setFile, error } = useTimelineContext();
    const {
        fetchGeohashDetailsCallback,
        dateMode,
        selectedYear,
        setSelectedYear,
        setDateMode,
        selectedMonth,
        setSelectedMonth,
        dateLimits,
        loading,
        loadCitiesEnabled,
        filteredCities,
        visibleCities,
        hideCity,
        showCity,
    } = useDateFilterContext();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (file.type === "application/json" || file.name.endsWith(".json")) {
            setFile(file);
        } else {
            alert("Please upload a JSON file");
        }
    };

    const onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDropFile = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer?.files?.[0];
        if (droppedFile) {
            processFile(droppedFile);
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target?.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="settingsContainer__header">
                <div>
                    <h3>{translate("step_1")} </h3>
                    <span onClick={() => setPage("info")}>{translate("what_is_json")}</span>
                </div>
                <button
                    className="info-button"
                    type="button"
                    onClick={() => setPage("info")}
                ></button>
            </div>
            <div
                className={`uploadContainer ${isDragging ? "dragging" : ""} ${
                    file ? "filePresent" : ""
                }`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDropFile}
                onClick={triggerFileInput}
            >
                <p>{translate("drag_json_here")}</p>
                <p>{translate("or")}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput();
                    }}
                >
                    <p>{translate("pick_file")}</p>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={onFileSelect}
                    style={{ display: "none" }}
                />
            </div>

            {file && (
                <div className="fileUploaded">
                    <p>
                        {translate("loaded_file")} {file.name}
                    </p>
                    <button type="button" onClick={triggerFileInput}>
                        {translate("change_file")}
                    </button>
                </div>
            )}

            {file && (
                <div className="dateModePicker">
                    <h3>{translate("step_2")}</h3>
                    <div className="dateModeOptions">
                        <button
                            type="button"
                            className={`dateModeOption ${dateMode === "year" ? "active" : ""}`}
                            onClick={() => setDateMode("year")}
                        >
                            {translate("select_year")}
                        </button>
                        <button
                            type="button"
                            className={`dateModeOption ${dateMode === "month" ? "active" : ""}`}
                            onClick={() => setDateMode("month")}
                        >
                            {translate("select_month")}
                        </button>
                    </div>
                </div>
            )}

            {file && dateMode === "year" && (
                <div className="datePickerContainer">
                    <DatePicker
                        selected={new Date(selectedYear, 6, 1)}
                        showYearPicker
                        dateFormat="yyyy"
                        className="custom-calendar-input"
                        calendarClassName="custom-calendar"
                        maxDate={dateLimits.maxDate || undefined}
                        minDate={dateLimits.minDate || undefined}
                        customInput={<ExampleCustomInput className="example-custom-input" />}
                        onChange={(date: Date | null) =>
                            date && setSelectedYear(date.getFullYear())
                        }
                    />
                </div>
            )}

            {file && dateMode === "month" && (
                <div className="datePickerContainer">
                    <DatePicker
                        selected={
                            selectedMonth && selectedYear
                                ? new Date(selectedYear, selectedMonth - 1, 10)
                                : null
                        }
                        showMonthYearPicker
                        dateFormat="MMM yyyy"
                        className="custom-calendar-input"
                        calendarClassName="custom-calendar"
                        maxDate={dateLimits.maxDate || undefined}
                        minDate={dateLimits.minDate || undefined}
                        customInput={<ExampleCustomInput className="example-custom-input" />}
                        onChange={(date: Date | null) =>
                            date &&
                            (setSelectedYear(date.getFullYear()),
                            setSelectedMonth(date.getMonth() + 1))
                        }
                        locale={selectedLang}
                    />
                </div>
            )}

            {error && <div className="errorMessage">{translate(error)}</div>}

            <div className="settingsContainer__footer">
                <button
                    type="button"
                    onClick={fetchGeohashDetailsCallback}
                    disabled={!file || loading || !loadCitiesEnabled}
                >
                    {loading ? (
                        <Ring size={48} speed={1.5} color={"var(--color-primary)"} />
                    ) : (
                        translate("identify_cities")
                    )}
                </button>
            </div>

            {filteredCities && !loadCitiesEnabled && Object.keys(filteredCities).length > 0 && (
                <div className="distinctCitiesContainer">
                    <h3>{translate("distinct_cities")}</h3>
                    <div className="distinctCitiesGrid">
                        {Object.entries(filteredCities).map(([cityKey, city]) => (
                            <label
                                key={cityKey}
                                className={`cityEntry ${
                                    visibleCities[cityKey] ? "visible" : "hidden"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={visibleCities[cityKey] ?? true}
                                    onChange={() =>
                                        visibleCities[cityKey]
                                            ? hideCity(cityKey)
                                            : showCity(cityKey)
                                    }
                                />
                                <span className="cityName">
                                    {city.town.long_name}, {city.country.long_name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {Object.keys(filteredCities).length > 0 && (
                <button className="closeButton" type="button" disabled={loading} onClick={onClose}>
                    {translate("confirm")}
                </button>
            )}
        </>
    );
};

export default TimelineSettings;
