import pool from "../bd/connection.js";

// Obtener todos los favoritos del usuario
export const obtenerFavoritos = async (req, res) => {
    const usuario_id = req.usuario.id;
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.nombre, p.precio, p.imagen, c.nombre as categoria 
            FROM favoritos f
            JOIN productos p ON f.producto_id = p.id
            JOIN categorias c ON p.categoria_id = c.id
            WHERE f.usuario_id = ? AND p.activo = 1
        `, [usuario_id]);
        res.json(rows);
    } catch (error) {
        console.error("DEBUG FAVS [GET]:", error.message);
        res.status(500).json({ error: "Error al obtener favoritos" });
    }
};

// Alternar favorito (añadir/quitar)
export const toggleFavorito = async (req, res) => {
    const usuario_id = req.usuario.id;
    const { producto_id } = req.body;

    console.log(`DEBUG FAVS [POST]: Usuario ${usuario_id} intentando toggle en producto ${producto_id}`);

    if (!producto_id) {
        console.error("DEBUG FAVS [POST]: ERROR - producto_id no proporcionado");
        return res.status(400).json({ error: "Producto ID es requerido" });
    }

    try {
        // Verificar si ya existe
        const [existente] = await pool.query(
            "SELECT id FROM favoritos WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, producto_id]
        );

        if (existente.length > 0) {
            console.log(`DEBUG FAVS [POST]: El producto ${producto_id} ya es favorito. Procediendo a eliminar.`);
            await pool.query("DELETE FROM favoritos WHERE id = ?", [existente[0].id]);
            return res.json({ mensaje: "Eliminado de favoritos", isFavorite: false });
        } else {
            console.log(`DEBUG FAVS [POST]: El producto ${producto_id} NO es favorito. Procediendo a insertar.`);
            await pool.query(
                "INSERT INTO favoritos (usuario_id, producto_id) VALUES (?, ?)",
                [usuario_id, producto_id]
            );
            return res.json({ mensaje: "Añadido a favoritos", isFavorite: true });
        }
    } catch (error) {
        console.error("DEBUG FAVS [POST]: ERROR SQL ->", error.message);
        res.status(500).json({ 
            error: "Error al procesar favoritos",
            detalle: error.message 
        });
    }
};

// Verificar si un producto es favorito
export const esFavorito = async (req, res) => {
    const usuario_id = req.usuario.id;
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT id FROM favoritos WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, id]
        );
        res.json({ isFavorite: rows.length > 0 });
    } catch (error) {
        console.error("DEBUG FAVS [CHECK]:", error.message);
        res.status(500).json({ error: "Error al verificar favorito" });
    }
};
