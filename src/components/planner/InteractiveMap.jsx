import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { FiMenu, FiNavigation, FiMapPin } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function CenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && map) {
      map.flyTo(position, 15);
    }
  }, [position, map]);
  return null;
}

const InteractiveMap = ({
  onMenuToggle,
  routePoints = [],
  calculatedRoute = [],
  isScenicRoute = false,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([45.4642, 9.19]);
  const zoom = 13;

  // Get user position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const loc = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        () => console.log('Geolocation non disponibile')
      );
    }
  }, []);

  const centerOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  };

  const calculateDistance = () => {
    if (calculatedRoute.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < calculatedRoute.length; i++) {
      const [lat1, lon1] = calculatedRoute[i - 1];
      const [lat2, lon2] = calculatedRoute[i];
      total += Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
    }
    return (total * 111).toFixed(1);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Hamburger Menu Button */}
      <button
        onClick={onMenuToggle}
        className="absolute top-4 left-4 z-[1000] bg-black/90 text-orange-500 p-3 rounded-xl shadow-2xl hover:bg-black transition-all duration-300 border border-orange-500/30 hover:border-orange-500"
        aria-label="Apri menu pianificazione"
      >
        <FiMenu size={24} />
      </button>

      {/* User Location Button */}
      <button
        onClick={centerOnUser}
        className="absolute top-20 left-4 z-[1000] bg-black/90 text-orange-500 p-3 rounded-xl shadow-2xl hover:bg-black transition-all duration-300 border border-orange-500/30 hover:border-orange-500"
        aria-label="Centra sulla mia posizione"
      >
        <FiNavigation size={24} />
      </button>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <CenterMap position={mapCenter} />

        {/* TileLayer CHIARO (OpenStreetMap standard) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/*Position Marker*/}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900">La tua posizione</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker punti del percorso */}
        {routePoints.map((point, index) => (
          <Marker key={index} position={point.position || [45.4642, 9.19]}>
            <Popup>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="text-orange-500" />
                  <span className="font-bold text-gray-900">
                    {point.label || `Punto ${index + 1}`}
                  </span>
                </div>
                <div className="text-gray-600 text-sm">
                  {point.description || 'Punto del percorso'}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Polyline*/}
        {calculatedRoute.length > 0 && (
          <Polyline
            pathOptions={{
              color: isScenicRoute ? '#f59e0b' : '#f97316',
              weight: 5,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round',
            }}
            positions={calculatedRoute}
          />
        )}
      </MapContainer>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-orange-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm">Punti: {routePoints.length}</span>
          </div>
          <div className="h-4 w-px bg-orange-500/50"></div>
          <div className="text-sm">
            {calculatedRoute.length > 0
              ? `Distanza: ${calculateDistance()} km`
              : 'Nessun percorso calcolato'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
