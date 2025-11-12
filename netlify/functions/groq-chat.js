// Utilizamos esta función de Netlify para evitar exponer la clave de la API de Groq en el frontend.

const Groq = require("groq-sdk");

exports.handler = async (event) => {
  // 1. Verificar método HTTP
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        status: 405,
        npcResponse: "",
        errText: "Método no permitido. Usa POST",
      }),
    };
  }

  // 2. Parsear parámetros
  const { npcBehavior, userText } = JSON.parse(event.body);
  const maxResponseTokens = 170;

  try {
    // 3. Obtener API key desde variables de entorno
    // Establecer esta API key en el panel de Netlify

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
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
      temperature: 0.7,
      max_completion_tokens: maxResponseTokens,
      top_p: 1,
      stop: null,
      stream: false,
      response_format: { type: "json_object" },
    });

    // 5. Devolver respuesta
    const npcResponse = completion.choices[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: 200,
        npcResponse,
        errText: "",
      }),
    };
  } catch (error) {
    if (error instanceof Groq.APIError) {
      if (error.status === 429) {
        console.log(error.headers);
        const retrySeconds = parseInt(error.headers.retry - after);
        const hours = Math.floor(retrySeconds / 3600);
        const minutes = Math.floor((retrySeconds % 3600) / 60);
        const seconds = retrySeconds % 60;

        const retryTime = `${hours} horas, ${minutes} minutos, ${seconds} segundos.`;

        return {
          statusCode: 429,
          body: JSON.stringify({
            status: 429,
            npcResponse: "",
            errText: `Se ha superado el nº de peticiones máximas en el sevidor de IA. El servidor volverá a estar operativo en ${retryTime} `,
          }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({
            status: 500,
            npcResponse: "",
            errText: `Error del servidor, inténtelo más tarde: ${error.message}`,
          }),
        };
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: 500,
          npcResponse: "",
          errText: `Error inesperado, inténtelo más tarde: ${error.message}`,
        }),
      };
    }
  }
};
