import { ShoppingCart, Zap, Star } from "lucide-react";

export const CardProduct = ({ product }) => {
    const originalPrice = parseFloat(product.precio);
    const salePrice = product.precio_oferta ? parseFloat(product.precio_oferta) : null;
    const isOffer = salePrice !== null && salePrice < originalPrice;

    return (
        <div className="product-card-neon glass-panel">
            <div className="card-image-box">
                <div className="card-tag">{product.categoria || "GAMER"}</div>
                {isOffer && <div className="sale-badge-neon">OFERTA</div>}
                <img src={product.imagen || "https://via.placeholder.com/300x400?text=NO+IMAGE"} alt={product.nombre} className="card-img" />
                <div className="card-overlay-actions">
                    <button className="btn-quick-add" title="Añadir al carrito">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
            
            <div className="card-body">
                <h3 className="card-title tech-font">{product.nombre}</h3>
                <div className="price-container">
                    {isOffer ? (
                        <>
                            <span className="price-sale text-gradient-green">${salePrice.toFixed(2)}</span>
                            <span className="price-original text-muted">${originalPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="price-normal text-gradient-green">${originalPrice.toFixed(2)}</span>
                    )}
                </div>
                
                {product.stock <= 5 && product.stock > 0 && (
                    <div className="stock-warning">¡ÚLTIMAS {product.stock} UNIDADES!</div>
                )}
                {product.stock === 0 && (
                    <div className="stock-out">AGOTADO</div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .product-card-neon { position: relative; border-radius: 12px; overflow: hidden; transition: all 0.3s; border: 1px solid rgba(168, 85, 247, 0.2); }
                .product-card-neon:hover { transform: translateY(-5px); border-color: var(--gaming-purple); box-shadow: 0 5px 15px rgba(168, 85, 247, 0.2); }
                .card-image-box { position: relative; height: 200px; overflow: hidden; background: #000; }
                .card-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
                .product-card-neon:hover .card-img { transform: scale(1.1); filter: brightness(0.7); }
                .card-tag { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: var(--gaming-purple); font-size: 0.6rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; border: 1px solid var(--gaming-purple); z-index: 2; }
                .sale-badge-neon { position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; font-size: 0.6rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; z-index: 2; box-shadow: 0 0 10px #ef4444; }
                .card-body { padding: 15px; }
                .card-title { font-size: 0.95rem; margin-bottom: 10px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .price-container { display: flex; align-items: baseline; gap: 10px; }
                .price-sale { font-size: 1.2rem; font-weight: 800; }
                .price-original { font-size: 0.8rem; text-decoration: line-through; opacity: 0.6; }
                .price-normal { font-size: 1.2rem; font-weight: 800; }
                .stock-warning { font-size: 0.65rem; color: #f59e0b; font-weight: 800; margin-top: 8px; }
                .stock-out { font-size: 0.65rem; color: #ef4444; font-weight: 800; margin-top: 8px; }
                .card-overlay-actions { position: absolute; bottom: -50px; left: 0; width: 100%; display: flex; justify-content: center; padding: 10px; transition: 0.3s; z-index: 3; }
                .product-card-neon:hover .card-overlay-actions { bottom: 0; }
                .btn-quick-add { background: var(--gaming-purple); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 0 15px var(--gaming-purple); }
            `}} />
        </div>
    );
}
       
