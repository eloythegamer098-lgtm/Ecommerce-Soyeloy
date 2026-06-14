import { useState, useEffect } from "react";
import "../styles/Admin.css"; 
import { useAuth } from "../services/AuthContext";
import { Search, Filter, AlertTriangle, PlusCircle, Edit3, Trash2, PackageOpen, Image as ImageIcon, ToggleLeft, ToggleRight, Eye, EyeOff } from "lucide-react";

export const AdminProductos = () => {
    const { token } = useAuth();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategoria] = useState([]);
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    const [isLoading, setIsLoading] = useState(true);
    
    // Filtros Avanzados
    const [filtroTexto, setFiltroTexto] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("todas");
    const [soloStockBajo, setSoloStockBajo] = useState(false);
    const [ordenarPor, setOrdenarPor] = useState("recientes");

    const [form, setForm] = useState({
        categoria_id : "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen: "",
        activo: 1
    });
    
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        listarProductos();
        obtenerCategorias();
    }, []);

    const listarProductos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos`);
            if (!response.ok) {
                setIsLoading(false);
                return;
            }
            const data = await response.json();
            setProductos(data.productos);
        } catch (error) {
            console.error("Error fetching productos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerCategorias = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/obtenerCategorias`);
            if (res.ok) {
                const data = await res.json();
                setCategoria(data.categorias);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ text: "", type: "" });

        const metodo = editandoId ? "PUT" : "POST";
        const url = editandoId
            ? `${import.meta.env.VITE_PUBLIC_URL}/productos/${editandoId}`
            : `${import.meta.env.VITE_PUBLIC_URL}/productos/`;
        
        try {
            const res = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (res.ok) {
                setMensaje({ 
                    text: `PROTOCOL OPERATIONAL: SKU ${editandoId ? 'Sincronizado' : 'Inyectado'} con éxito.`, 
                    type: "success" 
                });
                setForm({ categoria_id: "", nombre: "", descripcion: "", precio: "", stock: "", imagen: "", activo: 1 });
                setEditandoId(null);
                listarProductos();
            } else {
                setMensaje({ text: data.error || "DATA INTEGRITY CORRUPTION", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "CORE CONNECTION FAILURE.", type: "error" });
        }
    };

    const handleEditar = (prod) => {
        setEditandoId(prod.id);
        const CategoriaEncontrada = categorias.find(c => c.nombre === prod.categoria);

        setForm({
            categoria_id: CategoriaEncontrada ? CategoriaEncontrada.id : "",
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            precio: prod.precio,
            stock: prod.stock,
            imagen: prod.imagen || "",
            activo: prod.activo
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEliminar = async (id) => {
        if(!window.confirm("FATAL WARNING: ¿Purgar permanentemente este SKU? Esta acción no se puede deshacer.")) return;

        try {
             const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
             });
            
             if(res.ok){
                setMensaje({ text: "SKU PURGADO DEL SISTEMA.", type: "success" });
                listarProductos();
             } else {
                const data = await res.json();
                setMensaje({ text: data.error || "PURGE SEQUENCE FAILED", type: "error" });
             }
        } catch(error) {
            setMensaje({ text: "COMMUNICATION ERROR.", type: "error" });
        }
    };

    const toggleEstado = async (prod) => {
        const nuevoEstado = prod.activo === 1 ? 0 : 1;
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos/${prod.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...prod,
                    categoria_id: categorias.find(c => c.nombre === prod.categoria)?.id,
                    activo: nuevoEstado
                })
            });
            if (res.ok) {
                listarProductos();
            }
        } catch (error) {
            console.error("Error toggling status", error);
        }
    };

    // Lógica de Filtrado y Ordenamiento Avanzado
    let productosProcesados = [...productos];

    if (filtroTexto) {
        productosProcesados = productosProcesados.filter(p => 
            p.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            p.descripcion.toLowerCase().includes(filtroTexto.toLowerCase())
        );
    }
    if (filtroCategoria !== "todas") {
        productosProcesados = productosProcesados.filter(p => 
            p.categoria === filtroCategoria
        );
    }
    if (soloStockBajo) {
        productosProcesados = productosProcesados.filter(p => p.stock <= 5);
    }

    if (ordenarPor === "precioAsc") {
        productosProcesados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
    } else if (ordenarPor === "precioDesc") {
        productosProcesados.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
    } else if (ordenarPor === "stockAsc") {
        productosProcesados.sort((a, b) => parseInt(a.stock) - parseInt(b.stock));
    } else if (ordenarPor === "stockDesc") {
        productosProcesados.sort((a, b) => parseInt(b.stock) - parseInt(a.stock));
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">CONTROL DE <span className="text-gradient-primary">INVENTARIO</span></h1>
                <p className="admin-subtitle">Módulo de gestión de activos digitales, precios y despliegue de red.</p>
            </header>

            {mensaje.text && (
                <div className={`admin-alert glass-panel ${mensaje.type}`}>
                    <div className="alert-content">
                        {mensaje.type === 'success' ? '✓' : '⚠'} {mensaje.text}
                    </div>
                </div>
            )}

            <div className="admin-layout">
                {/* Formulario de Registro/Edición */}
                <div className="admin-form-section glass-panel">
                    <div className="form-header">
                        <PlusCircle size={20} className="text-primary"/>
                        <h3>{editandoId ? "RECONFIGURAR PARÁMETROS" : "REGISTRAR ACTIVO"}</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="cyber-form">
                        <div className="input-group">
                            <label>NODO DE CATEGORÍA</label>
                            <select className="cyber-select" name="categoria_id" value={form.categoria_id} onChange={handleChange} required>
                                <option value="">-- SELECCIONAR --</option>
                                {categorias.map (cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>IDENTIFICADOR DEL PRODUCTO</label>
                            <div className="input-field">
                                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre del juego/tarjeta..."/>
                                <div className="field-focus"></div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>URL DE IMAGEN (ASSET)</label>
                            <div className="input-field">
                                <ImageIcon size={16} className="field-icon"/>
                                <input type="text" name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..."/>
                                <div className="field-focus"></div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>ESPECIFICACIONES TÉCNICAS</label>
                            <textarea 
                                className="cyber-textarea" 
                                name="descripcion" 
                                value={form.descripcion} 
                                onChange={handleChange} 
                                required 
                                placeholder="Descripción detallada del activo..."
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="form-row-2">
                            <div className="input-group">
                                <label>VALOR (USD)</label>
                                <div className="input-field">
                                    <input type="number" name="precio" step="0.01" value={form.precio} onChange={handleChange} required placeholder="0.00"/>
                                    <div className="field-focus"></div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>STOCK DISPONIBLE</label>
                                <div className="input-field">
                                    <input type="number" name="stock" value={form.stock} onChange={handleChange} required placeholder="0"/>
                                    <div className="field-focus"></div>
                                </div>
                            </div>
                        </div>

                        <div className="input-group checkbox-group">
                            <label className="cyber-switch">
                                <input 
                                    type="checkbox" 
                                    name="activo" 
                                    checked={form.activo === 1} 
                                    onChange={handleChange}
                                />
                                <span className="switch-slider"></span>
                                <span className="switch-label">ACTIVO EN TIENDA</span>
                            </label>
                        </div>

                        <div className="form-actions mt-4">
                            <button type="submit" className="btn-gaming-primary w-100 flex-center gap-2">
                                {editandoId ? <Edit3 size={18}/> : <PlusCircle size={18}/>}
                                <span className="btn-text">{editandoId ? "GUARDAR CAMBIOS" : "AÑADIR A RED"}</span>
                                <div className="btn-glow"></div>
                            </button>
                            {editandoId && (
                                <button type="button" className="btn-gaming-secondary w-100 mt-2" onClick={() => {
                                    setEditandoId(null);
                                    setForm({ categoria_id: "", nombre: "", descripcion: "", precio: "", stock: "", imagen: "", activo: 1 });
                                }}>
                                    CANCELAR RECONFIGURACIÓN
                                </button>
                            )}
                        </div>
                    </form>

                    {form.imagen && (
                        <div className="image-preview-box mt-4">
                            <label>VISTA PREVIA DEL ASSET</label>
                            <div className="preview-container glass-panel">
                                <img src={form.imagen} alt="Preview" onError={(e) => e.target.src = 'data:image/svg+xml;charset=UTF-8,<svg%20width%3D"150"%20height%3D"150"%20xmlns%3D"http%3A//www.w3.org/2000/svg"><rect%20width%3D"150"%20height%3D"150"%20fill%3D"%23111"/><text%20x%3D"50%25"%20y%3D"50%25"%20font-family%3D"monospace"%20font-size%3D"12"%20fill%3D"%23888"%20text-anchor%3D"middle"%20dy%3D".3em">INVALID%20URL</text></svg>'} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabla de Inventario y Filtros */}
                <div className="admin-data-section glass-panel">
                    <div className="inventory-controls mb-4">
                        <div className="search-bar-wrapper">
                            <Search size={18} className="icon-search"/>
                            <input 
                                type="text" 
                                placeholder="Filtrar base de datos por nombre o descripción..." 
                                value={filtroTexto}
                                onChange={(e) => setFiltroTexto(e.target.value)}
                                className="cyber-input search-input"
                            />
                        </div>
                        <div className="filters-row mt-3">
                            <div className="filter-group">
                                <Filter size={14} className="filter-icon"/>
                                <select 
                                    className="cyber-select filter-select" 
                                    value={filtroCategoria} 
                                    onChange={(e) => setFiltroCategoria(e.target.value)}
                                >
                                    <option value="todas">Todas las categorías</option>
                                    {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                                </select>
                            </div>

                            <select 
                                className="cyber-select filter-select"
                                value={ordenarPor}
                                onChange={(e) => setOrdenarPor(e.target.value)}
                            >
                                <option value="recientes">Más recientes</option>
                                <option value="precioDesc">Precio: ↓</option>
                                <option value="precioAsc">Precio: ↑</option>
                                <option value="stockAsc">Stock: Crítico</option>
                                <option value="stockDesc">Stock: Abundante</option>
                            </select>

                            <button 
                                className={`btn-filter-toggle ${soloStockBajo ? 'active' : ''}`}
                                onClick={() => setSoloStockBajo(!soloStockBajo)}
                                title="Mostrar solo stock bajo (<= 5)"
                            >
                                <AlertTriangle size={16}/>
                                <span>BAJO STOCK</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="section-header mb-3 flex-between">
                        <h3>BANCO DE DATOS ({productosProcesados.length})</h3>
                    </div>
                    
                    {isLoading ? (
                        <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="cyber-table">
                                <thead>
                                    <tr>
                                        <th>ASSET</th>
                                        <th>SKU / NOMBRE</th>
                                        <th>CATEGORÍA</th>
                                        <th>PRECIO</th>
                                        <th>STOCK</th>
                                        <th>ESTADO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosProcesados.length > 0 ? (
                                        productosProcesados.map((prod) => (
                                            <tr key={prod.id} className={prod.activo === 0 ? 'row-inactive' : ''}>
                                                <td className="img-cell">
                                                    <div className="table-img-wrapper">
                                                        <img src={prod.imagen || 'data:image/svg+xml;charset=UTF-8,<svg%20width%3D"50"%20height%3D"50"%20xmlns%3D"http%3A//www.w3.org/2000/svg"><rect%20width%3D"50"%20height%3D"50"%20fill%3D"%23111"/><text%20x%3D"50%25"%20y%3D"50%25"%20font-family%3D"monospace"%20font-size%3D"8"%20fill%3D"%23888"%20text-anchor%3D"middle"%20dy%3D".3em">NO%20IMG</text></svg>'} alt={prod.nombre} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="prod-name-cell">
                                                        <span className="fw-bold">{prod.nombre}</span>
                                                        <span className="sku-id">ID: #{prod.id}</span>
                                                    </div>
                                                </td>
                                                <td><span className="cat-badge">{prod.categoria}</span></td>
                                                <td className="price-cell">
                                                    {prod.precio_oferta ? (
                                                        <div className="flex-column">
                                                            <span className="text-gradient-green fw-bold">${parseFloat(prod.precio_oferta).toFixed(2)}</span>
                                                            <span className="text-muted text-decoration-line-through" style={{fontSize: '0.7rem'}}>${parseFloat(prod.precio).toFixed(2)}</span>
                                                        </div>
                                                    ) : (
                                                        <span>${parseFloat(prod.precio).toFixed(2)}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={`stock-indicator ${prod.stock == 0 ? 'out' : (prod.stock <= 5 ? 'low' : 'ok')}`}>
                                                        <span className="dot"></span>
                                                        <span>{prod.stock}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button 
                                                        className={`status-btn ${prod.activo === 1 ? 'active' : 'inactive'}`}
                                                        onClick={() => toggleEstado(prod)}
                                                        title={prod.activo === 1 ? 'Desactivar' : 'Activar'}
                                                    >
                                                        {prod.activo === 1 ? <Eye size={16}/> : <EyeOff size={16}/>}
                                                        <span>{prod.activo === 1 ? 'VISIBLE' : 'OCULTO'}</span>
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn-icon edit" onClick={() => handleEditar(prod)} title="Editar">
                                                            <Edit3 size={16}/>
                                                        </button>
                                                        <button className="btn-icon delete" onClick={() => handleEliminar(prod.id)} title="Eliminar">
                                                            <Trash2 size={16}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                <PackageOpen size={48} className="mx-auto mb-3 opacity-30"/>
                                                <p>SISTEMA: No se encontraron registros en este sector.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
