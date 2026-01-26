import { Marker, Popup } from 'react-leaflet';
import { FiMapPin } from 'react-icons/fi';

const MapRoutePoints = ({ routePoints }) => {
  if (!routePoints || routePoints.length === 0) return null;

  return (
    <>
      {routePoints.map((point, index) => (
        <Marker key={index} position={point.position || [45.4642, 9.19]}>
          <Popup>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="text-orange-500" />
                <span className="font-bold text-gray-900">
                  {point.label || `Punto ${index + 1}`}
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                {point.description || 'Punto del percorso'}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapRoutePoints;
