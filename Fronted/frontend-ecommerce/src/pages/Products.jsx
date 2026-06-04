import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ContextCart } from "../services/ContextCart.jsx";
import "../styles/Products.css";

export const Productos = () => {
    const [buscar, setBuscar] = useState("");
    const [productos, setProductos] = useState([]);
    const {agregarAlCarrito} = useContext(ContextCart);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos`);
                const data = await response.json();
                setProductos(data.productos);
                console.log("Productos obtenidos:", data.productos);
            } catch (error) {
                console.error("Error fetching productos:", error);
            }
        };

        fetchProductos();
    }, []);

    const productosFiltrados = productos.filter((prod) =>
        prod.nombre.toLowerCase().includes(buscar.toLowerCase())
    );

    return (
        <div className="products-container">
            <header className="products-header">
                <h1 className="products-title">Explorar Productos</h1>
                <div className="search-wrapper">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="¿Qué quieres escuchar... digo, comprar?"
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            <div className="products-grid">
                {productosFiltrados.map((prod) => (
                    <div 
                        key={prod.id} 
                        className="product-card"
                        onClick={() => navigate(`/productos/${prod.id}`)}
                    >
                        <div className="product-image-placeholder">
                            <svg className="product-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            
                            <button
                                className="add-to-cart-fab"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    agregarAlCarrito(prod);
                                }}
                                disabled={prod.stock === 0}
                                title={prod.stock === 0 ? "Agotado" : "Añadir al carrito"}
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="product-category">{prod.categoria}</div>
                        <div className="product-name" title={prod.nombre}>{prod.nombre}</div>
                        <div className="product-description">{prod.descripcion}</div>
                        
                        <div className="product-footer">
                            <div className="product-price">${prod.precio}</div>
                            <div className={`product-stock ${prod.stock === 0 ? 'out-of-stock' : ''}`}>
                                {prod.stock === 0 ? 'Agotado' : `${prod.stock} disp.`}
                            </div>
                        </div>

                        <Link to={`/productos/${prod.id}`} className="details-link" onClick={(e) => e.stopPropagation()}>
                            <button className="btn-details">
                                Ver Detalles
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}