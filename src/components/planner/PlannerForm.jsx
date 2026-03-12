import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    FiX,
    FiPlus,
    FiTrash2,
    FiSave,
    FiCamera,
    FiMapPin,
    FiHome,
    FiCoffee,
    FiCheck,
    FiRepeat,
    FiMenu,
} from 'react-icons/fi';
import LocationInput from './LocationInput';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hook for drag & drop
function useDragToReorder(items, onChange) {
    const [dragging, setDragging] = useState(null);
    // dragging = { fromIndex, currentIndex, cloneY, cloneX, cloneW, cloneH, label }

    const listRef = useRef(null);
    const stateRef = useRef(null);

    const startDrag = (e, index) => {
        e.preventDefault();

        const list = listRef.current;
        if (!list) return;

        const rows = list.querySelectorAll('[data-drag-row]');
        const rowEl = rows[index];
        if (!rowEl) return;

        const rect = rowEl.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const itemH = rect.height + 8;

        const rowCenters = Array.from(rows).map(r => {
            const rb = r.getBoundingClientRect();
            return rb.top + rb.height / 2;
        });

        const initial = {
            fromIndex: index,
            currentIndex: index,
            cloneY: rect.top,
            cloneX: rect.left,
            cloneW: rect.width,
            cloneH: rect.height,
            offsetY,
            itemH,
            rowCenters,
            label: items[index],
        };

        stateRef.current = initial;
        setDragging(initial);

        const onMove = e => {
            const s = stateRef.current;
            if (!s) return;

            const newCloneY = e.clientY - s.offsetY;

            const cloneCenter = newCloneY + s.cloneH / 2;
            let newIndex = s.currentIndex;
            const list = listRef.current;
            if (list) {
                const rows = list.querySelectorAll('[data-drag-row]');
                let closest = Infinity;
                rows.forEach((r, i) => {
                    if (i === s.fromIndex) return;
                    const rb = r.getBoundingClientRect();
                    const center = rb.top + rb.height / 2;
                    const dist = Math.abs(cloneCenter - center);
                    if (dist < closest) {
                        closest = dist;
                        newIndex = i;
                    }
                });
                newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
            }

            const updated = { ...s, cloneY: newCloneY, currentIndex: newIndex };
            stateRef.current = updated;
            setDragging(updated);
        };

        const onUp = () => {
            const s = stateRef.current;
            if (s && s.fromIndex !== s.currentIndex) {
                const newItems = [...items];
                const [moved] = newItems.splice(s.fromIndex, 1);
                newItems.splice(s.currentIndex, 0, moved);
                onChange(newItems);
            }
            stateRef.current = null;
            setDragging(null);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    const getVisualOrder = () => {
        if (!dragging) return items.map((item, i) => ({ item, originalIndex: i, isHidden: false }));
        const { fromIndex, currentIndex } = dragging;
        const result = items.map((item, i) => ({
            item,
            originalIndex: i,
            isHidden: i === fromIndex,
        }));
        const [removed] = result.splice(fromIndex, 1);
        result.splice(currentIndex, 0, removed);
        return result;
    };

    return { dragging, startDrag, listRef, getVisualOrder };
}

const PlannerForm = ({ isOpen, onClose, onSaveRoute, onCalculateScenicRoute }) => {
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

    const { dragging, startDrag, listRef, getVisualOrder } = useDragToReorder(
        formData.waypoints,
        newWaypoints => setFormData(prev => ({ ...prev, waypoints: newWaypoints }))
    );

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
        setFormData(prev => ({ ...prev, waypoints: [...prev.waypoints, ''] }));
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

    const handleCalculateScenic = async () => {
        if (!formData.startPoint || !formData.endPoint) return;
        setIsSubmitting(true);
        setIsScenicMode(true);
        onClose();
        try {
            await onCalculateScenicRoute?.(formData);
        } catch (error) {
            console.error(error);
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
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearForm = () => {
        if (window.confirm('Vuoi cancellare tutti i dati inseriti?')) {
            setFormData({ startPoint: '', endPoint: '', waypoints: [''] });
            setIsScenicMode(false);
            setSuggestions([]);
            setActiveField(null);
        }
    };

    const getCurrentLocation = field => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const location = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
                setFormData(prev => ({ ...prev, [field]: location }));
            });
        }
    };

    const renderSuggestionIcon = type => {
        if (!type) return <FiMapPin className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        const t = type.toLowerCase();
        if (t.includes('city') || t.includes('comune'))
            return <FiHome className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        if (t.includes('restaurant') || t.includes('ristorante'))
            return <FiCoffee className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        if (t.includes('museum') || t.includes('museo') || t.includes('monument'))
            return <FiCamera className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
        return <FiMapPin className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />;
    };

    const setFieldRef = (fieldName, element) => {
        if (element) fieldRefs.current[fieldName] = element;
    };

    if (!isOpen) return null;

    const visualOrder = getVisualOrder();

    return (
        <div className="fixed inset-0 z-[2000] pointer-events-none">
            <div
                className="absolute inset-0 bg-transparent pointer-events-auto"
                onClick={onClose}
            />

            <div
                className="absolute inset-x-3 top-[5rem] sm:inset-x-auto sm:left-6 sm:top-20 sm:w-88 sm:max-w-sm shadow-2xl overflow-y-auto rounded-3xl border border-gray-200 pointer-events-auto"
                style={{ backgroundColor: '#FAF7F2', maxHeight: 'calc(100vh - 6rem)' }}
                ref={formRef}
            >
                <div className="py-6 px-4">
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
                            className="flex items-center gap-2"
                        >
                            <div style={{ width: 18 }} className="flex-shrink-0" />
                            <div className="flex-1">
                                <LocationInput
                                    value={formData.startPoint}
                                    onChange={handleInputChange}
                                    name="startPoint"
                                    placeholder="Partenza"
                                    onUseCurrentLocation={() => getCurrentLocation('startPoint')}
                                    onSearch={query => handleLocationSearch(query, 'startPoint')}
                                    onFocus={() => setActiveField('startPoint')}
                                    isLoading={loadingSuggestions && activeField === 'startPoint'}
                                    inputClassName="text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                />
                            </div>
                        </div>

                        {/* Waypoints */}
                        <div className="space-y-2" ref={listRef}>
                            {visualOrder.map(({ item, originalIndex, isHidden }) => (
                                <div
                                    key={originalIndex}
                                    data-drag-row
                                    className="flex items-center gap-2 rounded-xl"
                                    ref={el => setFieldRef(`waypoint-${originalIndex}`, el)}
                                    onFocus={() => setActiveField(`waypoint-${originalIndex}`)}
                                    style={{
                                        opacity: isHidden ? 0 : 1,
                                        pointerEvents: isHidden ? 'none' : 'auto',
                                        visibility: isHidden ? 'hidden' : 'visible',
                                    }}
                                >
                                    <div
                                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-orange-500 transition-colors flex-shrink-0 select-none flex items-center"
                                        style={{ width: 18 }}
                                        onMouseDown={e => startDrag(e, originalIndex)}
                                    >
                                        <FiMenu size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <LocationInput
                                            value={item}
                                            onChange={e =>
                                                handleWaypointChange(originalIndex, e.target.value)
                                            }
                                            name={`waypoint-${originalIndex}`}
                                            placeholder={`Tappa ${originalIndex + 1}`}
                                            onSearch={query =>
                                                handleLocationSearch(
                                                    query,
                                                    `waypoint-${originalIndex}`
                                                )
                                            }
                                            onFocus={() =>
                                                setActiveField(`waypoint-${originalIndex}`)
                                            }
                                            isLoading={
                                                loadingSuggestions &&
                                                activeField === `waypoint-${originalIndex}`
                                            }
                                            inputClassName="text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeWaypoint(originalIndex)}
                                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                                        disabled={isSubmitting}
                                        style={{
                                            width: 18,
                                            visibility:
                                                formData.waypoints.length > 1
                                                    ? 'visible'
                                                    : 'hidden',
                                        }}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
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

                        {/* Swap */}
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
                            className="flex items-center gap-2"
                        >
                            <div style={{ width: 18 }} className="flex-shrink-0" />
                            <div className="flex-1">
                                <LocationInput
                                    value={formData.endPoint}
                                    onChange={handleInputChange}
                                    name="endPoint"
                                    placeholder="Destinazione"
                                    onUseCurrentLocation={() => getCurrentLocation('endPoint')}
                                    onSearch={query => handleLocationSearch(query, 'endPoint')}
                                    onFocus={() => setActiveField('endPoint')}
                                    isLoading={loadingSuggestions && activeField === 'endPoint'}
                                    inputClassName="text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-300 my-4"></div>

                        {/* Button for Scenic Route */}
                        <button
                            type="button"
                            onClick={handleCalculateScenic}
                            disabled={isSubmitting || !formData.startPoint || !formData.endPoint}
                            className={`w-full px-4 py-3 rounded-lg bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium ${isScenicMode ? 'ring-2 ring-orange-300' : ''}`}
                        >
                            Calcola percorso
                        </button>

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

                        <button
                            type="button"
                            onClick={clearForm}
                            disabled={isSubmitting}
                            className="w-full text-sm text-gray-600 hover:text-red-700 transition-colors disabled:opacity-40 py-2"
                        >
                            Cancella tutto
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-600 space-y-1">
                        <p>Manuale: Crea itinerari con tappe personalizzate.</p>
                        <p>Panoramico: percorso suggestivo automatico.</p>
                    </div>
                </div>
            </div>

            {dragging &&
                createPortal(
                    <div
                        style={{
                            position: 'fixed',
                            top: dragging.cloneY,
                            left: dragging.cloneX,
                            width: dragging.cloneW,
                            height: dragging.cloneH,
                            zIndex: 9999,
                            pointerEvents: 'none',
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #fb923c',
                            borderRadius: '12px',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0 8px',
                        }}
                    >
                        <div className="p-1 text-orange-500 flex-shrink-0">
                            <FiMenu size={16} />
                        </div>
                        <span className="text-sm text-gray-700 truncate flex-1">
                            {dragging.label || <span className="text-gray-400">Tappa</span>}
                        </span>
                    </div>,
                    document.body
                )}

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
                            A{' '}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default PlannerForm;
