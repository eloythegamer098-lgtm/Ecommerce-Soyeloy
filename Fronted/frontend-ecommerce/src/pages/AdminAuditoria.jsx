import React, { useState, useEffect } from "react";
import "../styles/Admin.css"; 
import { useAuth } from "../services/AuthContext";
import { Shield, Clock, User, Activity, FileText, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

export const AdminAuditoria = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroAccion, setFiltroAccion] = useState("");
    const [expandedLog, setExpandedLog] = useState(null);

    useEffect(() => {
        obtenerLogs();
    }, []);

    const obtenerLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/auditoria/listar`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Error al obtener auditoría:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedLog(expandedLog === id ? null : id);
    };

    const getActionClass = (action) => {
        if (action.includes('ELIMINAR') || action.includes('DESACTIVAR')) return 'status-tag inactive';
        if (action.includes('CREAR')) return 'status-tag active';
        if (action.includes('CAMBIAR') || action.includes('ACTUALIZAR')) return 'status-tag warning';
        return 'status-tag';
    };

    const logsFiltrados = logs.filter(log => 
        log.accion.toLowerCase().includes(filtroAccion.toLowerCase()) ||
        log.admin_nombre.toLowerCase().includes(filtroAccion.toLowerCase()) ||
        (log.tabla_afectada && log.tabla_afectada.toLowerCase().includes(filtroAccion.toLowerCase()))
    );

    return (
        <div className="admin-container">
            <header className="admin-header flex-between">
                <div>
                    <h1 className="admin-title">BITÁCORA DE <span className="text-gradient-primary">AUDITORÍA</span></h1>
                    <p className="admin-subtitle">Registro centralizado de operaciones críticas y trazabilidad del sistema.</p>
                </div>
                <button className="btn-filter-toggle active" onClick={obtenerLogs}>
                    <Activity size={16} className="mr-2" /> REFRESCAR SISTEMA
                </button>
            </header>

            <div className="admin-data-section glass-panel">
                <div className="inventory-controls mb-4">
                    <div className="search-bar-wrapper">
                        <Search size={18} className="icon-search"/>
                        <input 
                            type="text" 
                            placeholder="Filtrar por administrador, acción o tabla..." 
                            value={filtroAccion}
                            onChange={(e) => setFiltroAccion(e.target.value)}
                            className="cyber-input search-input"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>
                ) : (
                    <div className="table-responsive">
                        <table className="cyber-table">
                            <thead>
                                <tr>
                                    <th>FECHA / HORA</th>
                                    <th>ADMINISTRADOR</th>
                                    <th>ACCIÓN</th>
                                    <th>TABLA</th>
                                    <th>ID REGISTRO</th>
                                    <th>DETALLES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logsFiltrados.length > 0 ? logsFiltrados.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <tr className="audit-row">
                                            <td style={{ fontSize: '0.75rem' }}>
                                                <div className="flex-center gap-2">
                                                    <Clock size={12} className="text-primary"/>
                                                    {new Date(log.creado_at).toLocaleString()}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex-column">
                                                    <span className="fw-bold">{log.admin_nombre}</span>
                                                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>{log.admin_email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={getActionClass(log.accion)}>{log.accion}</span>
                                            </td>
                                            <td><span className="cat-badge">{log.tabla_afectada || 'N/A'}</span></td>
                                            <td>{log.registro_id ? `#${log.registro_id}` : '-'}</td>
                                            <td>
                                                <button className="btn-icon" onClick={() => toggleExpand(log.id)}>
                                                    {expandedLog === log.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedLog === log.id && (
                                            <tr className="expanded-row">
                                                <td colSpan="6">
                                                    <div className="log-details-box glass-panel p-3 m-2">
                                                        <div className="details-header mb-2 flex-between">
                                                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>DATA_RAW // ID: {log.id}</span>
                                                            <span className="badge-neon purple">JSON_OBJECT</span>
                                                        </div>
                                                        <pre style={{ fontSize: '0.7rem', color: '#00f2ff', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                                            {JSON.stringify(log.detalles, null, 2)}
                                                        </pre>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center p-5">
                                            <div className="text-muted">No se encontraron registros que coincidan con la búsqueda.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .audit-row:hover { background: rgba(0, 242, 255, 0.05); }
                .expanded-row { background: rgba(0, 0, 0, 0.3); }
                .log-details-box { border-left: 3px solid var(--gaming-purple); position: relative; overflow: hidden; }
                .log-details-box::after { content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle at top right, rgba(168, 85, 247, 0.1), transparent); pointer-events: none; }
                
                .status-tag {
                    font-family: var(--font-gaming);
                    font-size: 0.65rem;
                    padding: 3px 8px;
                    border-radius: 4px;
                    border: 1px solid rgba(255,255,255,0.2);
                    letter-spacing: 1px;
                }
                .status-tag.active { background: rgba(34, 197, 94, 0.1); color: #22c55e; border-color: #22c55e; }
                .status-tag.inactive { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: #ef4444; }
                .status-tag.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: #f59e0b; }
                
                .details-header { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px; }
            `}} />
        </div>
    );
};
