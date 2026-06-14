import React from "react";
import { Hammer, ShieldAlert, Clock, Globe } from "lucide-react";
import "../styles/Home.css";

export const Maintenance = () => {
    return (
        <div className="maintenance-page flex-center flex-column" style={{ height: "100vh", background: "#020617", color: "white", textAlign: "center", padding: "2rem" }}>
            <div className="global-bg">
                <div className="bg-sphere sphere-1"></div>
                <div className="bg-sphere sphere-3"></div>
                <div className="global-grid"></div>
            </div>

            <div className="maintenance-content glass-panel p-5" style={{ maxWidth: "600px", border: "1px solid var(--gaming-purple)", position: "relative", zIndex: 10 }}>
                <div className="maintenance-icon mb-4">
                    <Hammer size={64} className="text-gradient-primary" style={{ filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))" }} />
                </div>
                
                <h1 className="tech-font mb-3" style={{ fontSize: "2.5rem", letterSpacing: "3px" }}>
                    SISTEMA EN <span className="text-gradient-primary">MANTENIMIENTO</span>
                </h1>
                
                <div className="status-badge mb-4" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "1px solid #f59e0b", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                    <ShieldAlert size={14} className="mr-2" /> ACTUALIZACIÓN DE NÚCLEO EN CURSO
                </div>

                <p className="text-muted mb-5" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                    Estamos optimizando nuestros sistemas para ofrecerte una experiencia de navegación más rápida y segura. 
                    El acceso a la tienda ha sido restringido temporalmente.
                </p>

                <div className="maintenance-footer flex-between text-muted" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", fontSize: "0.8rem" }}>
                    <div className="flex-center gap-2">
                        <Clock size={14} /> <span>TIEMPO ESTIMADO: 2 HORAS</span>
                    </div>
                    <div className="flex-center gap-2">
                        <Globe size={14} /> <span>NEON_STORE_V2.0</span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .maintenance-page { position: relative; overflow: hidden; }
                .maintenance-content { animation: pulse-border 4s infinite; }
                @keyframes pulse-border {
                    0% { box-shadow: 0 0 10px rgba(168, 85, 247, 0.1); }
                    50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.3); }
                    100% { box-shadow: 0 0 10px rgba(168, 85, 247, 0.1); }
                }
            `}} />
        </div>
    );
};
