import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { 
    PlusCircle, Edit3, Trash2, Folder, CheckCircle2, XCircle, 
    Layers, Search, RefreshCw, Eye, EyeOff, Tag, AlertCircle,
    Package
} from "lucide-react";
import "../styles/Admin.css";

export const AdminCategorias = () => {
    const { token } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    const [nombre, setNombre] = useState("");
    const [activa, setActiva] = useState(1);
    const [editandoId, setEditandoId] = useState(null);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/obtenerCategorias`);
            if (res.ok) {
                const data = await res.json();
                setCategorias(data.categorias);
            }
        } catch (error) {
            console.error("Error fetching categorias:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ text: "", type: "" });
        const metodo = editandoId ? "PUT" : "POST";
        const url = editandoId 
            ? `${import.meta.env.VITE_PUBLIC_URL}/categorias/actualizarCategoria/${editandoId}`
            : `${import.meta.env.VITE_PUBLIC_URL}/categorias/crearCategoria`;

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nombre, activa })
            });
            if (res.ok) {
                setMensaje({ text: `PROTOCOL SUCCESS: NODO ${editandoId ? 'ACTUALIZADO' : 'INYECTADO'}`, type: "success" });
                setNombre("");
                setActiva(1);
                setEditandoId(null);
                fetchCategorias();
                setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
            } else {
                const data = await res.json();
                setMensaje({ text: data.error || "INTEGRITY ERROR", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "COMMUNICATION FAILURE", type: "error" });
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("🚨 CRITICAL WARNING: ¿Purgar este NODO? Esto puede desconectar productos asociados.")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/eliminarCategoria/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setMensaje({ text: "NODO PURGADO DEL SISTEMA", type: "success" });
                fetchCategorias();
                setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
            } else {
                const data = await res.json();
                setMensaje({ text: data.error || "PURGE FAILED", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "ERROR DE CONEXIÓN", type: "error" });
        }
    };

    const handleEditar = (cat) => {
        setEditandoId(cat.id);
        setNombre(cat.nombre);
        setActiva(cat.activa !== undefined ? cat.activa : 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleEstado = async (cat) => {
        const nuevoEstado = cat.activa === 1 ? 0 : 1;
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/actualizarCategoria/${cat.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nombre: cat.nombre, activa: nuevoEstado })
            });
            if (res.ok) fetchCategorias();
        } catch (error) {
            console.error("Error toggling status", error);
        }
    };

    const categoriasFiltradas = categorias.filter(c => 
        c.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">ESTRUCTURA DE <span className="text-gradient-primary">NODOS</span></h1>
                <p>Configuración de la taxonomía del catálogo y jerarquía de activos digitales.</p>
            </header>

            {mensaje.text && (
                <div className={`admin-alert glass-panel ${mensaje.type}`}>
                    {mensaje.text}
                </div>
            )}

            <div className="admin-layout" style={{ gridTemplateColumns: "350px 1fr" }}>
                {/* Form Section */}
                <div className="admin-form-section glass-panel">
                    <div className="form-header mb-4">
                        <Layers size={20} className="text-primary"/>
                        <h3>{editandoId ? "MODIFICAR NODO" : "REGISTRAR NODO"}</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="cyber-form">
                        <div className="input-group">
                            <label>IDENTIFICADOR (NOMBRE)</label>
                            <div className="input-field">
                                <Tag size={16} className="field-icon"/>
                                <input 
                                    type="text" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    required 
                                    placeholder="Ej: PC Gaming, Tarjetas..."
                                />
                                <div className="field-focus"></div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>VISIBILIDAD EN RED</label>
                            <select 
                                className="cyber-select" 
                                value={activa} 
                                onChange={(e) => setActiva(parseInt(e.target.value))}
                            >
                                <option value={1}>OPERATIVO (VISIBLE)</option>
                                <option value={0}>DESCONECTADO (OCULTO)</option>
                            </select>
                        </div>

                        <div className="form-actions mt-4">
                            <button type="submit" className="btn-gaming-primary w-100 flex-center gap-2">
                                {editandoId ? <Edit3 size={18}/> : <PlusCircle size={18}/>}
                                <span className="btn-text">{editandoId ? "GUARDAR CAMBIOS" : "INYECTAR NODO"}</span>
                                <div className="btn-glow"></div>
                            </button>
                            {editandoId && (
                                <button type="button" className="btn-gaming-secondary w-100 mt-2" onClick={() => {
                                    setEditandoId(null);
                                    setNombre("");
                                    setActiva(1);
                                }}>
                                    CANCELAR RECONFIGURACIÓN
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="didactic-note mt-4">
                        <AlertCircle size={14} className="text-primary mr-2"/>
                        <p style={{fontSize: '0.7rem'}}>Los nodos inactivos ocultarán todos sus productos asociados de la tienda pública.</p>
                    </div>
                </div>

                {/* Grid Section */}
                <div className="admin-data-section glass-panel">
                    <div className="ops-toolbar mb-4">
                        <div className="search-bar-wrapper">
                            <Search size={18} className="icon-search"/>
                            <input 
                                type="text" 
                                placeholder="Escanear jerarquía de nodos..." 
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                className="cyber-input search-input"
                            />
                        </div>
                        <button className="btn-icon ml-auto" onClick={fetchCategorias} title="Sincronizar">
                            <RefreshCw size={18}/>
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>
                    ) : (
                        <div className="category-grid">
                            {categoriasFiltradas.length > 0 ? (
                                categoriasFiltradas.map(cat => (
                                    <div key={cat.id} className={`category-node-card glass-panel ${cat.activa === 0 ? 'node-offline' : ''}`}>
                                        <div className="node-main">
                                            <div className="node-icon">
                                                <Folder size={20}/>
                                            </div>
                                            <div className="node-info">
                                                <span className="node-name">{cat.nombre}</span>
                                                <span className="node-id">#ID: {cat.id}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="node-status">
                                            <button 
                                                className={`node-status-btn ${cat.activa === 1 ? 'active' : 'inactive'}`}
                                                onClick={() => toggleEstado(cat)}
                                            >
                                                {cat.activa === 1 ? <Eye size={14}/> : <EyeOff size={14}/>}
                                                <span>{cat.activa === 1 ? 'ONLINE' : 'OFFLINE'}</span>
                                            </button>
                                        </div>

                                        <div className="node-actions">
                                            <button className="btn-icon-sm" onClick={() => handleEditar(cat)} title="Configurar">
                                                <Edit3 size={14}/>
                                            </button>
                                            <button className="btn-icon-sm delete" onClick={() => handleEliminar(cat.id)} title="Purgar">
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state text-center py-5 w-100">
                                    <Package size={48} className="mx-auto mb-3 opacity-20"/>
                                    <p className="text-muted">No se encontraron nodos en el sector buscado.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
