import { useState, useEffect } from "react";
import "../styles/Admin.css";
import { useAuth } from "../services/AuthContext";
import { 
    Package, 
    AlertCircle, 
    ArrowUpCircle, 
    ArrowDownCircle, 
    History, 
    Search, 
    Filter,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Activity
} from "lucide-react";

export const AdminInventario = () => {
    const { token } = useAuth();
    const [productos, setProductos] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    
    // Filtros
    const [filtroTexto, setFiltroTexto] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, bajo, agotado

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setIsLoading(true);
        try {
            const [resProd, resHist] = await Promise.all([
                fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos`),
                fetch(`${import.meta.env.VITE_PUBLIC_URL}/inventario/historial`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (resProd.ok && resHist.ok) {
                const dataProd = await resProd.json();
                const dataHist = await resHist.json();
                setProductos(dataProd.productos);
                setHistorial(dataHist);
            }
        } catch (error) {
            console.error("Error al sincronizar inventario", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAjusteStock = async (id, cantidad, tipo) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/inventario/ajustar/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ cantidad, tipo, motivo: `Ajuste rápido desde panel de inventario` })
            });

            if (res.ok) {
                setMensaje({ text: "ACTUALIZACIÓN DE STOCK EXITOSA", type: "success" });
                cargarDatos();
                setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
            } else {
                const data = await res.json();
                setMensaje({ text: data.error || "ERROR EN LA OPERACIÓN", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "FALLO DE CONEXIÓN", type: "error" });
        }
    };

    const productosFiltrados = productos.filter(p => {
        const matchBusqueda = p.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
        if (filtroEstado === "bajo") return matchBusqueda && p.stock <= 5 && p.stock > 0;
        if (filtroEstado === "agotado") return matchBusqueda && p.stock === 0;
        return matchBusqueda;
    });

    const stats = {
        total: productos.length,
        bajoStock: productos.filter(p => p.stock <= 5 && p.stock > 0).length,
        agotados: productos.filter(p => p.stock === 0).length,
        totalUnidades: productos.reduce((acc, p) => acc + p.stock, 0)
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">SISTEMA DE <span className="text-gradient-primary">LOGÍSTICA</span></h1>
                <p className="admin-subtitle">Control de flujo de activos, auditoría de stock y alertas críticas.</p>
            </header>

            {mensaje.text && (
                <div className={`admin-alert glass-panel ${mensaje.type}`}>
                    {mensaje.text}
                </div>
            )}

            <div className="inventory-summary-grid mb-4">
                <div className="stat-card glass-panel interactive">
                    <div className="stat-header">
                        <Package className="text-primary" size={20}/>
                        <span className="stat-label">TOTAL SKUs</span>
                    </div>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat-card glass-panel interactive alert-low">
                    <div className="stat-header">
                        <AlertCircle className="text-warning" size={20}/>
                        <span className="stat-label">STOCK CRÍTICO</span>
                    </div>
                    <div className="stat-value text-warning">{stats.bajoStock}</div>
                </div>
                <div className="stat-card glass-panel interactive alert-out">
                    <div className="stat-header">
                        <TrendingDown className="text-danger" size={20}/>
                        <span className="stat-label">AGOTADOS</span>
                    </div>
                    <div className="stat-value text-danger">{stats.agotados}</div>
                </div>
                <div className="stat-card glass-panel interactive">
                    <div className="stat-header">
                        <Activity className="text-accent" size={20}/>
                        <span className="stat-label">TOTAL UNIDADES</span>
                    </div>
                    <div className="stat-value">{stats.totalUnidades}</div>
                </div>
            </div>

            <div className="admin-layout" style={{ gridTemplateColumns: "1fr 350px" }}>
                <div className="admin-data-section glass-panel">
                    <div className="inventory-controls mb-4">
                        <div className="search-bar-wrapper">
                            <Search size={18} className="icon-search"/>
                            <input 
                                type="text" 
                                placeholder="Escanear inventario..." 
                                value={filtroTexto}
                                onChange={(e) => setFiltroTexto(e.target.value)}
                                className="cyber-input search-input"
                            />
                        </div>
                        <div className="filters-row mt-3">
                            <button 
                                className={`btn-filter-toggle ${filtroEstado === 'todos' ? 'active' : ''}`}
                                onClick={() => setFiltroEstado("todos")}
                            >
                                TODOS
                            </button>
                            <button 
                                className={`btn-filter-toggle ${filtroEstado === 'bajo' ? 'active' : ''}`}
                                onClick={() => setFiltroEstado("bajo")}
                            >
                                <AlertCircle size={14} className="mr-1"/> BAJO STOCK
                            </button>
                            <button 
                                className={`btn-filter-toggle ${filtroEstado === 'agotado' ? 'active' : ''}`}
                                onClick={() => setFiltroEstado("agotado")}
                            >
                                <TrendingDown size={14} className="mr-1"/> AGOTADOS
                            </button>
                            <button className="btn-icon ml-auto" onClick={cargarDatos} title="Sincronizar">
                                <RefreshCw size={18}/>
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="cyber-table">
                            <thead>
                                <tr>
                                    <th>PRODUCTO</th>
                                    <th>STOCK ACTUAL</th>
                                    <th>ESTADO</th>
                                    <th>ACCIONES RÁPIDAS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map(p => (
                                    <tr key={p.id}>
                                        <td className="fw-bold">{p.nombre}</td>
                                        <td className="text-center">
                                            <span className={`stock-number ${p.stock <= 5 ? 'critical' : ''}`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={`stock-status-pill ${p.stock === 0 ? 'out' : (p.stock <= 5 ? 'low' : 'ok')}`}>
                                                {p.stock === 0 ? 'AGOTADO' : (p.stock <= 5 ? 'CRÍTICO' : 'ESTABLE')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="stock-actions">
                                                <button 
                                                    className="btn-stock-quick dec" 
                                                    onClick={() => handleAjusteStock(p.id, 1, 'decremento')}
                                                    disabled={p.stock === 0}
                                                >
                                                    -1
                                                </button>
                                                <button 
                                                    className="btn-stock-quick inc" 
                                                    onClick={() => handleAjusteStock(p.id, 1, 'incremento')}
                                                >
                                                    +1
                                                </button>
                                                <button 
                                                    className="btn-stock-quick inc-high" 
                                                    onClick={() => handleAjusteStock(p.id, 10, 'incremento')}
                                                >
                                                    +10
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-sidebar-section glass-panel">
                    <div className="section-header mb-3 flex-between">
                        <h3 className="flex-center gap-2"><History size={18}/> AUDITORÍA</h3>
                    </div>
                    <div className="history-list">
                        {historial.length === 0 ? (
                            <p className="text-muted text-center py-4">Sin registros de actividad.</p>
                        ) : (
                            historial.map(h => (
                                <div key={h.id} className="history-item">
                                    <div className="history-icon">
                                        {h.tipo === 'incremento' ? <ArrowUpCircle className="text-green"/> : <ArrowDownCircle className="text-red"/>}
                                    </div>
                                    <div className="history-info">
                                        <span className="h-name">{h.producto_nombre}</span>
                                        <span className="h-action">
                                            {h.tipo === 'incremento' ? '+' : '-'}{h.cantidad_cambio} unidades
                                        </span>
                                        <span className="h-date">{new Date(h.fecha).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
