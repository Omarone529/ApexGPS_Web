import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [banningUserId, setBanningUserId] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [userToBan, setUserToBan] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            setError('Non autenticato. Effettua il login.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/users/users/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const responseText = await res.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                throw new Error(
                    `Il server ha risposto con: ${res.status} ${res.statusText}\n` +
                        `Contenuto: ${responseText.substring(0, 200)}`
                );
            }

            if (!res.ok) {
                throw new Error(data.detail || JSON.stringify(data));
            }

            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleConfirmBan = async () => {
        if (!userToBan) return;
        setShowBanModal(false);

        const token = sessionStorage.getItem('access_token');
        if (!token) {
            alert('Sessione scaduta. Effettua di nuovo il login.');
            return;
        }

        setBanningUserId(userToBan.id);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/users/${userToBan.id}/ban`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Errore durante la sospensione');
            }

            alert(`Utente ${userToBan.username} sospeso con successo.`);
            await fetchUsers();
        } catch (err) {
            setError(err.message);
            alert(`Errore: ${err.message}`);
        } finally {
            setBanningUserId(null);
            setUserToBan(null);
        }
    };

    const handleCancelBan = () => {
        setShowBanModal(false);
        setUserToBan(null);
    };

    const renderBoolean = value => (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
        >
            {value ? 'Sì' : 'No'}
        </span>
    );

    const renderSuspension = hiddenUntil => {
        if (!hiddenUntil) return <span className="text-gray-500">—</span>;

        const suspensionDate = new Date(hiddenUntil);
        const now = new Date();

        if (suspensionDate <= now) {
            return <span className="text-gray-500">Non sospeso</span>;
        }

        const diffMs = suspensionDate - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffDays >= 1) {
            return (
                <span className="text-orange-600 font-medium">
                    {diffDays} {diffDays === 1 ? 'giorno' : 'giorni'} rimasti
                </span>
            );
        } else {
            return (
                <span className="text-orange-600 font-medium">
                    {diffHours} {diffHours === 1 ? 'ora' : 'ore'} rimaste
                </span>
            );
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F5F3EC] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Caricamento...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#F5F3EC] min-h-screen flex items-center justify-center">
                <div className="text-center text-red-600 max-w-md">
                    <p className="text-lg font-semibold">Errore</p>
                    <p className="mt-2 wrap-break-word whitespace-pre-wrap">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 rounded-full bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
                    >
                        Torna alla home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F3EC] min-h-screen py-16 sm:py-20 md:py-24">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1C1A18] mb-8">
                    Gestione Utenti
                </h1>

                {users.length === 0 ? (
                    <p className="text-gray-600">Nessun utente trovato.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                        <table className="w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="sticky left-0 bg-gray-50 z-20 px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ruolo
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Superuser
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Crea percorsi
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pubblica
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sospensione
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map(user => {
                                    const isSuspended =
                                        user.hiddenUntil && new Date(user.hiddenUntil) > new Date();
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                                {user.id}
                                            </td>
                                            <td className="sticky left-0 bg-white z-10 hover:bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                                {user.username}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                                {user.email || '-'}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        user.role === 'ADMIN'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : user.role === 'SUBSCRIBED'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                {renderBoolean(user.is_administrator)}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                {renderBoolean(user.is_superuser)}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                {renderBoolean(user.can_create_routes)}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                {renderBoolean(user.can_publish_routes)}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                {renderSuspension(user.hiddenUntil)}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap text-xs sm:text-sm">
                                                <button
                                                    onClick={() => {
                                                        setUserToBan(user);
                                                        setShowBanModal(true);
                                                    }}
                                                    disabled={
                                                        banningUserId === user.id || isSuspended
                                                    }
                                                    className={`inline-flex items-center rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-medium ${
                                                        banningUserId === user.id
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : isSuspended
                                                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                              : 'bg-red-500 text-white hover:bg-red-600'
                                                    }`}
                                                >
                                                    {banningUserId === user.id ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            Sospensione...
                                                        </>
                                                    ) : isSuspended ? (
                                                        'Sospeso'
                                                    ) : (
                                                        'Sospendi'
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showBanModal && userToBan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Conferma sospensione
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Sei sicuro di voler sospendere{' '}
                            <span className="font-medium text-gray-900">{userToBan.username}</span>?
                            Un utente sospeso non potrà rendere pubblici percorsi per alcuni giorni
                            e tutti i suoi percorsi verranno resi privati.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelBan}
                                className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleConfirmBan}
                                className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                            >
                                Conferma
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;
