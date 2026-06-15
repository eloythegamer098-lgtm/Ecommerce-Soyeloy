import pool from "../bd/connection.js";
import { registrarAuditoria } from "../services/auditService.js";
import slugify from "slugify";

// Get all products (Public: only active, Admin: all)
export const obtenerProductos = async(req,res) => {
    // Si hay un usuario y es admin, mostramos todo. Si no, solo activos.
    const isAdminView = req.usuario && req.usuario.rol === 'admin';
    const query = isAdminView 
        ? 'SELECT p.*, c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id ORDER BY p.id DESC'
        : 'SELECT p.*, c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id WHERE p.activo = 1 AND p.stock >= 0 ORDER BY p.id DESC';

    try {
        const [row] = await pool.query(query);
        res.json({total : row.length, productos:row});
    } catch (error) {
        res.status(500).json({error: "Error al obtener productos"});
    }
}

// Get by Id or Slug
export const obtenerProductosbyId = async(req,res) => {
    const {id} = req.params;
    // Determinar si id es un número o un slug
    const isNumber = !isNaN(id);
    const query = isNumber 
        ? "SELECT p.*, c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?"
        : "SELECT p.*, c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id WHERE p.slug = ?";

    try {
        const [rows] = await pool.query(query, [id]);

        if(rows.length===0){
            return res.status(404).json({error: "Producto no Encontrado"});
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({error: "Error al obtener producto"});
    }
}

// Post 
export const crearProducto = async(req,res) => {
    const {categoria_id, nombre, descripcion, precio, stock, imagen, activo, precio_oferta} = req.body;
    
    // Validaciones Profesionales
    if(!categoria_id || !nombre || !descripcion || precio === undefined || stock === undefined){
        return res.status(400).json({error:"Campos obligatorios faltantes"});
    }

    if(parseFloat(precio) < 0) return res.status(400).json({error: "El precio no puede ser negativo"});
    if(parseInt(stock) < 0) return res.status(400).json({error: "El stock no puede ser negativo"});

    const imgFinal = imagen || 'https://via.placeholder.com/300x400?text=NO+IMAGE';
    const activoFinal = activo !== undefined ? activo : 1;
    
    // Generar Slug
    const baseSlug = slugify(nombre, { lower: true, strict: true });

    try {
        const [resultado] = await pool.query(
            "INSERT INTO productos(categoria_id, nombre, slug, descripcion, precio, precio_oferta, stock, imagen, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [categoria_id, nombre, baseSlug, descripcion, precio, precio_oferta || null, stock, imgFinal, activoFinal]
        );
        
        // Asegurar unicidad añadiendo ID al slug
        const finalSlug = `${baseSlug}-${resultado.insertId}`;
        await pool.query("UPDATE productos SET slug = ? WHERE id = ?", [finalSlug, resultado.insertId]);

        // Auditoría
        await registrarAuditoria(req.usuario.id, 'CREAR_PRODUCTO', 'productos', resultado.insertId, { nombre, slug: finalSlug });

        res.status(201).json({mensaje:"Producto creado exitosamente", id: resultado.insertId, slug: finalSlug});
    } catch (error) {
        res.status(500).json({error: "Error al crear el producto"});
    }
}

// Put
export const actualizarProducto = async(req,res) => {
    const {id} = req.params;
    const {categoria_id, nombre, descripcion, precio, stock, imagen, activo, precio_oferta} = req.body;

    if(!categoria_id || !nombre || !descripcion || precio === undefined || stock === undefined){
        return res.status(400).json({error:"Campos obligatorios faltantes"});
    }

    try {
        const [anterior] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
        if (anterior.length === 0) return res.status(404).json({error: "Producto no encontrado"});

        // Solo regenerar slug si el nombre cambió
        let slug = anterior[0].slug;
        if (nombre !== anterior[0].nombre) {
            slug = `${slugify(nombre, { lower: true, strict: true })}-${id}`;
        }

        await pool.query(
            "UPDATE productos SET categoria_id=?, nombre=?, slug=?, descripcion=?, precio=?, precio_oferta=?, stock=?, imagen=?, activo=? WHERE id=?",
            [categoria_id, nombre, slug, descripcion, precio, precio_oferta || null, stock, imagen, activo, id]
        );

        // Auditoría
        await registrarAuditoria(req.usuario.id, 'ACTUALIZAR_PRODUCTO', 'productos', id, { 
            antes: anterior[0], 
            despues: { nombre, slug, precio, stock } 
        });

        res.json({mensaje:"Producto actualizado exitosamente", id, slug});
    } catch (error) {
        res.status(500).json({error: "Error al actualizar el producto"});
    }
}

// Get related products by category
export const obtenerProductosRelacionados = async(req,res) => {
    const {id} = req.params;
    try {
        // 1. Obtener categoría del producto actual
        const [current] = await pool.query("SELECT categoria_id FROM productos WHERE id = ?", [id]);
        if (current.length === 0) return res.status(404).json({ error: "Producto no encontrado" });

        const categoria_id = current[0].categoria_id;

        // 2. Buscar otros productos de la misma categoría
        const [rows] = await pool.query(
            "SELECT p.*, c.nombre as categoria FROM productos p JOIN categorias c ON p.categoria_id = c.id WHERE p.categoria_id = ? AND p.id != ? AND p.activo = 1 LIMIT 4",
            [categoria_id, id]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos relacionados" });
    }
}

// Delete (ELIMINACIÓN LÓGICA)
export const eliminarProducto = async(req,res) =>{
    const {id} = req.params;
    try {
        // En lugar de DELETE físico, hacemos un soft-delete cambiando activo a 0
        const [resultado] = await pool.query("UPDATE productos SET activo = 0 WHERE id = ?", [id]);
        
        if(resultado.affectedRows === 0){
            return res.status(404).json({error:"Producto no encontrado"});
        }

        // Auditoría
        await registrarAuditoria(req.usuario.id, 'DESACTIVAR_PRODUCTO', 'productos', id);

        res.json({mensaje:"Producto desactivado exitosamente (eliminación lógica)", id});
    } catch (error) {
        res.status(500).json({error: "Error al procesar la baja del producto"});
    }
}