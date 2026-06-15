export const obtenerProductos = async (req, res) => {
    try {
        const [row] = await pool.query(
            `SELECT 
                p.id, 
                p.nombre, 
                p.descripcion, 
                p.precio, 
                p.stock, 
                p.imagen, 
                p.activo, 
                c.nombre AS categoria 
            FROM productos p 
            INNER JOIN categorias c ON p.categoria_id = c.id`
        );

        res.json({ total: row.length, productos: row });
    } catch (error) {
        console.error("========== ERROR PRODUCTOS ==========");
        console.error("Mensaje:", error.message);
        console.error("Código:", error.code);
        console.error("SQL:", error.sql);
        console.error("====================================");

        res.status(500).json({
            error: "Error al obtener productos",
            detalle: error.message,
            codigo: error.code || null
        });
    }
};