import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pregunta, setPregunta] = useState("");
    const [mensajes, setMensajes] = useState([
        { remitente: "bot", texto: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?" }
    ]);
    const [cargando, setCargando] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [mensajes, isOpen]);

    const enviarPregunta = async (e) => {
        e.preventDefault();
        if (!pregunta.trim()) return;

        const nuevoMensajeUsuario = { remitente: "user", texto: pregunta };
        setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
        setPregunta("");
        setCargando(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/bot/preguntar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pregunta: nuevoMensajeUsuario.texto })
            });
            const data = await res.json();
            
            setMensajes((prev) => [...prev, { remitente: "bot", texto: data.respuesta || "Lo siento, no pude procesar tu solicitud." }]);
        } catch (error) {
            setMensajes((prev) => [...prev, { remitente: "bot", texto: "Error al contactar con el asistente. Intenta de nuevo más tarde." }]);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="chatbot-container">
            
            {!isOpen && (
                <button 
                    className="chatbot-toggle-btn" 
                    onClick={() => setIsOpen(true)}
                    aria-label="Abrir chat"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                            <span>Asistente Virtual</span>
                        </div>
                        <button 
                            className="chatbot-close-btn" 
                            onClick={() => setIsOpen(false)}
                            aria-label="Cerrar chat"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {mensajes.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`chatbot-message ${msg.remitente}`}
                            >
                                {msg.texto}
                            </div>
                        ))}
                        {cargando && (
                            <div className="chatbot-typing">
                                Pensando
                                <span className="chatbot-typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-area" onSubmit={enviarPregunta}>
                        <input 
                            type="text"
                            className="chatbot-input"
                            value={pregunta}
                            placeholder="Escribe tu mensaje..."
                            onChange={(e) => setPregunta(e.target.value)}
                            disabled={cargando}
                        />
                        <button 
                            type="submit" 
                            className="chatbot-send-btn" 
                            disabled={cargando || !pregunta.trim()}
                            aria-label="Enviar mensaje"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
