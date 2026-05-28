import { Link } from "react-router-dom";


export const Home = () => {
    return (
        <div style={{textAlign:"center"}}>
            <h1>Bienvenido a Mi Ecommerce</h1>
            <p>Explora nuestra amplia gama de productos y encuentra lo que necesitas.</p>
            <Link to="/productos" style={{color:"blue",fontSize:"18px"}}>Ver Productos</Link>
            <br />
            <Link to="/mispedidos" style={{color:"purple",fontSize:"18px"}}>Ver Mis Pedidos</Link>
        </div>
    )
}