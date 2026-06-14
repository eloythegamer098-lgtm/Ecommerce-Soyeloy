import pool from "../bd/connection.js";
import { registrarAuditoria } from "../services/auditService.js";


//POST REALIZAR PEDIDO
export const realizarPedido = async(req,res) => {
    const{carrito, cupon_id} = req.body;
    const usuario_id = req.usuario.id;
    let subtotal = 0;
    let descuento = 0;

    const conexion = await pool.getConnection();

    try{
        await conexion.beginTransaction();
        
        // Calcular subtotal
        carrito.forEach(item => subtotal += (item.precio * item.cantidad));

        // Aplicar cupón si existe
        if (cupon_id) {
            const [cupones] = await conexion.query(
                "SELECT * FROM cupones WHERE id = ? AND activo = 1 AND expira_at > NOW() AND usos_actuales < limite_uso",
                [cupon_id]
            );

            if (cupones.length > 0) {
                const cupon = cupones[0];
                if (cupon.tipo === 'porcentaje') {
                    descuento = (subtotal * cupon.valor) / 100;
                } else {
                    descuento = cupon.valor;
                }
                // Asegurar que el descuento no sea mayor al subtotal
                descuento = Math.min(descuento, subtotal);

                // Incrementar usos del cupón
                await conexion.query("UPDATE cupones SET usos_actuales = usos_actuales + 1 WHERE id = ?", [cupon_id]);
            }
        }

        const total = subtotal - descuento;

        const[resPedido] = await conexion.query(
            "INSERT INTO pedidos (usuario_id, total, estado, cupon_id, descuento) VALUES (?, ?, 'pagado', ?, ?)",
            [usuario_id, total, cupon_id || null, descuento]
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
        res.status(201).json({mensaje:"Pedido creado exitosamente", pedido_id, total, descuento});

    }catch(error){
        await conexion.rollback();
        res.status(500).json({error: error.message || "Error al procesar el pedido"});
    }
    finally{
        conexion.release();
    }
}


//GET OBTENER PEDIDOS DE UN USUARIO (CLIENTE)
export const obtenerPedidos = async(req,res) => {
    const usuario_id = req.usuario.id;
    try {
        const [pedidos] = await pool.query(
            "SELECT id, total, estado, creado_en FROM pedidos WHERE usuario_id = ? ORDER BY creado_en DESC",
            [usuario_id]
        );
        res.json({ data: pedidos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener pedidos" });
    }
} 

// GET OBTENER TODOS LOS PEDIDOS (ADMIN)
export const listarTodosLosPedidos = async (req, res) => {
    try {
        const [pedidos] = await pool.query(`
            SELECT p.id, p.total, p.estado, p.creado_en, u.nombre as usuario_nombre, u.email as usuario_email 
            FROM pedidos p 
            INNER JOIN usuarios u ON p.usuario_id = u.id 
            ORDER BY p.creado_en DESC
        `);
        res.json({ data: pedidos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener todos los pedidos" });
    }
};

// PUT ACTUALIZAR ESTADO DEL PEDIDO (ADMIN)
export const actualizarEstadoPedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado'];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: "Estado no válido" });
    }

    try {
        const [resultado] = await pool.query("UPDATE pedidos SET estado = ? WHERE id = ?", [estado, id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        // Auditoría
        await registrarAuditoria(req.usuario.id, 'ACTUALIZAR_ESTADO_PEDIDO', 'pedidos', id, { nuevo_estado: estado });

        res.json({ mensaje: "Estado del pedido actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar estado del pedido" });
    }
};

//Get ver el detalle exacto del pedido (CLIENTE Y ADMIN)
export const obtenerDetallePedido = async (req,res) => {
    const {id} = req.params;

    try {
        const[pedido] = await pool.query(`
            SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email 
            FROM pedidos p 
            INNER JOIN usuarios u ON p.usuario_id = u.id 
            WHERE p.id = ?`, [id]);

        if(pedido.length === 0){
            return res.status(404).json({error : "Pedido no encontrado"});
        }

        // Seguridad: Si no es admin, solo puede ver sus propios pedidos
        if (req.usuario.rol !== 'admin' && pedido[0].usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: "No tienes permiso para ver este pedido" });
        }

        const[detalles] = await pool.query(
            "Select dp.id , dp.cantidad,dp.precio_unitario, p.nombre AS producto_nombre From detalle_pedido dp INNER JOIN productos p ON dp.producto_id = p.id WHERE dp.pedido_id = ?"
            ,[id]      
        );

        res.json({
            pedido: pedido[0],
            detalles: detalles
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener detalle del pedido" });
    }
}
