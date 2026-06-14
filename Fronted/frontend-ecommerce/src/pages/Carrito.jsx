import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ContextCart } from "../services/ContextCart.jsx";
import "../styles/Cart.css"; // Create this file next

export const Carrito = () => {
    const {carrito, eliminarDelCarrito, vaciarCarrito} = useContext(ContextCart);
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Estados para cupones
    const [cuponCodigo, setCuponCodigo] = useState("");
    const [cuponAplicado, setCuponAplicado] = useState(null);
    const [validandoCupon, setValidandoCupon] = useState(false);

    const subtotal = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * parseInt(item.cantidad)), 0);
    
    let descuento = 0;
    if (cuponAplicado) {
        if (cuponAplicado.tipo === 'porcentaje') {
            descuento = (subtotal * cuponAplicado.valor) / 100;
        } else {
            descuento = cuponAplicado.valor;
        }
        descuento = Math.min(descuento, subtotal);
    }

    const total = subtotal - descuento;

    const handleValidarCupon = async () => {
        if (!cuponCodigo) return;
        setValidandoCupon(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/cupones/validar/${cuponCodigo}`, {
                headers: { "Authorization" : `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                setCuponAplicado(data.cupon);
                setMensaje({ text: "CUPÓN APLICADO CON ÉXITO", type: "success" });
            } else {
                setCuponAplicado(null);
                setMensaje({ text: data.error || "CUPÓN INVÁLIDO", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "ERROR AL VALIDAR CUPÓN", type: "error" });
        } finally {
            setValidandoCupon(false);
        }
    };

    const handleRealizarPedido = async () => {
        const token = localStorage.getItem("token");

        if(!token){
            setMensaje({ text: "ACCESO DENEGADO: INICIA SESIÓN PARA COMPRAR", type: "error" });
            return;
        }

        setIsProcessing(true);
        setMensaje({ text: "", type: "" });

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/realizarPedido`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    carrito,
                    cupon_id: cuponAplicado ? cuponAplicado.id : null 
                })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Error de sincronización con servidor central`);
            } 

            const data = await res.json();
            setMensaje({ text: "TRANSACCIÓN COMPLETADA. CÓDIGOS ENVIADOS.", type: "success" });
            
            setTimeout(() => {
                vaciarCarrito();
            }, 2000);

        } catch (error) {
            setMensaje({ text: "ERROR EN LA TRANSACCIÓN: " + error.message, type: "error" });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="cart-container">
            <header className="cart-header">
                <h1 className="cart-title">CARRITO DE <span className="text-gradient-primary">COMPRAS</span></h1>
                <p>Confirma tus juegos y códigos antes de la transmisión.</p>
            </header>

            {mensaje.text && (
                <div className={`cart-alert glass-panel ${mensaje.type}`}>
                    <span className="alert-icon">{mensaje.type === 'error' ? '⚠' : '✓'}</span>
                    {mensaje.text}
                </div>
            )}

            {carrito.length === 0 ? (
                <div className="empty-cart glass-panel">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>INVENTARIO VACÍO</h2>
                    <p>No tienes elementos preparados para la compra.</p>
                    <Link to="/productos" className="btn-gaming-primary" style={{marginTop: "20px"}}>
                        <span className="btn-text">EXPLORAR TIENDA</span>
                        <div className="btn-glow"></div>
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {carrito.map((item) => (
                            <div key={item.producto_id} className="cart-item glass-panel">
                                <div className="item-visual">
                                    🎮
                                </div>
                                <div className="item-details">
                                    <h3>{item.nombre}</h3>
                                    <p className="item-cat">Digital Code</p>
                                </div>
                                <div className="item-price">
                                    <div className="price-calc">
                                        ${parseFloat(item.precio).toFixed(2)} x {item.cantidad}
                                    </div>
                                    <div className="price-total">
                                        ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                                    </div>
                                </div>
                                <button 
                                    className="btn-remove"
                                    onClick={() => eliminarDelCarrito(item.producto_id)}
                                    title="Remover del carrito"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary glass-panel">
                        <h3>RESUMEN DE TRANSACCIÓN</h3>
                        
                        {/* Sección de Cupón */}
                        <div className="coupon-section mb-4 mt-3">
                            <label className="text-muted d-block mb-2" style={{fontSize: '0.7rem'}}>¿TIENES UN CÓDIGO DE DESCUENTO?</label>
                            <div className="flex-center gap-2">
                                <input 
                                    type="text" 
                                    className="cyber-input py-2" 
                                    placeholder="CÓDIGO" 
                                    value={cuponCodigo}
                                    onChange={(e) => setCuponCodigo(e.target.value.toUpperCase())}
                                    style={{flex: 1}}
                                />
                                <button 
                                    className="btn-gaming-secondary py-2 px-3" 
                                    onClick={handleValidarCupon}
                                    disabled={validandoCupon}
                                    style={{fontSize: '0.7rem'}}
                                >
                                    {validandoCupon ? '...' : 'APLICAR'}
                                </button>
                            </div>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {descuento > 0 && (
                            <div className="summary-row text-gradient-green">
                                <span>Descuento ({cuponAplicado?.codigo}):</span>
                                <span>-${descuento.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row">
                            <span>Impuestos digitales:</span>
                            <span>$0.00</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>TOTAL A PAGAR:</span>
                            <span className="total-amount">${total.toFixed(2)}</span>
                        </div>

                        <button
                            className={`btn-gaming-primary full-width ${isProcessing ? 'loading' : ''}`}
                            onClick={handleRealizarPedido}
                            disabled={isProcessing}
                        >
                            <span className="btn-text">
                                {isProcessing ? 'PROCESANDO...' : 'FINALIZAR COMPRA'}
                            </span>
                            <div className="btn-glow"></div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}