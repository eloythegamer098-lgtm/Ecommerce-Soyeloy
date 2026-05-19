import {Outlet,Link} from "react-router-dom";

export const MainLayout = () => {
    return (
    <div>
        <nav style={{background :"blue",color:"white","padding":"10px",display:"flex"}}>
        <h2>E-Commerce</h2>
        <Link to="/" style={{color:"white",marginLeft:"20px"}}>Home</Link>
        <Link to="/contacto" style={{color:"white",marginLeft:"20px"}}>Contacto</Link>
        <Link to="/productos" style={{color:"white",marginLeft:"20px"}}>Productos</Link>
        </nav>
        <main>
            <Outlet />
        </main>
    </div>
    )
}