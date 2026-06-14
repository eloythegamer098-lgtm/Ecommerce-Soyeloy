import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ContextCart } from "../services/ContextCart.jsx";
import api from "../services/api";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
import "../styles/Products.css";

export const Productos = () => {
    const [buscar, setBuscar] = useState("");
    const [productos, setProductos] = useState([]);
    const [favoritosIds, setFavoritosIds] = useState(new Set());
    const [categoriaActiva, setCategoriaActiva] = useState("TODOS");
    const [isLoading, setIsLoading] = useState(true);
    const { agregarAlCarrito } = useContext(ContextCart);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            setIsLoading(true);
            try {
                const [dataProd, dataFavs] = await Promise.all([
                    api.get("/productos"),
                    api.get("/favoritos").catch(() => []) 
                ]);
                
                setProductos(dataProd.productos || []);
                setFavoritosIds(new Set((dataFavs || []).map(f => f.id)));
            } catch (error) {
                console.error("Error al sincronizar datos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const toggleFavorite = async (e, id) => {
        console.log("DEBUG: Iniciando toggle para producto ID:", id);
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const res = await api.post('/favoritos/toggle', { producto_id: id });
            console.log("DEBUG: Respuesta del servidor:", res);
            
            setFavoritosIds(prev => {
                const newSet = new Set(prev);
                if (res.isFavorite) {
                    newSet.add(id);
                } else {
                    newSet.delete(id);
                }
                return newSet;
            });
        } catch (err) {
            console.error("DEBUG: Error al alternar favorito:", err);
            alert("SISTEMA: Error al sincronizar favorito. ¿Has iniciado sesión?");
        }
    };

    // Categorías únicas
    const categorias = ["TODOS", ...new Set(productos.map(p => p.categoria))];

    const productosFiltrados = productos.filter((prod) => {
        const matchBusqueda = prod.nombre.toLowerCase().includes(buscar.toLowerCase());
        const matchCategoria = categoriaActiva === "TODOS" || prod.categoria === categoriaActiva;
        const estaActivo = prod.activo === 1; 
        return matchBusqueda && matchCategoria && estaActivo;
    });

    return (
        <div className="store-container">
            <header className="store-header">
                <div className="header-content">
                    <h1 className="store-title">CATÁLOGO <span className="text-gradient-primary">DIGITAL</span></h1>
                    <p className="store-subtitle">Explora nuestra colección de juegos, pases y tarjetas de regalo.</p>
                </div>
                
                <div className="search-bar glass-panel">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar juegos, tarjetas, códigos..."
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-glow"></div>
                </div>
            </header>

            <div className="store-layout">
                <aside className="store-sidebar">
                    <div className="glass-panel filters-panel">
                        <h3>PLATAFORMAS</h3>
                        <div className="category-list">
                            {categorias.map(cat => (
                                <button 
                                    key={cat}
                                    className={`category-btn ${categoriaActiva === cat ? 'active' : ''}`}
                                    onClick={() => setCategoriaActiva(cat)}
                                >
                                    <span className="cat-name">{cat}</span>
                                    {categoriaActiva === cat && <span className="cat-indicator"></span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="products-main">
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="cyber-spinner"></div>
                            <p>Sincronizando inventario...</p>
                        </div>
                    ) : productosFiltrados.length === 0 ? (
                        <div className="empty-state glass-panel">
                            <div className="empty-icon">!</div>
                            <h3>NO SE ENCONTRARON DATOS</h3>
                            <p>No hay productos que coincidan con tu búsqueda.</p>
                        </div>
                    ) : (
                        <div className="gaming-grid">
                            {productosFiltrados.map((prod) => (
                                <div key={prod.id} className="gaming-card glass-panel">
                                    <div className="card-image-box">
                                        <div className="platform-tag">{prod.categoria}</div>
                                        
                                        {prod.imagen ? (
                                            <img src={prod.imagen} alt={prod.nombre} className="prod-img" />
                                        ) : (
                                            <div className="abstract-cover">
                                                <div className="cover-icon">🎮</div>
                                            </div>
                                        )}

                                        <button 
                                            className={`fav-toggle-btn ${favoritosIds.has(prod.id) ? 'active' : ''}`}
                                            onClick={(e) => toggleFavorite(e, prod.id)}
                                            type="button"
                                            title="Alternar Favorito"
                                        >
                                            <Heart size={16} fill={favoritosIds.has(prod.id) ? "currentColor" : "none"} />
                                        </button>

                                        <button
                                            className={`quick-add-btn ${prod.stock === 0 ? 'disabled' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if(prod.stock > 0) agregarAlCarrito(prod);
                                            }}
                                            disabled={prod.stock === 0}
                                        >
                                            {prod.stock === 0 ? 'AGOTADO' : 'AGREGAR AL CARRITO'}
                                        </button>
                                    </div>
                                    
                                    <div className="card-info" onClick={() => navigate(`/productos/${prod.slug || prod.id}`)}>
                                        <h3 className="prod-title" title={prod.nombre}>{prod.nombre}</h3>
                                        <div className="prod-meta">
                                            <span className="prod-price">${parseFloat(prod.precio).toFixed(2)}</span>
                                            <span className={`prod-stock ${prod.stock === 0 ? 'out' : ''}`}>
                                                {prod.stock === 0 ? 'Sin stock' : `Stock: ${prod.stock}`}
                                            </span>
                                        </div>
                                        <div className="details-link-wrapper mt-2">
                                            <span className="details-link">
                                                Ver Detalles <ChevronRight size={14}/>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fav-toggle-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.6);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.3s;
                    pointer-events: auto;
                }
                .fav-toggle-btn:hover {
                    transform: scale(1.1);
                    background: rgba(168, 85, 247, 0.3);
                    border-color: var(--gaming-purple);
                    box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
                }
                .fav-toggle-btn.active {
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.4);
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
                }
                .details-link-wrapper {
                    border-top: 1px solid rgba(255,255,255,0.05);
                    padding-top: 10px;
                }
            `}} />
        </div>
    );
};
