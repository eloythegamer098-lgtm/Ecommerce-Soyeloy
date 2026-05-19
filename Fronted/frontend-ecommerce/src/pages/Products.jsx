import { Link } from "react-router-dom";
import { CardProduct } from "../components/CardProduct";
import { useState } from "react";
const productos = [
    { id: 1, name: 'Producto 1', price: 10.99, image: 'https://placehold.net/1.png', onSale: true, outOfStock: false },
    { id: 2, name: 'Producto 2', price: 19.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: true },
    { id: 3, name: 'Producto 3', price: 5.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: false },
    { id: 4, name: 'Producto 4', price: 15.99, image: 'https://placehold.net/1.png', onSale: true, outOfStock: true },
    { id: 5, name: 'Producto 5', price: 8.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: false },
];

export const Productos = () => {
    const[buscar,setBuscar] = useState("");

     const productosFiltrados = productos.filter((prod) =>
        prod.name.toLowerCase().includes(buscar.toLowerCase())
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
                        <CardProduct product={prod} />
                        <Link to={`/productos/${prod.id}`} style={{ color: "blue", fontSize: "18px" }}>
                            <button style={{ padding: "10px 20px", marginTop: "20px" }}>
                                Ver Detalles</button>

                        </Link>
                    </div>

                ))}
            </div>


        </div>

    )
}