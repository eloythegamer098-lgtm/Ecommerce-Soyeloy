import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const consultarBot = async (req, res) => {

    const { pregunta } = req.body;
    if (!pregunta) {
        return res.status(400).json({ error: "Hazme una pregunta" });
    }

    try {
        const prompt = `
        Eres el asistente virtual de nuestra Tienda E-commerce de tecnologia de Ecuador.
        Reglas:
        1. "Eres amable,cordial con los usuarios, ademas se breve y habla español"
        2.Envios:"Enviamos a todo el pais por ServiEntrega ($5 adicionales)"
        3.Pagos: "Aceptamos transferencias del banco pichincha,produbanco,pacifico son los unicos que aceptamos y tarjetas de credito"
        4.Si te preguntan algo fuera de la tienda,responde que solo ayudas con compras

        Pregunta del cliente: ${pregunta}`;
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });

        res.json({respuesta:response.text})



    } catch (error) {
        console.log("Error en el bot", error);
    }
  
}

