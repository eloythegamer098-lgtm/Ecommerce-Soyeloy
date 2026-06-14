import { GoogleGenAI } from "@google/genai";
import pool from "../bd/connection.js";

export const consultarBot = async (req, res) => {
    const { pregunta } = req.body;

    if (!pregunta || !pregunta.trim()) {
        return res.status(400).json({
            error: "Comando vacío."
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const modelo = process.env.GEMINI_MODEL || "gemini-2.5-flash";

        if (!apiKey) {
            console.error("ERROR BOT: GEMINI_API_KEY no está configurada.");
            return res.status(500).json({
                error: "Configuración incompleta: GEMINI_API_KEY no encontrada en el .env del servidor."
            });
        }

        const ai = new GoogleGenAI({
            apiKey
        });

        let catalogoTexto = "No hay productos disponibles actualmente.";

        try {
            const [productos] = await pool.query(`
                SELECT 
                    p.nombre, 
                    p.precio, 
                    p.stock,
                    c.nombre AS categoria 
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.activo = 1 OR p.activo IS NULL
                LIMIT 30
            `);

            if (productos.length > 0) {
                catalogoTexto = productos
                    .map((p) => {
                        const categoria = p.categoria || "Sin categoría";
                        const stock = p.stock !== null && p.stock !== undefined ? p.stock : "No disponible";
                        return `- ${p.nombre} (${categoria}) - $${p.precio} - Stock: ${stock}`;
                    })
                    .join("\n");
            }
        } catch (dbError) {
            console.error("ERROR BOT - Catálogo:", dbError.message);
        }

        const prompt = `
Eres el asistente virtual de SOY ELOY GAMING, una tienda ecommerce gamer.

Tu personalidad:
- Profesional
- Amable
- Breve
- Estilo gamer
- Siempre en español

Reglas:
1. Ayuda principalmente con productos, catálogo, precios, stock, métodos de pago, pedidos y entregas.
2. No inventes productos que no estén en el catálogo.
3. Si el usuario pregunta por un producto que no aparece, recomiéndale revisar el catálogo oficial.
4. Si pregunta algo fuera de la tienda, responde que solo puedes ayudar con información de SOY ELOY GAMING.
5. No des respuestas demasiado largas.

CATÁLOGO ACTUAL:
${catalogoTexto}

PREGUNTA DEL USUARIO:
${pregunta}
`;

        const respuestaIA = await ai.models.generateContent({
            model: modelo,
            contents: prompt,
            config: {
                temperature: 0.5,
                maxOutputTokens: 180
            }
        });

        const texto =
            typeof respuestaIA.text === "function"
                ? respuestaIA.text()
                : respuestaIA.text;

        return res.json({
            respuesta: texto || "No pude generar una respuesta en este momento."
        });

    } catch (error) {
        console.error("========== ERROR REAL DEL BOT ==========");
        console.error("Mensaje:", error.message);
        console.error("Nombre:", error.name);
        console.error("Status:", error.status || error.statusCode);
        console.error("Error completo:", error);
        console.error("========================================");

        return res.status(500).json({
            error: "Error de conexión con el núcleo de IA.",
            detalle: error.message
        });
    }
};