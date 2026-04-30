import express from 'express';
import authRoutes from './routes/auth.js';
import { loggerDetallado } from './middlewares/avanzado.js';
import sistemEventos from './events/sistemaEventos.js';
const app = express();

const Port = process.env.Port || 3000;

//Middleware pero en orden
app.use(express.json());
app.use(loggerDetallado);

app.use("/api/v1/auth",authRoutes);

//Middleware de error
app.use((err,req,res,next) => {
    console.error(`${err.message}`);
    res.status(500).json({error:"Algo salio mal"});
})

app.get('/',(req,res) => {
    res.send('<h1>Hola Mundo con express </h1>');
});

app.listen(Port,()=>{
console.log(`Servidor en http://localhost:${Port}`);
});