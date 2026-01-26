import { Marker, Popup } from 'react-leaflet';
import { FiMapPin } from 'react-icons/fi';

const MapPOIs = ({ pois }) => {
  if (!pois || pois.length === 0) return null;

  return (
    <>
      {pois.map((poi, index) => (
        <Marker key={poi.id || `poi-${index}`} position={poi.coordinates}>
          <Popup>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="text-orange-500" />
                <span className="font-bold text-gray-900">{poi.name || `POI ${index + 1}`}</span>
              </div>
              <div className="text-gray-600 text-sm">
                {poi.category ? `Categoria: ${poi.category}` : 'Punto di interesse'}
              </div>
              {poi.scenic_value && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">Valore scenico: </span>
                  <span className="font-medium text-orange-600">
                    {poi.scenic_value.toFixed(1)}/10
                  </span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapPOIs;
