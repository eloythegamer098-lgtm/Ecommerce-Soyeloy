import {Outlet,Link} from "react-router-dom";
import { ContextCart } from "../services/ContextCart";
import { useContext } from "react";

export const MainLayout = () => {
    const {carrito} = useContext(ContextCart);
    const cantidadItems = carrito.reduce((acc,item) => acc + item.cantidad,0)

    return (
    <div>
        <nav style={{background :"blue",color:"white","padding":"10px",display:"flex"}}>
        <h2>E-Commerce</h2>
        <Link to="/" style={{color:"white",marginLeft:"20px"}}>Home</Link>
        <Link to="/contacto" style={{color:"white",marginLeft:"20px"}}>Contacto</Link>
        <Link to="/productos" style={{color:"white",marginLeft:"20px"}}>Productos</Link>
        <Link to="/categorias" style={{color:"white",marginLeft:"20px"}}>Categorias</Link>
        <Link to="/adminProductos" style={{color:"white",marginLeft:"20px"}}>Crud Productos</Link>
        <Link to="/chatbot" style={{color:"white",marginLeft:"20px"}}>Bot</Link>
        <Link to="/carrito" style={{color:"white",marginLeft:"20px"}}>Carrito({cantidadItems})
        </Link>

        </nav>
        <main>
            <Outlet />
        </main>
    </div>
    )
}