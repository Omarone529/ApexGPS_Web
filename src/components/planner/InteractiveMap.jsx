import { useState, useRef, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { FiMenu, FiNavigation } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import MapUserLocation from './MapComponents/MapUserLocation';
import MapRoutePoints from './MapComponents/MapRoutePoints';
import MapPolyline from './MapComponents/MapPolyline';
import MapPOIs from './MapComponents/MapPOIs.jsx';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function CenterMap({ position, centerTrigger }) {
  const map = useMap();
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    if (position && map && centerTrigger > lastTriggerRef.current) {
      map.flyTo(position, 13);
      lastTriggerRef.current = centerTrigger;
    }
  }, [position, map, centerTrigger]);

  return null;
}

function CenterOnRoute({ route }) {
  const map = useMap();
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (route && route.length > 0 && map && !hasCenteredRef.current) {
      let minLat = 90,
        maxLat = -90,
        minLng = 180,
        maxLng = -180;

      route.forEach(coord => {
        const [lat, lng] = coord;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      });

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      // Distance in km
      const latDiff = (maxLat - minLat) * 111; // 1 grado ≈ 111 km
      const lngDiff = (maxLng - minLng) * 111 * Math.cos((centerLat * Math.PI) / 180);
      const maxDiff = Math.max(latDiff, lngDiff);

      // Calculate zoom
      let zoom;
      if (maxDiff > 100) zoom = 8;
      else if (maxDiff > 50) zoom = 9;
      else if (maxDiff > 20) zoom = 10;
      else if (maxDiff > 10) zoom = 11;
      else if (maxDiff > 5) zoom = 12;
      else if (maxDiff > 2) zoom = 13;
      else if (maxDiff > 1) zoom = 14;
      else if (maxDiff > 0.5) zoom = 15;
      else zoom = 16;

      const paddedZoom = Math.max(zoom - 1, 8);

      map.flyTo([centerLat, centerLng], paddedZoom);
      hasCenteredRef.current = true;
    }
  }, [route, map]);

  return null;
}

const InteractiveMap = ({
  onMenuToggle,
  routePoints = [],
  calculatedRoute = [],
  pois = [],
  isScenicRoute = false,
  loading = false,
  routeStats,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const hasCenteredOnPermissionRef = useRef(false);

  const generatedRoutePoints = useMemo(() => {
    const points = [];

    if (calculatedRoute.length > 0) {
      // Start point
      points.push({
        label: 'Partenza',
        description: 'Punto di partenza del percorso',
        position: calculatedRoute[0],
      });

      // End point
      points.push({
        label: 'Arrivo',
        description: 'Punto di arrivo del percorso',
        position: calculatedRoute[calculatedRoute.length - 1],
      });
    }

    return [...points, ...routePoints];
  }, [calculatedRoute, routePoints]);

  const centerOnUser = () => {
    if (userLocation) {
      setCenterTrigger(prev => prev + 1);
    }
  };

  const calculateDistance = () => {
    if (routeStats?.distance) return routeStats.distance;
    if (calculatedRoute.length < 2) return '0 km';
    let total = 0;
    for (let i = 1; i < calculatedRoute.length; i++) {
      const [lat1, lon1] = calculatedRoute[i - 1];
      const [lat2, lon2] = calculatedRoute[i];
      total += Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
    }
    return `${(total * 111).toFixed(1)} km`;
  };

  const handleUserLocation = location => {
    setUserLocation(location);

    if (!hasCenteredOnPermissionRef.current) {
      hasCenteredOnPermissionRef.current = true;
      setCenterTrigger(1);
    }
  };

  const totalPoints = generatedRoutePoints.length + pois.length;
  return (
    <div className="relative w-full h-screen">
      <button
        onClick={onMenuToggle}
        className="absolute top-28 left-4 z-[1000] bg-black/90 text-orange-500 p-3 rounded-xl shadow-2xl hover:bg-black transition-all duration-300 border border-orange-500/30 hover:border-orange-500"
        aria-label="Apri menu pianificazione"
      >
        <FiMenu size={24} />
      </button>

      <button
        onClick={centerOnUser}
        disabled={!userLocation}
        className={`absolute top-44 left-4 z-[1000] p-3 rounded-xl shadow-2xl transition-all duration-300 border ${
          userLocation
            ? 'bg-black/90 text-orange-500 hover:bg-black border-orange-500/30 hover:border-orange-500'
            : 'bg-gray-800/70 text-gray-400 border-gray-600/30 cursor-not-allowed'
        }`}
        aria-label="Centra sulla mia posizione"
      >
        <FiNavigation size={24} />
      </button>

      <MapContainer
        center={[45.4642, 9.19]}
        zoom={13}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <CenterMap position={userLocation} centerTrigger={centerTrigger} />
        <CenterOnRoute route={calculatedRoute} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapUserLocation onLocationFound={handleUserLocation} />
        <MapRoutePoints routePoints={generatedRoutePoints} />
        <MapPolyline calculatedRoute={calculatedRoute} isScenicRoute={isScenicRoute} />
        <MapPOIs pois={pois} />
      </MapContainer>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-orange-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm">Punti: {totalPoints}</span>
          </div>
          <div className="h-4 w-px bg-orange-500/50"></div>
          <div className="text-sm">
            {routeStats?.distance
              ? `Distanza: ${routeStats.distance}`
              : calculatedRoute.length > 0
                ? `Distanza: ${calculateDistance()}`
                : 'Nessun percorso calcolato'}
          </div>
          {routeStats?.duration && (
            <>
              <div className="h-4 w-px bg-orange-500/50"></div>
              <div className="text-sm">Durata: {routeStats.duration}</div>
            </>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[2000] bg-black/50 flex items-center justify-center">
          <div className="bg-black/90 text-white p-6 rounded-2xl border border-orange-500/30">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span>Calcolo percorso in corso...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
