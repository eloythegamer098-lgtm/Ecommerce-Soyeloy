import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/image.png";
import "../styles/Login.css";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError("LAS CONTRASEÑAS NO COINCIDEN");
        }
        
        setMensaje("");
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();

            if (res.ok) {
                setMensaje("CONTRASEÑA ACTUALIZADA CON ÉXITO");
                setTimeout(() => navigate("/Login"), 3000);
            } else {
                setError(data.error || "ERROR AL RESTABLECER");
            }
        } catch (error) {
            setError("ERROR DE CONEXIÓN");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="login-screen loaded">
                <div className="auth-container" style={{ textAlign: 'center', padding: '100px' }}>
                    <h1 style={{ color: '#ff4444' }}>TOKEN NO VÁLIDO</h1>
                    <Link to="/Login" className="btn-primary-gaming" style={{ marginTop: '20px', display: 'inline-block' }}>IR AL LOGIN</Link>
                </div>
            </div>
        );
    }

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
                                <h1>NUEVO PROTOCOLO</h1>
                                <p>Ingresa tu nueva contraseña de acceso</p>
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
                                        <label htmlFor="pass">NUEVA CONTRASEÑA</label>
                                        <div className="input-field">
                                            <input
                                                id="pass"
                                                type="password"
                                                value={newPassword}
                                                required
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="confirm">CONFIRMAR CONTRASEÑA</label>
                                        <div className="input-field">
                                            <input
                                                id="confirm"
                                                type="password"
                                                value={confirmPassword}
                                                required
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className={`btn-primary-gaming ${loading ? 'btn-loading' : ''}`}
                                        disabled={loading}
                                    >
                                        <span className="btn-text">
                                            {loading ? "ACTUALIZANDO..." : "CAMBIAR CONTRASEÑA"}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
