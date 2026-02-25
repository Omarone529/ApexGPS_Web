import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user) {
        // Save the current location so we can come back after login
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
