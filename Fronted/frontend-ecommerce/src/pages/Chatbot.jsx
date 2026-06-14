import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { 
    MessageSquare, Send, X, Terminal, 
    Sparkles, RefreshCcw, HelpCircle 
} from "lucide-react";
import "../styles/Chatbot.css";

export const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pregunta, setPregunta] = useState("");
    const [mensajes, setMensajes] = useState([
        { remitente: "bot", texto: "SISTEMA ONLINE: Soy tu asistente de SOY ELOY GAMING. ¿En qué sector del catálogo necesitas asistencia hoy?" }
    ]);
    const [cargando, setCargando] = useState(false);
    const messagesEndRef = useRef(null);

    const sugerencias = [
        "¿Qué juegos hay en stock?",
        "¿Cómo recibo mi producto?",
        "¿Cuáles son los métodos de pago?",
        "¿Tienen ofertas hoy?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [mensajes, isOpen]);

    const enviarPregunta = async (e, preguntaPersonalizada = null) => {
        if (e) e.preventDefault();
        
        const textoAEnviar = preguntaPersonalizada || pregunta;
        if (!textoAEnviar.trim()) return;

        const nuevoMensajeUsuario = { remitente: "user", texto: textoAEnviar };
        
        setMensajes((prev) => {
            const nuevoHistorial = [...prev, nuevoMensajeUsuario];
            return nuevoHistorial.slice(-20); 
        });
        
        if (!preguntaPersonalizada) setPregunta("");
        setCargando(true);

        try {
            // Usamos el servicio centralizado api.js
            const data = await api.post("/bot/preguntar", { pregunta: textoAEnviar });
            
            setMensajes((prev) => {
                const nuevoHistorial = [...prev, { remitente: "bot", texto: data.respuesta || "RESPUESTA VACÍA DEL SERVIDOR CENTRAL." }];
                return nuevoHistorial.slice(-20);
            });

        } catch (error) {
            console.error("Error en Chatbot:", error);
            
            setMensajes((prev) => {
                const nuevoHistorial = [...prev, { 
                    remitente: "bot", 
                    texto: `ERROR DEL SISTEMA: ${error}`,
                    isError: true,
                    preguntaOriginal: textoAEnviar 
                }];
                return nuevoHistorial.slice(-20);
            });
            
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
                    aria-label="Abrir terminal"
                >
                    <MessageSquare size={24} />
                    <div className="pulse-ring"></div>
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window glass-panel">
                    <div className="chatbot-header">
                        <div className="bot-status">
                            <Terminal size={16} className="text-primary"/>
                            <span className="tech-font ml-2">CORE-AI TERMINAL</span>
                        </div>
                        <button 
                            className="chatbot-close-btn" 
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {mensajes.map((msg, index) => (
                            <div key={index} className="message-wrapper">
                                <div className={`chatbot-message ${msg.remitente} ${msg.isError ? 'error-msg' : ''}`}>
                                    {msg.texto}
                                </div>
                                {msg.isError && msg.preguntaOriginal && (
                                    <button 
                                        className="chatbot-retry-btn" 
                                        onClick={() => enviarPregunta(null, msg.preguntaOriginal)}
                                        disabled={cargando}
                                    >
                                        <RefreshCcw size={12} className="mr-1"/> REINTENTAR
                                    </button>
                                )}
                            </div>
                        ))}
                        {cargando && (
                            <div className="chatbot-typing">
                                <Sparkles size={14} className="spinning-icon"/>
                                <span className="ml-2">DECODIFICANDO...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Sugerencias Inteligentes */}
                    {mensajes.length < 4 && !cargando && (
                        <div className="chatbot-suggestions px-3 mb-2">
                            <div className="suggestion-label mb-2 flex-center" style={{justifyContent: 'flex-start', gap: '5px'}}>
                                <HelpCircle size={12} className="text-muted"/>
                                <span className="text-muted" style={{fontSize: '0.65rem'}}>COMANDOS RÁPIDOS</span>
                            </div>
                            <div className="suggestion-list">
                                {sugerencias.map((s, i) => (
                                    <button 
                                        key={i} 
                                        className="suggestion-chip"
                                        onClick={() => enviarPregunta(null, s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form className="chatbot-input-area" onSubmit={(e) => enviarPregunta(e)}>
                        <input 
                            type="text"
                            className="chatbot-input"
                            value={pregunta}
                            placeholder="Ingrese comando de búsqueda..."
                            onChange={(e) => setPregunta(e.target.value)}
                            disabled={cargando}
                        />
                        <button 
                            type="submit" 
                            className="chatbot-send-btn" 
                            disabled={cargando || !pregunta.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .chatbot-container { position: fixed; bottom: 30px; right: 30px; z-index: 1000; }
                .chatbot-toggle-btn {
                    width: 60px; height: 60px; border-radius: 50%;
                    background: var(--gaming-purple); color: white;
                    border: none; cursor: pointer; display: flex;
                    align-items: center; justify-content: center;
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
                    position: relative; transition: all 0.3s;
                }
                .chatbot-toggle-btn:hover { transform: scale(1.1); filter: brightness(1.2); }
                .pulse-ring {
                    position: absolute; width: 100%; height: 100%;
                    border-radius: 50%; border: 2px solid var(--gaming-purple);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .chatbot-window {
                    width: 380px; height: 500px;
                    display: flex; flex-direction: column;
                    overflow: hidden; border: 1px solid rgba(168, 85, 247, 0.3);
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                
                .chatbot-header { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
                .chatbot-messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
                .chatbot-message { padding: 10px 15px; border-radius: 12px; font-size: 0.85rem; line-height: 1.4; max-width: 85%; }
                .chatbot-message.bot { align-self: flex-start; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; }
                .chatbot-message.user { align-self: flex-end; background: var(--gaming-purple); color: #fff; box-shadow: 0 0 10px rgba(168, 85, 247, 0.2); }
                
                .chatbot-input-area { padding: 15px; display: flex; gap: 10px; background: rgba(0,0,0,0.2); }
                .chatbot-input { flex: 1; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px 15px; border-radius: 8px; outline: none; }
                .chatbot-send-btn { background: var(--gaming-purple); border: none; color: white; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                
                .suggestion-list { display: flex; flex-wrap: wrap; gap: 8px; }
                .suggestion-chip {
                    background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2);
                    color: var(--gaming-purple); padding: 4px 10px; border-radius: 15px;
                    font-size: 0.7rem; cursor: pointer; transition: all 0.2s;
                }
                .suggestion-chip:hover { background: var(--gaming-purple); color: white; }
                
                .spinning-icon { animation: spin 2s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                @media (max-width: 450px) { .chatbot-window { width: 90vw; right: 5vw; } }
            `}} />
        </div>
    );
};
