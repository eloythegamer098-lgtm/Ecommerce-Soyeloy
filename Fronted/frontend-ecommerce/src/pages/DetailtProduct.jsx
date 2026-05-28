import { useState,useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const DetalleProducto = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);

    const fetchProductos = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos/${id}`);
            if (response.ok) {
                console.log("Producto Encontrado");
                const data = await response.json();
                setProducto(data);


            } else {
                console.log("Producto No Encontrado");
            }


        } catch (error) {
            console.log("Error en el serivdor", error);
        }
    }

     useEffect(() => {
        fetchProductos();
    }, [id]);


    if(!producto) return <h2>Producto no encontrado</h2>
    return (
        <div style={{ textAlign: "center" }}>
            <h1>{producto.nombre}</h1>
            <p style={{ fontSize: 40, "color": "black" }}>${producto.precio}</p>
            <p>{producto.descripcion}</p>
            <p>Stock: {producto.stock}</p>
            <p>Categoria : {producto.categoria}</p>
            <Link to="/productos" style={{ color: "blue", fontSize: "18px" }}>
                <button style={{ padding: "10px 20px", marginTop: "20px" }}>
                    Volver a Productos</button>
            </Link>
        </div>
    )
}