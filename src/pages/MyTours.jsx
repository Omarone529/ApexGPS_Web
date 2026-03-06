import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gpxService } from '../services/gpxService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

const GLOBAL_STYLES = `
  .font-display { font-family: 'Playfair Display', serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pillActivate {
    0%   { transform: scale(1); }
    45%  { transform: scale(1.07); }
    75%  { transform: scale(0.97); }
    100% { transform: scale(1); }
  }

  .animate-fadeUp { animation: fadeUp 0.45s ease both; }
  .card-enter     { animation: fadeUp 0.45s cubic-bezier(0.25,0.46,0.45,0.94) both; }
  .pill-activate  { animation: pillActivate 0.4s cubic-bezier(0.34,1.4,0.64,1) both; }

  .pill-fill {
    transition: transform 0.6s cubic-bezier(0.34,1.2,0.64,1), opacity 0.4s ease;
    transform-origin: left center;
  }
`;

function StatPill({ count, label, accent }) {
    const prevRef = useRef(count);
    const [bounce, setBounce] = useState(false);
    const isActive = accent && count > 0;

    useEffect(() => {
        if (count !== prevRef.current) {
            prevRef.current = count;
            requestAnimationFrame(() => requestAnimationFrame(() => setBounce(true)));
        }
    }, [count]);

    return (
        <span
            className={[
                'relative overflow-hidden inline-flex items-center rounded-full px-4 py-2',
                'text-[13px] font-medium font-body border select-none cursor-default',
                'shadow-sm transition-all duration-500',
                isActive
                    ? 'bg-[#FDF0E8] border-orange-300/50 text-[#E8692A] shadow-[0_0_0_3px_rgba(232,105,42,0.07)]'
                    : 'bg-white border-[#E2DDD3] text-[#6B6460]',
                bounce && 'pill-activate',
            ]
                .filter(Boolean)
                .join(' ')}
            onAnimationEnd={() => setBounce(false)}
        >
            {accent && (
                <span
                    aria-hidden
                    className="pill-fill absolute inset-0 rounded-full bg-[#FDF0E8] pointer-events-none"
                    style={{
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        opacity: isActive ? 1 : 0,
                    }}
                />
            )}
            <span className="relative z-10">
                <span className="font-semibold">{count}</span> {label}
            </span>
        </span>
    );
}

function MyTours() {
    return (
        <>
            <style>{GLOBAL_STYLES}</style>
            <section className="font-body bg-[#F5F3EC] min-h-screen">
                <RoutesGrid />
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
        if (!token) token = sessionStorage.getItem('access_token');
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
            if (res.ok) setCurrentUser(await res.json());
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
                if (!response.ok) throw new Error(`Failed to fetch routes: ${response.statusText}`);
                const data = await response.json();
                setRoutes(data);
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
        if (diffDays >= 1) return `${diffDays} ${diffDays === 1 ? 'giorno' : 'giorni'}`;
        return `${diffHours} ${diffHours === 1 ? 'ora' : 'ore'}`;
    };

    const handleDelete = async id => {
        if (!window.confirm('Are you sure you want to delete this route?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${id}/`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error(`Delete failed: ${response.statusText}`);
            setRoutes(routes.filter(route => route.id !== id));
        } catch (err) {
            alert(`Error deleting route: ${err.message}`);
        }
    };

    const handleTogglePublic = async id => {
        const route = routes.find(r => r.id === id);
        if (!route) return;
        if (route.hidden_until && new Date(route.hidden_until) > new Date()) {
            alert('Questo percorso è sospeso e non può essere reso pubblico.');
            return;
        }
        const newVisibility = route.visibility === 'public' ? 'private' : 'public';
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${id}/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ visibility: newVisibility }),
            });
            if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
            setRoutes(routes.map(r => (r.id === id ? { ...r, visibility: newVisibility } : r)));
        } catch (err) {
            alert(`Error updating route: ${err.message}`);
        }
    };

    const handleEditStart = route => {
        setEditingId(route.id);
        setEditValue(route.name);
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
            if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
            setRoutes(routes.map(r => (r.id === id ? { ...r, name: editValue.trim() } : r)));
            setEditingId(null);
            setEditValue('');
        } catch (err) {
            alert(`Error updating route name: ${err.message}`);
        }
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') handleEditSave(id);
        else if (e.key === 'Escape') handleEditCancel();
    };

    const isUserSuspended =
        currentUser?.hidden_until && new Date(currentUser.hidden_until) > new Date();
    const userSuspensionTime = isUserSuspended
        ? renderTimeRemaining(currentUser.hidden_until)
        : null;

    const publicCount = routes.filter(r => r.visibility === 'public').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 min-h-[60vh] text-[#9B958F]">
                <div className="w-5 h-5 rounded-full border-2 border-[#E2DDD3] border-t-[#E8692A] animate-spin" />
                <span className="text-[13px] font-body">Caricamento percorsi…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-8 font-body text-sm">
                Errore nel caricamento: {error}
            </div>
        );
    }

    const sectionPadding = 'clamp(1.5rem, 5vw, 4rem)';

    return (
        <>
            {/* Header */}
            <header
                className="bg-[#F5F3EC] border-b border-[#E2DDD3]"
                style={{
                    paddingTop: 'clamp(4rem, 6vw, 5rem)',
                    paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
                    paddingLeft: sectionPadding,
                    paddingRight: sectionPadding,
                }}
            >
                <div className="max-w-[1280px] mx-auto animate-fadeUp">
                    <div className="flex justify-end mb-6">
                        <div className="flex items-center gap-3">
                            <StatPill count={publicCount} label="pubblici" accent={true} />
                            <StatPill count={routes.length} label="totali" accent={false} />
                        </div>
                    </div>
                    <h1
                        className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium
                                   text-[#1A1814] leading-[1.15] tracking-[-0.02em]"
                    >
                        I tuoi percorsi
                    </h1>
                </div>
            </header>

            {/* Main */}
            <main
                className="py-10 pb-20"
                style={{ paddingLeft: sectionPadding, paddingRight: sectionPadding }}
            >
                <div className="max-w-[1280px] mx-auto">
                    {/* Suspension banner */}
                    {isUserSuspended && (
                        <div
                            className="flex items-center gap-3 mb-8 px-4 py-3.5 rounded-2xl
                                    bg-[#FEF2EE] border border-orange-200/60 animate-fadeUp"
                        >
                            <span className="text-[15px] flex-shrink-0">⏸</span>
                            <p className="text-[13.5px] font-medium text-[#E8692A] font-body">
                                Il tuo account è sospeso per {userSuspensionTime}. Durante questo
                                periodo non puoi rendere pubblici nuovi percorsi.
                            </p>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {routes.length === 0 && (
                            <div className="col-span-full text-center py-20 animate-fadeUp">
                                <div
                                    className="w-14 h-14 rounded-[16px] bg-[#EDE9DF] flex items-center justify-center
                                            mx-auto mb-4 text-[#9B958F]"
                                >
                                    <svg
                                        width="26"
                                        height="26"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                        />
                                    </svg>
                                </div>
                                <h2 className="font-display text-[20px] font-medium text-[#1A1814] mb-2">
                                    Nessun percorso ancora
                                </h2>
                                <p className="text-[13px] text-[#9B958F] font-body">
                                    I tuoi percorsi creati appariranno qui.
                                </p>
                            </div>
                        )}

                        {routes.map((route, idx) => {
                            const isRouteSuspended =
                                route.hidden_until && new Date(route.hidden_until) > new Date();
                            const routeSuspensionTime = isRouteSuspended
                                ? renderTimeRemaining(route.hidden_until)
                                : null;

                            return (
                                <RouteCard
                                    key={route.id}
                                    route={route}
                                    idx={idx}
                                    isRouteSuspended={isRouteSuspended}
                                    routeSuspensionTime={routeSuspensionTime}
                                    editingId={editingId}
                                    editValue={editValue}
                                    setEditValue={setEditValue}
                                    onDelete={handleDelete}
                                    onTogglePublic={handleTogglePublic}
                                    onEditStart={handleEditStart}
                                    onEditSave={handleEditSave}
                                    onKeyDown={handleKeyDown}
                                />
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}

function RouteCard({
    route,
    idx,
    isRouteSuspended,
    routeSuspensionTime,
    editingId,
    editValue,
    setEditValue,
    onDelete,
    onTogglePublic,
    onEditStart,
    onEditSave,
    onKeyDown,
}) {
    const navigate = useNavigate();
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold: 0.06 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const handleDownload = () => {
        try {
            gpxService.downloadGPX({
                id: route.id,
                name: route.name,
                polyline: route.polyline,
            });
        } catch (error) {
            console.error('GPX download failed:', error);
            alert(
                'Impossibile generare il file GPX. Il percorso potrebbe non contenere dati validi.'
            );
        }
    };

    const handleViewDetails = () => {
        navigate('/planner', { state: { routeData: route } });
    };

    const area = `${route.start_location_name || '?'} → ${route.end_location_name || '?'}`;
    const image = `https://picsum.photos/seed/${route.id}/300/400`;
    const isPublic = route.visibility === 'public';

    return (
        <div
            ref={ref}
            className={[
                'group bg-white rounded-[20px] border overflow-hidden cursor-pointer',
                'shadow-[0_1px_3px_rgba(26,24,20,0.06)] transition-all duration-300',
                isPublic ? 'border-orange-200/60' : 'border-[#E2DDD3]',
                'hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(26,24,20,0.09)] hover:border-transparent',
                visible ? 'card-enter' : 'opacity-0',
            ].join(' ')}
            style={{ animationDelay: `${idx * 0.05}s` }}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE9DF]">
                <img
                    src={image}
                    alt={route.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25 pointer-events-none" />

                {/* Toggle */}
                <div className="absolute top-3 left-3 z-10">
                    <label
                        className={[
                            'inline-flex items-center gap-2 rounded-full px-2.5 py-[5px]',
                            'bg-white/90 backdrop-blur-sm border border-black/8 shadow-sm select-none',
                            'transition-transform duration-150',
                            !isRouteSuspended
                                ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]'
                                : 'opacity-40 cursor-not-allowed',
                        ].join(' ')}
                        onClick={isRouteSuspended ? undefined : () => onTogglePublic(route.id)}
                    >
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPublic}
                            onChange={() => onTogglePublic(route.id)}
                            disabled={isRouteSuspended}
                        />
                        <span
                            className={[
                                'relative flex-shrink-0 w-[28px] h-[16px] rounded-full transition-colors duration-300',
                                isPublic ? 'bg-[#E8692A]' : 'bg-[#C8C4BC]',
                            ].join(' ')}
                        >
                            <span
                                className={[
                                    'absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white',
                                    'shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
                                    'transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                                    isPublic ? 'translate-x-[14px]' : 'translate-x-[2px]',
                                ].join(' ')}
                            />
                        </span>
                        <span
                            className={[
                                'text-[11px] font-semibold tracking-[0.03em] font-body min-w-[32px]',
                                'transition-colors duration-300',
                                isPublic ? 'text-[#E8692A]' : 'text-[#9B958F]',
                            ].join(' ')}
                        >
                            {isPublic ? 'Pubblico' : 'Privato'}
                        </span>
                    </label>
                    {isRouteSuspended && (
                        <div className="absolute top-8 left-0 text-[11px] font-medium text-[#E8692A] whitespace-nowrap font-body">
                            ⏳ Sospeso {routeSuspensionTime}
                        </div>
                    )}
                </div>

                {/* Delete */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={() => onDelete(route.id)}
                        disabled={isRouteSuspended}
                        title={isRouteSuspended ? 'Cannot delete suspended route' : 'Delete route'}
                        className={[
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            'bg-white/90 backdrop-blur-sm border border-black/8 shadow-sm',
                            'text-[#9B8880] opacity-0 group-hover:opacity-100 transition-all duration-200',
                            !isRouteSuspended
                                ? 'hover:bg-red-50 hover:text-red-500 hover:scale-110'
                                : 'opacity-20 cursor-not-allowed',
                        ].join(' ')}
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

                {/* Suspended badge */}
                {isRouteSuspended && (
                    <div
                        className="absolute top-12 right-3 z-10 flex items-center gap-1.5
                                    bg-red-500/80 backdrop-blur-sm text-white
                                    text-[10px] font-semibold tracking-widest uppercase
                                    px-2.5 py-1 rounded-full font-body"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                        Sospeso
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1.5">
                    {editingId === route.id ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => onEditSave(route.id)}
                            onKeyDown={e => onKeyDown(e, route.id)}
                            className="w-full font-display text-[17px] font-medium text-[#1A1814]
                                       bg-[#F5F3EC] border border-[#E8692A] rounded-lg px-2.5 py-1
                                       outline-none shadow-[0_0_0_3px_rgba(232,105,42,0.1)]"
                            autoFocus
                        />
                    ) : (
                        <>
                            <h3 className="flex-1 font-display text-[17px] font-medium text-[#1A1814] leading-snug">
                                {route.name}
                            </h3>
                            {!isRouteSuspended && (
                                <button
                                    onClick={() => onEditStart(route)}
                                    title="Edit name"
                                    className="w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0
                                               opacity-0 group-hover:opacity-100 text-[#9B958F]
                                               transition-all duration-200
                                               hover:bg-[#FDF0E8] hover:text-[#E8692A]"
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

                {/* Area */}
                <p className="flex items-center gap-1.5 text-[12.5px] text-[#9B958F] mb-4 font-body">
                    <svg
                        width="11"
                        height="11"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="flex-shrink-0 opacity-50"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    {area}
                </p>

                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleDownload}
                        title="Scarica GPX"
                        className="w-7 h-7 rounded-full flex items-center justify-center
                                   bg-[#F5F3EC] border border-[#E2DDD3] text-[#6B6460]
                                   hover:bg-[#E8692A] hover:border-[#E8692A] hover:text-white
                                   transition-all duration-200 active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-3-3m3 3l3-3"
                            />
                        </svg>
                    </button>
                </div>

                {/* CTA */}
                <button
                    onClick={handleViewDetails}
                    className="w-full py-2.5 rounded-xl text-[13px] font-medium font-body
                                   bg-[#F5F3EC] border border-[#E2DDD3] text-[#6B6460]
                                   transition-all duration-200
                                   hover:bg-[#E8692A] hover:border-[#E8692A] hover:text-white
                                   hover:shadow-[0_6px_20px_rgba(232,105,42,0.22)]
                                   active:scale-[0.99]"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default MyTours;
