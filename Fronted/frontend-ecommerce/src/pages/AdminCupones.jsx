import { useState, useEffect } from "react";
import "../styles/Admin.css"; 
import { useAuth } from "../services/AuthContext";
import { PlusCircle, Ticket, Trash2, Calendar, Hash, Percent, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

export const AdminCupones = () => {
    const { token } = useAuth();
    const [cupones, setCupones] = useState([]);
    const [mensaje, setMensaje] = useState({ text: "", type: "" });
    const [isLoading, setIsLoading] = useState(true);

    const [form, setForm] = useState({
        codigo: "",
        tipo: "porcentaje",
        valor: "",
        expira_at: "",
        limite_uso: 100
    });

    useEffect(() => {
        listarCupones();
    }, []);

    const listarCupones = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/cupones/admin/listar`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCupones(data);
            }
        } catch (error) {
            console.error("Error fetching cupones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ text: "", type: "" });

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/cupones/admin/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (res.ok) {
                setMensaje({ text: "CUPÓN INYECTADO EN EL SISTEMA.", type: "success" });
                setForm({ codigo: "", tipo: "porcentaje", valor: "", expira_at: "", limite_uso: 100 });
                listarCupones();
            } else {
                setMensaje({ text: data.error || "ERROR EN LA CREACIÓN", type: "error" });
            }
        } catch (error) {
            setMensaje({ text: "FALLO DE CONEXIÓN.", type: "error" });
        }
    };

    const handleDesactivar = async (id) => {
        if(!window.confirm("¿Desactivar este protocolo de descuento?")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/cupones/admin/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setMensaje({ text: "CUPÓN DESACTIVADO.", type: "success" });
                listarCupones();
            }
        } catch (error) {
            setMensaje({ text: "ERROR AL PROCESAR.", type: "error" });
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">GEOFENCE DE <span className="text-gradient-primary">CUPONES</span></h1>
                <p className="admin-subtitle">Gestión de protocolos de descuento y promociones de red.</p>
            </header>

            {mensaje.text && (
                <div className={`admin-alert glass-panel ${mensaje.type}`}>
                    <div className="alert-content">
                        {mensaje.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                        <span>{mensaje.text}</span>
                    </div>
                </div>
            )}

            <div className="admin-layout" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
                {/* Formulario de Creación */}
                <div className="admin-form-section glass-panel">
                    <div className="form-header">
                        <PlusCircle size={20} className="text-primary"/>
                        <h3>CREAR NUEVO CUPÓN</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="cyber-form">
                        <div className="input-group">
                            <label>CÓDIGO (KEY)</label>
                            <div className="input-field">
                                <Hash size={16} className="field-icon"/>
                                <input 
                                    type="text" 
                                    name="codigo" 
                                    value={form.codigo} 
                                    onChange={(e) => setForm({...form, codigo: e.target.value.toUpperCase()})} 
                                    required 
                                    placeholder="CYBER2026"
                                />
                                <div className="field-focus"></div>
                            </div>
                        </div>

                        <div className="form-row-2">
                            <div className="input-group">
                                <label>TIPO DE IMPACTO</label>
                                <select className="cyber-select" name="tipo" value={form.tipo} onChange={handleChange}>
                                    <option value="porcentaje">PORCENTAJE (%)</option>
                                    <option value="fijo">VALOR FIJO (USD)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>VALOR</label>
                                <div className="input-field">
                                    {form.tipo === 'porcentaje' ? <Percent size={16} className="field-icon"/> : <DollarSign size={16} className="field-icon"/>}
                                    <input type="number" name="valor" value={form.valor} onChange={handleChange} required placeholder="0.00"/>
                                    <div className="field-focus"></div>
                                </div>
                            </div>
                        </div>

                        <div className="form-row-2">
                            <div className="input-group">
                                <label>FECHA EXPIRACIÓN</label>
                                <div className="input-field">
                                    <Calendar size={16} className="field-icon"/>
                                    <input type="datetime-local" name="expira_at" value={form.expira_at} onChange={handleChange} required/>
                                    <div className="field-focus"></div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>LÍMITE DE USOS</label>
                                <div className="input-field">
                                    <input type="number" name="limite_uso" value={form.limite_uso} onChange={handleChange} required/>
                                    <div className="field-focus"></div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-gaming-primary w-100 mt-4">
                            <PlusCircle size={18}/>
                            <span className="btn-text">ACTIVAR CUPÓN</span>
                            <div className="btn-glow"></div>
                        </button>
                    </form>
                </div>

                {/* Lista de Cupones */}
                <div className="admin-data-section glass-panel">
                    <div className="section-header mb-4">
                        <Ticket size={20} className="text-primary"/>
                        <h3>CUPONES ACTIVOS EN RED</h3>
                    </div>

                    {isLoading ? (
                        <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="cyber-table">
                                <thead>
                                    <tr>
                                        <th>CÓDIGO</th>
                                        <th>VALOR</th>
                                        <th>USOS</th>
                                        <th>EXPIRACIÓN</th>
                                        <th>ESTADO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cupones.map((c) => (
                                        <tr key={c.id} className={c.activo === 0 ? 'row-inactive' : ''}>
                                            <td className="fw-bold text-primary">{c.codigo}</td>
                                            <td>{c.tipo === 'porcentaje' ? `${parseFloat(c.valor)}%` : `$${parseFloat(c.valor)}`}</td>
                                            <td>
                                                <div className="flex-column" style={{ fontSize: '0.7rem' }}>
                                                    <span>{c.usos_actuales} / {c.limite_uso}</span>
                                                    <div className="p-progress-bar" style={{ width: '60px', marginTop: '4px' }}>
                                                        <div className="p-progress" style={{ width: `${Math.min((c.usos_actuales/c.limite_uso)*100, 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '0.7rem' }}>{new Date(c.expira_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-tag ${c.activo === 1 ? 'active' : 'inactive'}`}>
                                                    {c.activo === 1 ? 'ONLINE' : 'OFFLINE'}
                                                </span>
                                            </td>
                                            <td>
                                                {c.activo === 1 && (
                                                    <button className="btn-icon delete" onClick={() => handleDesactivar(c.id)} title="Desactivar">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
