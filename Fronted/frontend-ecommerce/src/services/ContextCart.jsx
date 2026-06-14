import { createContext, useState, useMemo } from "react";

export const ContextCart = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    // Agregar producto o aumentar cantidad si ya existe
    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            // BUG FIX: Comparar contra producto.id, no producto_id (que no existía)
            const existe = prev.find((item) => item.producto_id === producto.id);
            
            if (existe) {
                return prev.map((item) =>
                    item.producto_id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            
            // Si es nuevo, añadir objeto estructurado
            return [
                ...prev,
                {
                    producto_id: producto.id,
                    nombre: producto.nombre,
                    precio: parseFloat(producto.precio),
                    cantidad: 1,
                    imagen: producto.imagen 
                },
            ];
        });
    };

    // Eliminar un producto completo
    const eliminarDelCarrito = (producto_id) => {
        setCarrito((prev) => prev.filter((item) => item.producto_id !== producto_id));
    };

    // Vaciar todo el carrito
    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // Cálculos derivados memoizados para rendimiento
    const totalItems = useMemo(() => 
        carrito.reduce((acc, item) => acc + item.cantidad, 0), 
    [carrito]);

    const totalPrecio = useMemo(() => 
        carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0), 
    [carrito]);

    return (
        <ContextCart.Provider value={{ 
            carrito, 
            agregarAlCarrito, 
            eliminarDelCarrito, 
            vaciarCarrito,
            totalItems,
            totalPrecio
        }}>
            {children}
        </ContextCart.Provider>
    );
};
