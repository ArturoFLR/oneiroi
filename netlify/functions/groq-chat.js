// Utilizamos esta función de Netlify para evitar exponer la clave de la API de Groq en el frontend.

const Groq = require("groq-sdk");

exports.handler = async (event) => {
  // 1. Verificar método HTTP
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido. Usa POST" }),
    };
  }

  // 2. Parsear parámetros
  const { npcBehavior, userText } = JSON.parse(event.body);
  const maxResponseTokens = 170;

  try {
    // 3. Obtener API key desde variables de entorno
    // Para Netlify, debe estar activa "process.env.GROQ_API_KEY". Para probar en local, usar "import.meta.env.VITE_APP_GROQKEY"

    const groq = new Groq({
      // apiKey: process.env.GROQ_API_KEY,
      apiKey: import.meta.env.VITE_APP_GROQKEY,
    });

    // 4. Crear el chat completion
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: npcBehavior,
        },
        {
          role: "user",
          content: userText,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_completion_tokens: maxResponseTokens,
      top_p: 1,
      stop: null,
      stream: false,
    });

    // 5. Devolver respuesta
    const npcResponse = completion.choices[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npcResponse }),
    };
  } catch (error) {
    console.error("Error en Groq API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al generar respuesta del NPC" }),
    };
  }
};
