import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ContextCart } from "../services/ContextCart";
import { useContext } from "react";
import { ChatBot } from "../pages/Chatbot";
import logo from "../assets/image.png";
import "../styles/Navbar.css";
import { useAuth } from "../services/AuthContext";

export const MainLayout = () => {
    const { carrito } = useContext(ContextCart);
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const handleLogout = () => {
        logout();
        navigate("/Login");
    };
    
    return (
        <div className="layout-container">
            {/* Global Background Atmosphere */}
            <div className="global-bg">
                <div className="bg-sphere sphere-1"></div>
                <div className="bg-sphere sphere-2"></div>
                <div className="bg-sphere sphere-3"></div>
                <div className="global-grid"></div>
            </div>

            <nav className="gaming-navbar glass-panel">
                <div className="navbar-brand">
                    <Link to="/home">
                        <img src={logo} alt="SOY ELOY GAMING" className="nav-logo" />
                        <span className="brand-text">SOY ELOY <span>GAMING</span></span>
                    </Link>
                </div>

                <div className="navbar-links">
                    <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
                        <span className="link-text">INICIO</span>
                        <div className="link-glow"></div>
                    </Link>
                    <Link to="/productos" className={`nav-link ${location.pathname.includes('/productos') && !location.pathname.includes('admin') ? 'active' : ''}`}>
                        <span className="link-text">TIENDA</span>
                        <div className="link-glow"></div>
                    </Link>
                    <Link to="/categorias" className={`nav-link ${location.pathname === '/categorias' ? 'active' : ''}`}>
                        <span className="link-text">CATEGORÍAS</span>
                        <div className="link-glow"></div>
                    </Link>
                    <Link to="/favoritos" className={`nav-link ${location.pathname === '/favoritos' ? 'active' : ''}`}>
                        <span className="link-text">FAVORITOS</span>
                        <div className="link-glow"></div>
                    </Link>
                    {isAdmin && (
                        <Link to="/adminProductos" className={`nav-link ${location.pathname === '/adminProductos' ? 'active' : ''}`}>
                            <span className="link-text">ADMIN</span>
                            <div className="link-glow"></div>
                        </Link>
                    )}
                    <Link to="/contacto" className={`nav-link ${location.pathname === '/contacto' ? 'active' : ''}`}>
                        <span className="link-text">SOPORTE</span>
                        <div className="link-glow"></div>
                    </Link>
                </div>

                <div className="navbar-actions">
                    <Link to="/carrito" className="cart-btn">
                        <div className="cart-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cantidadItems > 0 && (
                                <span className="cart-badge">{cantidadItems}</span>
                            )}
                        </div>
                        <span className="cart-text">CARRITO</span>
                    </Link>
                    
                    <div className="auth-buttons">
                        {user ? (
                            <div className="user-profile-nav">
                                <span className="user-name">{user.nombre || user.email.split('@')[0]}</span>
                                <button onClick={handleLogout} className="btn-nav-logout">SALIR</button>
                            </div>
                        ) : (
                            <Link to="/Login" className="btn-nav-login">ACCEDER</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
            
            <ChatBot />
        </div>
    );
};
