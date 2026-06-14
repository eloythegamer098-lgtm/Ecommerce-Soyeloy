import { useState, useEffect } from "react";
import "../styles/Admin.css"; // We will use a shared Admin CSS for Categorias and AdminProductos

export const Categorias = () => {
    const [categorias, setCategoria] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    const [isLoading, setIsLoading] = useState(true);

    const obtenerCategorias = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/obtenerCategorias`);
            const data = await res.json();
            if (res.ok) {
                setCategoria(data.categorias);
            } else {
                console.error("Error al cargar categorias", data.error);
            }
        } catch (error) {
            console.log("Error en el servidor", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        setMensaje({text: "", type: ""});
        
        if(!nuevaCategoria.trim()) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/crearCategoria`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ nombre: nuevaCategoria })
            });
            const data = await res.json();
            if (res.ok) {
                setMensaje({ text: "Categoría agregada a la base de datos.", type: "success" });
                setNuevaCategoria("");
                obtenerCategorias();
            } else {
                setMensaje({ text: data.error || "Error al crear", type: "error" });
            }
        } catch(error) {
            setMensaje({ text: "Error de conexión", type: "error" });
        }
    };

    const handleEliminar = async (id) => {
        if(!window.confirm("¿CONFIRMAR ELIMINACIÓN DE PROTOCOLO DE CATEGORÍA?")) return;
        setMensaje({text: "", type: ""});

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/eliminarCategoria/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setMensaje({ text: "Categoría purgada del sistema.", type: "success" });
                obtenerCategorias();
            } else {
                setMensaje({ text: data.error || "Error al eliminar", type: "error" });
            }
        } catch(error) {
            setMensaje({ text: "Error de conexión", type: "error" });
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">GESTIÓN DE <span className="text-gradient-purple">CATEGORÍAS</span></h1>
                <p>Administración de plataformas y ecosistemas de juego.</p>
            </header>

            {mensaje.text && (
                <div className={`admin-alert glass-panel ${mensaje.type}`}>
                    {mensaje.text}
                </div>
            )}

            <div className="admin-layout">
                <div className="admin-form-section glass-panel">
                    <h3>NUEVA CATEGORÍA</h3>
                    <form onSubmit={handleCrear} className="cyber-form">
                        <div className="input-field">
                            <input 
                                type="text"
                                value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                placeholder="Ej: PlayStation 5"
                                required
                            />
                            <div className="field-focus"></div>
                        </div>
                        <button type="submit" className="btn-gaming-primary" style={{marginTop: "15px", width: "100%"}}>
                            <span className="btn-text">REGISTRAR EN SISTEMA</span>
                            <div className="btn-glow"></div>
                        </button>
                    </form>
                </div>

                <div className="admin-data-section glass-panel">
                    <h3>CATEGORÍAS ACTIVAS ({categorias.length})</h3>
                    
                    {isLoading ? (
                        <div className="cyber-spinner" style={{margin: "40px auto"}}></div>
                    ) : (
                        <div className="category-grid">
                            {categorias.map((cat) => (
                                <div key={cat.id} className="category-tag-card">
                                    <div className="cat-name">{cat.nombre}</div>
                                    <button 
                                        className="btn-icon-delete"
                                        onClick={() => handleEliminar(cat.id)}
                                        title="Eliminar"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
