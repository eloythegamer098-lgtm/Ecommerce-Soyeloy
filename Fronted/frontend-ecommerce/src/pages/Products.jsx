import { Link } from "react-router-dom";
import { CardProduct } from "../components/CardProduct.jsx";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { ContextCart } from "../services/ContextCart.jsx";

export const Productos = () => {
    const [buscar, setBuscar] = useState("");
    const [productos, setProductos] = useState([]);
    const {agregarAlCarrito} = useContext(ContextCart);

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
        <div style={{ textAlign: "center" }}>
            <h1>Productos</h1>
            <input
                type="text"
                placeholder="Filtrar productos..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                {productosFiltrados.map((prod) => (
                    <div key={prod.id} style={{ width: "200px" }}>

                        <div>
                            <h3>{prod.categoria}</h3>
                            <h3>{prod.nombre}</h3>
                            <h3>{prod.stock}</h3>
                            <p>${prod.precio}</p>
                            <p style={{ fontSize: 12, color: "gray" }}>{prod.descripcion}</p>
                            <button
                            onClick={() => agregarAlCarrito(prod)}
                            disabled={prod.stock === 0}

                            >
                                {prod.stock===0 ? "Agotado": "Agregar al Carrito"}
                                
                            </button>
                            <Link to={`/productos/${prod.id}`}>
                            <button>
                                Ver Detalles
                            </button>
                            </Link>
                        </div>


                    </div>
                ))}



            </div>

        </div>
    );
}