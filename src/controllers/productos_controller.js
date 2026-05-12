import pool from "../bd/connection.js";

//Get
export const obtenerProductos = async(req,res) => {
    const[row]= await pool.query('SELECT p.id, p.nombre,p.descripcion,p.precio,p.stock,c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id'

        
    );
    res.json({total : row.length, productos:row});


}

//Post 

export const crearProducto = async(req,res) => {
    const {categoria_id,nombre,descripcion,precio,stock} = req.body;
    if(!categoria_id || !nombre || !descripcion || !precio || !stock){
        return res.status(400).json({error:"Todos los campos son obligatorios"});
    }
    const resultado = await pool.query(
        "INSERT INTO productos(categoria_id,nombre,descripcion,precio,stock) VALUES (?,?,?,?,?)",
        [categoria_id,nombre,descripcion,precio,stock]
    );
    res.status(201).json({mensaje:"Producto creado exitosamente",id:resultado.insertId});
}

//Put

export const actualizarProducto = async(req,res) => {
    const {id} = req.params;
    const {categoria_id,nombre,descripcion,precio,stock} = req.body;
    if(!categoria_id || !nombre || !descripcion || !precio || !stock){
        return res.status(400).json({error:"Todos los campos son obligatorios"});
    }
    const resultado = await pool.query(
        "UPDATE productos SET categoria_id=?,nombre=?,descripcion=?,precio=?,stock=? WHERE id=?",
        [categoria_id,nombre,descripcion,precio,stock,id]
    );
    res.json({mensaje:"Producto actualizado exitosamente",id});
}