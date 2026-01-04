import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';

const InteractiveMap = ({ routePoints }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapInstanceRef.current && mapRef.current) {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Create map
            mapInstanceRef.current = L.map(mapRef.current).setView([45.4642, 9.19], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);
            setTimeout(() => {
                mapInstanceRef.current.invalidateSize();
            }, 100);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update route
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                mapInstanceRef.current.removeLayer(layer);
            }
        });

        if (routePoints.length > 0) {
            const polyline = L.polyline(routePoints, {
                color: '#ff6b00',
                weight: 4,
                opacity: 0.8
            }).addTo(mapInstanceRef.current);

            // Start marker
            L.marker(routePoints[0])
                .addTo(mapInstanceRef.current)
                .bindPopup('<b>Partenza</b>')
                .openPopup();

            // End marker
            L.marker(routePoints[routePoints.length - 1])
                .addTo(mapInstanceRef.current)
                .bindPopup('<b>Arrivo</b>');

            // POIs
            if (routePoints.length > 2) {
                routePoints.slice(1, -1).forEach((point, index) => {
                    L.marker(point)
                        .addTo(mapInstanceRef.current)
                        .bindPopup(`<b>Tappa ${index + 1}</b>`);
                });
            }

            mapInstanceRef.current.fitBounds(polyline.getBounds(), {
                padding: [30, 30]
            });
        }

        setTimeout(() => {
            mapInstanceRef.current.invalidateSize();
        }, 50);
    }, [routePoints]);

    return <div ref={mapRef} className="leaflet-map" />;
};

export default InteractiveMap;