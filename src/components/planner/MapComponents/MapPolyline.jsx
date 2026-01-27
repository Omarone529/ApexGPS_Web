import { Polyline } from 'react-leaflet';

const MapPolyline = ({ calculatedRoute, isScenicRoute }) => {
  if (calculatedRoute.length === 0) return null;

  const pathOptions = {
    color: isScenicRoute ? '#f59e0b' : '#f97316',
    weight: 5,
    opacity: 0.8,
    lineCap: 'round',
    lineJoin: 'round',
  };

  return <Polyline pathOptions={pathOptions} positions={calculatedRoute} />;
};

export default MapPolyline;
