import { Polyline } from 'react-leaflet';

const MapPolyline = ({ calculatedRoute, isScenicRoute }) => {
  if (calculatedRoute.length === 0) return null;

  const borderColor = isScenicRoute ? '#d97706' : '#ea580c'; // Versione più scura per il bordo
  const highlightColor = isScenicRoute ? '#fbbf24' : '#fb923c'; // Versione più chiara per il centro

  return (
    <>
      <Polyline
        pathOptions={{
          color: '#000000',
          weight: 7,
          opacity: 0.1,
          lineCap: 'round',
          lineJoin: 'round',
          smoothFactor: 1.5,
          interactive: false,
        }}
        positions={calculatedRoute}
      />

      {/* Bordo più spesso e scuro */}
      <Polyline
        pathOptions={{
          color: borderColor,
          weight: 6,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round',
          smoothFactor: 1.5,
          interactive: false,
        }}
        positions={calculatedRoute}
      />

      <Polyline
        pathOptions={{
          color: highlightColor,
          weight: 4,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
          smoothFactor: 1.5,
        }}
        positions={calculatedRoute}
      />
    </>
  );
};

export default MapPolyline;
