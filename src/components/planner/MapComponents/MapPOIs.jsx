import { Marker, useMap } from 'react-leaflet';
import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';

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
  museum: { icon: '🏛️', color: '#ffffff', bgColor: '#f59e0b' },
  archaeological: { icon: '🔍', color: '#ffffff', bgColor: '#f59e0b' },
  gallery: { icon: '🖼️', color: '#ffffff', bgColor: '#f59e0b' },
  theatre: { icon: '🎭', color: '#ffffff', bgColor: '#8b5cf6' },
  library: { icon: '📚', color: '#ffffff', bgColor: '#3b82f6' },
  school: { icon: '🎓', color: '#ffffff', bgColor: '#6b7280' },
  university: { icon: '🎓', color: '#ffffff', bgColor: '#3b82f6' },
  hospital: { icon: '🏥', color: '#ffffff', bgColor: '#ef4444' },
  pharmacy: { icon: '💊', color: '#ffffff', bgColor: '#10b981' },
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

const POIMarkers = ({ pois, onPoiClick }) => {
  const map = useMap();
  const [visiblePois, setVisiblePois] = useState([]);
  const markersRef = useRef({});
  const rafRef = useRef();

  const updateVisiblePois = useCallback(() => {
    if (!map) return;

    const zoom = map.getZoom();
    const bounds = map.getBounds();
    const ZOOM_THRESHOLD = 12;

    const filtered = pois.filter(poi => {
      if (poi.isRoutePoi) return true;
      if (zoom < ZOOM_THRESHOLD) return false;
      if (bounds && poi.coordinates) {
        return bounds.contains([poi.coordinates[0], poi.coordinates[1]]);
      }
      return true;
    });

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setVisiblePois(filtered);
    });
  }, [map, pois]);

  useEffect(() => {
    if (!map) return;

    updateVisiblePois();

    const throttledUpdate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateVisiblePois);
    };

    map.on('moveend', throttledUpdate);
    map.on('zoomend', throttledUpdate);

    return () => {
      map.off('moveend', throttledUpdate);
      map.off('zoomend', throttledUpdate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [map, updateVisiblePois]);

  useEffect(() => {
    const currentMarkers = markersRef.current;

    Object.values(currentMarkers).forEach(m => m?.remove());

    const newMarkers = {};
    visiblePois.forEach(poi => {
      const id = poi.id || `poi-${poi.coordinates[0]}-${poi.coordinates[1]}`;
      const { icon, bgColor } = getCategoryStyle(poi.category);
      const isRoutePoi = poi.isRoutePoi;

      const markerIcon = L.divIcon({
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
      });

      const marker = L.marker(poi.coordinates, { icon: markerIcon })
        .on('click', () => onPoiClick(poi))
        .addTo(map);

      newMarkers[id] = marker;
    });

    markersRef.current = newMarkers;

    return () => {
      Object.values(newMarkers).forEach(m => m?.remove());
    };
  }, [map, visiblePois, onPoiClick]);

  return null;
};

const MapPOIs = ({ pois, onPoiClick }) => {
  if (!pois || pois.length === 0) return null;
  return <POIMarkers pois={pois} onPoiClick={onPoiClick} />;
};

export default MapPOIs;
