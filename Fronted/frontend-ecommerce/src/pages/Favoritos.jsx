import { useState, useEffect } from "react";
import api, { IMAGE_FALLBACK } from "../services/api";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, PackageOpen, ChevronRight } from "lucide-react";
import "../styles/Products.css";

export const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavoritos();
    }, []);

    const fetchFavoritos = async () => {
        try {
            const data = await api.get("/favoritos");
            setFavoritos(data);
        } catch (error) {
            console.error("Error fetching favoritos:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorito = async (id) => {
        try {
            await api.post("/favoritos/toggle", { producto_id: id });
            setFavoritos(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("Error removing favorito:", error);
        }
    };

    if (loading) {
        return (
            <div className="cyber-spinner-container py-5">
                <div className="cyber-spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header className="admin-header mb-5">
                <h1 className="admin-title">LISTA DE <span className="text-gradient-primary">DESEOS</span></h1>
                <p className="text-muted">Tus activos digitales reservados para futuras misiones.</p>
            </header>

            {favoritos.length === 0 ? (
                <div className="empty-state glass-panel py-5 text-center">
                    <Heart size={64} className="mx-auto mb-4 opacity-20 text-primary"/>
                    <h3 className="text-white tech-font">SIN ACTIVOS EN MEMORIA</h3>
                    <p className="text-muted">Explora el catálogo para añadir tus productos favoritos.</p>
                    <Link to="/productos" className="btn-gaming-primary mt-4">
                        VER CATÁLOGO
                    </Link>
                </div>
            ) : (
                <div className="fav-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {favoritos.map(prod => (
                        <div key={prod.id} className="fav-card glass-panel p-3">
                            <div className="fav-media mb-3" style={{ position: 'relative', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
                                <img 
                                    src={prod.imagen || IMAGE_FALLBACK} 
                                    alt={prod.nombre} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => e.target.src = IMAGE_FALLBACK}
                                />
                                <div className="fav-category" style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--gaming-purple)', fontSize: '0.6rem', padding: '4px 10px', borderRadius: '4px', fontWeight: '800' }}>
                                    {prod.categoria}
                                </div>
                                <button 
                                    className="remove-btn" 
                                    onClick={() => removeFavorito(prod.id)}
                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                            
                            <div className="fav-info">
                                <h4 className="m-0 text-white fw-bold">{prod.nombre}</h4>
                                <div className="price-row flex-between mt-2">
                                    <span className="text-gradient-green fw-bold">${parseFloat(prod.precio).toFixed(2)}</span>
                                    <div className="fav-actions flex-center gap-2">
                                        <Link to={`/detalle/${prod.id}`} className="btn-icon-sm" title="Ver Detalle">
                                            <ChevronRight size={16}/>
                                        </Link>
                                        <button className="btn-gaming-primary btn-sm" style={{ padding: '5px 15px' }}>
                                            <ShoppingCart size={14}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
