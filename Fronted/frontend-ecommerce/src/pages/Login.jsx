import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensajeExitoso, setMensajeExitoso] = useState("");
    const [mensajeIncorrecto, setMensajeIncorrecto] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeExitoso("");
        setMensajeIncorrecto("");


        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                setMensajeExitoso("Login exitoso");
                setTimeout(() => {
                    navigate("/");
                }, 2000);

            } else {
                console.error("Error en login", data.error);
                setMensajeIncorrecto("Credenciales inválidas");

            }

        } catch (error) {
            console.log("Error al inciar sesion", error);
            setMensajeIncorrecto("Error de conexion al servidor");
        }
    };


    return (
        <div style={{ textAlign: "center" }}>
            <h1>Iniciar Sesión</h1>
            {mensajeExitoso && <p style={{ color: "green" }}>{mensajeExitoso}</p>}
            {mensajeIncorrecto && <p style={{ color: "red" }}>{mensajeIncorrecto}</p>}

            <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: "10px", width: "300px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: "10px", width: "300px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>Login</button>
                <Link to="/Register">

                    <button style={{ padding: "10px 20px", marginTop: "10px" }}>

                        Registrarse</button>
                </Link>
                <Link to="/" >
                    <button style={{ padding: "10px 20px", marginTop: "10px", background: "gray", color: "white", borderRadius: "5px" }}>

                        Regresar al Inicio

                    </button>
                </Link>
            </form>


        </div>
    )
}  
