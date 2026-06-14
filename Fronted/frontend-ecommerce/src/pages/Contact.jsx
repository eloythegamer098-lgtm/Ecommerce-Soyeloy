import { useState } from "react";
import "../styles/Contact.css"; // We will create this file next

export const Contact = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: ""
    });
    const [status, setStatus] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mocking the submit action
        setStatus({ type: "success", text: "TRANSMISIÓN EXITOSA. EL EQUIPO SE PONDRÁ EN CONTACTO PRONTO." });
        setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
        
        setTimeout(() => {
            setStatus({ type: "", text: "" });
        }, 5000);
    };

    return (
        <div className="contact-container">
            <header className="contact-header">
                <h1 className="contact-title">CENTRO DE <span className="text-gradient-purple">COMUNICACIONES</span></h1>
                <p>Establece conexión directa con el equipo de soporte de SOY ELOY GAMING.</p>
            </header>

            <div className="contact-layout">
                {/* Info Cards */}
                <div className="contact-info-grid">
                    <div className="info-box glass-panel">
                        <div className="box-icon">📡</div>
                        <h3>SOPORTE TÉCNICO</h3>
                        <p>¿Problemas con un código? Escríbenos.</p>
                        <span className="box-highlight">support@soyeloy.com</span>
                    </div>
                    <div className="info-box glass-panel">
                        <div className="box-icon">💬</div>
                        <h3>COMUNIDAD</h3>
                        <p>Únete a nuestras redes y Discord.</p>
                        <span className="box-highlight">@SoyEloyGaming</span>
                    </div>
                    <div className="info-box glass-panel">
                        <div className="box-icon">⚡</div>
                        <h3>TIEMPO DE RESPUESTA</h3>
                        <p>Garantizamos atención prioritaria.</p>
                        <span className="box-highlight">{"<"} 24 Horas</span>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="contact-form-section glass-panel">
                    <h3>TRANSMISIÓN DE MENSAJE</h3>
                    
                    {status.text && (
                        <div className={`admin-alert ${status.type} glass-panel`} style={{marginBottom: "20px"}}>
                            {status.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="cyber-form">
                        <div className="form-row-2">
                            <div className="input-group">
                                <label>IDENTIFICADOR / NOMBRE</label>
                                <div className="input-field">
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ingresa tu nombre"/>
                                    <div className="field-focus"></div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>CANAL DE RETORNO / EMAIL</label>
                                <div className="input-field">
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="correo@ejemplo.com"/>
                                    <div className="field-focus"></div>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>ASUNTO DE LA TRANSMISIÓN</label>
                            <div className="input-field">
                                <input type="text" name="asunto" value={formData.asunto} onChange={handleChange} required placeholder="Ej: Error de activación de código"/>
                                <div className="field-focus"></div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>CONTENIDO DEL MENSAJE</label>
                            <textarea 
                                className="cyber-textarea" 
                                name="mensaje" 
                                value={formData.mensaje} 
                                onChange={handleChange} 
                                required 
                                placeholder="Describe detalladamente tu consulta..."
                                rows="5"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-gaming-primary" style={{marginTop: "15px"}}>
                            <span className="btn-text">INICIAR TRANSMISIÓN</span>
                            <div className="btn-glow"></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
