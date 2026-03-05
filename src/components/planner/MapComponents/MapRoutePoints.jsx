import { Marker, Popup } from 'react-leaflet';
import { FiMapPin } from 'react-icons/fi';
import L from 'leaflet';

// Colori marker stile Google Maps
const COLORS = {
    start: '#1a73e8', // blu Google
    end: '#ea4335', // rosso Google
    waypoint: '#1a73e8', // blu Google
};

const createPinIcon = (color, label = '', className = 'map-pin-marker') => {
    const inner = label
        ? `<text x="12" y="15" text-anchor="middle" fill="white" font-size="10" font-weight="bold" font-family="sans-serif">${label}</text>`
        : `<circle cx="12" cy="12" r="4" fill="white"/>`;

    return L.divIcon({
        className,
        html: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36"
               style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24S24 19.2 24 12C24 5.4 18.6 0 12 0z"
                  fill="${color}"/>
            ${inner}
          </svg>
        `,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
    });
};

const MapRoutePoints = ({ routePoints }) => {
    if (!routePoints || routePoints.length === 0) return null;

    return (
        <>
            {routePoints.map((point, index) => {
                const position = point.position || [45.4642, 9.19];
                const isStart = index === 0;
                const isEnd = index === routePoints.length - 1;

                let icon;
                let popupColor;
                if (isStart) {
                    icon = createPinIcon(COLORS.start, '', 'start-marker');
                    popupColor = 'text-blue-600';
                } else if (isEnd) {
                    icon = createPinIcon(COLORS.end, '', 'end-marker');
                    popupColor = 'text-red-600';
                } else {
                    icon = createPinIcon(COLORS.waypoint, String(index), 'waypoint-marker');
                    popupColor = 'text-sky-500';
                }

                return (
                    <Marker key={index} position={position} icon={icon}>
                        <Popup>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiMapPin className={popupColor} />
                                    <span className="font-bold text-gray-900">
                                        {point.label ||
                                            (isStart
                                                ? 'Partenza'
                                                : isEnd
                                                  ? 'Arrivo'
                                                  : `Tappa ${index}`)}
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
