import React, { useState, useEffect } from "react";
import "../styles/Admin.css";
import { useAuth } from "../services/AuthContext";
import { 
    Settings, Save, RefreshCcw, Shield, Globe, 
    Mail, Phone, MapPin, DollarSign, Wrench, 
    Bot, Share2, Truck
} from "lucide-react";

export const AdminConfiguracion = () => {
    const { token } = useAuth();
    const [ajustes, setAjustes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    useEffect(() => {
        fetchAjustes();
    }, []);

    const fetchAjustes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/configuracion/admin/listar`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAjustes(data);
            }
        } catch (error) {
            console.error("Error al cargar ajustes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (clave, nuevoValor) => {
        setAjustes(prev => prev.map(a => a.clave === clave ? { ...a, valor: nuevoValor } : a));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMensaje({ tipo: "", texto: "" });

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/configuracion/admin/actualizar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ajustes })
            });

            if (res.ok) {
                setMensaje({ tipo: "success", texto: "SISTEMA ACTUALIZADO: Configuración sincronizada con el núcleo." });
                setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
            } else {
                throw new Error("Error en la respuesta del servidor");
            }
        } catch (error) {
            setMensaje({ tipo: "error", texto: "ERROR CRÍTICO: Fallo en la sincronización de datos." });
        } finally {
            setIsSaving(false);
        }
    };

    const renderIcon = (clave) => {
        if (clave.includes('nombre')) return <Globe size={18}/>;
        if (clave.includes('email')) return <Mail size={18}/>;
        if (clave.includes('telefono')) return <Phone size={18}/>;
        if (clave.includes('direccion')) return <MapPin size={18}/>;
        if (clave.includes('moneda')) return <DollarSign size={18}/>;
        if (clave.includes('mantenimiento')) return <Wrench size={18}/>;
        if (clave.includes('chatbot')) return <Bot size={18}/>;
        if (clave.includes('facebook') || clave.includes('instagram')) return <Share2 size={18}/>;
        if (clave.includes('envio')) return <Truck size={18}/>;
        return <Settings size={18}/>;
    };

    const categorias = [...new Set(ajustes.map(a => a.categoria))];

    return (
        <div className="admin-container">
            <header className="admin-header flex-between">
                <div>
                    <h1 className="admin-title">CONFIGURACIÓN DEL <span className="text-gradient-primary">SISTEMA</span></h1>
                    <p className="admin-subtitle">Gestión de parámetros globales y comportamiento del núcleo de la tienda.</p>
                </div>
                <button className="btn-filter-toggle active" onClick={fetchAjustes}>
                    <RefreshCcw size={16} className="mr-2" /> RECARGAR DATOS
                </button>
            </header>

            {mensaje.texto && (
                <div className={`admin-alert ${mensaje.tipo} glass-panel mb-4`}>
                    <Shield size={18} className="mr-2" /> {mensaje.texto}
                </div>
            )}

            {isLoading ? (
                <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>
            ) : (
                <form onSubmit={handleSave} className="config-form">
                    <div className="config-grid">
                        {categorias.map(cat => (
                            <div key={cat} className="config-section glass-panel">
                                <h3 className="section-title tech-font">
                                    <span className="text-gradient-purple">{cat.toUpperCase()}</span>_CORE
                                </h3>
                                <div className="config-inputs">
                                    {ajustes.filter(a => a.categoria === cat).map(ajuste => (
                                        <div key={ajuste.clave} className="input-field mb-4">
                                            <label className="cyber-label flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                                                {renderIcon(ajuste.clave)}
                                                <span>{ajuste.clave.replace(/_/g, ' ').toUpperCase()}</span>
                                            </label>
                                            
                                            {ajuste.clave.includes('modo') || ajuste.clave.includes('activo') ? (
                                                <div className="checkbox-group mt-2">
                                                    <label className="cyber-switch">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={ajuste.valor === '1'} 
                                                            onChange={(e) => handleInputChange(ajuste.clave, e.target.checked ? '1' : '0')}
                                                        />
                                                        <span className="switch-slider"></span>
                                                        <span className="switch-label">{ajuste.valor === '1' ? 'ACTIVADO' : 'DESACTIVADO'}</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    className="cyber-input w-100" 
                                                    value={ajuste.valor}
                                                    onChange={(e) => handleInputChange(ajuste.clave, e.target.value)}
                                                    placeholder={ajuste.descripcion}
                                                />
                                            )}
                                            <p className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>{ajuste.descripcion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sticky-actions glass-panel">
                        <div className="flex-between align-items-center">
                            <div className="status-info text-muted">
                                <span className="status-indicator online mr-2"></span>
                                TERMINAL LISTA PARA SINCRONIZACIÓN
                            </div>
                            <button type="submit" className="btn-gaming-primary" disabled={isSaving}>
                                <Save size={18} className="mr-2" /> {isSaving ? 'SINCRONIZANDO...' : 'GUARDAR CAMBIOS'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .config-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 25px;
                    margin-bottom: 100px;
                }
                .config-section {
                    padding: 25px;
                    border-left: 3px solid var(--gaming-purple);
                }
                .section-title {
                    margin-bottom: 25px;
                    font-size: 1.1rem;
                    letter-spacing: 2px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding-bottom: 10px;
                }
                .sticky-actions {
                    position: fixed;
                    bottom: 20px;
                    left: 280px;
                    right: 40px;
                    padding: 20px 30px;
                    z-index: 100;
                    border: 1px solid var(--gaming-purple);
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
                }
                @media (max-width: 1024px) {
                    .sticky-actions { left: 40px; }
                }
                .cyber-label {
                    font-family: var(--font-gaming);
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 10px;
                    display: block;
                }
            `}} />
        </div>
    );
};
