import { useParams,Link } from "react-router-dom";

const productos = [
    {id: 1, name: 'Producto 1', price: 10.99, image: 'https://placehold.net/1.png' , onSale: true, outOfStock: false},
    {id: 2, name: 'Producto 2', price: 19.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: true},
    {id: 3, name: 'Producto 3', price: 5.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: false},
    {id: 4, name: 'Producto 4', price: 15.99, image: 'https://placehold.net/1.png', onSale: true, outOfStock: true},
    {id: 5, name: 'Producto 5', price: 8.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: false},
  ];

  export const DetalleProducto = () => {
    const { id } = useParams();

    const productoEncontrado = productos.find((prod) => prod.id === parseInt(id));

    if (!productoEncontrado) {
        return <div style={{textAlign:"center"}}><h2>Producto no encontrado</h2></div>;
    }

    return (
        <div style={{textAlign:"center"}}>
            <h1>{productoEncontrado.name}</h1>
            <img style={{ width: "300px", height: "auto" }} src={productoEncontrado.image} alt={productoEncontrado.name} />
            <p style={{fontSize : 40,"color":"black"}}>${productoEncontrado.price.toFixed(2)}</p>   
            <Link to="/productos" style={{color:"blue",fontSize:"18px"}}>
            <button style={{padding:"10px 20px",marginTop:"20px"}}>
            Volver a Productos</button>
            </Link>
        </div>
    )
}