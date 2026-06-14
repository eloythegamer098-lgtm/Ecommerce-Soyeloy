import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/image.png";
import "../styles/Register.css";

export const Register = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        gamertag: "",
        email: "",
        whatsapp: "",
        password: "",
        confirmPassword: "",
        ubicacion: "",
        terminos: false,
        ofertas: false
    });

    const [mensajeExitoso, setMensajeExitoso] = useState("");
    const [mensajeIncorrecto, setMensajeIncorrecto] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeExitoso("");
        setMensajeIncorrecto("");

        if (formData.password !== formData.confirmPassword) {
            setMensajeIncorrecto("LAS CONTRASEÑAS NO COINCIDEN");
            return;
        }

        if (!formData.terminos) {
            setMensajeIncorrecto("DEBES ACEPTAR LOS TÉRMINOS Y CONDICIONES");
            return;
        }

        setLoading(true);

        try {
            const url = `${import.meta.env.VITE_PUBLIC_URL}/auth/registro`;
            
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    email: formData.email,
                    password: formData.password,
                    // Extended fields prepared for future backend use
                    gamertag: formData.gamertag,
                    whatsapp: formData.whatsapp,
                    ubicacion: formData.ubicacion
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMensajeExitoso(data.mensaje || "REGISTRO COMPLETADO CON ÉXITO");
                setTimeout(() => {
                    navigate("/Login");
                }, 2000);
            } else {
                setMensajeIncorrecto(data.error || "ERROR AL REGISTRAR JUGADOR");
            }
        } catch (error) {
            setMensajeIncorrecto("ERROR DE CONEXIÓN AL SERVIDOR");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`register-screen ${isLoaded ? 'loaded' : ''}`}>
            {/* Background Atmosphere */}
            <div className="bg-atmosphere">
                <div className="gradient-sphere gs-1"></div>
                <div className="gradient-sphere gs-2"></div>
                <div className="gradient-sphere gs-3"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className="register-layout">
                {/* Left Panel: Register Form */}
                <aside className="register-panel">
                    <div className="panel-content">
                        <header className="panel-header">
                            <img src={logo} alt="SOY ELOY GAMING" className="brand-logo" />
                            <div className="header-status">
                                <span className="status-dot"></span>
                                <span className="status-text">INITIALIZING REGISTRATION</span>
                            </div>
                        </header>

                        <div className="auth-container">
                            <div className="auth-title">
                                <h1>CREAR CUENTA GAMER</h1>
                                <p>Únete a la legión de SOY ELOY GAMING y accede a beneficios exclusivos</p>
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

                            <form onSubmit={handleSubmit} className="auth-form-multi">
                                <div className="form-row">
                                    <div className="input-group">
                                        <label htmlFor="nombre">NOMBRE COMPLETO</label>
                                        <div className="input-field">
                                            <input
                                                id="nombre" name="nombre" type="text"
                                                value={formData.nombre} required
                                                onChange={handleChange} placeholder="Nombre y Apellido"
                                            />
                                            <div className="field-focus"></div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="gamertag">GAMERTAG / USUARIO</label>
                                        <div className="input-field">
                                            <input
                                                id="gamertag" name="gamertag" type="text"
                                                value={formData.gamertag} required
                                                onChange={handleChange} placeholder="Ej: DragonMaster"
                                            />
                                            <div className="field-focus"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label htmlFor="email">EMAIL</label>
                                        <div className="input-field">
                                            <input
                                                id="email" name="email" type="email"
                                                value={formData.email} required
                                                onChange={handleChange} placeholder="correo@gamer.com"
                                            />
                                            <div className="field-focus"></div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="whatsapp">WHATSAPP / CELULAR</label>
                                        <div className="input-field">
                                            <input
                                                id="whatsapp" name="whatsapp" type="tel"
                                                value={formData.whatsapp} required
                                                onChange={handleChange} placeholder="+593..."
                                            />
                                            <div className="field-focus"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label htmlFor="password">CONTRASEÑA</label>
                                        <div className="input-field">
                                            <input
                                                id="password" name="password" type="password"
                                                value={formData.password} required
                                                onChange={handleChange} placeholder="••••••••"
                                            />
                                            <div className="field-focus"></div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="confirmPassword">CONFIRMAR</label>
                                        <div className="input-field">
                                            <input
                                                id="confirmPassword" name="confirmPassword" type="password"
                                                value={formData.confirmPassword} required
                                                onChange={handleChange} placeholder="••••••••"
                                            />
                                            <div className="field-focus"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="ubicacion">PAÍS / CIUDAD</label>
                                    <div className="input-field">
                                        <input
                                            id="ubicacion" name="ubicacion" type="text"
                                            value={formData.ubicacion}
                                            onChange={handleChange} placeholder="Ej: Quito, Ecuador"
                                        />
                                        <div className="field-focus"></div>
                                    </div>
                                </div>

                                <div className="form-checks">
                                    <label className="checkbox-container">
                                        <input 
                                            name="terminos" type="checkbox" 
                                            checked={formData.terminos} onChange={handleChange} 
                                        />
                                        <span className="checkmark"></span>
                                        Acepto los términos y condiciones del portal
                                    </label>
                                    <label className="checkbox-container">
                                        <input 
                                            name="ofertas" type="checkbox" 
                                            checked={formData.ofertas} onChange={handleChange} 
                                        />
                                        <span className="checkmark"></span>
                                        Deseo recibir actualizaciones de juegos y ofertas
                                    </label>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`btn-primary-gaming ${loading ? 'btn-loading' : ''}`}
                                    disabled={loading}
                                >
                                    <span className="btn-text">
                                        {loading ? "PROCESANDO..." : "CREAR CUENTA GAMER"}
                                    </span>
                                    <div className="btn-glitch"></div>
                                </button>
                            </form>

                            <div className="auth-footer">
                                <Link to="/Login" className="btn-secondary-gaming">
                                    ¿YA TIENES CUENTA? INICIA SESIÓN AQUÍ
                                </Link>
                                <Link to="/" className="btn-back">
                                    « REGRESAR A LA TIENDA
                                </Link>
                            </div>
                        </div>

                        <footer className="panel-footer">
                            <p>© 2026 SOY ELOY GAMING</p>
                            <div className="encryption-badge">
                                <span>SECURE ACCESS ENCRYPTED</span>
                            </div>
                        </footer>
                    </div>
                </aside>

                {/* Right Visual Section */}
                <main className="register-visual">
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
