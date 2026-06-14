import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image.png";
import "../styles/Login.css";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                setMensaje("SI EL EMAIL EXISTE, SE HA ENVIADO UN ENLACE DE RECUPERACIÓN.");
            } else {
                setError(data.error || "ERROR AL SOLICITAR RECUPERACIÓN");
            }
        } catch (error) {
            setError("ERROR DE CONEXIÓN CON EL SISTEMA");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-screen loaded">
            <div className="bg-atmosphere">
                <div className="grid-overlay"></div>
            </div>

            <div className="login-layout">
                <aside className="login-panel" style={{ margin: 'auto', maxWidth: '500px' }}>
                    <div className="panel-content">
                        <header className="panel-header">
                            <img src={logo} alt="NEON STORE" className="brand-logo" />
                        </header>

                        <div className="auth-container">
                            <div className="auth-title">
                                <h1>RECUPERAR PROTOCOLO</h1>
                                <p>Ingresa tu email para restablecer tu acceso al sistema</p>
                            </div>

                            {mensaje && (
                                <div className="auth-message success">
                                    <div className="message-icon">✓</div>
                                    <div className="message-text">{mensaje}</div>
                                </div>
                            )}
                            
                            {error && (
                                <div className="auth-message error">
                                    <div className="message-icon">⚠</div>
                                    <div className="message-text">{error}</div>
                                </div>
                            )}

                            {!mensaje && (
                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="input-group">
                                        <label htmlFor="email">EMAIL DE USUARIO</label>
                                        <div className="input-field">
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="ejemplo@soy-eloy.com"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className={`btn-primary-gaming ${loading ? 'btn-loading' : ''}`}
                                        disabled={loading}
                                    >
                                        <span className="btn-text">
                                            {loading ? "ENVIANDO..." : "SOLICITAR ACCESO"}
                                        </span>
                                    </button>
                                </form>
                            )}

                            <div className="auth-footer">
                                <Link to="/Login" className="btn-back">
                                    « REGRESAR AL LOGIN
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
