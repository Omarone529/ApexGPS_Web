import { Marker, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

const categoryConfig = {
  // Ristoranti e cibo
  restaurant: { icon: '🍽️', color: '#ffffff', bgColor: '#f97316' },
  food: { icon: '🍕', color: '#ffffff', bgColor: '#f97316' },

  // Luoghi di culto
  church: { icon: '⛪', color: '#ffffff', bgColor: '#8b5cf6' },

  // Storici e monumenti
  historic: { icon: '🏛️', color: '#ffffff', bgColor: '#f59e0b' },
  monument: { icon: '🗿', color: '#ffffff', bgColor: '#f59e0b' },

  // Panorami
  viewpoint: { icon: '👁️', color: '#ffffff', bgColor: '#10b981' },
  panoramic: { icon: '🏞️', color: '#ffffff', bgColor: '#10b981' },

  // Castelli
  castle: { icon: '🏰', color: '#ffffff', bgColor: '#f59e0b' },

  // Natura
  lake: { icon: '💧', color: '#ffffff', bgColor: '#3b82f6' },
  nature: { icon: '🌲', color: '#ffffff', bgColor: '#10b981' },
  mountain_pass: { icon: '⛰️', color: '#ffffff', bgColor: '#6b7280' },
  waterfall: { icon: '💦', color: '#ffffff', bgColor: '#3b82f6' },

  // Vigneti
  vineyard: { icon: '🍇', color: '#ffffff', bgColor: '#a855f7' },

  // Musei e cultura
  museum: { icon: '🏛️', color: '#ffffff', bgColor: '#f59e0b' },
  archaeological: { icon: '🔍', color: '#ffffff', bgColor: '#f59e0b' },
  gallery: { icon: '🖼️', color: '#ffffff', bgColor: '#f59e0b' },
  theatre: { icon: '🎭', color: '#ffffff', bgColor: '#8b5cf6' },
  library: { icon: '📚', color: '#ffffff', bgColor: '#3b82f6' },

  // Istruzione
  school: { icon: '🎓', color: '#ffffff', bgColor: '#6b7280' },
  university: { icon: '🎓', color: '#ffffff', bgColor: '#3b82f6' },

  // Sanità
  hospital: { icon: '🏥', color: '#ffffff', bgColor: '#ef4444' },
  pharmacy: { icon: '💊', color: '#ffffff', bgColor: '#10b981' },

  // Servizi
  bank: { icon: '💰', color: '#ffffff', bgColor: '#f59e0b' },
  post_office: { icon: '📮', color: '#ffffff', bgColor: '#3b82f6' },
  town_hall: { icon: '🏛️', color: '#ffffff', bgColor: '#f59e0b' },
  police: { icon: '👮', color: '#ffffff', bgColor: '#3b82f6' },
  fire_station: { icon: '🚒', color: '#ffffff', bgColor: '#ef4444' },
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
const POIMarkers = ({ pois, onPoiClick }) => {
  const map = useMap();
  const [visiblePois, setVisiblePois] = useState([]);

  useEffect(() => {
    const updateVisiblePois = () => {
      const zoom = map.getZoom();
      const ZOOM_THRESHOLD = 13;

      const filtered = pois.filter(poi => {
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
        const { icon, bgColor } = getCategoryStyle(poi.category);

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
                  color: #ffffff;
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
            eventHandlers={{
              click: () => onPoiClick(poi),
            }}
          />
        );
      })}
    </>
  );
};

const MapPOIs = ({ pois, onPoiClick }) => {
  if (!pois || pois.length === 0) return null;
  return <POIMarkers pois={pois} onPoiClick={onPoiClick} />;
};

export default MapPOIs;
