import { Link } from "react-router-dom";
import "../styles/Home.css"; // Create this file next

export const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section glass-panel">
                <div className="hero-content">
                    <div className="hero-badge">NEW ERA OF GAMING</div>
                    <h1 className="hero-title">
                        TU PORTAL A <br />
                        <span className="text-gradient-primary">UNIVERSOS DIGITALES</span>
                    </h1>
                    <p className="hero-subtitle">
                        Descubre el mejor catálogo de juegos para PlayStation, Xbox, Nintendo y PC. Códigos digitales de entrega instantánea y gift cards premium.
                    </p>
                    <div className="hero-actions">
                        <Link to="/productos" className="btn-gaming-primary">
                            <span className="btn-text">EXPLORAR CATÁLOGO</span>
                            <div className="btn-glow"></div>
                        </Link>
                        <Link to="/categorias" className="btn-gaming-secondary">
                            VER PLATAFORMAS
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-abstract-shape"></div>
                    <div className="platform-icons">
                        <div className="p-icon ps-icon"><i className="fab fa-playstation"></i> PS5</div>
                        <div className="p-icon xbox-icon"><i className="fab fa-xbox"></i> XBOX</div>
                        <div className="p-icon nin-icon"><i className="fab fa-nintendo-switch"></i> SWITCH</div>
                        <div className="p-icon pc-icon"><i className="fab fa-steam"></i> PC</div>
                    </div>
                </div>
            </section>

            {/* Featured Platforms/Categories */}
            <section className="featured-section">
                <div className="section-header">
                    <h2 className="section-title">PLATAFORMAS <span className="text-gradient-purple">SOPORTADAS</span></h2>
                    <div className="header-line"></div>
                </div>
                
                <div className="platforms-grid">
                    <Link to="/productos" className="platform-card glass-panel ps-card">
                        <div className="card-bg-glow"></div>
                        <h3>PLAYSTATION</h3>
                        <p>Juegos y PSN Cards</p>
                        <div className="card-arrow">»</div>
                    </Link>
                    <Link to="/productos" className="platform-card glass-panel xbox-card">
                        <div className="card-bg-glow"></div>
                        <h3>XBOX</h3>
                        <p>Game Pass & Títulos</p>
                        <div className="card-arrow">»</div>
                    </Link>
                    <Link to="/productos" className="platform-card glass-panel nin-card">
                        <div className="card-bg-glow"></div>
                        <h3>NINTENDO</h3>
                        <p>eShop & Exclusivos</p>
                        <div className="card-arrow">»</div>
                    </Link>
                    <Link to="/productos" className="platform-card glass-panel pc-card">
                        <div className="card-bg-glow"></div>
                        <h3>PC GAMING</h3>
                        <p>Steam, Epic, Battlenet</p>
                        <div className="card-arrow">»</div>
                    </Link>
                </div>
            </section>

            {/* Quick Links / Info */}
            <section className="info-section">
                <div className="info-grid">
                    <div className="info-card glass-panel">
                        <div className="info-icon">⚡</div>
                        <h3>ENTREGA INSTANTÁNEA</h3>
                        <p>Recibe tus códigos digitales en tu correo inmediatamente después de tu compra.</p>
                    </div>
                    <div className="info-card glass-panel">
                        <div className="info-icon">🛡️</div>
                        <h3>PAGOS SEGUROS</h3>
                        <p>Transacciones encriptadas y 100% seguras. Tu información está protegida.</p>
                    </div>
                    <div className="info-card glass-panel">
                        <div className="info-icon">🎮</div>
                        <h3>SOPORTE GAMER</h3>
                        <p>Atención al cliente especializada para resolver tus dudas de instalación.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
