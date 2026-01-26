import { Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';

const MapUserLocation = ({ onLocationFound }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          if (onLocationFound) {
            onLocationFound(location);
          }
        },
        error => {
          console.log('Geolocation non disponibile o permesso negato:', error.message);
        }
      );
    }
  }, [onLocationFound]);

  if (!userLocation) return null;

  return (
    <Marker position={userLocation}>
      <Popup>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-gray-900">La tua posizione</span>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapUserLocation;
