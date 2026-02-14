import { Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { FiStar, FiMapPin } from 'react-icons/fi';

const categoryConfig = {
  restaurant: { icon: '🍽️', color: '#ffffff', bgColor: '#f97316' },
  food: { icon: '🍕', color: '#ffffff', bgColor: '#f97316' },
  church: { icon: '⛪', color: '#ffffff', bgColor: '#8b5cf6' },
  historic: { icon: '🏛️', color: '#ffffff', bgColor: '#f59e0b' },
  monument: { icon: '🗿', color: '#ffffff', bgColor: '#f59e0b' },
  viewpoint: { icon: '👁️', color: '#ffffff', bgColor: '#10b981' },
  panoramic: { icon: '🏞️', color: '#ffffff', bgColor: '#10b981' },
  castle: { icon: '🏰', color: '#ffffff', bgColor: '#f59e0b' },
  lake: { icon: '💧', color: '#ffffff', bgColor: '#3b82f6' },
  nature: { icon: '🌲', color: '#ffffff', bgColor: '#10b981' },
  mountain_pass: { icon: '⛰️', color: '#ffffff', bgColor: '#6b7280' },
  waterfall: { icon: '💦', color: '#ffffff', bgColor: '#3b82f6' },
  vineyard: { icon: '🍇', color: '#ffffff', bgColor: '#a855f7' },
};

const getCategoryStyle = category => {
  return (
    categoryConfig[category] || {
      icon: '📍',
      color: '#ffffff',
      bgColor: '#9ca3af',
    }
  );
};

// Inner component with access to map zoom level
const POIMarkers = ({ pois }) => {
  const map = useMap();
  const [visiblePois, setVisiblePois] = useState([]);

  useEffect(() => {
    const updateVisiblePois = () => {
      const zoom = map.getZoom();
      const ZOOM_THRESHOLD = 13; // Show POIs from zoom level 13

      const filtered = pois.filter(poi => {
        // Route POIs are always visible
        if (poi.isRoutePoi) return true;
        return zoom >= ZOOM_THRESHOLD;
      });

      setVisiblePois(filtered);
    };

    updateVisiblePois();
    map.on('zoomend', updateVisiblePois);

    return () => {
      map.off('zoomend', updateVisiblePois);
    };
  }, [map, pois]);

  return (
    <>
      {visiblePois.map(poi => {
        const isRoutePoi = poi.isRoutePoi;
        const { icon, color, bgColor } = getCategoryStyle(poi.category);

        return (
          <Marker
            key={poi.id || `poi-${poi.coordinates[0]}-${poi.coordinates[1]}`}
            position={poi.coordinates}
            icon={L.divIcon({
              className: 'poi-marker',
              html: `
                <div style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: ${isRoutePoi ? '36px' : '28px'};
                  height: ${isRoutePoi ? '36px' : '28px'};
                  background-color: ${bgColor};
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                  font-size: ${isRoutePoi ? '18px' : '14px'};
                  color: ${color};
                  transition: all 0.2s ease;
                  cursor: pointer;
                  transform: ${isRoutePoi ? 'scale(1.1)' : 'scale(1)'};
                  opacity: ${isRoutePoi ? 1 : 0.9};
                ">
                  ${icon}
                </div>
              `,
              iconSize: [isRoutePoi ? 36 : 28, isRoutePoi ? 36 : 28],
              iconAnchor: [isRoutePoi ? 18 : 14, isRoutePoi ? 18 : 14],
              popupAnchor: [0, -18],
            })}
          >
            <Popup>
              <div className="min-w-[200px] p-2">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: bgColor, color: 'white' }}
                  >
                    {icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{poi.name}</h3>
                </div>

                <div className="mb-2">
                  <span className="text-xs text-gray-500 capitalize">{poi.category}</span>
                </div>

                {poi.description && <p className="text-xs text-gray-600 mb-2">{poi.description}</p>}

                {poi.scenic_value && (
                  <div className="flex items-center gap-1 mb-2">
                    <FiStar size={12} className="text-amber-400" />
                    <span className="text-xs font-medium text-amber-600">
                      {typeof poi.scenic_value === 'number'
                        ? poi.scenic_value.toFixed(1)
                        : poi.scenic_value}
                    </span>
                  </div>
                )}

                {isRoutePoi && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                    <FiMapPin size={12} className="text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">Route stop</span>
                  </div>
                )}

                <div className="mt-2 text-[10px] text-gray-400 font-mono">
                  {poi.coordinates[0].toFixed(4)}, {poi.coordinates[1].toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const MapPOIs = ({ pois }) => {
  if (!pois || pois.length === 0) return null;
  return <POIMarkers pois={pois} />;
};

export default MapPOIs;
