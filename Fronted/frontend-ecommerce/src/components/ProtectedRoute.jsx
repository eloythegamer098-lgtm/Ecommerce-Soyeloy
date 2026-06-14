import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading, role } = useAuth();

    // Pantalla de carga mientras se valida la sesión
    if (loading) {
        return (
            <div className="cyber-spinner-container">
                <div className="cyber-spinner"></div>
                <p className="mt-4 cyber-text">VALIDANDO CREDENCIALES...</p>
            </div>
        );
    }

    // Si no hay usuario, enviar al Login
    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    // Si hay roles permitidos definidos, verificar que el usuario tenga uno
    if (allowedRoles && !allowedRoles.includes(role)) {
        console.warn(`Acceso denegado: Se requiere rol ${allowedRoles.join(', ')}. Rol actual: ${role}`);
        return <Navigate to="/home" replace />;
    }

    // Si todo es correcto, renderizar la ruta hija
    return <Outlet />;
};
