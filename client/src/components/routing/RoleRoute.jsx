import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
};

export default RoleRoute;
