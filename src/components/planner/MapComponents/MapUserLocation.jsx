import { Marker, Popup } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

const MapUserLocation = ({ onLocationFound }) => {
    const [userLocation, setUserLocation] = useState(null);
    const hasFetchedLocationRef = useRef(false);

    // Icona personalizzata per la posizione utente
    const userLocationIcon = L.divIcon({
        className: 'custom-user-location',
        html: `
      <div style="
        position: relative;
        width: 26px;
        height: 26px;
      ">
        <!-- Cerchio esterno pulsante -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #4285f4;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s infinite;
        "></div>
        
        <!-- Cerchio interno -->
        <div style="
          position: absolute;
          top: 4px;
          left: 4px;
          right: 4px;
          bottom: 4px;
          background-color: #4285f4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
        
        <!-- Puntino centrale -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      </style>
    `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
    });

    useEffect(() => {
        if (navigator.geolocation && !hasFetchedLocationRef.current) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const location = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(location);
                    hasFetchedLocationRef.current = true;
                    if (onLocationFound) {
                        onLocationFound(location);
                    }
                },
                error => {
                    console.log('Geolocation non disponibile o permesso negato:', error.message);
                    hasFetchedLocationRef.current = true;
                }
            );
        }
    }, [onLocationFound]);

    if (!userLocation) return null;

    return (
        <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="font-semibold text-gray-900">La tua posizione</span>
                </div>
            </Popup>
        </Marker>
    );
};

export default MapUserLocation;
