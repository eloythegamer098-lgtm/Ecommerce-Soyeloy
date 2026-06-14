import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
    TrendingUp, Users, ShoppingCart, Package, AlertTriangle, 
    CheckCircle, Info, Zap, ArrowRight, Star, Clock, FileText, 
    BarChart3, LayoutDashboard, PlusCircle, Settings, Eye,
    Save, X, Edit3, Search, RefreshCcw, PieChart as PieIcon
} from "lucide-react";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import "../styles/Admin.css";

export const AdminDashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(null); // pedidoId
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/dashboard/stats`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (id, currentStock) => {
        const newStock = prompt("INGRESAR NUEVO STOCK:", currentStock);
        if (newStock === null || isNaN(newStock)) return;

        try {
            // Usamos el endpoint de inventario para mayor consistencia
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/inventario/ajustar/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    cantidad: parseInt(newStock),
                    tipo: 'ajuste',
                    motivo: 'Ajuste rápido desde Dashboard'
                })
            });

            if (res.ok) {
                fetchStats();
            }
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setStatusUpdating(id);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/admin/estado/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ estado: newStatus })
            });

            if (res.ok) {
                fetchStats();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setStatusUpdating(null);
        }
    };

    const handleTaskAction = (tipo) => {
        if (tipo === 'pedidos') navigate('/admin/pedidos');
        if (tipo === 'stock_bajo' || tipo === 'agotados' || tipo === 'contenido') navigate('/adminProductos');
        if (tipo === 'usuarios') navigate('/admin/usuarios');
    };

    if (loading) {
        return (
            <div className="cyber-spinner-container">
                <div className="cyber-spinner"></div>
                <p className="mt-4 cyber-text">ACCEDIENDO AL NÚCLEO OPERATIVO...</p>
            </div>
        );
    }

    const { resumen, rendimiento, alertas, recomendaciones, ultimos_pedidos, productos_populares } = stats || {};

    const salesData = [
        { name: 'Prev', ventas: rendimiento?.mes_anterior || 0 },
        { name: 'Mes', ventas: rendimiento?.mes || 0 },
        { name: 'Sem', ventas: rendimiento?.semana || 0 },
        { name: 'Hoy', ventas: rendimiento?.hoy || 0 },
    ];

    const categoryPieData = rendimiento?.categorias?.map(c => ({
        name: c.nombre,
        value: parseInt(c.ventas_totales || 0)
    })).filter(c => c.value > 0) || [];

    const COLORS = ['#a855f7', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

    return (
        <div className="admin-container control-center">
            <header className="admin-header flex-between">
                <div>
                    <h1 className="admin-title">OPERATIONAL <span className="text-gradient-primary">CONTROL CENTER</span></h1>
                    <div className="system-badges">
                        <span className="badge-neon purple"><RefreshCcw size={12}/> AUTO-SYNC ON</span>
                        <span className="badge-neon green"><CheckCircle size={12}/> NODE ONLINE</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid metrics-row">
                <div className="stat-card glass-panel interactive">
                    <div className="stat-header">
                        <span className="stat-label">INGRESOS NETOS</span>
                        <TrendingUp size={16} className="text-gradient-green"/>
                    </div>
                    <span className="stat-value text-gradient-green">${parseFloat(resumen?.ingresos_totales || 0).toLocaleString()}</span>
                    <div className="stat-footer">
                        <span className={`trend ${rendimiento?.mes >= rendimiento?.mes_anterior ? 'up' : 'down'}`}>
                            {rendimiento?.mes_anterior > 0 ? (((rendimiento.mes - rendimiento.mes_anterior) / rendimiento.mes_anterior) * 100).toFixed(1) : 0}% vs mes ant.
                        </span>
                    </div>
                </div>

                <div className="stat-card glass-panel interactive">
                    <div className="stat-header">
                        <span className="stat-label">CONVERSIÓN CLIENTES</span>
                        <Users size={16} className="text-gradient-primary"/>
                    </div>
                    <span className="stat-value">{resumen?.usuarios_totales}</span>
                    <div className="stat-footer">
                        <span className="trend up">+{resumen?.usuarios_nuevos_24h} ult. 24h</span>
                    </div>
                </div>

                <div className="stat-card glass-panel interactive">
                    <div className="stat-header">
                        <span className="stat-label">FLUJO DE ÓRDENES</span>
                        <ShoppingCart size={16} className="text-gradient-orange"/>
                    </div>
                    <span className="stat-value">{resumen?.pedidos_totales}</span>
                    <div className="stat-footer">
                        <span className="alert-count text-orange">{resumen?.pedidos_pendientes} PENDIENTES</span>
                    </div>
                </div>

                <div className="stat-card glass-panel interactive">
                    <div className="stat-header">
                        <span className="stat-label">SALUD INVENTARIO</span>
                        <Package size={16} className="text-gradient-purple"/>
                    </div>
                    <span className="stat-value">{resumen?.productos_totales}</span>
                    <div className="stat-footer">
                        <span className="alert-count text-red">{resumen?.agotados} AGOTADOS</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections-container main-ops">
                <div className="ops-column charts">
                    <div className="admin-data-section glass-panel">
                        <div className="section-header">
                            <h3><BarChart3 size={18}/> ANÁLISIS DE RENDIMIENTO</h3>
                        </div>
                        <div className="chart-wrapper line">
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                    <ChartTooltip 
                                        contentStyle={{ background: '#020617', border: '1px solid #a855f7', borderRadius: '8px' }}
                                    />
                                    <Line type="monotone" dataKey="ventas" stroke="#a855f7" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="category-split mt-4">
                            <h4>DISTRIBUCIÓN POR CATEGORÍA</h4>
                            <div className="chart-wrapper pie">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={categoryPieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ops-column actions">
                    <div className="admin-data-section glass-panel alerts-terminal">
                        <div className="section-header">
                            <h3><Zap size={18}/> TERMINAL DE ACCIÓN</h3>
                        </div>
                        <div className="task-list interactive">
                            {recomendaciones?.map((rec, i) => (
                                <div key={i} className="task-action-card" onClick={() => handleTaskAction(rec.tipo)}>
                                    <div className="task-header">
                                        <span className={`task-tag ${rec.tipo}`}>{rec.tipo.toUpperCase()}</span>
                                        <ArrowRight size={14} className="arrow"/>
                                    </div>
                                    <p className="task-msg">{rec.mensaje}</p>
                                    <div className="task-action-btn">EJECUTAR PROTOCOLO</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="admin-data-section glass-panel quick-links-grid">
                         <Link to="/adminProductos" className="q-link">
                            <PlusCircle size={24}/>
                            <span>+ PRODUCTO</span>
                         </Link>
                         <Link to="/admin/pedidos" className="q-link">
                            <ShoppingCart size={24}/>
                            <span>G. PEDIDOS</span>
                         </Link>
                         <Link to="/admin/usuarios" className="q-link">
                            <Users size={24}/>
                            <span>G. USUARIOS</span>
                         </Link>
                         <Link to="/admin/categorias" className="q-link">
                            <LayoutDashboard size={24}/>
                            <span>G. CATEGORÍAS</span>
                         </Link>
                    </div>
                </div>
            </div>

            <div className="admin-data-section glass-panel">
                <div className="section-header">
                    <h3><Clock size={18}/> GESTIÓN DE ÓRDENES RECIENTES</h3>
                </div>
                <div className="table-responsive">
                    <table className="cyber-table ops-table">
                        <thead>
                            <tr>
                                <th>ORDER_ID</th>
                                <th>CLIENTE</th>
                                <th>MONTO</th>
                                <th>ESTADO OPERATIVO</th>
                                <th>ACCIONES RÁPIDAS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimos_pedidos?.map(p => (
                                <tr key={p.id}>
                                    <td className="tech-font">#{p.id}</td>
                                    <td>
                                        <div className="user-cell">
                                            <span className="u-name">{p.usuario}</span>
                                            <span className="u-date">{new Date(p.creado_en).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="price-cell">${parseFloat(p.total).toFixed(2)}</td>
                                    <td>
                                        <select 
                                            className={`status-select-inline ${p.estado}`}
                                            value={p.estado}
                                            onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                                            disabled={statusUpdating === p.id}
                                        >
                                            <option value="pendiente">PENDIENTE</option>
                                            <option value="pagado">PAGADO</option>
                                            <option value="preparando">PREPARANDO</option>
                                            <option value="enviado">ENVIADO</option>
                                            <option value="entregado">ENTREGADO</option>
                                            <option value="cancelado">CANCELADO</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="ops-btns">
                                            <button className="btn-icon-sm" onClick={() => navigate(`/admin/pedidos`)}>
                                                <Eye size={14}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="admin-data-section glass-panel">
                <div className="section-header">
                    <h3><Star size={18}/> PRODUCTOS TOP & AJUSTE DE STOCK</h3>
                </div>
                <div className="popular-grid">
                    {productos_populares?.map((p, index) => (
                        <div key={index} className="inventory-card">
                            <div className="p-rank">#{index + 1}</div>
                            <div className="p-details">
                                <span className="p-name">{p.nombre}</span>
                                <span className="p-stats">{p.vendidos} VENDIDOS</span>
                            </div>
                            <div className="p-stock-control">
                                <div className={`stock-status ${p.stock <= 5 ? 'critical' : 'stable'}`}>
                                    {p.stock} UNID.
                                </div>
                                <button className="btn-edit-stock" onClick={() => handleUpdateStock(p.id, p.stock)}>
                                    <Edit3 size={14}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};