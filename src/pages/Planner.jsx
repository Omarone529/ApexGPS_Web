import { useState, useEffect } from 'react';
import InteractiveMap from '../components/planner/InteractiveMap';
import PlannerForm from '../components/planner/PlannerForm';
import { poiService } from '../components/planner/MapServices/POIService.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Decode polyline
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

// Format time
const formatTime = minutes => {
  if (!minutes || minutes <= 0) return '0 min';
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
  return `${Math.round(minutes)} min`;
};

// Format distance
const formatDistance = km => {
  if (!km || km <= 0) return '0 km';
  if (km >= 100) return `${Math.round(km)} km`;
  if (km >= 10) return `${km.toFixed(1)} km`;
  return `${km.toFixed(2)} km`;
};

const Planner = () => {
  // State
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
  const [activeFilters, setActiveFilters] = useState(new Set(['all']));

  // Load POIs on mount
  useEffect(() => {
    const loadAllPOIs = async () => {
      setLoadingPois(true);
      try {
        const poisData = await poiService.getAllPOIs();
        const formattedPois = poiService.formatPOIsForMap(poisData);
        setAllPois(formattedPois);
      } catch (error) {
        console.error('Error loading POIs:', error);
        showError('Unable to load points of interest');
      } finally {
        setLoadingPois(false);
      }
    };

    loadAllPOIs();
  }, []);

  // Toggle filter
  const toggleFilter = categoryId => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);

      if (newFilters.has(categoryId)) {
        newFilters.delete(categoryId);
      } else {
        newFilters.add(categoryId);
      }

      return newFilters;
    });
  };

  // Get filtered POIs
  const getFilteredPois = () => {
    if (activeFilters.size === 0) return [];
    return allPois.filter(poi => activeFilters.has(poi.category) || activeFilters.has('all'));
  };

  // Get display POIs
  const getDisplayPois = () => {
    const filteredPois = getFilteredPois();
    if (pois.length > 0) {
      const routePoiIds = new Set(pois.map(p => p.id));
      const uniqueFilteredPois = filteredPois.filter(p => !routePoiIds.has(p.id));
      return [...pois, ...uniqueFilteredPois];
    }
    return filteredPois;
  };

  // Get category counts
  const getCategoryCounts = () => {
    const counts = { all: allPois.length };
    allPois.forEach(poi => {
      const cat = poi.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  };

  // Show error
  const showError = message => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Handle calculate route
  const handleCalculateRoute = formData => {
    console.log('Manual route requested:', formData);
  };

  // Handle calculate scenic route
  const handleCalculateScenicRoute = async formData => {
    if (!formData.startPoint || !formData.endPoint) {
      showError('Enter start and end points');
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
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Route calculation failed');

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
      let errorMessage = 'Error calculating scenic route';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Connection failed. Is the backend running?';
      } else if (error.message.includes('cors')) {
        errorMessage = 'CORS error. Backend must allow frontend requests.';
      } else {
        errorMessage = error.message;
      }
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle save route
  const handleSaveRoute = async formData => {
    if (!routeDetails) {
      showError('Calculate a route before saving');
      return;
    }
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: formData.routeName || `Scenic route ${new Date().toLocaleDateString()}`,
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
        let errorMessage = 'Error saving route';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.detail || errorMessage;
        } catch (parseError) {
          console.error('Error parsing save response:', parseError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving route:', error);
      showError(`Save error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const displayPois = getDisplayPois();
  const categoryCounts = getCategoryCounts();

  // Categories with icons
  const categories = [
    { id: 'all', label: 'All', icon: '📍', color: 'text-white' },
    { id: 'restaurant', label: 'Restaurants', icon: '🍽️', color: 'text-orange-400' },
    { id: 'food', label: 'Food', icon: '🍕', color: 'text-orange-400' },
    { id: 'church', label: 'Churches', icon: '⛪', color: 'text-purple-400' },
    { id: 'historic', label: 'Historic', icon: '🏛️', color: 'text-amber-400' },
    { id: 'monument', label: 'Monuments', icon: '🗿', color: 'text-amber-400' },
    { id: 'viewpoint', label: 'Viewpoints', icon: '👁️', color: 'text-emerald-400' },
    { id: 'castle', label: 'Castles', icon: '🏰', color: 'text-amber-400' },
    { id: 'lake', label: 'Lakes', icon: '💧', color: 'text-blue-400' },
    { id: 'nature', label: 'Nature', icon: '🌲', color: 'text-emerald-400' },
    { id: 'mountain_pass', label: 'Passes', icon: '⛰️', color: 'text-gray-400' },
    { id: 'waterfall', label: 'Waterfalls', icon: '💦', color: 'text-blue-400' },
    { id: 'vineyard', label: 'Vineyards', icon: '🍇', color: 'text-purple-400' },
  ].filter(cat => cat.id === 'all' || categoryCounts[cat.id] > 0);

  return (
    <div className="relative h-screen">
      {/* Loading indicator */}
      {loadingPois && (
        <div className="absolute top-4 right-4 z-[1500] bg-black/90 text-white px-4 py-2 rounded-xl border border-orange-500/30 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          <span className="text-sm">Loading POIs...</span>
        </div>
      )}

      {/* Filter buttons */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="flex flex-wrap justify-center gap-2 max-w-[90vw]">
          {categories.map(cat => {
            const isActive = activeFilters.has(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-orange-500/30 scale-105'
                    : `${cat.color} bg-black/80 border border-gray-700 hover:bg-black/90 hover:border-orange-500/50`
                }`}
              >
                <span className={isActive ? 'text-white' : cat.color}>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {categoryCounts[cat.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <InteractiveMap
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        routePoints={[]}
        calculatedRoute={calculatedRoute}
        pois={displayPois}
        routeStats={routeStats}
        isScenicRoute={isScenicRoute}
        loading={loading}
      />

      {/* Planner form */}
      <PlannerForm
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onCalculateRoute={handleCalculateRoute}
        onCalculateScenicRoute={handleCalculateScenicRoute}
        onSaveRoute={handleSaveRoute}
        loading={loading}
        hasRoute={calculatedRoute.length > 0}
      />

      {/* Error message */}
      {errorMessage && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center">
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
              <h3 className="text-lg font-semibold text-red-400">Error</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="w-full py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
