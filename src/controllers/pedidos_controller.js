import pool from "../bd/connection.js";


//POST REALIZAR PEDIDO
export const realizarPedido = async(req,res) => {
    const{carrito} = req.body;
    const usuario_id = req.usuario.id;
    let total = 0;

    const conexion = await pool.getConnection();

    try{
        await conexion.beginTransaction();
        carrito.forEach(item => total += (item.precio * item.cantidad));
        const[resPedido] = await conexion.query(
            "INSERT INTO pedidos (usuario_id,total,estado) VALUES (?,?,'pagado')",
            [usuario_id,total]
        );
        const pedido_id = resPedido.insertId;
        for(const item of carrito){
            await conexion.query(
                "INSERT INTO detalle_pedido (pedido_id,producto_id,cantidad,precio_unitario) VALUES (?,?,?,?)",
                [pedido_id,item.producto_id,item.cantidad,item.precio]
            );
             const [resStock] = await conexion.query(
                "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
                [item.cantidad,item.producto_id,item.cantidad]
            );
            if(resStock.affectedRows === 0){
                throw new Error(`Producto con id ${item.producto_id} no encontrado o stock insuficiente`);
            }
        }
        await conexion.commit();
        res.status(201).json({mensaje:"Pedido creado exitosamente",pedido_id});

    }catch(error){
        await conexion.rollback();
        res.status(500).json({error:"Error al procesar el pedido"});
    }
    finally{
        conexion.release();
    }
}


//GET OBTENER PEDIDOS DE UN USUARIO
export const obtenerPedidos = async(req,res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1 ) *limit;
  
    const [pedidos] = await pool.query(
        "Select id,usuario_id,total,estado FROM pedidos LIMIT ? OFFSET ?",
        [limit, offset]
    );
    res.json({
        pagina_actual: page,
        limite: limit,
        data : pedidos
    });
} 