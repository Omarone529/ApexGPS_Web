import { useState, useEffect } from 'react';
import InteractiveMap from '../components/planner/InteractiveMap';
import PlannerForm from '../components/planner/PlannerForm';
import { poiService } from '../components/planner/MapServices/POIService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const decodePolyline = encoded => {
  if (!encoded || typeof encoded !== 'string' || encoded.trim() === '') {
    console.log('Polyline vuota o non valida');
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

    console.log(`Decodificate ${coordinates.length} coordinate`);
    return coordinates;
  } catch (error) {
    console.error('Errore nella decodifica della polyline:', error);
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

  if (km >= 100) {
    return `${Math.round(km)} km`;
  } else if (km >= 10) {
    return `${km.toFixed(1)} km`;
  }

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
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadAllPOIs = async () => {
      setLoadingPois(true);
      try {
        const poisData = await poiService.getAllPOIs();
        const formattedPois = poiService.formatPOIsForMap(poisData);
        setAllPois(formattedPois);
        console.log(`Caricati ${formattedPois.length} POI dal database`);
      } catch (error) {
        console.error('Errore nel caricamento dei POI:', error);
        showError('Impossibile caricare i punti di interesse');
      } finally {
        setLoadingPois(false);
      }
    };

    loadAllPOIs();
  }, []);

  // Filter POIs by category
  const getFilteredPois = () => {
    if (selectedCategory === 'all') {
      return allPois;
    }
    return allPois.filter(poi => poi.category === selectedCategory);
  };

  const getDisplayPois = () => {
    const filteredPois = getFilteredPois();

    // Se ci sono POI del percorso, li includiamo (evitando duplicati)
    if (pois.length > 0) {
      const routePoiIds = new Set(pois.map(p => p.id));
      const uniqueFilteredPois = filteredPois.filter(p => !routePoiIds.has(p.id));
      return [...pois, ...uniqueFilteredPois];
    }

    return filteredPois;
  };

  const showError = message => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleCalculateRoute = formData => {
    console.log('Percorso manuale richiesto:', formData);
    // Non mostrare feedback per il percorso manuale
  };

  const handleCalculateScenicRoute = async formData => {
    console.log('Calcolo percorso panoramico:', formData);

    if (!formData.startPoint || !formData.endPoint) {
      showError('Inserisci punto di partenza e arrivo');
      return;
    }

    if (loading) {
      return; // Non mostrare feedback duplicato
    }

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

      console.log('Invio richiesta al backend:', payload);
      console.log('URL:', `${API_BASE_URL}/api/routes/calculate-scenic/`);

      const response = await fetch(`${API_BASE_URL}/api/routes/calculate-scenic/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);

        let errorMessage = `Errore ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.start_location_name) {
            errorMessage = errorData.start_location_name[0];
          } else if (errorData.end_location_name) {
            errorMessage = errorData.end_location_name[0];
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.details) {
            errorMessage = errorData.details;
          }
        } catch (parseError) {
          console.error('Errore nel parsing della risposta:', parseError);
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('API Response completo:', result);

      if (!result.success) {
        throw new Error(result.error || 'Errore nel calcolo del percorso');
      }

      const scenicRoute = result.scenic_route;
      console.log('Dati percorso panoramico:', scenicRoute);

      const routeCoords = decodePolyline(scenicRoute.polyline);
      console.log('Coordinate decodificate:', routeCoords.length);

      if (routeCoords.length === 0) {
        console.log('Nessuna coordinata dalla polyline, usando fallback');
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
        isWithinConstraint: scenicRoute.time_constraint?.is_within_constraint || false,
        fastestDuration: result.fastest_route?.total_time_minutes
          ? formatTime(result.fastest_route.total_time_minutes)
          : 'N/A',
        totalScenicScore: scenicRoute.scenic_score,
        avgScenicRating: scenicRoute.avg_scenic_rating,
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
      console.error('Errore nel calcolo del percorso:', error);

      let errorMessage = 'Errore nel calcolo del percorso panoramico';

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Connessione al server fallita. Verifica che il backend sia in esecuzione.';
      } else if (error.message.includes('cors')) {
        errorMessage = 'Errore CORS. Il backend deve consentire richieste dal frontend.';
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
      const payload = {
        name: formData.routeName || `Percorso panoramico ${new Date().toLocaleDateString()}`,
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
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Errore salvataggio:', errorText);

        let errorMessage = 'Errore nel salvataggio';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.detail || errorMessage;
        } catch (parseError) {
          console.error('Errore nel parsing della risposta di salvataggio:', parseError);
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      showError(`Errore nel salvataggio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const displayPois = getDisplayPois();

  return (
    <div className="relative h-screen">
      {loadingPois && (
        <div className="absolute top-4 right-4 z-[1500] bg-black/90 text-white px-4 py-2 rounded-xl border border-orange-500/30 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          <span className="text-sm">Caricamento POI...</span>
        </div>
      )}

      {/* category filter */}
      <div className="absolute top-28 right-4 z-[1000] bg-black/90 backdrop-blur-sm rounded-xl border border-orange-500/30 shadow-2xl overflow-hidden">
        <div className="p-3 border-b border-orange-500/20">
          <h3 className="text-white text-sm font-semibold">Filtra POI</h3>
        </div>
        <div className="p-2 max-h-96 overflow-y-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>📍</span>
              <span>Tutti ({allPois.length})</span>
            </span>
          </button>

          {Object.entries(
            allPois.reduce((acc, poi) => {
              acc[poi.category] = (acc[poi.category] || 0) + 1;
              return acc;
            }, {})
          )
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>
                    {category === 'restaurant' && '🍽️'}
                    {category === 'food' && '🍕'}
                    {category === 'church' && '⛪'}
                    {category === 'historic' && '🏛️'}
                    {category === 'monument' && '🗿'}
                    {category === 'viewpoint' && '👁️'}
                    {category === 'panoramic' && '🏞️'}
                    {category === 'castle' && '🏰'}
                    {category === 'lake' && '💧'}
                    {category === 'nature' && '🌲'}
                    {category === 'mountain_pass' && '⛰️'}
                    {![
                      'restaurant',
                      'food',
                      'church',
                      'historic',
                      'monument',
                      'viewpoint',
                      'panoramic',
                      'castle',
                      'lake',
                      'nature',
                      'mountain_pass',
                    ].includes(category) && '📍'}
                  </span>
                  <span className="capitalize">{category}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </span>
              </button>
            ))}
        </div>
      </div>

      <InteractiveMap
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        routePoints={[]}
        calculatedRoute={calculatedRoute}
        pois={displayPois}
        routeStats={routeStats}
        isScenicRoute={isScenicRoute}
        loading={loading}
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

      {/* Error message overlay */}
      {errorMessage && (
        <div className="fixed inset-0 z-[3000] bggit -black/50 flex items-center justify-center">
          <div className="bg-black/90 text-white p-6 rounded-2xl border border-orange-500/30 shadow-2xl max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
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
