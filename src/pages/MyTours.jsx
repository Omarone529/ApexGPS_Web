import React, { useState } from 'react';

function MyTours() {
    return (
        <>
            <section className="tour">
                <h1
                    className="text-center py-8 m-0 text-5xl text-white bg-linear-to-r
                             from-[#1c1c1c] to-[#0e0e0e]"
                >
                    MY TOURS
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
    const [routes, setRoutes] = useState([
        {
            id: 1,
            title: 'Passo della Futa',
            area: 'Appennino Tosco-Emiliano',
            rating: 4.8,
            image: '/routes/routes1.webp',
            isPublic: true,
        },
        {
            id: 2,
            title: 'Passo della Raticosa',
            area: 'Bologna – Firenze',
            rating: 4.9,
            image: '/routes/routes2.webp',
            isPublic: true,
        },
        {
            id: 3,
            title: 'Muraglione',
            area: 'Foreste Casentinesi',
            rating: 4.7,
            image: '/routes/routes3.webp',
            isPublic: false,
        },
        {
            id: 4,
            title: 'Passo della Cisa',
            area: 'Appennino Parmense',
            rating: 4.6,
            image: '/routes/routes4.webp',
            isPublic: true,
        },
        {
            id: 5,
            title: 'Passo del Gavia',
            area: 'Alpi Lombarde',
            rating: 4.9,
            image: '/routes/routes5.webp',
            isPublic: true,
        },
        {
            id: 6,
            title: 'Passo dello Stelvio',
            area: 'Alpi Retiche',
            rating: 5.0,
            image: '/routes/routes6.webp',
            isPublic: true,
        },
        {
            id: 7,
            title: 'Passo Giau',
            area: 'Dolomiti',
            rating: 4.9,
            image: '/routes/routes7.webp',
            isPublic: false,
        },
        {
            id: 8,
            title: 'Colle delle Finestre',
            area: 'Val di Susa',
            rating: 4.8,
            image: '/routes/routes8.webp',
            isPublic: true,
        },
        {
            id: 9,
            title: 'Passo del Rombo',
            area: 'Alpi Venoste',
            rating: 4.9,
            image: '/routes/routes9.webp',
            isPublic: true,
        },
        {
            id: 10,
            title: 'Passo del Tonale',
            area: 'Lombardia – Trentino',
            rating: 4.6,
            image: '/routes/routes10.webp',
            isPublic: false,
        },
        {
            id: 11,
            title: 'Passo San Marco',
            area: 'Val Brembana',
            rating: 4.7,
            image: '/routes/routes11.webp',
            isPublic: true,
        },
    ]);

    const handleDelete = id => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            setRoutes(routes.filter(route => route.id !== id));
        }
    };

    const handleTogglePublic = id => {
        setRoutes(
            routes.map(route => (route.id === id ? { ...route, isPublic: !route.isPublic } : route))
        );
    };

    return (
        <div
            className="mw-[1400px] my-0 mx-auto
            font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Oxygen,Ubuntu,sans-serif]"
        >
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-[clamp(2.2rem,3.2vw,2.8rem)] font-semibold leading-[1.15] m-0 text-[#f2f2f2]">
                    I percorsi che hai creato
                </h2>
                <div className="flex items-center gap-4">
                    <span className="bg-white/10 py-2 px-4 rounded-2xl text-base text-[#f2f2f2] font-medium backdrop-blur-md border border-white/10">
                        {routes.filter(r => r.isPublic).length} public / {routes.length} total
                    </span>
                    <span
                        className="bg-white/10 py-2 px-4 rounded-2xl text-base text-[#f2f2f2] font-medium
                               backdrop-blur-md border border-white/10"
                    >
                        {routes.length} percorsi
                    </span>
                </div>
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

                        {/* Action Buttons - Top Right */}
                        <div className="absolute top-3 right-3 z-10 flex gap-2">
                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(route.id)}
                                className="p-2 rounded-lg bg-red-500/20 text-red-300
                                         border border-red-400/30 backdrop-blur-md
                                         transition-all duration-300 ease-out
                                         hover:bg-red-500 hover:text-white
                                         hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]
                                         hover:scale-110 active:scale-95"
                                title="Delete route"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Smartphone-style Toggle Switch - Top Left */}
                        <div className="absolute top-3 left-3 z-10">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={route.isPublic}
                                    onChange={() => handleTogglePublic(route.id)}
                                />
                                <div
                                    className={`
                                    relative w-14 h-7 rounded-full 
                                    transition-all duration-300 ease-in-out
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                                    after:bg-white after:rounded-full after:h-6 after:w-6
                                    after:shadow-md after:transition-all after:duration-300
                                    ${
                                        route.isPublic
                                            ? 'bg-green-500/50 after:translate-x-7 after:bg-white'
                                            : 'bg-gray-400/50 after:translate-x-0 after:bg-white'
                                    }
                                `}
                                >
                                    {/* Icons inside the switch */}
                                    <span
                                        className={`
                                        absolute left-1.5 top-1.5 text-xs font-bold transition-opacity duration-300
                                        ${route.isPublic ? 'text-white opacity-100' : 'text-gray-600 opacity-0'}
                                    `}
                                    >
                                        PUB
                                    </span>
                                    <span
                                        className={`
                                        absolute right-1.5 top-1.5 text-xs font-bold transition-opacity duration-300
                                        ${!route.isPublic ? 'text-white opacity-100' : 'text-gray-600 opacity-0'}
                                    `}
                                    >
                                        PRIV
                                    </span>
                                </div>
                            </label>
                        </div>

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
                                    {route.rating.toFixed(1)}
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
                                className="text-gray-200 text-sm mb-4 opacity-90
                         drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
                         transition-all duration-500"
                            >
                                {route.area}
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
export default MyTours;
