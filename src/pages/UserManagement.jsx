import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('access_token'); // adjust key if needed
        if (!token) {
            setError('Non autenticato. Effettua il login.');
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const renderBoolean = value => (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
        >
            {value ? 'Sì' : 'No'}
        </span>
    );

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
                    <p className="mt-2 break-words whitespace-pre-wrap">{error}</p>
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
            <div className="mx-auto max-w-6xl px-6 sm:px-10 md:px-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1C1A18] mb-8">
                    Gestione Utenti
                </h1>

                {users.length === 0 ? (
                    <p className="text-gray-600">Nessun utente trovato.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ruolo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Superuser
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Crea percorsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pubblica
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {renderBoolean(user.is_administrator)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {renderBoolean(user.is_superuser)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {renderBoolean(user.can_create_routes)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {renderBoolean(user.can_publish_routes)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;
