import { useMapEvents, useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapClickHandler = ({ onMapClick, mapillaryMode }) => {
    const map = useMap();

    useEffect(() => {
        const container = map.getContainer();
        if (mapillaryMode) {
            container.style.cursor = 'crosshair';
        } else {
            container.style.cursor = '';
        }
        return () => {
            container.style.cursor = '';
        };
    }, [mapillaryMode, map]);

    useMapEvents({
        click(e) {
            if (mapillaryMode) {
                onMapClick(e.latlng);
            }
        },
    });

    return null;
};

export default MapClickHandler;
