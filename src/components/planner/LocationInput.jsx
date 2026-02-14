import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiNavigation } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LocationInput = ({ value, onChange, name, placeholder, onUseCurrentLocation }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async query => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/geocode/search/?q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            Accept: 'application/json',
          },
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = e => {
    const newValue = e.target.value;
    const syntheticEvent = {
      target: {
        name: name,
        value: newValue,
      },
    };
    onChange(syntheticEvent);
    searchLocations(newValue);
  };

  const handleSelectSuggestion = suggestion => {
    const syntheticEvent = {
      target: {
        name: name,
        value: suggestion.display_name,
      },
    };
    onChange(syntheticEvent);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all pr-10"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map(suggestion => (
            <button
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-start gap-2 border-b border-gray-700 last:border-0"
            >
              <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
              <div className="flex-1">
                <span className="text-sm text-gray-200">{suggestion.display_name}</span>
                {suggestion.type && (
                  <span className="text-xs text-gray-500 ml-2">({suggestion.type})</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {onUseCurrentLocation && (
        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
          title="Usa la mia posizione"
        >
          <FiNavigation size={18} />
        </button>
      )}
    </div>
  );
};

export default LocationInput;
