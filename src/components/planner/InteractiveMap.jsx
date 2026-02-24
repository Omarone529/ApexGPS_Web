import { useState, useRef, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { FiMenu, FiNavigation, FiLayers } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import MapUserLocation from './MapComponents/MapUserLocation';
import MapRoutePoints from './MapComponents/MapRoutePoints';
import MapPolyline from './MapComponents/MapPolyline';
import MapPOIs from './MapComponents/MapPOIs';
import POICard from './POICard';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Componente per il centraggio della mappa
const MapController = ({ center, route, centerTrigger }) => {
    const map = useMap();
    const lastTriggerRef = useRef(0);
    const hasCenteredOnRouteRef = useRef(false);

    useEffect(() => {
        if (center && centerTrigger > lastTriggerRef.current) {
            map.flyTo(center, 15, {
                duration: 1.5,
                easeLinearity: 0.25,
            });
            lastTriggerRef.current = centerTrigger;
        }
    }, [center, map, centerTrigger]);

    useEffect(() => {
        if (route?.length > 1 && !hasCenteredOnRouteRef.current) {
            const bounds = L.latLngBounds(route);
            map.flyToBounds(bounds, {
                padding: [50, 50],
                duration: 1.5,
                maxZoom: 14,
            });
            hasCenteredOnRouteRef.current = true;
        }
    }, [route, map]);

    return null;
};

const InteractiveMap = ({
    onMenuToggle,
    routePoints = [],
    calculatedRoute = [],
    pois = [],
    isScenicRoute = false,
    loading = false,
    routeStats,
    selectedPoi,
    onPoiClick,
    onAddPoiToRoute,
}) => {
    const [userLocation, setUserLocation] = useState(null);
    const [centerTrigger, setCenterTrigger] = useState(0);
    const [mapLayer, setMapLayer] = useState('standard');
    const hasInitializedRef = useRef(false);

    const handleUserLocation = location => {
        setUserLocation(location);
        if (!hasInitializedRef.current) {
            setCenterTrigger(1);
            hasInitializedRef.current = true;
        }
    };

    const centerOnUser = () => {
        if (userLocation) {
            setCenterTrigger(prev => prev + 1);
        }
    };

    const routePointsWithLabels = useMemo(() => {
        if (!calculatedRoute.length) return routePoints;

        const points = [];

        points.push({
            position: calculatedRoute[0],
            label: 'Start',
            description: 'Starting point',
        });

        points.push(...routePoints);

        points.push({
            position: calculatedRoute[calculatedRoute.length - 1],
            label: 'Finish',
            description: 'Destination',
        });

        return points;
    }, [calculatedRoute, routePoints]);

    const calculateTotalDistance = () => {
        if (routeStats?.distance) return routeStats.distance;

        if (calculatedRoute.length < 2) return null;

        let total = 0;
        for (let i = 1; i < calculatedRoute.length; i++) {
            const [lat1, lon1] = calculatedRoute[i - 1];
            const [lat2, lon2] = calculatedRoute[i];
            const R = 6371;
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                    Math.cos((lat2 * Math.PI) / 180) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            total += R * c;
        }
        return `${total.toFixed(1)} km`;
    };

    const distance = calculateTotalDistance();

    return (
        <div className="relative w-full h-screen bg-gray-900">
            {/* Overlay Controls */}
            <div className="absolute top-24 left-6 z-[1000] flex flex-col gap-3">
                <button
                    onClick={onMenuToggle}
                    className="group w-12 h-12 bg-[#FAF7F2] text-gray-800 rounded-2xl shadow-2xl
                     hover:bg-orange-500 hover:text-white transition-all duration-300 border border-gray-200
                     hover:border-orange-400 flex items-center justify-center"
                    aria-label="Open planner"
                >
                    <FiMenu size={22} className="group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={() =>
                        setMapLayer(prev => (prev === 'standard' ? 'satellite' : 'standard'))
                    }
                    className="group w-12 h-12 bg-[#FAF7F2] text-gray-800 rounded-2xl shadow-2xl
                     hover:text-orange-600 transition-all duration-300 border border-gray-200
                     hover:border-orange-400 flex items-center justify-center"
                    aria-label="Toggle map layer"
                >
                    <FiLayers size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={centerOnUser}
                    disabled={!userLocation}
                    className={`group w-12 h-12 rounded-2xl shadow-2xl transition-all duration-300 
                     flex items-center justify-center border ${
                         userLocation
                             ? 'bg-[#FAF7F2] text-gray-800 border-gray-200 hover:border-orange-400 hover:text-orange-600'
                             : 'bg-gray-200/50 text-gray-400 border-gray-300 cursor-not-allowed'
                     }`}
                    aria-label="Center on my location"
                >
                    <FiNavigation
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                    />
                </button>
            </div>

            {/* Route Stats */}
            {(distance || routeStats) && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]
                      bg-[#FAF7F2]/95 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-2xl
                      border border-gray-200 shadow-2xl"
                >
                    <div className="flex items-center gap-6">
                        {distance && (
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${isScenicRoute ? 'bg-amber-500' : 'bg-orange-500'}`}
                                />
                                <span className="text-sm font-medium text-gray-800">
                                    {distance}
                                </span>
                            </div>
                        )}

                        {routeStats?.duration && (
                            <>
                                <div className="w-px h-4 bg-gray-300" />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">⏱️</span>
                                    <span className="text-sm font-medium text-gray-800">
                                        {routeStats.duration}
                                    </span>
                                </div>
                            </>
                        )}

                        {routeStats?.scenicScore && routeStats.scenicScore !== 'N/A' && (
                            <>
                                <div className="w-px h-4 bg-gray-300" />
                                <div className="flex items-center gap-1">
                                    <span className="text-sm">🏔️</span>
                                    <span className="text-sm font-medium text-amber-600">
                                        {routeStats.scenicScore}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Map Container */}
            <MapContainer
                center={[45.4642, 9.19]}
                zoom={13}
                className="h-full w-full z-0"
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <MapController
                    center={userLocation}
                    route={calculatedRoute}
                    centerTrigger={centerTrigger}
                />

                <TileLayer
                    url={
                        mapLayer === 'standard'
                            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    }
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <MapUserLocation onLocationFound={handleUserLocation} />
                <MapRoutePoints routePoints={routePointsWithLabels} />
                <MapPolyline calculatedRoute={calculatedRoute} isScenicRoute={isScenicRoute} />
                <MapPOIs pois={pois} onPoiClick={onPoiClick} />
            </MapContainer>

            {/* POI Card */}
            {selectedPoi && (
                <POICard
                    poi={selectedPoi}
                    onClose={() => onPoiClick(null)}
                    onAddToRoute={onAddPoiToRoute}
                />
            )}

            {/* Loading Overlay */}
            {loading && (
                <div
                    className="absolute inset-0 z-[2000] bg-[#FAF7F2]/80 backdrop-blur-sm
                      flex items-center justify-center"
                >
                    <div
                        className="bg-[#FAF7F2] text-gray-800 px-6 py-4 rounded-2xl
                        border border-gray-200 shadow-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-5 h-5 border-2 border-orange-500 border-t-transparent
                            rounded-full animate-spin"
                            />
                            <span className="text-sm font-medium text-gray-800">
                                Calculating route...
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteractiveMap;
