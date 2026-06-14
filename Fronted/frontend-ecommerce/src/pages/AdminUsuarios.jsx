import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { 
    Users, Search, Shield, User, Trash2, ShieldAlert, 
    Calendar, Mail, UserCheck, RefreshCw, MoreVertical,
    ShieldCheck, UserMinus
} from "lucide-react";
import "../styles/Admin.css";

export const AdminUsuarios = () => {
    const { token, user: currentUser } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/usuarios/all`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data.usuarios);
            }
        } catch (error) {
            console.error("Error fetching usuarios:", error);
            setMensaje({ text: "ERROR DE CONEXIÓN CON EL SERVIDOR", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarRol = async (id, nuevoRol) => {
        const confirmMsg = nuevoRol === 'admin' 
            ? "⚠ ADVERTENCIA: ¿Otorgar PRIVILEGIOS DE ADMINISTRADOR a este usuario?" 
            : "¿Revocar privilegios de administrador y degradar a USUARIO ESTÁNDAR?";
        
        if (!window.confirm(confirmMsg)) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/usuarios/rol/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ rol: nuevoRol })
            });
            if (res.ok) {
                setMensaje({ text: "PRIVILEGIOS SINCRONIZADOS CORRECTAMENTE", type: "success" });
                fetchUsuarios();
                setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
            } else {
                const data = await res.json();
                setMensaje({ text: data.error || "FALLO EN EL PROTOCOLO", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "ERROR DE COMUNICACIÓN", type: "error" });
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("🚨 FATAL WARNING: ¿EXPULSAR permanentemente a este usuario de la red? Todos sus datos serán purgados.")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/usuarios/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setMensaje({ text: "USUARIO PURGADO DEL SISTEMA", type: "success" });
                fetchUsuarios();
                setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
            } else {
                const data = await res.json();
                setMensaje({ text: data.error || "PURGA FALLIDA", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "FALLO DE CONEXIÓN", type: "error" });
        }
    };

    const usuariosFiltrados = usuarios.filter(u => 
        u.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
        u.email.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">GESTIÓN DE <span className="text-gradient-primary">OPERATIVOS</span></h1>
                <p>Centro de mando para el control de accesos, roles y seguridad de la red.</p>
            </header>

            {mensaje.text && (
                <div className={`admin-alert glass-panel ${mensaje.type}`}>
                    {mensaje.text}
                </div>
            )}

            <div className="admin-data-section glass-panel">
                <div className="ops-toolbar mb-4">
                    <div className="search-bar-wrapper">
                        <Search size={18} className="icon-search"/>
                        <input 
                            type="text" 
                            placeholder="Escanear base de datos por nombre o email..." 
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="cyber-input search-input"
                        />
                    </div>
                    <button className="btn-icon ml-auto" onClick={fetchUsuarios} title="Sincronizar">
                        <RefreshCw size={18}/>
                    </button>
                </div>

                {loading ? (
                    <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>
                ) : (
                    <div className="table-responsive">
                        <table className="cyber-table">
                            <thead>
                                <tr>
                                    <th>USUARIO / OPERATIVO</th>
                                    <th>EMAIL</th>
                                    <th>NIVEL DE ACCESO</th>
                                    <th>FECHA DE INGRESO</th>
                                    <th>PROTOCOLOS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.length > 0 ? (
                                    usuariosFiltrados.map(u => (
                                        <tr key={u.id} className={u.id === currentUser?.id ? 'current-user-row' : ''}>
                                            <td>
                                                <div className="u-info-cell">
                                                    <div className={`u-avatar-mini ${u.rol}`}>
                                                        {u.nombre[0].toUpperCase()}
                                                    </div>
                                                    <div className="u-meta">
                                                        <span className="u-name">{u.nombre}</span>
                                                        {u.id === currentUser?.id && <span className="u-self-tag">(TÚ)</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="email-cell">
                                                    <Mail size={14} className="text-muted mr-2"/>
                                                    <span>{u.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`role-shield ${u.rol}`}>
                                                    {u.rol === 'admin' ? <ShieldCheck size={14}/> : <User size={14}/>}
                                                    <span>{u.rol === 'admin' ? 'ADMINISTRADOR' : 'OPERARIO ESTÁNDAR'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    <Calendar size={14} className="text-muted mr-2"/>
                                                    <span>{new Date(u.creado_en).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    {u.id !== currentUser?.id ? (
                                                        <>
                                                            <button 
                                                                className={`btn-icon ${u.rol === 'admin' ? 'warning' : 'success'}`}
                                                                title={u.rol === 'admin' ? 'Revocar Admin' : 'Hacer Admin'}
                                                                onClick={() => handleCambiarRol(u.id, u.rol === 'admin' ? 'user' : 'admin')}
                                                            >
                                                                {u.rol === 'admin' ? <UserMinus size={16}/> : <Shield size={16}/>}
                                                            </button>
                                                            <button 
                                                                className="btn-icon delete" 
                                                                title="Expulsar de la red"
                                                                onClick={() => handleEliminar(u.id)}
                                                            >
                                                                <Trash2 size={16}/>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted" style={{fontSize: '0.7rem'}}>CONTROL MAESTRO</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No se encontraron usuarios que coincidan con el filtro.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
