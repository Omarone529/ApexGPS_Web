import { Marker, Popup } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';

const MapUserLocation = ({ onLocationFound }) => {
  const [userLocation, setUserLocation] = useState(null);
  const hasFetchedLocationRef = useRef(false);

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
