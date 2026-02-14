import { useState, useEffect } from 'react';
import { FiX, FiStar, FiMapPin, FiPlusCircle, FiImage, FiCamera } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const POICard = ({ poi, onClose, onAddToRoute }) => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [wikipediaDescription, setWikipediaDescription] = useState('');

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (poi?.name && poi?.coordinates) {
      fetchPhotos();
    }
  }, [poi?.name, poi?.coordinates, poi?.category]);

  const fetchPhotos = async () => {
    if (!poi.name || !poi.coordinates) return;

    setLoadingPhotos(true);
    try {
      const params = new URLSearchParams({
        name: poi.name,
        lat: poi.coordinates[0].toString(),
        lon: poi.coordinates[1].toString(),
        category: poi.category || '',
      });

      const response = await fetch(`${API_BASE_URL}/api/pois/photos/?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
        setWikipediaDescription(data.wikipedia_description || '');
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const categoryColors = {
    restaurant: 'bg-orange-500',
    food: 'bg-orange-500',
    church: 'bg-purple-500',
    historic: 'bg-amber-500',
    monument: 'bg-amber-500',
    viewpoint: 'bg-emerald-500',
    panoramic: 'bg-emerald-500',
    castle: 'bg-amber-500',
    lake: 'bg-blue-500',
    nature: 'bg-emerald-500',
    mountain_pass: 'bg-gray-500',
    waterfall: 'bg-blue-500',
    vineyard: 'bg-purple-500',
    museum: 'bg-amber-500',
    archaeological: 'bg-amber-500',
    gallery: 'bg-amber-500',
    theatre: 'bg-purple-500',
    library: 'bg-blue-500',
    school: 'bg-gray-500',
    university: 'bg-blue-500',
    hospital: 'bg-red-500',
    pharmacy: 'bg-green-500',
    bank: 'bg-emerald-500',
    post_office: 'bg-blue-500',
    town_hall: 'bg-amber-500',
    police: 'bg-blue-500',
    fire_station: 'bg-red-500',
  };

  const categoryIcons = {
    restaurant: '🍽️',
    food: '🍕',
    church: '⛪',
    historic: '🏛️',
    monument: '🗿',
    viewpoint: '👁️',
    panoramic: '🏞️',
    castle: '🏰',
    lake: '💧',
    nature: '🌲',
    mountain_pass: '⛰️',
    waterfall: '💦',
    vineyard: '🍇',
    museum: '🏛️',
    archaeological: '🔍',
    gallery: '🖼️',
    theatre: '🎭',
    library: '📚',
    school: '🎓',
    university: '🎓',
    hospital: '🏥',
    pharmacy: '💊',
    bank: '💰',
    post_office: '📮',
    town_hall: '🏛️',
    police: '👮',
    fire_station: '🚒',
  };

  const colorClass = categoryColors[poi?.category] || 'bg-gray-500';
  const icon = categoryIcons[poi?.category] || '📍';

  const nextPhoto = () => {
    setCurrentPhotoIndex(prev => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

  if (!poi) return null;

  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md px-4 animate-slide-up">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Header with color strip */}
          <div className={`h-2 ${colorClass}`} />

          {/* Photo Gallery Section */}
          {photos.length > 0 && (
            <div className="relative h-64 bg-gray-800 group">
              <img
                src={photos[currentPhotoIndex]?.thumbnail || photos[currentPhotoIndex]?.url}
                alt={poi.name}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+not+available';
                }}
              />

              {/* Photo date */}
              {photos[currentPhotoIndex]?.date && (
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  📅 {photos[currentPhotoIndex].date}
                </div>
              )}

              {/* Photo navigation */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
                  >
                    →
                  </button>
                </>
              )}

              {/* Photo counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {currentPhotoIndex + 1} / {photos.length}
              </div>

              {/* Expand gallery button */}
              {photos.length > 0 && (
                <button
                  onClick={() => setShowGallery(true)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
                  title="View full screen"
                >
                  <FiImage size={16} />
                </button>
              )}

              {/* Photo source */}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                {photos[currentPhotoIndex]?.source || 'Wikimedia'}
              </div>
            </div>
          )}

          {/* Loading indicator for photos */}
          {loadingPhotos && (
            <div className="h-48 bg-gray-800 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
            </div>
          )}

          {/* Placeholder when no photos */}
          {!loadingPhotos && photos.length === 0 && (
            <div className="h-32 bg-gray-800/50 flex items-center justify-center gap-2">
              <FiCamera className="text-gray-600" size={20} />
              <span className="text-gray-500 text-sm">Nessuna foto disponibile</span>
            </div>
          )}

          {/* Wikipedia description (when no photos) */}
          {!loadingPhotos && photos.length === 0 && wikipediaDescription && (
            <div className="p-4 bg-gray-800/80 text-gray-300 text-sm border-t border-gray-700">
              <p className="line-clamp-3">{wikipediaDescription}</p>
              <a
                href={`https://it.wikipedia.org/wiki/${encodeURIComponent(poi.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 text-xs mt-2 inline-block"
              >
                Leggi su Wikipedia →
              </a>
            </div>
          )}

          <div className="p-5">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <FiX size={20} />
            </button>

            {/* Main content */}
            <div className="flex items-start gap-4">
              {/* Icon circle */}
              <div
                className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-xl flex-shrink-0`}
              >
                {icon}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{poi.name}</h3>
                <p className="text-sm text-gray-400 capitalize mb-2">{poi.category}</p>

                {poi.description && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{poi.description}</p>
                )}

                {/* Scenic value */}
                {poi.scenic_value && (
                  <div className="flex items-center gap-1 mb-2">
                    <FiStar className="text-amber-400" size={14} />
                    <span className="text-sm text-amber-400">
                      {typeof poi.scenic_value === 'number'
                        ? poi.scenic_value.toFixed(1)
                        : poi.scenic_value}
                    </span>
                  </div>
                )}

                {/* Region & Elevation */}
                {(poi.region || poi.elevation) && (
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    {poi.region && <span>📍 {poi.region}</span>}
                    {poi.elevation && <span>⛰️ {poi.elevation}m</span>}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => onAddToRoute(poi)}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"
                  >
                    <FiPlusCircle size={16} />
                    Aggiungi al percorso
                  </button>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="mt-3 pt-2 border-t border-gray-800">
              <p className="text-xs text-gray-500 font-mono">
                {poi.coordinates[0].toFixed(6)}, {poi.coordinates[1].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && photos.length > 0 && (
        <div className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 transition-colors"
          >
            <FiX size={28} />
          </button>

          <div className="relative w-full max-w-6xl max-h-[90vh] px-4">
            <img
              src={photos[currentPhotoIndex]?.url}
              alt={poi.name}
              className="w-full h-full object-contain"
              onError={e => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+not+available';
              }}
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors text-2xl backdrop-blur-sm"
                >
                  ←
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors text-2xl backdrop-blur-sm"
                >
                  →
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {currentPhotoIndex + 1} / {photos.length}
            </div>

            {/* Photo date in modal */}
            {photos[currentPhotoIndex]?.date && (
              <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                📅 {photos[currentPhotoIndex].date}
              </div>
            )}

            {/* Photo source in modal */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              {photos[currentPhotoIndex]?.source || 'Wikimedia Commons'}
            </div>
          </div>
        </div>
      )}

      <style>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
    </>
  );
};

export default POICard;
