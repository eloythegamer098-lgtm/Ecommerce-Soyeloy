import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api, { IMAGE_FALLBACK } from "../services/api";
import { ContextCart } from "../services/ContextCart";
import {
    ShoppingCart,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Info,
    Star,
    Package,
    Share2,
    Heart,
    MessageSquare,
    User,
    Calendar
} from "lucide-react";
import "../styles/Products.css";

export const DetalleProducto = () => {
    const { id } = useParams(); // 'id' puede ser el ID numérico o el SLUG
    const navigate = useNavigate();
    const { agregarAlCarrito } = useContext(ContextCart);

    const [producto, setProducto] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [copiado, setCopiado] = useState(false);

    // Estados para Valoraciones
    const [valoraciones, setValoraciones] = useState([]);
    const [stats, setStats] = useState({ promedio: 0, total: 0 });
    const [miRating, setMiRating] = useState({ estrellas: 5, comentario: "" });
    const [enviandoVal, setEnviandoVal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // El backend ahora soporta buscar por slug o ID en la misma ruta
                const productData = await api.get(`/productos/${id}`);
                const productoEncontrado = productData?.producto || productData?.data || productData;
                
                if (!productoEncontrado) throw new Error("Producto no encontrado");

                const prodId = productoEncontrado.id;

                // Cargar el resto usando el ID real
                const [favData, relatedData, valData, myVal] = await Promise.all([
                    api.get(`/favoritos/check/${prodId}`).catch(() => ({ isFavorite: false })),
                    api.get(`/productos/relacionados/${prodId}`).catch(() => []),
                    api.get(`/valoraciones/producto/${prodId}`),
                    api.get(`/valoraciones/mi-valoracion/${prodId}`).catch(() => null)
                ]);

                setProducto(productoEncontrado);
                setIsFavorite(favData.isFavorite);
                setRelacionados(relatedData || []);
                setValoraciones(valData.valoraciones || []);
                setStats(valData.stats || { promedio: 0, total: 0 });
                
                if (myVal) {
                    setMiRating({ estrellas: myVal.estrellas, comentario: myVal.comentario || "" });
                }
            } catch (err) {
                console.error("Error cargando datos:", err);
                setError("El activo digital no pudo ser localizado.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleToggleFavorite = async () => {
        try {
            const res = await api.post('/favoritos/toggle', { producto_id: producto.id });
            setIsFavorite(res.isFavorite);
        } catch (err) {
            console.error("Error toggle favorite:", err);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: `NEON STORE - ${producto.nombre}`, url: window.location.href });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
            }
        } catch (err) { console.error(err); }
    };

    const handleSubmitValoracion = async (e) => {
        e.preventDefault();
        setEnviandoVal(true);
        try {
            await api.post('/valoraciones/guardar', {
                producto_id: producto.id,
                estrellas: miRating.estrellas,
                comentario: miRating.comentario
            });
            // Recargar valoraciones
            const valData = await api.get(`/valoraciones/producto/${producto.id}`);
            setValoraciones(valData.valoraciones);
            setStats(valData.stats);
            alert("SISTEMA: Valoración sincronizada con éxito.");
        } catch (err) {
            alert("Error: Inicia sesión para valorar.");
        } finally {
            setEnviandoVal(false);
        }
    };

    if (loading) return <div className="cyber-spinner-container py-5"><div className="cyber-spinner"></div></div>;
    if (error || !producto) return <div className="admin-container text-center py-5"><h2>ERROR</h2><Link to="/productos">VOLVER</Link></div>;

    const precio = Number(producto.precio || 0);
    const stock = Number(producto.stock || 0);

    return (
        <div className="admin-container product-detail-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
            <Helmet>
                <title>{`${producto.nombre} | Neon Store 🚀`}</title>
                <meta name="description" content={producto.descripcion?.substring(0, 160)} />
                <meta property="og:title" content={producto.nombre} />
                <meta property="og:description" content={producto.descripcion?.substring(0, 160)} />
                <meta property="og:image" content={producto.imagen} />
                <meta property="og:type" content="product" />
            </Helmet>
            <header className="detail-header mb-4">
                <button onClick={() => navigate(-1)} className="btn-icon-text text-muted mb-3" type="button">
                    <ArrowLeft size={18} /> <span>REGRESAR</span>
                </button>
            </header>

            <div className="detail-grid">
                <div className="detail-media glass-panel">
                    <div className="main-image-container">
                        <div className="category-overlay-tag">{producto.categoria || "DIGITAL"}</div>
                        <img src={producto.imagen || IMAGE_FALLBACK} alt={producto.nombre} onError={(e) => e.currentTarget.src = IMAGE_FALLBACK} className="detail-img" />
                    </div>
                </div>

                <div className="detail-info">
                    <div className="info-header mb-4">
                        <div className="id-badge mb-2">#SKU-00{producto.id}</div>
                        <h1 className="detail-title tech-font text-white">{producto.nombre}</h1>
                        <div className="rating-summary flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                            <div className="stars flex-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.round(stats.promedio) ? "#f59e0b" : "none"} color="#f59e0b" />
                                ))}
                            </div>
                            <span className="text-white fw-bold">{Number(stats.promedio || 0).toFixed(1)}</span>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>({stats.total} opiniones)</span>
                        </div>
                    </div>

                    <div className="price-section glass-panel p-4 mb-4">
                        <div className="flex-between align-items-end">
                            <div>
                                <span className="text-muted d-block" style={{ fontSize: "0.7rem" }}>VALOR DE MERCADO</span>
                                {producto.precio_oferta ? (
                                    <div className="flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
                                        <span className="detail-price text-gradient-green">${parseFloat(producto.precio_oferta).toFixed(2)}</span>
                                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '1.2rem' }}>${precio.toFixed(2)}</span>
                                    </div>
                                ) : (
                                    <span className="detail-price text-gradient-green">${precio.toFixed(2)}</span>
                                )}
                            </div>
                            <div className={`stock-status-tag ${stock > 0 ? "in" : "out"}`}>
                                <Package size={14} /> <span>{stock > 0 ? `${stock} UNIDADES` : "AGOTADO"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="description-section mb-4">
                        <h4 className="tech-font text-primary mb-2 flex-center gap-2" style={{ justifyContent: "flex-start" }}>
                            <Info size={16} /> ESPECIFICACIONES
                        </h4>
                        <p className="text-muted">{producto.descripcion || "Sin descripción disponible."}</p>
                    </div>

                    <div className="detail-actions">
                        <button className={`btn-gaming-primary w-100 py-3 ${stock === 0 ? "disabled" : ""}`} onClick={() => agregarAlCarrito(producto)} disabled={stock === 0}>
                            <ShoppingCart size={20} className="mr-2" /> INYECTAR AL CARRITO
                        </button>

                        <div className="secondary-actions mt-3">
                            <button className={`btn-icon-text flex-1 ${isFavorite ? 'active-fav' : ''}`} onClick={handleToggleFavorite}>
                                <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "currentColor"} />
                                <span>{isFavorite ? 'EN FAVORITOS' : 'FAVORITOS'}</span>
                            </button>
                            <button className={`btn-icon-text flex-1 ${copiado ? 'active-share' : ''}`} onClick={handleShare}>
                                <Share2 size={18} color={copiado ? "#22c55e" : "currentColor"} />
                                <span>{copiado ? 'COPIADO' : 'COMPARTIR'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Valoraciones Section */}
            <div className="reviews-section mt-5 grid-2">
                <div className="leave-review glass-panel p-4">
                    <h3 className="tech-font text-white mb-4 flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                        <MessageSquare size={20} className="text-primary"/> VALORAR ASSET
                    </h3>
                    <form onSubmit={handleSubmitValoracion}>
                        <div className="star-selector mb-3 flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <Star 
                                    key={num} 
                                    size={24} 
                                    style={{ cursor: 'pointer' }}
                                    fill={num <= miRating.estrellas ? "#f59e0b" : "none"} 
                                    color="#f59e0b"
                                    onClick={() => setMiRating({ ...miRating, estrellas: num })}
                                />
                            ))}
                        </div>
                        <textarea 
                            className="cyber-input w-100" 
                            rows="4" 
                            placeholder="Comparte tu experiencia con este activo..."
                            value={miRating.comentario}
                            onChange={(e) => setMiRating({ ...miRating, comentario: e.target.value })}
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                        ></textarea>
                        <button type="submit" className="btn-gaming-primary w-100 mt-3" disabled={enviandoVal}>
                            {enviandoVal ? 'SINCRONIZANDO...' : 'PUBLICAR OPINIÓN'}
                        </button>
                    </form>
                </div>

                <div className="reviews-list glass-panel p-4">
                    <h3 className="tech-font text-white mb-4">REPORTE DE USUARIOS</h3>
                    {valoraciones.length === 0 ? (
                        <p className="text-muted text-center py-5">Sin transmisiones de opinión detectadas.</p>
                    ) : (
                        <div className="rev-scroll" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {valoraciones.map(v => (
                                <div key={v.id} className="review-item mb-4 pb-3 border-bottom" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                                    <div className="flex-between mb-2">
                                        <div className="u-meta-small flex-center gap-2">
                                            <div className="u-avatar-mini" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>{v.usuario_nombre[0]}</div>
                                            <div className="flex-column">
                                                <span className="text-white fw-bold" style={{ fontSize: '0.8rem' }}>{v.usuario_nombre}</span>
                                                {v.compra_verificada ? (
                                                    <span className="verified-badge"><ShieldCheck size={10}/> COMPRA VERIFICADA</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="stars-mini flex-center gap-1">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < v.estrellas ? "#f59e0b" : "none"} color="#f59e0b" />)}
                                        </div>
                                    </div>
                                    <p className="text-muted m-0" style={{ fontSize: '0.85rem' }}>{v.comentario}</p>
                                    <span className="text-muted d-block mt-2" style={{ fontSize: '0.65rem' }}>
                                        <Calendar size={10} className="mr-1"/> {new Date(v.creado_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products Section */}
            {relacionados.length > 0 && (
                <section className="related-section mt-5 pt-5 border-top" style={{ borderTopColor: 'rgba(255,255,255,0.05)' }}>
                    <h3 className="tech-font text-white mb-4 flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                        <Zap size={20} className="text-primary"/> ASSETS RELACIONADOS
                    </h3>
                    <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {relacionados.map(rel => (
                            <div key={rel.id} className="rel-card glass-panel p-3" onClick={() => { navigate(`/productos/${rel.id}`); window.scrollTo(0,0); }} style={{ cursor: 'pointer' }}>
                                <div className="rel-img-box mb-3" style={{ height: '150px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={rel.imagen || IMAGE_FALLBACK} alt={rel.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h4 className="m-0 text-white" style={{ fontSize: '0.9rem' }}>{rel.nombre}</h4>
                                <span className="text-gradient-green fw-bold">${parseFloat(rel.precio).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .grid-2 { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; }
                .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
                .detail-media { border-radius: 16px; overflow: hidden; background: rgba(0,0,0,0.4); }
                .main-image-container { position: relative; aspect-ratio: 4/5; display: flex; align-items: center; justify-content: center; }
                .detail-img { max-width: 100%; max-height: 100%; object-fit: cover; }
                .category-overlay-tag { position: absolute; top: 20px; left: 20px; background: var(--gaming-purple); color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; z-index: 2; }
                .detail-price { font-size: 3rem; font-weight: 800; font-family: var(--font-gaming); }
                .stock-status-tag { display: flex; align-items: center; gap: 8px; padding: 8px 15px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 0.8rem; font-weight: 800; }
                .stock-status-tag.in { color: var(--gaming-green); border: 1px solid rgba(34, 197, 94, 0.2); }
                .stock-status-tag.out { color: var(--gaming-danger); border: 1px solid rgba(239, 68, 68, 0.2); }
                .secondary-actions { display: flex; gap: 15px; }
                .btn-icon-text { background: rgba(255,255,255,0.05); border: 1px solid var(--gaming-border); color: white; padding: 12px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.3s; font-size: 0.8rem; font-weight: 700; flex: 1; }
                .btn-icon-text:hover { background: rgba(255,255,255,0.1); border-color: white; }
                .verified-badge { color: #22c55e; font-size: 0.6rem; font-weight: 800; display: flex; align-items: center; gap: 4px; letter-spacing: 0.5px; margin-top: 2px; }
                .active-fav { border-color: #ef4444 !important; color: #ef4444 !important; background: rgba(239, 68, 68, 0.05) !important; }
                .active-share { border-color: #22c55e !important; color: #22c55e !important; background: rgba(34, 197, 94, 0.05) !important; }
                .rel-card { transition: all 0.3s; }
                .rel-card:hover { transform: translateY(-5px); border-color: var(--gaming-purple); }
                .rev-scroll::-webkit-scrollbar { width: 5px; }
                .rev-scroll::-webkit-scrollbar-track { background: transparent; }
                .rev-scroll::-webkit-scrollbar-thumb { background: var(--gaming-purple); border-radius: 10px; }
                @media (max-width: 900px) { .detail-grid, .grid-2 { grid-template-columns: 1fr; gap: 2rem; } }
            `}} />
        </div>
    );
};
