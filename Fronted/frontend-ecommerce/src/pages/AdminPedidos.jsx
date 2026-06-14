import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { Search, Filter, Box, Truck, CheckCircle, XCircle, Clock, Eye, AlertCircle } from "lucide-react";
import "../styles/Admin.css";

export const AdminPedidos = () => {
    const { token } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroTexto, setFiltroTexto] = useState("");

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/admin/todos`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!res.ok) {
                setLoading(false);
                return;
            }

            const data = await res.json();
            setPedidos(data.data);
        } catch (error) {
            console.error("Error fetching pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/admin/estado/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            
            if (res.ok) {
                setMensaje({ text: "Estado logístico actualizado", type: "success" });
                fetchPedidos();
                if (pedidoDetalle && pedidoDetalle.pedido.id === id) {
                    verDetalle(id);
                }
            } else {
                const data = await res.json();
                setMensaje({ text: data.error || "Fallo en actualización", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "Error de conexión de red", type: "error" });
        }
    };

    const verDetalle = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/detallePedidos/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!res.ok) return;

            const data = await res.json();
            setPedidoDetalle(data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Error ver detalle:", error);
        }
    };

    // Filtrado de Pedidos
    let pedidosFiltrados = pedidos;
    if (filtroEstado !== "todos") {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === filtroEstado);
    }
    if (filtroTexto) {
        const text = filtroTexto.toLowerCase();
        pedidosFiltrados = pedidosFiltrados.filter(p => 
            p.id.toString().includes(text) || 
            p.usuario_nombre.toLowerCase().includes(text) ||
            p.usuario_email.toLowerCase().includes(text)
        );
    }

    const tabs = [
        { id: 'todos', label: 'TODOS', icon: <Box size={16}/> },
        { id: 'pendiente', label: 'PENDIENTES', icon: <Clock size={16}/> },
        { id: 'pagado', label: 'PAGADOS', icon: <AlertCircle size={16}/> },
        { id: 'enviado', label: 'ENVIADOS', icon: <Truck size={16}/> },
        { id: 'entregado', label: 'ENTREGADOS', icon: <CheckCircle size={16}/> },
        { id: 'cancelado', label: 'CANCELADOS', icon: <XCircle size={16}/> },
    ];

    return (
        <div className="admin-container">
            {/* ... header ... */}
            <header className="admin-header">
                <h1 className="admin-title">LOGÍSTICA Y <span className="text-gradient-primary">DESPACHOS</span></h1>
                <p>Centro de monitoreo de transacciones y estados de envío.</p>
            </header>

            {mensaje.text && (
                <div className={`admin-alert glass-panel ${mensaje.type}`}>
                    {mensaje.text}
                </div>
            )}

            <div className="admin-layout">
                {/* Panel Central de Pedidos */}
                <div className="admin-data-section glass-panel" style={{ gridColumn: 'span 2' }}>
                    {/* Filtros Superiores */}
                    <div className="ops-toolbar mb-4">
                        <div className="tabs-container">
                            {tabs.map(tab => (
                                <button 
                                    key={tab.id}
                                    className={`ops-tab ${filtroEstado === tab.id ? 'active' : ''}`}
                                    onClick={() => setFiltroEstado(tab.id)}
                                >
                                    {tab.icon} {tab.label}
                                    <span className="tab-count">
                                        {tab.id === 'todos' ? pedidos.length : pedidos.filter(p => p.estado === tab.id).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="search-bar-wrapper mt-3">
                            <Search size={18} className="icon-search"/>
                            <input 
                                type="text" 
                                placeholder="Rastrear por ID de Orden, Cliente o Email..." 
                                value={filtroTexto}
                                onChange={(e) => setFiltroTexto(e.target.value)}
                                className="cyber-input search-input"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>
                    ) : (
                        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="cyber-table ops-table">
                                <thead style={{ position: 'sticky', top: 0, background: 'var(--gaming-glass)', zIndex: 1 }}>
                                    <tr>
                                        <th>ORDEN_ID</th>
                                        <th>OPERADOR (CLIENTE)</th>
                                        <th>MONTO TOTAL</th>
                                        <th>ESTADO ACTUAL</th>
                                        <th>ACCIÓN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosFiltrados.length > 0 ? (
                                        pedidosFiltrados.map(p => (
                                            <tr key={p.id} className={pedidoDetalle?.pedido.id === p.id ? 'active-row' : ''}>
                                                <td className="tech-font fw-bold">#{p.id}</td>
                                                <td>
                                                    <div className="u-info">
                                                        <span className="u-name">{p.usuario_nombre}</span>
                                                        <span className="u-email text-muted">{p.usuario_email}</span>
                                                    </div>
                                                </td>
                                                <td className="price-cell">${parseFloat(p.total).toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${p.estado}`}>
                                                        {p.estado.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn-icon edit" onClick={() => verDetalle(p.id)} title="Inspeccionar">
                                                        <Eye size={16}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">
                                                <AlertCircle size={32} className="mx-auto mb-2 opacity-50"/>
                                                No hay registros que coincidan con los parámetros actuales.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Detalles de la Orden */}
                <div className="admin-form-section glass-panel" style={{ gridColumn: 'span 1' }}>
                    <h3>INSPECCIÓN DE ORDEN</h3>
                    {pedidoDetalle ? (
                        <div className="order-detail-view">
                            <div className="detail-header flex-between mb-4">
                                <div>
                                    <h4 className="tech-font text-gradient-primary m-0">ORDEN #{pedidoDetalle.pedido.id}</h4>
                                    <span className="date-info text-muted" style={{fontSize:'0.8rem'}}>
                                        {new Date(pedidoDetalle.pedido.creado_en).toLocaleString()}
                                    </span>
                                </div>
                                <span className={`status-badge ${pedidoDetalle.pedido.estado}`}>
                                    {pedidoDetalle.pedido.estado.toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="detail-section mb-4 p-3" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--gaming-border)'}}>
                                <label className="text-muted mb-2 d-block" style={{fontSize:'0.75rem', letterSpacing:'1px'}}>ACTUALIZAR FASE LÓGICA:</label>
                                <select 
                                    className={`cyber-select w-100 fw-bold status-select-${pedidoDetalle.pedido.estado}`}
                                    value={pedidoDetalle.pedido.estado}
                                    onChange={(e) => handleCambiarEstado(pedidoDetalle.pedido.id, e.target.value)}
                                >
                                    <option value="pendiente">PENDIENTE</option>
                                    <option value="pagado">PAGADO</option>
                                    <option value="enviado">ENVIADO</option>
                                    <option value="entregado">ENTREGADO</option>
                                    <option value="cancelado">CANCELADO</option>
                                </select>
                            </div>

                            <div className="items-list mb-4">
                                <h5 className="mb-2 text-muted" style={{fontSize:'0.75rem', letterSpacing:'1px'}}>ARTÍCULOS:</h5>
                                <div className="items-scroll" style={{maxHeight: '150px', overflowY: 'auto'}}>
                                    {pedidoDetalle.detalles.map(item => (
                                        <div key={item.id} className="detail-item flex-between mb-2 pb-2" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                                            <div className="item-info">
                                                <span className="text-gradient-purple fw-bold">{item.cantidad}x </span>
                                                <span className="item-name">{item.producto_nombre}</span>
                                            </div>
                                            <span className="item-price fw-bold">${parseFloat(item.precio_unitario).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="detail-footer p-3 glass-panel" style={{background: 'rgba(255,255,255,0.02)'}}>
                                <div className="total-row flex-between fw-bold">
                                    <span>TOTAL</span>
                                    <span className="total-val text-gradient-green fs-4">${parseFloat(pedidoDetalle.pedido.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state text-center py-5">
                            <AlertCircle size={48} className="mx-auto mb-3 opacity-20"/>
                            <p className="text-muted">Seleccione un pedido para ver los detalles.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};