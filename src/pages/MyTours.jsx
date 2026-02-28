import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

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
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const getAuthHeaders = () => {
        let token = localStorage.getItem('access_token');

        if (!token) {
            token = sessionStorage.getItem('access_token');
        }
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    };

    const fetchCurrentUser = async () => {
        const token =
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/users/me/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const userData = await res.json();
                setCurrentUser(userData);
            }
        } catch (err) {
            console.error('Failed to fetch current user', err);
        }
    };

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/routes/my_routes/`, {
                    headers: getAuthHeaders(),
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch routes: ${response.statusText}`);
                }
                const data = await response.json();
                const formattedRoutes = data.map(route => ({
                    id: route.id,
                    title: route.name,
                    area: `${route.start_location || '?'} → ${route.end_location || '?'}`,
                    rating: route.total_scenic_score
                        ? Math.min(5, (route.total_scenic_score / 2).toFixed(1))
                        : 4.5,
                    image: `https://picsum.photos/seed/${route.id}/300/400`,
                    isPublic: route.visibility === 'public',
                    hiddenUntil: route.hidden_until,
                }));
                setRoutes(formattedRoutes);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
        fetchCurrentUser();
    }, []);

    const renderTimeRemaining = hiddenUntil => {
        if (!hiddenUntil) return null;
        const suspensionDate = new Date(hiddenUntil);
        const now = new Date();
        if (suspensionDate <= now) return null;

        const diffMs = suspensionDate - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffDays >= 1) {
            return `${diffDays} ${diffDays === 1 ? 'giorno' : 'giorni'}`;
        } else {
            return `${diffHours} ${diffHours === 1 ? 'ora' : 'ore'}`;
        }
    };

    const handleDelete = async id => {
        if (!window.confirm('Are you sure you want to delete this route?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${id}/`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error(`Delete failed: ${response.statusText}`);
            }
            setRoutes(routes.filter(route => route.id !== id));
        } catch (err) {
            alert(`Error deleting route: ${err.message}`);
        }
    };

    const handleTogglePublic = async id => {
        const route = routes.find(r => r.id === id);
        if (!route) return;
        if (route.hiddenUntil && new Date(route.hiddenUntil) > new Date()) {
            alert('Questo percorso è sospeso e non può essere reso pubblico.');
            return;
        }
        const newVisibility = route.isPublic ? 'private' : 'public';

        try {
            const response = await fetch(`${API_BASE_URL}/routes/${id}/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ visibility: newVisibility }),
            });
            if (!response.ok) {
                throw new Error(`Update failed: ${response.statusText}`);
            }
            setRoutes(routes.map(r => (r.id === id ? { ...r, isPublic: !r.isPublic } : r)));
        } catch (err) {
            alert(`Error updating route: ${err.message}`);
        }
    };

    const handleEditStart = route => {
        setEditingId(route.id);
        setEditValue(route.title);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditValue('');
    };

    const handleEditSave = async id => {
        if (!editValue.trim()) return;
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${id}/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ name: editValue.trim() }),
            });
            if (!response.ok) {
                throw new Error(`Update failed: ${response.statusText}`);
            }
            setRoutes(routes.map(r => (r.id === id ? { ...r, title: editValue.trim() } : r)));
            setEditingId(null);
            setEditValue('');
        } catch (err) {
            alert(`Error updating route name: ${err.message}`);
        }
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleEditSave(id);
        } else if (e.key === 'Escape') {
            handleEditCancel();
        }
    };

    const isUserSuspended =
        currentUser?.hidden_until && new Date(currentUser.hidden_until) > new Date();
    const userSuspensionTime = isUserSuspended
        ? renderTimeRemaining(currentUser.hidden_until)
        : null;

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

            {isUserSuspended && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg backdrop-blur-sm text-white">
                    <p className="font-semibold">
                        ⚠️ Il tuo account è sospeso per {userSuspensionTime}. Durante questo periodo
                        non puoi rendere pubblici nuovi percorsi.
                    </p>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {routes.map(route => {
                    const isRouteSuspended =
                        route.hiddenUntil && new Date(route.hiddenUntil) > new Date();
                    const routeSuspensionTime = isRouteSuspended
                        ? renderTimeRemaining(route.hiddenUntil)
                        : null;

                    return (
                        <div
                            key={route.id}
                            className="group relative aspect-3/4 rounded-3xl overflow-hidden
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
                                className="absolute inset-0 bg-linear-to-t
                          from-black/90 via-black/50 to-transparent
                          opacity-90 transition-opacity duration-500
                          group-hover:opacity-95"
                            />

                            <div className="absolute top-3 right-3 z-10 flex gap-2">
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(route.id)}
                                    disabled={isRouteSuspended}
                                    className={`p-2 rounded-lg ${
                                        isRouteSuspended
                                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                                    } border border-red-400/30 backdrop-blur-md
                                         transition-all duration-300 ease-out
                                         hover:scale-110 active:scale-95`}
                                    title={
                                        isRouteSuspended
                                            ? 'Cannot delete suspended route'
                                            : 'Delete route'
                                    }
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

                            <div className="absolute top-3 left-3 z-10">
                                <label
                                    className={`relative inline-flex items-center cursor-pointer ${isRouteSuspended ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={route.isPublic}
                                        onChange={() => handleTogglePublic(route.id)}
                                        disabled={isRouteSuspended}
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
                                {isRouteSuspended && (
                                    <div className="absolute top-8 left-0 text-xs text-red-300 whitespace-nowrap">
                                        ⏳ Sospeso {routeSuspensionTime}
                                    </div>
                                )}
                            </div>

                            <div
                                className="absolute bottom-0 left-0 right-0 p-6
                         transition-all duration-500 ease-out
                         translate-y-0 group-hover:-translate-y-2"
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

                                <div className="flex items-center gap-2 mb-1">
                                    {editingId === route.id ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={e => setEditValue(e.target.value)}
                                            onBlur={() => handleEditSave(route.id)}
                                            onKeyDown={e => handleKeyDown(e, route.id)}
                                            className="bg-black/50 text-white text-2xl font-bold
                                                 px-2 py-1 rounded border border-white/30
                                                 w-full focus:outline-none focus:border-orange-400
                                                 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                                            autoFocus
                                        />
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                                                {route.title}
                                            </h3>
                                            {!isRouteSuspended && (
                                                <button
                                                    onClick={() => handleEditStart(route)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity
                                                     p-1 rounded-lg bg-white/10 text-white/70
                                                     hover:bg-orange-500 hover:text-white
                                                     border border-white/20"
                                                    title="Edit name"
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
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>

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

                            {isRouteSuspended && (
                                <div className="absolute top-12 right-3 z-10 bg-red-600/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                    Sospeso
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyTours;
