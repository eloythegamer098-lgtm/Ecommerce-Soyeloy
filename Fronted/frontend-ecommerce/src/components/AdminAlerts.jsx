import { AlertTriangle, Info, Clock, Users, FileText, CheckCircle } from "lucide-react";

export const AdminAlerts = ({ summary, recommendations }) => {
    return (
        <div className="admin-data-section glass-panel">
            <div className="section-header">
                <h3><AlertTriangle size={18} className="text-gradient-primary"/> ALERTAS INTELIGENTES</h3>
                <span className="text-muted">Detección de anomalías en tiempo real</span>
            </div>

            <div className="alerts-grid">
                {/* Alertas Críticas */}
                <div className="alerts-column">
                    <h4 className="alert-subtitle">ATENCIÓN INMEDIATA</h4>
                    <div className="alerts-panel">
                        {summary?.pedidos_pendientes > 0 && (
                            <div className="alert-item critical">
                                <Clock size={16} className="text-orange"/>
                                <div className="alert-content">
                                    <span className="alert-title">PEDIDOS PENDIENTES: {summary.pedidos_pendientes}</span>
                                    <p className="alert-desc">Validar para no retrasar el tiempo de entrega al cliente.</p>
                                </div>
                            </div>
                        )}
                        {summary?.agotados > 0 && (
                            <div className="alert-item critical">
                                <AlertTriangle size={16} className="text-red"/>
                                <div className="alert-content">
                                    <span className="alert-title">PRODUCTOS AGOTADOS: {summary.agotados}</span>
                                    <p className="alert-desc">Estos artículos no generan ingresos actualmente.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Advertencias */}
                <div className="alerts-column">
                    <h4 className="alert-subtitle">OPTIMIZACIÓN</h4>
                    <div className="alerts-panel">
                        {summary?.stock_bajo > 0 && (
                            <div className="alert-item warning">
                                <AlertTriangle size={16} className="text-orange"/>
                                <div className="alert-content">
                                    <span className="alert-title">STOCK BAJO: {summary.stock_bajo}</span>
                                    <p className="alert-desc">Repón stock de estos productos para evitar agotamientos.</p>
                                </div>
                            </div>
                        )}
                        {summary?.sin_descripcion > 0 && (
                            <div className="alert-item warning">
                                <FileText size={16} className="text-purple"/>
                                <div className="alert-content">
                                    <span className="alert-title">DESCRIPCIONES INCOMPLETAS: {summary.sin_descripcion}</span>
                                    <p className="alert-desc">Afecta al SEO y la confianza del comprador.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recomendaciones Didácticas */}
            <div className="recommendations-box mt-4">
                <div className="didactic-header">
                    <Info size={16} className="text-gradient-primary"/>
                    <span>CONSEJOS OPERATIVOS</span>
                </div>
                <div className="recommendations-list">
                    {recommendations?.map((rec, i) => (
                        <div key={i} className="rec-item">
                            <span className="rec-bullet"></span>
                            <p>{rec.mensaje}</p>
                        </div>
                    ))}
                    {recommendations?.length === 0 && (
                        <div className="rec-empty">
                            <CheckCircle size={20} className="text-gradient-green"/>
                            <p>¡Todo en orden! No hay acciones urgentes pendientes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
