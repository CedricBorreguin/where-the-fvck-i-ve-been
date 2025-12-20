import type React from "react";
import { useDateFilterContext } from "../../providers/DateFilter/Context";
import { useEffect, useMemo } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const baseIconOptions: Omit<L.IconOptions, "iconUrl"> = {
    shadowUrl: "/shadow.svg",
    iconSize: [50, 50],
    shadowSize: [20, 30],
    iconAnchor: [25, 35],
    shadowAnchor: [10, -10],
    popupAnchor: [0, -5],
};

const Places: React.FC = () => {
    const map = useMap();
    const { filteredCities, visibleCities } = useDateFilterContext();

    const icons: Record<string, L.Icon> = useMemo(() => {
        const result: Record<string, L.Icon> = {};
        for (const city of Object.values(filteredCities)) {
            const countryCode = city.country.short_name;
            if (!result[countryCode]) {
                result[countryCode] = L.icon({
                    ...baseIconOptions,
                    iconUrl: `/svg-circle-flags/${countryCode.toLocaleLowerCase()}.svg`,
                });
            }
        }
        return result;
    }, [filteredCities]);

    const validCities = useMemo(() => {
        return Object.keys(filteredCities)
            .filter((city) => visibleCities[city])
            .filter((cityKey) => {
                const city = filteredCities[cityKey];
                const icon = icons[city.country.short_name];
                if (!icon) {
                    console.log("No icon for country", city.country.short_name);
                    return false;
                }
                return true;
            });
    }, [filteredCities, visibleCities, icons]);

    useEffect(() => {
        const bounds: L.LatLngBoundsExpression = [];
        for (const cityKey of validCities) {
            const city = filteredCities[cityKey];
            bounds.push([city.minLat, city.minLng]);
            bounds.push([city.maxLat, city.maxLng]);
        }
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [validCities, map, filteredCities]);

    return (
        <>
            {validCities.map((cityKey) => {
                const city = filteredCities[cityKey];
                const icon = icons[city.country.short_name];
                return (
                    <Marker
                        key={city.town.long_name}
                        position={{
                            lat: (city.maxLat + city.minLat) / 2,
                            lng: (city.maxLng + city.minLng) / 2,
                        }}
                        icon={icon}
                    >
                        <Popup minWidth={90}>
                            <span>{`${city.town.long_name}, ${city.country.long_name}`}</span>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default Places;
