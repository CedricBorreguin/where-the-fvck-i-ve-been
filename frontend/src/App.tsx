import "leaflet/dist/leaflet.css";
import { useState } from "react";
import OpenSettingsButton from "./components/OpenSettingsButton";
import TimelineProvider from "./providers/Timeline/Provider";
import SettingsModal from "./components/SettingsModal";
import DateFilterProvider from "./providers/DateFilter/Provider";
import MapLayer from "./components/MapLayer";
import I18nProvider from "./i18n/provider";
import Title from "./components/Title";

function App() {
    const [open, setOpen] = useState(true);

    return (
        <I18nProvider>
            <TimelineProvider>
                <DateFilterProvider>
                    <Title />
                    <OpenSettingsButton onClick={() => setOpen(true)} />
                    <SettingsModal open={open} onClose={() => setOpen(false)} />
                    <MapLayer />
                </DateFilterProvider>
            </TimelineProvider>
        </I18nProvider>
    );
}

export default App;
