import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { 
    ShoppingBag, Clock, CheckCircle, Package, Truck, 
    XCircle, ChevronRight, RefreshCcw, Box, ExternalLink,
    AlertCircle, FileText
} from "lucide-react";
import "../styles/Cart.css"; // Reuse some cart/panel styles

export const MisPedidos = () => {
    const { token } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const obtenerPedidos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/obtenerPedidos`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            setPedidos(data.data || []);
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerPedidos();
    }, []);

    const getStatusIcon = (estado) => {
        switch (estado) {
            case 'pendiente': return <Clock size={20} className="text-warning" />;
            case 'pagado': return <CheckCircle size={20} className="text-success" />;
            case 'preparando': return <Package size={20} className="text-primary" />;
            case 'enviado': return <Truck size={20} className="text-accent" />;
            case 'entregado': return <CheckCircle size={20} className="text-success" />;
            case 'cancelado': return <XCircle size={20} className="text-danger" />;
            default: return <Clock size={20} />;
        }
    };

    const getStatusLabel = (estado) => {
        switch (estado) {
            case 'pendiente': return 'PENDIENTE DE PAGO';
            case 'pagado': return 'PAGO CONFIRMADO';
            case 'preparando': return 'EN PREPARACIÓN';
            case 'enviado': return 'DESPACHADO / EN RUTA';
            case 'entregado': return 'ENTREGADO CON ÉXITO';
            case 'cancelado': return 'TRANSACCIÓN CANCELADA';
            default: return estado.toUpperCase();
        }
    };

    return (
        <div className="admin-container" style={{maxWidth: '1100px', margin: '0 auto', padding: '2rem'}}>
            <header className="admin-header flex-between">
                <div>
                    <h1 className="admin-title">MIS <span className="text-gradient-primary">ADQUISICIONES</span></h1>
                    <p className="admin-subtitle">Historial centralizado de tus transacciones y licencias de activos digitales.</p>
                </div>
                <button className="btn-icon" onClick={obtenerPedidos} title="Sincronizar">
                    <RefreshCcw size={18}/>
                </button>
            </header>

            <div className="orders-content mt-4">
                {loading ? (
                    <div className="cyber-spinner-container py-5"><div className="cyber-spinner"></div></div>
                ) : pedidos.length === 0 ? (
                    <div className="empty-state glass-panel py-5 text-center">
                        <ShoppingBag size={64} className="mx-auto mb-4 opacity-20 text-primary"/>
                        <h3 className="text-white tech-font">SIN ACTIVIDAD DETECTADA</h3>
                        <p className="text-muted">Aún no has realizado ninguna adquisición en nuestra red.</p>
                        <button className="btn-gaming-primary mt-4" onClick={() => window.location.href='/productos'}>
                            EXPLORAR CATÁLOGO
                        </button>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {pedidos.map(p => (
                            <div key={p.id} className={`order-card glass-panel mb-4 ${p.estado}`}>
                                <div className="order-header flex-between p-4">
                                    <div className="order-id-group">
                                        <span className="text-muted tech-font" style={{fontSize: '0.7rem', letterSpacing: '2px'}}>REF_ID: 00{p.id}</span>
                                        <h4 className="m-0 text-white fw-bold">TRANSACCIÓN #{p.id}</h4>
                                    </div>
                                    <div className={`status-pill ${p.estado}`}>
                                        {getStatusIcon(p.estado)}
                                        <span>{getStatusLabel(p.estado)}</span>
                                    </div>
                                </div>

                                <div className="order-body p-4 pt-0">
                                    <div className="order-meta-grid">
                                        <div className="meta-item">
                                            <span className="meta-label">FECHA DE REGISTRO</span>
                                            <span className="meta-value">{new Date(p.creado_en).toLocaleString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">MÉTODO DE ENTREGA</span>
                                            <span className="meta-value">DESCARGA DIGITAL INMEDIATA</span>
                                        </div>
                                        <div className="meta-item text-end">
                                            <span className="meta-label">TOTAL LIQUIDADO</span>
                                            <span className="meta-value total-price">${parseFloat(p.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-footer p-3 glass-panel" style={{background: 'rgba(255,255,255,0.02)', border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                                    <div className="flex-between">
                                        <div className="didactic-info">
                                            <AlertCircle size={14} className="text-primary"/>
                                            <span>Soporte técnico disponible 24/7 para esta orden.</span>
                                        </div>
                                        <div className="footer-actions">
                                            <button className="btn-gaming-secondary btn-sm flex-center gap-2" onClick={() => alert("Función de comprobante próximamente")}>
                                                <FileText size={14}/> DETALLES
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .orders-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .order-card {
                    border: 1px solid rgba(255,255,255,0.05);
                    transition: all 0.3s;
                    overflow: hidden;
                }
                .order-card:hover {
                    border-color: rgba(168, 85, 247, 0.3);
                    transform: translateX(5px);
                    background: rgba(168, 85, 247, 0.02);
                }
                .order-card.pendiente { border-left: 4px solid #f59e0b; }
                .order-card.pagado { border-left: 4px solid #22c55e; }
                .order-card.enviado { border-left: 4px solid #3b82f6; }
                .order-card.cancelado { border-left: 4px solid #ef4444; opacity: 0.8; }

                .status-pill {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 16px;
                    border-radius: 30px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    background: rgba(255,255,255,0.05);
                }
                .status-pill.pendiente { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
                .status-pill.pagado { color: #22c55e; background: rgba(34, 197, 94, 0.1); }
                .status-pill.enviado { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
                .status-pill.cancelado { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

                .order-meta-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    padding: 10px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 12px;
                }
                .meta-item { display: flex; flex-direction: column; gap: 5px; }
                .meta-label { font-size: 0.65rem; color: rgba(255,255,255,0.4); letter-spacing: 1px; font-weight: 800; }
                .meta-value { font-size: 0.9rem; font-weight: 600; color: #fff; }
                .total-price { color: var(--gaming-green); font-family: var(--font-gaming); font-size: 1.2rem; }

                .didactic-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.5);
                }
                .btn-sm { padding: 6px 15px; font-size: 0.7rem; }
            `}} />
        </div>
    );
};
