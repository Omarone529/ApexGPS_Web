import { Marker, Popup } from 'react-leaflet';
import { FiMapPin } from 'react-icons/fi';
import L from 'leaflet';

const MapRoutePoints = ({ routePoints }) => {
    if (!routePoints || routePoints.length === 0) return null;

    return (
        <>
            {routePoints.map((point, index) => {
                const position = point.position || [45.4642, 9.19];
                const isStart = index === 0;
                const isEnd = index === routePoints.length - 1;
                let customIcon = null;

                if (isStart) {
                    customIcon = L.divIcon({
                        className: 'start-marker',
                        html: `
              <div style="
                width: 20px;
                height: 20px;
                background-color: white;
                border: 3px solid black;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    });
                } else if (isEnd) {
                    customIcon = L.divIcon({
                        className: 'end-marker',
                        html: `
              <div style="
                position: relative;
                width: 24px;
                height: 32px;
              ">
                <div style="
                  position: absolute;
                  top: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 16px;
                  height: 16px;
                  background-color: #ea4335;
                  border-radius: 50% 50% 50% 0;
                  transform: translateX(-50%) rotate(-45deg);
                  border: 3px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>
                <div style="
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 6px;
                  height: 12px;
                  background-color: #ea4335;
                  border: 2px solid white;
                  border-top: none;
                  border-radius: 0 0 2px 2px;
                "></div>
              </div>
            `,
                        iconSize: [24, 32],
                        iconAnchor: [12, 32],
                    });
                }

                return (
                    <Marker
                        key={index}
                        position={position}
                        icon={customIcon || undefined} // undefined => usa icona di default
                    >
                        <Popup>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiMapPin
                                        className={`${isStart ? 'text-gray-800' : isEnd ? 'text-red-600' : 'text-orange-500'}`}
                                    />
                                    <span className="font-bold text-gray-900">
                                        {point.label ||
                                            (isStart
                                                ? 'Partenza'
                                                : isEnd
                                                  ? 'Arrivo'
                                                  : `Punto ${index + 1}`)}
                                    </span>
                                </div>
                                <div className="text-gray-600 text-sm">
                                    {point.description ||
                                        (isStart
                                            ? 'Punto di partenza'
                                            : isEnd
                                              ? 'Punto di arrivo'
                                              : 'Punto intermedio')}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default MapRoutePoints;
