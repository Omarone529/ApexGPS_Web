import { useState } from 'react';
import InteractiveMap from '../components/planner/InteractiveMap';
import PlannerForm from '../components/planner/PlannerForm';

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
  const [loading, setLoading] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });

  const showFeedback = (type, message, duration = 4000) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      setFeedback(prev => (prev.show ? { show: false, type: '', message: '' } : prev));
    }, duration);
  };

  const handleCalculateRoute = formData => {
    console.log('Percorso manuale richiesto:', formData);
    showFeedback('info', 'Usa il percorso panoramico per calcoli automatici.');
  };

  const handleCalculateScenicRoute = async formData => {
    console.log('Calcolo percorso panoramico:', formData);

    if (!formData.startPoint || !formData.endPoint) {
      showFeedback('error', 'Inserisci punto di partenza e arrivo');
      return;
    }

    if (loading) {
      showFeedback('info', 'Calcolo già in corso, attendi...');
      return;
    }

    setLoading(true);

    try {
      setIsScenicRoute(true);
      setCalculatedRoute([]);
      setRouteStats(null);
      setPois([]);
      setRouteDetails(null);

      showFeedback('info', 'Il sistema sta trovando il percorso più suggestivo...');

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

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
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
      console.log(
        'Polyline ricevuta (primi 100 caratteri):',
        scenicRoute.polyline?.substring(0, 100)
      );

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

      const poiMarkers =
        scenicRoute.poi_stops?.map(poi => ({
          id: poi.poi_id,
          name: poi.name,
          category: poi.category,
          coordinates: [poi.location.lat, poi.location.lon],
          scenic_value: poi.scenic_value,
        })) || [];

      setPois(poiMarkers);

      setRouteDetails({
        ...result,
        startAddress: result.locations?.start?.name || formData.startPoint,
        endAddress: result.locations?.end?.name || formData.endPoint,
        formData: formData,
      });

      const message = scenicRoute.time_constraint?.is_within_constraint
        ? `Percorso panoramico calcolato! Il sistema ha trovato il percorso più suggestivo.`
        : `Percorso panoramico calcolato! Il sistema ha trovato il percorso più suggestivo (tempo eccede il limite).`;

      showFeedback('success', message);
    } catch (error) {
      console.error('Errore nel calcolo del percorso:', error);

      let errorMessage = 'Errore nel calcolo del percorso panoramico';

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage =
          'Connessione al server fallita. Verifica: 1) Il backend è in esecuzione? 2) CORS è abilitato?';
      } else if (error.message.includes('cors')) {
        errorMessage = 'Errore CORS. Il backend deve consentire richieste dal frontend.';
      } else {
        errorMessage = error.message;
      }

      showFeedback('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async formData => {
    if (!routeDetails) {
      showFeedback('error', 'Calcola un percorso prima di salvarlo');
      return;
    }

    if (loading) return;

    setLoading(true);

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

      const data = await response.json();
      showFeedback(
        'success',
        data.message || `Percorso "${data.route?.name || 'senza nome'}" salvato con successo!`
      );
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      showFeedback('error', `Errore nel salvataggio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen">
      <InteractiveMap
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        routePoints={[]}
        calculatedRoute={calculatedRoute}
        pois={pois}
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

      {feedback.show && (
        <div
          className={`
                    fixed top-4 right-4 z-[3000] 
                    p-4 rounded-xl shadow-2xl backdrop-blur-md
                    animate-[fadeIn_0.25s_cubic-bezier(0.4,0,0.2,1)]
                    transition-all duration-300 ease-out
                    ${
                      feedback.type === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 border border-green-400/30'
                        : feedback.type === 'error'
                          ? 'bg-gradient-to-r from-red-500 to-red-600 border border-red-400/30'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/30'
                    } 
                    text-white max-w-sm
                    transform hover:scale-[1.02] hover:shadow-2xl
                    overflow-hidden
                `}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {feedback.type === 'success' && (
                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {feedback.type === 'error' && (
                <div className="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {feedback.type === 'info' && (
                <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug tracking-tight">{feedback.message}</p>
            </div>

            <button
              onClick={() => setFeedback({ show: false, type: '', message: '' })}
              className="flex-shrink-0 text-white/60 hover:text-white transition-colors duration-200 ml-1"
              aria-label="Chiudi notifica"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full"
              style={{
                animation: 'progress 4s linear',
                width: '100%',
                transformOrigin: 'left',
              }}
            />
          </div>
        </div>
      )}

      <style>{`
                @keyframes progress {
                    from {
                        transform: scaleX(1);
                    }
                    to {
                        transform: scaleX(0);
                    }
                }
            `}</style>
    </div>
  );
};

export default Planner;
