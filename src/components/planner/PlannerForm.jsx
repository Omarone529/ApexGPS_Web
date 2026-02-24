import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    FiRepeat,
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
    const [suggestionsPosition, setSuggestionsPosition] = useState({ top: 0, left: 0, width: 0 });

    const abortControllerRef = useRef(null);
    const suggestionsRef = useRef(null);
    const formRef = useRef(null);
    const fieldRefs = useRef({});

    useEffect(() => {
        const handleEsc = e => {
            if (e.key === 'Escape') setSuggestions([]);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => {
        const handleClickOutside = e => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (suggestions.length > 0 && activeField) {
            const fieldElement = fieldRefs.current[activeField];
            if (fieldElement) {
                const rect = fieldElement.getBoundingClientRect();
                setSuggestionsPosition({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        }
    }, [suggestions, activeField]);

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

    const handleSwap = () => {
        setFormData(prev => ({
            ...prev,
            startPoint: prev.endPoint,
            endPoint: prev.startPoint,
        }));
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

    const renderSuggestionIcon = type => {
        if (!type) return <FiMapPin className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        const typeLower = type.toLowerCase();
        if (typeLower.includes('city') || typeLower.includes('comune'))
            return <FiHome className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        if (typeLower.includes('restaurant') || typeLower.includes('ristorante'))
            return <FiCoffee className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        if (typeLower.includes('museum') || typeLower.includes('museo'))
            return <FiCamera className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        if (typeLower.includes('monument'))
            return <FiCamera className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        return <FiMapPin className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
    };

    const setFieldRef = (fieldName, element) => {
        if (element) {
            fieldRefs.current[fieldName] = element;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000]">
            {/* Overlay invisibile */}
            <div className="absolute inset-0 bg-transparent" onClick={onClose} />

            {/* Pannello laterale con sfondo #FAF7F2 */}
            <div
                className="absolute left-0 top-0 h-full w-full sm:w-96 shadow-xl overflow-y-auto border-r border-gray-200"
                style={{ backgroundColor: '#FAF7F2' }}
                ref={formRef}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Pianifica percorso</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 transition-colors"
                            disabled={isSubmitting}
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    <form onSubmit={e => e.preventDefault()} className="space-y-4">
                        {/* Start Point */}
                        <div
                            ref={el => setFieldRef('startPoint', el)}
                            onFocus={() => setActiveField('startPoint')}
                        >
                            <LocationInput
                                value={formData.startPoint}
                                onChange={handleInputChange}
                                name="startPoint"
                                placeholder="Partenza"
                                onUseCurrentLocation={() => getCurrentLocation('startPoint')}
                                onSearch={query => handleLocationSearch(query, 'startPoint')}
                                onFocus={() => setActiveField('startPoint')}
                                iconType="start"
                                isLoading={loadingSuggestions && activeField === 'startPoint'}
                                inputClassName="text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                            />
                        </div>

                        {/* Waypoints */}
                        <div className="space-y-2">
                            {formData.waypoints.map((waypoint, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                    ref={el => setFieldRef(`waypoint-${index}`, el)}
                                    onFocus={() => setActiveField(`waypoint-${index}`)}
                                >
                                    <LocationInput
                                        value={waypoint}
                                        onChange={e => handleWaypointChange(index, e.target.value)}
                                        name={`waypoint-${index}`}
                                        placeholder={`Tappa ${index + 1}`}
                                        onSearch={query =>
                                            handleLocationSearch(query, `waypoint-${index}`)
                                        }
                                        onFocus={() => setActiveField(`waypoint-${index}`)}
                                        iconType="waypoint"
                                        isLoading={
                                            loadingSuggestions &&
                                            activeField === `waypoint-${index}`
                                        }
                                        inputClassName="text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                    />
                                    {formData.waypoints.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeWaypoint(index)}
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
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
                                className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 transition-colors px-2 py-1 font-medium"
                                disabled={isSubmitting}
                            >
                                <FiPlus size={18} />
                                <span>Aggiungi tappa</span>
                            </button>
                        </div>

                        {/* Pulsante inverti piccolo a sinistra */}
                        <div className="flex justify-start -mt-2 mb-2">
                            <button
                                type="button"
                                onClick={handleSwap}
                                disabled={
                                    isSubmitting || !formData.startPoint || !formData.endPoint
                                }
                                className="p-2 text-gray-500 hover:text-orange-600 transition-colors disabled:opacity-40 rounded-full hover:bg-orange-100"
                                title="Inverti partenza e destinazione"
                            >
                                <FiRepeat size={18} />
                            </button>
                        </div>

                        {/* End Point */}
                        <div
                            ref={el => setFieldRef('endPoint', el)}
                            onFocus={() => setActiveField('endPoint')}
                        >
                            <LocationInput
                                value={formData.endPoint}
                                onChange={handleInputChange}
                                name="endPoint"
                                placeholder="Destinazione"
                                onUseCurrentLocation={() => getCurrentLocation('endPoint')}
                                onSearch={query => handleLocationSearch(query, 'endPoint')}
                                onFocus={() => setActiveField('endPoint')}
                                iconType="end"
                                isLoading={loadingSuggestions && activeField === 'endPoint'}
                                inputClassName="text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                            />
                        </div>

                        {/* Separatore */}
                        <div className="border-t border-gray-300 my-4"></div>

                        {/* Pulsanti azione */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleCalculate}
                                disabled={
                                    isSubmitting || !formData.startPoint || !formData.endPoint
                                }
                                className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-orange-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                Manuale
                            </button>
                            <button
                                type="button"
                                onClick={handleCalculateScenic}
                                disabled={
                                    isSubmitting || !formData.startPoint || !formData.endPoint
                                }
                                className={`px-4 py-3 rounded-lg bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium ${
                                    isScenicMode ? 'ring-2 ring-orange-300' : ''
                                }`}
                            >
                                Panoramico
                            </button>
                        </div>

                        {/* Pulsante Salva */}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                            className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <FiSave size={18} />
                                    Salva percorso
                                </>
                            )}
                        </button>

                        {/* Link cancella */}
                        <button
                            type="button"
                            onClick={clearForm}
                            disabled={isSubmitting}
                            className="w-full text-sm text-gray-600 hover:text-red-700 transition-colors disabled:opacity-40 py-2"
                        >
                            Cancella tutto
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-600 space-y-1">
                        <p>Manuale: Crea itinerari con tappe personalizzate.</p>
                        <p>Panoramico: percorso suggestivo automatico.</p>
                    </div>
                </div>
            </div>

            {/* Dropdown suggerimenti */}
            {suggestions.length > 0 &&
                createPortal(
                    <div
                        ref={suggestionsRef}
                        className="fixed z-[2100] bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
                        style={{
                            top: suggestionsPosition.top,
                            left: suggestionsPosition.left,
                            width: suggestionsPosition.width,
                            maxHeight: '240px',
                            overflowY: 'auto',
                        }}
                    >
                        <div className="py-1">
                            {suggestions.map(suggestion => (
                                <button
                                    key={suggestion.id}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className="w-full text-left px-3 py-2 hover:bg-orange-50 transition-colors flex items-start gap-2 group"
                                >
                                    {renderSuggestionIcon(suggestion.type)}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-gray-900 truncate font-medium">
                                            {suggestion.display_name}
                                        </div>
                                        {suggestion.region && (
                                            <div className="text-xs text-gray-600">
                                                {suggestion.region}
                                            </div>
                                        )}
                                    </div>
                                    <FiCheck
                                        className="opacity-0 group-hover:opacity-100 text-orange-600"
                                        size={16}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default PlannerForm;
