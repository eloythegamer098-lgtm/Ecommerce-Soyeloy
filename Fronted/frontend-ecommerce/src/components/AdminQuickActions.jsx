import { PlusCircle, ShoppingCart, Users, Eye, Package, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminQuickActions = () => {
    return (
        <div className="admin-data-section glass-panel actions-panel">
            <div className="section-header">
                <h3>ACCIONES RÁPIDAS</h3>
            </div>
            
            <div className="quick-actions-grid">
                <Link to="/adminProductos" className="quick-action-btn">
                    <PlusCircle size={20}/>
                    <span>NUEVO PRODUCTO</span>
                </Link>
                <Link to="/adminProductos" className="quick-action-btn">
                    <Package size={20}/>
                    <span>GESTIONAR STOCK</span>
                </Link>
                <Link to="/admin/pedidos" className="quick-action-btn">
                    <ShoppingCart size={20}/>
                    <span>VER PEDIDOS</span>
                </Link>
                <Link to="/admin/usuarios" className="quick-action-btn">
                    <Users size={20}/>
                    <span>USUARIOS</span>
                </Link>
                <Link to="/admin/categorias" className="quick-action-btn">
                    <LayoutDashboard size={20}/>
                    <span>CATEGORÍAS</span>
                </Link>
                <Link to="/home" className="quick-action-btn client-mode">
                    <Eye size={20}/>
                    <span>VISTA CLIENTE</span>
                </Link>
            </div>
        </div>
    );
};
