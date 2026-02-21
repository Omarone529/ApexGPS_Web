import { useState, useEffect } from 'react';
import { FiX, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const POICard = ({ poi, onClose }) => {
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
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

    const nextPhoto = () => {
        setCurrentPhotoIndex(prev => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex(prev => (prev - 1 + photos.length) % photos.length);
    };

    const categoryAccent = {
        restaurant: 'border-orange-500',
        food: 'border-orange-500',
        church: 'border-purple-500',
        historic: 'border-amber-500',
        monument: 'border-amber-500',
        viewpoint: 'border-emerald-500',
        panoramic: 'border-emerald-500',
        castle: 'border-amber-500',
        lake: 'border-blue-500',
        nature: 'border-emerald-500',
        mountain_pass: 'border-gray-500',
        waterfall: 'border-blue-500',
        vineyard: 'border-purple-500',
    };

    const accentClass = categoryAccent[poi?.category] || 'border-gray-500';

    if (!poi) return null;

    return (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-2xl px-4 animate-fade-up">
            <div className="relative backdrop-blur-xl bg-gray-900/90 rounded-xl shadow-2xl overflow-hidden border border-gray-800/50">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black/80 transition-all border border-white/20"
                >
                    <FiX size={18} />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full md:w-3/5 h-56 md:h-48 bg-gray-800">
                        {loadingPhotos ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500/50 border-t-orange-500" />
                            </div>
                        ) : photos.length > 0 ? (
                            <div className="relative h-full w-full group">
                                <img
                                    src={photos[currentPhotoIndex]?.url}
                                    alt={poi.name}
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                        e.target.src =
                                            'https://via.placeholder.com/600x400?text=No+Image';
                                    }}
                                />

                                {/* Navigation arrows */}
                                {photos.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevPhoto}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/20 md:opacity-0 md:group-hover:opacity-100"
                                        >
                                            <FiChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={nextPhoto}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/20 md:opacity-0 md:group-hover:opacity-100"
                                        >
                                            <FiChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Photo counter */}
                                {photos.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                                        {currentPhotoIndex + 1}/{photos.length}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                                <span className="text-4xl opacity-30">🏞️</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                        {/* Title and category */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                                {poi.name}
                            </h3>

                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full border ${accentClass} text-gray-300`}
                                >
                                    {poi.category}
                                </span>
                            </div>

                            {/* Short description */}
                            {(poi.description || wikipediaDescription) && (
                                <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                                    {poi.description || wikipediaDescription}
                                </p>
                            )}
                        </div>

                        {/* Location chips */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {poi.region && (
                                <span className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-md">
                                    <FiMapPin size={10} />
                                    {poi.region}
                                </span>
                            )}
                            {poi.elevation && (
                                <span className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-md">
                                    {poi.elevation}m
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-up {
                    animation: fade-up 0.2s ease-out;
                }
                .group:hover .md\\\\:opacity-0 {
                    opacity: 1;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default POICard;
