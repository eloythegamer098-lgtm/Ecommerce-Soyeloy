import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import logo from "../assets/image.png";
import "../styles/AdminLayout.css";

export const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/Login");
    };

    return (
        <div className="admin-layout-wrapper">
            {/* Background Atmosphere */}
            <div className="global-bg">
                <div className="bg-sphere sphere-1"></div>
                <div className="bg-sphere sphere-2"></div>
                <div className="bg-sphere sphere-3"></div>
                <div className="global-grid"></div>
            </div>

            <aside className="admin-sidebar glass-panel">
                <div className="sidebar-brand">
                    <img src={logo} alt="LOGO" className="sidebar-logo" />
                    <div className="brand-text">ADMIN <span>PANEL</span></div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <span className="group-label">OVERVIEW</span>
                        <Link to="/admin" className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                            <span className="icon">📊</span>
                            <span className="text">Dashboard</span>
                            <div className="link-glow"></div>
                        </Link>
                    </div>

                    <div className="nav-group">
                        <span className="group-label">INVENTARIO</span>
                        <Link to="/adminProductos" className={`sidebar-link ${location.pathname === '/adminProductos' ? 'active' : ''}`}>
                            <span className="icon">📦</span>
                            <span className="text">Productos</span>
                            <div className="link-glow"></div>
                        </Link>
                        <Link to="/admin/inventario" className={`sidebar-link ${location.pathname === '/admin/inventario' ? 'active' : ''}`}>
                            <span className="icon">⚡</span>
                            <span className="text">Inventario</span>
                            <div className="link-glow"></div>
                        </Link>
                        <Link to="/admin/categorias" className={`sidebar-link ${location.pathname === '/admin/categorias' ? 'active' : ''}`}>
                            <span className="icon">📂</span>
                            <span className="text">Categorías</span>
                            <div className="link-glow"></div>
                        </Link>
                    </div>

                    <div className="nav-group">
                        <span className="group-label">VENTAS</span>
                        <Link to="/admin/pedidos" className={`sidebar-link ${location.pathname === '/admin/pedidos' ? 'active' : ''}`}>
                            <span className="icon">🧾</span>
                            <span className="text">Pedidos</span>
                            <div className="link-glow"></div>
                        </Link>
                        <Link to="/admin/cupones" className={`sidebar-link ${location.pathname === '/admin/cupones' ? 'active' : ''}`}>
                            <span className="icon">🎟️</span>
                            <span className="text">Cupones</span>
                            <div className="link-glow"></div>
                        </Link>
                    </div>

                    <div className="nav-group">
                        <span className="group-label">SISTEMA</span>
                        <Link to="/admin/usuarios" className={`sidebar-link ${location.pathname === '/admin/usuarios' ? 'active' : ''}`}>
                            <span className="icon">👥</span>
                            <span className="text">Usuarios</span>
                            <div className="link-glow"></div>
                        </Link>
                        <Link to="/admin/auditoria" className={`sidebar-link ${location.pathname === '/admin/auditoria' ? 'active' : ''}`}>
                            <span className="icon">🛡️</span>
                            <span className="text">Auditoría</span>
                            <div className="link-glow"></div>
                        </Link>
                        <Link to="/admin/configuracion" className={`sidebar-link ${location.pathname === '/admin/configuracion' ? 'active' : ''}`}>
                            <span className="icon">⚙️</span>
                            <span className="text">Configuración</span>
                            <div className="link-glow"></div>
                        </Link>
                        <Link to="/home" className="sidebar-link">
                            <span className="icon">🛒</span>
                            <span className="text">Ver Tienda</span>
                            <div className="link-glow"></div>
                        </Link>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-info">
                        <div className="admin-avatar">
                            {user?.email[0].toUpperCase()}
                        </div>
                        <div className="admin-details">
                            <span className="admin-name">{user?.nombre || 'Admin'}</span>
                            <span className="admin-role">COMMANDER</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-logout-sidebar">
                        DESCONECTAR
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar glass-panel">
                    <div className="topbar-status">
                        <span className="status-indicator online"></span>
                        <span className="status-text">SYSTEM SECURE</span>
                    </div>
                    <div className="topbar-date">
                        {new Date().toLocaleDateString()}
                    </div>
                </header>
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
