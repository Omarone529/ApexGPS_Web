import { useState, useEffect } from 'react';
import InteractiveMap from '../components/planner/InteractiveMap';
import PlannerForm from '../components/planner/PlannerForm';
import { poiService } from '../components/planner/MapServices/POIService.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const decodePolyline = encoded => {
    if (!encoded || typeof encoded !== 'string' || encoded.trim() === '') {
        return [];
    }

    try {
        let index = 0;
        const len = encoded.length;
        let lat = 0;
        let lng = 0;
        const coordinates = [];

        while (index < len) {
            let b;
            let shift = 0;
            let result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlat = result & 1 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlng = result & 1 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            coordinates.push([lat * 1e-5, lng * 1e-5]);
        }

        return coordinates;
    } catch (error) {
        console.error('Error decoding polyline:', error);
        return [];
    }
};

const formatTime = minutes => {
    if (!minutes || minutes <= 0) return '0 min';
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${Math.round(minutes)} min`;
};

const formatDistance = km => {
    if (!km || km <= 0) return '0 km';
    if (km >= 100) return `${Math.round(km)} km`;
    if (km >= 10) return `${km.toFixed(1)} km`;
    return `${km.toFixed(2)} km`;
};

const Planner = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [calculatedRoute, setCalculatedRoute] = useState([]);
    const [isScenicRoute, setIsScenicRoute] = useState(false);
    const [routeStats, setRouteStats] = useState(null);
    const [pois, setPois] = useState([]);
    const [allPois, setAllPois] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPois, setLoadingPois] = useState(false);
    const [routeDetails, setRouteDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedPoi, setSelectedPoi] = useState(null);

    // Map to normalize POI categories to expected POICard values
    const categoryMap = {
        // Restaurants and food
        ristorante: 'restaurant',
        trattoria: 'restaurant',
        osteria: 'restaurant',
        pizzeria: 'restaurant',
        food: 'food',
        // Places of worship
        chiesa: 'church',
        cattedrale: 'church',
        basilica: 'church',
        duomo: 'church',
        // Historic and monuments
        castello: 'castle',
        fortezza: 'castle',
        monumento: 'monument',
        statua: 'monument',
        'sito archeologico': 'historic',
        rovine: 'historic',
        storico: 'historic',
        // Museums
        museo: 'museum',
        // Viewpoints
        belvedere: 'viewpoint',
        panorama: 'viewpoint',
        panoramico: 'panoramic',
        // Nature
        lago: 'lake',
        fiume: 'nature',
        cascata: 'waterfall',
        passo: 'mountain_pass',
        montagna: 'nature',
        valle: 'nature',
        parco: 'nature',
        giardino: 'nature',
        spiaggia: 'nature',
        costiera: 'nature',
        // Vineyards
        vigneto: 'vineyard',
        cantina: 'vineyard',
    };

    useEffect(() => {
        const loadAllPOIs = async () => {
            setLoadingPois(true);
            try {
                const poisData = await poiService.getAllPOIs();
                // Format POIs for the map
                const formattedPois = poiService.formatPOIsForMap(poisData);
                // Normalize categories
                const normalizedPois = formattedPois.map(poi => {
                    const originalCategory = poi.category?.toLowerCase() || '';
                    const mappedCategory =
                        categoryMap[originalCategory] || poi.category || 'unknown';
                    return {
                        ...poi,
                        category: mappedCategory,
                    };
                });
                setAllPois(normalizedPois);
            } catch (error) {
                console.error('Error loading POIs:', error);
                showError('Impossibile caricare i punti di interesse');
            } finally {
                setLoadingPois(false);
            }
        };

        loadAllPOIs();
    }, []);

    const getDisplayPois = () => {
        if (pois.length > 0) {
            const routePoiIds = new Set(pois.map(p => p.id));
            const uniquePois = allPois.filter(p => !routePoiIds.has(p.id));
            return [...pois, ...uniquePois];
        }
        return allPois;
    };

    const showError = message => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 5000);
    };

    const showSuccess = message => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handlePoiClick = async poi => {
        if (!poi) {
            setSelectedPoi(null);
            return;
        }

        // If it's a route POI, use it directly
        if (poi.isRoutePoi) {
            setSelectedPoi(poi);
            return;
        }

        // Determine correct ID for fetch (try different keys)
        const poiId = poi.originalId || poi.id || poi.pk;
        if (!poiId) {
            console.warn('POI without ID, using base data', poi);
            setSelectedPoi(poi);
            return;
        }

        try {
            // FIX: use same base URL as list (/api/gis/...)
            const response = await fetch(`${API_BASE_URL}/api/gis/points-of-interest/${poiId}/`, {
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                const fullPoiData = await response.json();
                setSelectedPoi({
                    ...poi,
                    description: fullPoiData.description,
                    scenic_value: fullPoiData.importance_score,
                    elevation: fullPoiData.elevation,
                    region: fullPoiData.region,
                });
            } else {
                // If request fails, use base data
                setSelectedPoi(poi);
            }
        } catch (error) {
            console.error('Error fetching POI details:', error);
            setSelectedPoi(poi);
        }
    };

    const handleAddPoiToRoute = poi => {
        console.log('Add POI to route:', poi);
        // Here you could add the POI as a waypoint
        setSelectedPoi(null);
    };

    const handleCalculateRoute = formData => {
        console.log('Manual route requested:', formData);
    };

    const handleCalculateScenicRoute = async formData => {
        if (!formData.startPoint || !formData.endPoint) {
            showError('Inserisci punto di partenza e arrivo');
            return;
        }

        if (loading) return;
        setLoading(true);
        setErrorMessage(null);

        try {
            setIsScenicRoute(true);
            setCalculatedRoute([]);
            setRouteStats(null);
            setPois([]);
            setRouteDetails(null);

            const payload = {
                start_location_name: formData.startPoint.trim(),
                end_location_name: formData.endPoint.trim(),
                vertex_threshold: 0.01,
                preference: formData.preference || 'balanced',
            };

            const response = await fetch(`${API_BASE_URL}/api/routes/calculate-scenic/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
                mode: 'cors',
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Errore ${response.status}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorData.details || errorMessage;
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Calcolo percorso fallito');

            const scenicRoute = result.scenic_route;
            const routeCoords = decodePolyline(scenicRoute.polyline);

            if (routeCoords.length === 0) {
                if (result.locations?.start) {
                    routeCoords.push([result.locations.start.lat, result.locations.start.lon]);
                }
                if (result.locations?.end) {
                    routeCoords.push([result.locations.end.lat, result.locations.end.lon]);
                }
                if (scenicRoute.poi_stops?.length > 0) {
                    scenicRoute.poi_stops.forEach(poi => {
                        routeCoords.push([poi.location.lat, poi.location.lon]);
                    });
                }
            }

            setCalculatedRoute(routeCoords);

            const stats = {
                distance: formatDistance(scenicRoute.total_distance_km),
                duration: formatTime(scenicRoute.total_time_minutes),
                scenicScore: scenicRoute.scenic_score
                    ? `${scenicRoute.scenic_score.toFixed(1)}/100`
                    : 'N/A',
                poiCount: scenicRoute.poi_count || 0,
                fastestDuration: result.fastest_route?.total_time_minutes
                    ? formatTime(result.fastest_route.total_time_minutes)
                    : 'N/A',
            };

            setRouteStats(stats);

            const routePoiMarkers =
                scenicRoute.poi_stops?.map(poi => ({
                    id: `route-${poi.poi_id}`,
                    originalId: poi.poi_id,
                    name: poi.name,
                    category: poi.category,
                    coordinates: [poi.location.lat, poi.location.lon],
                    scenic_value: poi.scenic_value,
                    isRoutePoi: true,
                })) || [];

            setPois(routePoiMarkers);

            setRouteDetails({
                ...result,
                startAddress: result.locations?.start?.name || formData.startPoint,
                endAddress: result.locations?.end?.name || formData.endPoint,
                formData: formData,
            });
        } catch (error) {
            console.error('Error calculating route:', error);
            let errorMessage = 'Errore nel calcolo del percorso panoramico';
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Connessione fallita. Il backend è in esecuzione?';
            } else if (error.message.includes('cors')) {
                errorMessage = 'Errore CORS. Il backend deve accettare richieste dal frontend.';
            } else {
                errorMessage = error.message;
            }
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRoute = async formData => {
        if (!routeDetails) {
            showError('Calcola un percorso prima di salvarlo');
            return;
        }
        if (loading) return;

        setLoading(true);
        setErrorMessage(null);

        try {
            let token = localStorage.getItem('access_token'); // Legge il token JWT

            if (!token) {
                token = sessionStorage.getItem('access_token');
            }
            if (!token) {
                throw new Error('Utente non autenticato. Effettua il login.');
            }

            const payload = {
                name:
                    formData.routeName || `Percorso panoramico ${new Date().toLocaleDateString()}`,
                visibility: formData.isPublic ? 'public' : 'private',
                calculation_data: routeDetails.calculation_data || {
                    start_location: routeDetails.locations?.start || { lat: 0, lon: 0 },
                    end_location: routeDetails.locations?.end || { lat: 0, lon: 0 },
                    preference: formData.preference || 'balanced',
                    total_distance_km: routeDetails.scenic_route?.total_distance_km || 0,
                    total_time_minutes: routeDetails.scenic_route?.total_time_minutes || 0,
                    polyline: routeDetails.scenic_route?.polyline || '',
                    total_scenic_score: routeDetails.scenic_route?.scenic_score || 0,
                },
            };

            const response = await fetch(`${API_BASE_URL}/api/routes/save-calculated/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
                mode: 'cors',
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Errore nel salvataggio del percorso';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorData.detail || errorMessage;
                } catch (parseError) {
                    console.error('Error parsing save response:', parseError);
                }
                // Gestione specifica per duplicato (409 Conflict)
                if (response.status === 409) {
                    errorMessage = 'Percorso già salvato in precedenza.';
                }
                throw new Error(errorMessage);
            }

            // Salvataggio riuscito
            showSuccess('Percorso salvato con successo!');

            // Chiudi il form dopo un breve ritardo per dare feedback visivo
            setTimeout(() => {
                setIsMenuOpen(false);
            }, 500);
        } catch (error) {
            console.error('Error saving route:', error);
            showError(`Errore salvataggio: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const displayPois = getDisplayPois();

    return (
        <div className="relative h-screen">
            {loadingPois && (
                <div className="absolute top-4 right-4 z-[1500] bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
                    <span className="text-sm">Caricamento POI...</span>
                </div>
            )}

            {successMessage && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1500] bg-green-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-green-800 shadow-lg">
                    {successMessage}
                </div>
            )}

            <InteractiveMap
                onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
                routePoints={[]}
                calculatedRoute={calculatedRoute}
                pois={displayPois}
                routeStats={routeStats}
                isScenicRoute={isScenicRoute}
                loading={loading}
                selectedPoi={selectedPoi}
                onPoiClick={handlePoiClick}
                onAddPoiToRoute={handleAddPoiToRoute}
            />

            <PlannerForm
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onCalculateRoute={handleCalculateRoute}
                onCalculateScenicRoute={handleCalculateScenicRoute}
                onSaveRoute={handleSaveRoute}
                loading={loading}
                hasRoute={calculatedRoute.length > 0}
            />

            {errorMessage && (
                <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center">
                    <div className="bg-gray-900 text-white p-6 rounded-2xl border border-gray-800 shadow-2xl max-w-md mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-red-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-red-400">Errore</h3>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">{errorMessage}</p>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="w-full py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700"
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planner;
