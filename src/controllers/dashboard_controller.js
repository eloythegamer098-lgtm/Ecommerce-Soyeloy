import pool from "../bd/connection.js";

export const obtenerEstadisticas = async (req, res) => {
    try {
        // 1. Resumen General
        const [ventasTotales] = await pool.query("SELECT SUM(total) as total FROM pedidos WHERE estado != 'cancelado'");
        const [usuarios] = await pool.query("SELECT COUNT(*) as total FROM usuarios");
        const [pedidosTotales] = await pool.query("SELECT COUNT(*) as total FROM pedidos");
        const [productosTotales] = await pool.query("SELECT COUNT(*) as total FROM productos");

        // 2. Rendimiento de Ventas (Hoy, Semana, Mes)
        const [ventasHoy] = await pool.query("SELECT SUM(total) as total FROM pedidos WHERE DATE(creado_en) = CURDATE() AND estado != 'cancelado'");
        const [ventasSemana] = await pool.query("SELECT SUM(total) as total FROM pedidos WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND estado != 'cancelado'");
        const [ventasMes] = await pool.query("SELECT SUM(total) as total FROM pedidos WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND estado != 'cancelado'");
        
        // Comparación mes anterior
        const [ventasMesAnterior] = await pool.query(`
            SELECT SUM(total) as total 
            FROM pedidos 
            WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
            AND creado_en < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND estado != 'cancelado'
        `);

        // 3. Alertas de Inventario y Operaciones
        const [stockBajo] = await pool.query("SELECT COUNT(*) as total FROM productos WHERE stock > 0 AND stock <= 5");
        const [agotados] = await pool.query("SELECT COUNT(*) as total FROM productos WHERE stock = 0");
        const [sinDescripcion] = await pool.query("SELECT COUNT(*) as total FROM productos WHERE descripcion IS NULL OR descripcion = ''");
        const [pedidosPendientes] = await pool.query("SELECT COUNT(*) as total FROM pedidos WHERE estado = 'pendiente'");
        const [usuariosNuevos] = await pool.query("SELECT COUNT(*) as total FROM usuarios WHERE creado_en >= DATE_SUB(NOW(), INTERVAL 24 HOUR)");

        // 4. Rendimiento por Categoría
        const [categoriasPerformance] = await pool.query(`
            SELECT c.nombre, COUNT(p.id) as cantidad_productos, SUM(dp.cantidad) as ventas_totales
            FROM categorias c
            LEFT JOIN productos p ON c.id = p.categoria_id
            LEFT JOIN detalle_pedido dp ON p.id = dp.producto_id
            GROUP BY c.id
            ORDER BY ventas_totales DESC
        `);

        // 5. Listados Detallados para el dashboard
        const [ultimosPedidos] = await pool.query(`
            SELECT p.id, p.total, p.estado, p.creado_en, u.nombre as usuario
            FROM pedidos p
            INNER JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.creado_en DESC
            LIMIT 8
        `);

        const [topProductos] = await pool.query(`
            SELECT p.nombre, SUM(dp.cantidad) as vendidos, p.stock
            FROM detalle_pedido dp
            INNER JOIN productos p ON dp.producto_id = p.id
            GROUP BY p.id
            ORDER BY vendidos DESC
            LIMIT 5
        `);

        // Generar Recomendaciones (Tareas Inteligentes)
        const recomendaciones = [];
        if (stockBajo[0].total > 0) recomendaciones.push({ tipo: 'stock_bajo', mensaje: `Hay ${stockBajo[0].total} productos con stock crítico. Revisa el inventario.` });
        if (agotados[0].total > 0) recomendaciones.push({ tipo: 'agotados', mensaje: `${agotados[0].total} productos están agotados. Considera reponer stock.` });
        if (pedidosPendientes[0].total > 0) recomendaciones.push({ tipo: 'pedidos', mensaje: `Tienes ${pedidosPendientes[0].total} pedidos pendientes por procesar.` });
        if (sinDescripcion[0].total > 0) recomendaciones.push({ tipo: 'contenido', mensaje: `${sinDescripcion[0].total} productos no tienen descripción completa.` });
        if (usuariosNuevos[0].total > 0) recomendaciones.push({ tipo: 'usuarios', mensaje: `¡Tienes ${usuariosNuevos[0].total} usuarios nuevos hoy!` });

        res.json({
            resumen: {
                ingresos_totales: ventasTotales[0].total || 0,
                usuarios_totales: usuarios[0].total,
                pedidos_totales: pedidosTotales[0].total,
                productos_totales: productosTotales[0].total,
                pedidos_pendientes: pedidosPendientes[0].total,
                stock_bajo: stockBajo[0].total,
                agotados: agotados[0].total,
                sin_descripcion: sinDescripcion[0].total,
                usuarios_nuevos_24h: usuariosNuevos[0].total
            },
            rendimiento: {
                hoy: ventasHoy[0].total || 0,
                semana: ventasSemana[0].total || 0,
                mes: ventasMes[0].total || 0,
                mes_anterior: ventasMesAnterior[0].total || 0,
                categorias: categoriasPerformance
            },
            alertas: {
                criticas: agotados[0].total + pedidosPendientes[0].total,
                advertencias: stockBajo[0].total + sinDescripcion[0].total
            },
            recomendaciones,
            ultimos_pedidos: ultimosPedidos,
            productos_populares: topProductos
        });

    } catch (error) {
        console.error("Error en dashboard stats:", error);
        res.status(500).json({ error: "Error al generar estadísticas avanzadas" });
    }
    
};

export const obtenerReporteVentas = async (req, res) => {
    try {
        const [ventasPorDia] = await pool.query(`
            SELECT 
                DATE(creado_en) as fecha,
                SUM(total) as total,
                COUNT(*) as cantidad_pedidos
            FROM pedidos
            WHERE estado != 'cancelado'
            AND creado_en >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(creado_en)
            ORDER BY fecha ASC
        `);

        const [ventasPorEstado] = await pool.query(`
            SELECT 
                estado,
                COUNT(*) as cantidad,
                SUM(total) as total
            FROM pedidos
            GROUP BY estado
            ORDER BY cantidad DESC
        `);

        const [productosMasVendidos] = await pool.query(`
            SELECT 
                p.id,
                p.nombre,
                p.stock,
                SUM(dp.cantidad) as unidades_vendidas,
                SUM(dp.cantidad * dp.precio_unitario) as total_generado
            FROM detalle_pedido dp
            INNER JOIN productos p ON dp.producto_id = p.id
            INNER JOIN pedidos pe ON dp.pedido_id = pe.id
            WHERE pe.estado != 'cancelado'
            GROUP BY p.id, p.nombre, p.stock
            ORDER BY unidades_vendidas DESC
            LIMIT 10
        `);

        const [ventasResumen] = await pool.query(`
            SELECT 
                SUM(total) as total_ventas,
                COUNT(*) as total_pedidos,
                AVG(total) as promedio_pedido
            FROM pedidos
            WHERE estado != 'cancelado'
        `);

        res.json({
            resumen: {
                total_ventas: ventasResumen[0].total_ventas || 0,
                total_pedidos: ventasResumen[0].total_pedidos || 0,
                promedio_pedido: ventasResumen[0].promedio_pedido || 0
            },
            ventas_por_dia: ventasPorDia,
            ventas_por_estado: ventasPorEstado,
            productos_mas_vendidos: productosMasVendidos
        });

    } catch (error) {
        console.error("Error al obtener reporte de ventas:", error);
        res.status(500).json({
            error: "Error al generar reporte de ventas"
        });
    }
};

