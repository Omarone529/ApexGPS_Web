import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.jsx';

const AdminRoute = () => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (!user?.is_administrator) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
