import { useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el registro de usuarios
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    alert("Registro exitoso");
};
return (
    <div style={{textAlign:"center"}}>
        <h1>Registro de Usuario</h1>
        <form onSubmit={handleSubmit} style={{display:"inline-block",textAlign:"left"}}>
            <div style={{marginBottom:"10px"}}>
                <label>Name:</label><br />
                <input 
                    type="text"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    style={{padding:"10px",width:"300px"}}
                />
            </div>
            <div style={{marginBottom:"10px"}}>
                <label>Email:</label><br />
                <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={{padding:"10px",width:"300px"}}
                />
            </div>
            <div style={{marginBottom:"10px"}}>
                <label>Password:</label><br />
                <input
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={{padding:"10px",width:"300px"}}
                />
            </div>
            <button type="submit" style={{padding:"10px 20px",marginTop:"10px"}}>Register</button>
            <Link to="/Login">
                <button style={{padding:"10px 20px",marginTop:"10px"}}>
                    Iniciar Sesión
                </button>
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

