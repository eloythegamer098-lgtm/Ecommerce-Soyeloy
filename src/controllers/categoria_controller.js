import pool from "../bd/connection.js";

//Get
export const obtenerCategorias = async(req,res) => {
    const[row]= await pool.query('SELECT * FROM categorias');
    res.json({total : row.length, categorias:row});
}

