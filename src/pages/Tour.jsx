import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

function Tour() {
    return (
        <>
            <section className="tour">
                <h1
                    className="text-center py-8 m-0 text-5xl text-white bg-linear-to-r
                             from-[#1c1c1c] to-[#0e0e0e]"
                >
                    TOUR
                </h1>
                <section
                    id="nearby-routes"
                    className="py-16 px-8 br-[radial-gradient(circle_at_top,#1c1c1c,#0e0e0e)]
                             text-white overflow-hidden "
                >
                    <RoutesGrid />
                </section>
            </section>
        </>
    );
}

function RoutesGrid() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Optional: include auth header if the user is logged in (not required for public endpoint)
    const getAuthHeaders = () => {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    };

    useEffect(() => {
        const fetchPublicRoutes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/routes/public/`, {
                    headers: getAuthHeaders(),
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch routes: ${response.statusText}`);
                }
                const data = await response.json();
                // data is expected to be an array of route objects
                const formattedRoutes = data.map(route => ({
                    id: route.id,
                    title: route.name,
                    area: `${route.start_location || '?'} → ${route.end_location || '?'}`,
                    rating: route.total_scenic_score
                        ? Math.min(5, (route.total_scenic_score / 2).toFixed(1))
                        : 4.5,
                    image: `https://picsum.photos/seed/${route.id}/300/400`,
                    owner: route.owner_username || 'Anonymous',
                }));
                setRoutes(formattedRoutes);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicRoutes();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-400 p-8">Error loading routes: {error}</div>;
    }

    return (
        <div
            className="mw-[1400px] my-0 mx-auto
            font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Oxygen,Ubuntu,sans-serif]"
        >
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-[clamp(2.2rem,3.2vw,2.8rem)] font-semibold leading-[1.15] m-0 text-[#f2f2f2]">
                    Scopri i percorsi degli utenti{' '}
                </h2>
                <span
                    className="bg-white/10 py-2 px-4 rounded-2xl text-base text-[#f2f2f2] font-medium
                               backdrop-blur-md border border-white/10"
                >
                    {routes.length} percorsi
                </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {routes.map(route => (
                    <div
                        key={route.id}
                        className="group relative aspect-[3/4] rounded-3xl overflow-hidden
                              bg-white/5 backdrop-blur-sm border border-white/10
                              transition-all duration-500 ease-out
                              hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
                    >
                        {/* Image */}
                        <img
                            src={route.image}
                            alt={route.title}
                            className="absolute inset-0 w-full h-full object-cover
                           transition-transform duration-700 ease-out
                           group-hover:scale-110"
                        />

                        <div
                            className="absolute inset-0 bg-gradient-to-t
                          from-black/90 via-black/50 to-transparent
                          opacity-90 transition-opacity duration-500
                          group-hover:opacity-95"
                        />

                        <div
                            className="absolute bottom-0 left-0 right-0 p-6
                         transition-all duration-500 ease-out
                         translate-y-0 group-hover:translate-y-[-8px]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                            style={{
                                                color:
                                                    i < Math.floor(route.rating)
                                                        ? '#FFD700'
                                                        : '#ffffff80',
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span
                                    className="text-white font-bold text-sm
                             drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                >
                                    {route.rating}
                                </span>
                            </div>

                            <h3
                                className="text-2xl font-bold text-white mb-1
                         drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]
                         transition-all duration-500"
                            >
                                {route.title}
                            </h3>

                            <p
                                className="text-gray-200 text-sm mb-1 opacity-90
                         drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                            >
                                {route.area}
                            </p>

                            {/* Creator info */}
                            <p
                                className="text-gray-400 text-xs mb-4
                         drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                            >
                                by {route.owner}
                            </p>

                            <button
                                className="px-5 py-2.5 rounded-lg text-sm font-semibold
                         bg-white/10 text-white
                         border border-white/30
                         backdrop-blur-md
                         transition-all duration-300 ease-out
                         hover:bg-orange-500 hover:border-orange-400
                         hover:shadow-[0_0_20px_rgba(255,107,0,0.5)]
                         hover:scale-105
                         active:scale-95"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tour;
