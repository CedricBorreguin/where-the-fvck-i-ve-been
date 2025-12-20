import { MapContainer, TileLayer } from "react-leaflet";
import Places from "./Places";
import { MAP_TILER_KEY } from "../config";

const center = {
    lat: 21.338859,
    lng: -101.355622,
};

const MapLayer: React.FC = () => {
    return (
        <MapContainer center={center} zoom={5} scrollWheelZoom={true}>
            <TileLayer
                attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                url={`https://api.maptiler.com/maps/base-v4/{z}/{x}/{y}.png?key=${MAP_TILER_KEY}`}
            />
            <Places />
        </MapContainer>
    );
};

export default MapLayer;
