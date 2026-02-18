import { useState, useRef, useEffect } from 'react';
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiSave,
  FiCamera,
  FiTarget,
  FiMapPin,
  FiHome,
  FiCoffee,
  FiCheck,
} from 'react-icons/fi';
import LocationInput from './LocationInput';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PlannerForm = ({
  isOpen,
  onClose,
  onCalculateRoute,
  onSaveRoute,
  onCalculateScenicRoute,
}) => {
  const [formData, setFormData] = useState({
    startPoint: '',
    endPoint: '',
    waypoints: [''],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScenicMode, setIsScenicMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const abortControllerRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Chiudi suggerimenti con ESC
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') setSuggestions([]);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Chiudi suggerimenti cliccando fuori
  useEffect(() => {
    const handleClickOutside = e => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWaypointChange = (index, value) => {
    const newWaypoints = [...formData.waypoints];
    newWaypoints[index] = value;
    setFormData(prev => ({ ...prev, waypoints: newWaypoints }));
  };

  const addWaypoint = () => {
    setFormData(prev => ({
      ...prev,
      waypoints: [...prev.waypoints, ''],
    }));
  };

  const removeWaypoint = index => {
    if (formData.waypoints.length > 1) {
      const newWaypoints = formData.waypoints.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, waypoints: newWaypoints }));
    }
  };

  const handleLocationSearch = async query => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    abortControllerRef.current = new AbortController();
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/geocode/search/?q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: { Accept: 'application/json' },
          signal: abortControllerRef.current.signal,
        }
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Geocoding error:', error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelectSuggestion = suggestion => {
    if (!activeField) return;
    if (activeField.startsWith('waypoint-')) {
      const index = parseInt(activeField.split('-')[1], 10);
      handleWaypointChange(index, suggestion.display_name);
    } else {
      setFormData(prev => ({ ...prev, [activeField]: suggestion.display_name }));
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const handleCalculate = async () => {
    if (!formData.startPoint || !formData.endPoint) return;
    setIsSubmitting(true);
    onClose();
    try {
      await onCalculateRoute?.(formData);
    } catch (error) {
      console.error('Errore nel calcolo del percorso:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculateScenic = async () => {
    if (!formData.startPoint || !formData.endPoint) return;
    setIsSubmitting(true);
    setIsScenicMode(true);
    onClose();
    try {
      await onCalculateScenicRoute?.(formData);
    } catch (error) {
      console.error('Errore nel calcolo del percorso panoramico:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!formData.startPoint || !formData.endPoint) return;
    setIsSubmitting(true);
    try {
      await onSaveRoute?.(formData);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    if (window.confirm('Vuoi cancellare tutti i dati inseriti?')) {
      setFormData({
        startPoint: '',
        endPoint: '',
        waypoints: [''],
      });
      setIsScenicMode(false);
      setSuggestions([]);
      setActiveField(null);
    }
  };

  const getCurrentLocation = field => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
          setFormData(prev => ({ ...prev, [field]: location }));
        },
        () => {
          console.log('Impossibile ottenere la posizione corrente');
        }
      );
    }
  };

  // Restituisce direttamente l'elemento icona
  const renderSuggestionIcon = type => {
    if (!type) return <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />;
    const typeLower = type.toLowerCase();
    if (typeLower.includes('city') || typeLower.includes('comune'))
      return <FiHome className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />;
    if (typeLower.includes('restaurant') || typeLower.includes('ristorante'))
      return <FiCoffee className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />;
    if (typeLower.includes('museum') || typeLower.includes('museo'))
      return <FiCamera className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />;
    if (typeLower.includes('monument'))
      return <FiCamera className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />;
    return <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-full sm:w-96 bg-gray-900 shadow-2xl overflow-y-auto border-r border-orange-500/20">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Pianifica Percorso</h2>
              <p className="text-orange-500/80 text-sm mt-1">
                Crea il tuo itinerario personalizzato
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-orange-500 hover:bg-gray-700 transition-colors duration-200"
              disabled={isSubmitting}
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={e => e.preventDefault()} className="space-y-5">
            {/* Start Point */}
            <div title="Scegli la partenza">
              <LocationInput
                value={formData.startPoint}
                onChange={handleInputChange}
                name="startPoint"
                placeholder="Scegli la partenza"
                onUseCurrentLocation={() => getCurrentLocation('startPoint')}
                onSearch={query => handleLocationSearch(query, 'startPoint')}
                onFocus={() => setActiveField('startPoint')}
                iconType="start"
                isLoading={loadingSuggestions && activeField === 'startPoint'}
              />
            </div>

            {/* Waypoints */}
            <div className="space-y-3">
              {formData.waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-center gap-2 group/waypoint">
                  <LocationInput
                    value={waypoint}
                    onChange={e => handleWaypointChange(index, e.target.value)}
                    name={`waypoint-${index}`}
                    placeholder={`Tappa ${index + 1}`}
                    onSearch={query => handleLocationSearch(query, `waypoint-${index}`)}
                    onFocus={() => setActiveField(`waypoint-${index}`)}
                    iconType="waypoint"
                    isLoading={loadingSuggestions && activeField === `waypoint-${index}`}
                  />
                  {formData.waypoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWaypoint(index)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-all duration-200 hover:rotate-3"
                      disabled={isSubmitting}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addWaypoint}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 hover:bg-gray-800/50 px-2 py-1 rounded-lg transition-all duration-200 hover:translate-x-1"
                disabled={isSubmitting}
              >
                <FiPlus size={18} />
                <span>Aggiungi tappa</span>
              </button>
            </div>

            {/* End Point */}
            <div title="Scegli la destinazione">
              <LocationInput
                value={formData.endPoint}
                onChange={handleInputChange}
                name="endPoint"
                placeholder="Scegli la destinazione"
                onUseCurrentLocation={() => getCurrentLocation('endPoint')}
                onSearch={query => handleLocationSearch(query, 'endPoint')}
                onFocus={() => setActiveField('endPoint')}
                iconType="end"
                isLoading={loadingSuggestions && activeField === 'endPoint'}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 pt-4"></div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                className="group relative overflow-hidden bg-transparent border border-gray-600 text-gray-300 py-3 px-3 rounded-xl font-medium hover:border-orange-500 hover:text-orange-500 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-200" />
                <FiTarget
                  size={16}
                  className={
                    isScenicMode ? 'text-gray-600' : 'text-orange-500 group-hover:text-orange-500'
                  }
                />
                <span className="text-xs">Manuale</span>
              </button>

              <button
                type="button"
                onClick={handleCalculateScenic}
                disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                className={`group relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-500 text-white py-3 px-3 rounded-xl font-medium hover:from-orange-500 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isScenicMode ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-gray-900' : ''
                }`}
              >
                <FiCamera size={16} className="text-white/90" />
                <span className="text-xs">Panoramico</span>
              </button>
            </div>

            {/* Suggestions Panel */}
            {suggestions.length > 0 && (
              <div ref={suggestionsRef} className="mt-4 space-y-3 border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-400 tracking-wider">
                    SUGGERIMENTI
                  </div>
                  <button
                    onClick={() => setSuggestions([])}
                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    Chiudi
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {suggestions.map(suggestion => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-3 bg-gray-800/80 hover:bg-gray-700 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border border-gray-700/50 hover:border-gray-600 flex items-start gap-3 group"
                    >
                      {renderSuggestionIcon(suggestion.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-200 font-medium truncate">
                            {suggestion.display_name}
                          </span>
                          {suggestion.type && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 uppercase tracking-wider">
                              {suggestion.type}
                            </span>
                          )}
                        </div>
                        {suggestion.region && (
                          <div className="text-xs text-gray-500 mt-1">{suggestion.region}</div>
                        )}
                      </div>
                      <FiCheck
                        className="opacity-0 group-hover:opacity-100 text-orange-400 transition-opacity duration-200"
                        size={16}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </span>
                ) : (
                  <>
                    <FiSave />
                    Salva Percorso
                  </>
                )}
              </button>
            </div>

            {/* Clear Form */}
            <button
              type="button"
              onClick={clearForm}
              disabled={isSubmitting}
              className="w-full py-3 text-gray-400 hover:text-red-500 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
            >
              Cancella tutto
            </button>
          </form>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>Crea il tuo percorso con tappe personalizzate.</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <p>
                  <span className="font-medium text-blue-400">Percorso Panoramico:</span> Il sistema
                  genererà automaticamente un percorso suggestivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerForm;
