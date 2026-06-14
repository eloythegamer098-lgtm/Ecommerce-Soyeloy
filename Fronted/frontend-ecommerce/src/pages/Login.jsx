import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/image.png";
import "../styles/Login.css";
import { useAuth } from "../services/AuthContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensajeExitoso, setMensajeExitoso] = useState("");
    const [mensajeIncorrecto, setMensajeIncorrecto] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeExitoso("");
        setMensajeIncorrecto("");
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                const usuarioValido = data.usuario || data.user || data.datos;
                
                if (!usuarioValido || !data.token) {
                    setMensajeIncorrecto("ERROR: RESPUESTA DEL SERVIDOR INCOMPLETA");
                    setLoading(false);
                    return;
                }

                login(data.token, usuarioValido);
                setMensajeExitoso("ACCESO CONCEDIDO");
                setTimeout(() => {
                    navigate(usuarioValido.rol === 'admin' ? "/adminProductos" : "/home");
                }, 1500);
            } else {
                setMensajeIncorrecto("ERROR DE AUTENTICACIÓN");
            }
        } catch (error) {
            setMensajeIncorrecto("ERROR DE SISTEMA");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`login-screen ${isLoaded ? 'loaded' : ''}`}>
            {/* Background Atmosphere */}
            <div className="bg-atmosphere">
                <div className="gradient-sphere gs-1"></div>
                <div className="gradient-sphere gs-2"></div>
                <div className="gradient-sphere gs-3"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className="login-layout">
                {/* Left Panel: Auth Form */}
                <aside className="login-panel">
                    <div className="panel-content">
                        <header className="panel-header">
                            <img src={logo} alt="SOY ELOY GAMING" className="brand-logo" />
                            <div className="header-status">
                                <span className="status-dot"></span>
                                <span className="status-text">SYSTEM ONLINE</span>
                            </div>
                        </header>

                        <div className="auth-container">
                            <div className="auth-title">
                                <h1>BIENVENIDO AL PORTAL</h1>
                                <p>Ingresa tus credenciales para acceder al universo gamer</p>
                            </div>

                            {mensajeExitoso && (
                                <div className="auth-message success">
                                    <div className="message-icon">✓</div>
                                    <div className="message-text">{mensajeExitoso}</div>
                                </div>
                            )}
                            
                            {mensajeIncorrecto && (
                                <div className="auth-message error">
                                    <div className="message-icon">⚠</div>
                                    <div className="message-text">{mensajeIncorrecto}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="input-group">
                                    <label htmlFor="email">IDENTIFICADOR / EMAIL</label>
                                    <div className="input-field">
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ejemplo@soy-eloy.com"
                                        />
                                        <div className="field-focus"></div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="password">PROTOCOLO / CONTRASEÑA</label>
                                    <div className="input-field">
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <div className="field-focus"></div>
                                    </div>
                                </div>

                                <div className="form-options">
                                    <label className="checkbox-container">
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                        Recordarme
                                    </label>
                                    <Link to="/forgot-password" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        <button type="button" className="link-text">¿Olvidaste tu contraseña?</button>
                                    </Link>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`btn-primary-gaming ${loading ? 'btn-loading' : ''}`}
                                    disabled={loading}
                                >
                                    <span className="btn-text">
                                        {loading ? "SINCRONIZANDO..." : "INICIAR SESIÓN"}
                                    </span>
                                    <div className="btn-glitch"></div>
                                </button>
                            </form>

                            <div className="auth-footer">
                                <div className="divider">
                                    <span>¿NUEVO EN EL SISTEMA?</span>
                                </div>
                                <Link to="/Register" className="btn-secondary-gaming">
                                    CREAR CUENTA GAMER
                                </Link>
                                <Link to="/" className="btn-back">
                                    « REGRESAR A LA TIENDA
                                </Link>
                            </div>
                        </div>

                        <footer className="panel-footer">
                            <p>© 2026 SOY ELOY GAMING - V.2.0.1</p>
                            <div className="encryption-badge">
                                <span>ENCRYPTED CONNECTION</span>
                            </div>
                        </footer>
                    </div>
                </aside>

                {/* Right Visual Section */}
                <main className="login-visual">
                    <div className="visual-elements">
                        <img src={logo} alt="" className="watermark-logo" />
                        <div className="hud-elements">
                            <div className="hud-corner top-right"></div>
                            <div className="hud-corner bottom-right"></div>
                            <div className="hud-scanline"></div>
                        </div>
                        <div className="particle-container">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className={`particle p-${i}`}></div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

  
