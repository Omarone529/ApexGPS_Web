import { useRef } from 'react';
import { FiMapPin, FiNavigation, FiCircle, FiMoreVertical } from 'react-icons/fi';

const LocationInput = ({
    value,
    onChange,
    name,
    placeholder,
    onUseCurrentLocation,
    onSearch,
    onFocus,
    iconType = 'end',
    isLoading = false,
    inputClassName = '', // nuova prop opzionale
}) => {
    const inputRef = useRef(null);

    const renderIcon = () => {
        switch (iconType) {
            case 'start':
                return <FiCircle className="text-gray-400" size={18} />;
            case 'waypoint':
                return <FiMoreVertical className="text-gray-400" size={18} />;
            case 'end':
            default:
                return <FiMapPin className="text-gray-400" size={18} />;
        }
    };

    const handleInputChange = e => {
        const newValue = e.target.value;
        onChange({
            target: {
                name: name,
                value: newValue,
            },
        });
        if (onSearch) {
            onSearch(newValue);
        }
    };

    return (
        <div className="relative flex items-center gap-3 w-full group">
            <div className="flex-shrink-0">{renderIcon()}</div>
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    className={`w-full px-0 py-2 bg-transparent border-b border-gray-700 focus:outline-none focus:border-orange-500 focus:shadow-sm focus:shadow-orange-500/20 focus:scale-[1.02] transition-all duration-200 ${inputClassName}`}
                    autoComplete="off"
                />
                {isLoading && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
                    </div>
                )}
            </div>
            {onUseCurrentLocation && (
                <button
                    type="button"
                    onClick={onUseCurrentLocation}
                    className="flex-shrink-0 text-gray-400 hover:text-orange-500 transition-colors duration-200"
                    title="Usa la mia posizione"
                >
                    <FiNavigation size={18} />
                </button>
            )}
        </div>
    );
};

export default LocationInput;
