import { useState, useEffect } from 'react';
import { FiX, FiCamera, FiMapPin } from 'react-icons/fi';

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;

const MapillaryPanel = ({ lat, lon, onClose }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                    { headers: { 'Accept-Language': 'it' } }
                );
                const data = await response.json();
                const road = data.address?.road || data.address?.pedestrian || data.address?.path;
                const city = data.address?.city || data.address?.town || data.address?.village;
                setAddress(
                    road ? `${road}${city ? `, ${city}` : ''}` : city || 'Posizione sconosciuta'
                );
            } catch {
                setAddress(null);
            }
        };

        const fetchPhotos = async () => {
            setLoading(true);
            setPhotos([]);
            setSelectedPhoto(null);

            try {
                const response = await fetch(
                    `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,thumb_256_url,thumb_1024_url,captured_at&bbox=${lon - 0.001},${lat - 0.001},${lon + 0.001},${lat + 0.001}&limit=10`
                );
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    setPhotos(data.data);
                    setSelectedPhoto(data.data[0]);
                }
            } catch (error) {
                console.error('Mapillary error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
        fetchPhotos();
    }, [lat, lon]);

    return (
        <div className="absolute bottom-6 right-6 z-[1500] w-96 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2 min-w-0">
                    <FiCamera size={16} className="text-orange-500 flex-shrink-0" />
                    <div className="min-w-0">
                        <span className="text-sm font-semibold text-gray-800 block">
                            Vista strada
                        </span>
                        {address ? (
                            <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                <FiMapPin size={10} />
                                {address}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">
                                {lat.toFixed(4)}, {lon.toFixed(4)}
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                >
                    <FiX size={14} className="text-gray-600" />
                </button>
            </div>

            {/* Main photo */}
            <div className="w-full h-52 bg-gray-100 flex items-center justify-center">
                {loading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-gray-500">Caricamento foto...</span>
                    </div>
                ) : selectedPhoto ? (
                    <img
                        src={selectedPhoto.thumb_1024_url}
                        alt="Vista strada"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FiCamera size={32} />
                        <span className="text-xs text-center px-4">
                            Nessuna foto disponibile in questa zona
                        </span>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                    {photos.map(photo => (
                        <img
                            key={photo.id}
                            src={photo.thumb_256_url}
                            alt="thumbnail"
                            onClick={() => setSelectedPhoto(photo)}
                            className={`w-14 h-14 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${
                                selectedPhoto?.id === photo.id
                                    ? 'ring-2 ring-orange-500'
                                    : 'opacity-70 hover:opacity-100'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MapillaryPanel;
