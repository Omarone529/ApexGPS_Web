import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiStar } from 'react-icons/fi';

const getCategoryIcon = category => {
  const iconMap = {
    restaurant: { icon: '🍽️', color: '#ef4444' },
    food: { icon: '🍕', color: '#ef4444' },
    church: { icon: '⛪', color: '#8b5cf6' },
    historic: { icon: '🏛️', color: '#f59e0b' },
    monument: { icon: '🗿', color: '#f59e0b' },
    viewpoint: { icon: '👁️', color: '#10b981' },
    panoramic: { icon: '🏞️', color: '#10b981' },
    castle: { icon: '🏰', color: '#f59e0b' },
    lake: { icon: '💧', color: '#3b82f6' },
    nature: { icon: '🌲', color: '#10b981' },
    mountain_pass: { icon: '⛰️', color: '#6b7280' },
    waterfall: { icon: '💦', color: '#3b82f6' },
    vineyard: { icon: '🍇', color: '#a855f7' },
  };

  const defaultIcon = { icon: '📍', color: '#9ca3af' };
  return iconMap[category] || defaultIcon;
};

const createCustomIcon = category => {
  const { icon, color } = getCategoryIcon(category);

  return L.divIcon({
    className: 'custom-poi-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background-color: ${color}20;
        border-radius: 50%;
        border: 2px solid ${color};
        font-size: 16px;
        color: ${color};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      ">
        ${icon}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const MapPOIs = ({ pois }) => {
  if (!pois || pois.length === 0) return null;

  return (
    <>
      {pois.map(poi => (
        <Marker
          key={poi.id || `poi-${poi.coordinates[0]}-${poi.coordinates[1]}`}
          position={poi.coordinates}
          icon={createCustomIcon(poi.category)}
        >
          <Popup>
            <div className="flex flex-col max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCategoryIcon(poi.category).icon}</span>
                <span className="font-bold text-gray-900">{poi.name}</span>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Categoria: <span className="font-medium">{poi.category}</span>
                </p>

                {poi.description && <p className="text-sm text-gray-500 mt-2">{poi.description}</p>}

                {poi.scenic_value && (
                  <div className="flex items-center gap-1 mt-2">
                    <FiStar className="text-yellow-500" size={14} />
                    <span className="text-sm font-medium text-yellow-600">
                      Valore:{' '}
                      {typeof poi.scenic_value === 'number'
                        ? poi.scenic_value.toFixed(1)
                        : poi.scenic_value}
                    </span>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Lat: {poi.coordinates[0].toFixed(6)}
                    <br />
                    Lng: {poi.coordinates[1].toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapPOIs;
