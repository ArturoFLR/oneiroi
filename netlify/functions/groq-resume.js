// Utilizamos esta función de Netlify para evitar exponer la clave de la API de Groq en el frontend.
const Groq = require("groq-sdk");

exports.handler = async (event) => {
  // 1. Verificar método HTTP
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        status: 405,
        summary: "",
        errText: "Método no permitido. Usa POST",
      }),
    };
  }

  // 2. Obtener datos del cuerpo de la petición
  const { textToResume, NPCName, keyTopics } = JSON.parse(event.body);
  const maxResponseTokens = 400;

  try {
    // 3. Acceder a la variable de entorno (configurada en Netlify)
    // Para Netlify, debe estar activa "process.env.GROQ_API_KEY".

    const groqKey = process.env.GROQ_API_KEY;

    // 4. Inicializar cliente Groq
    const groq = new Groq({
      apiKey: groqKey,
      // 'dangerouslyAllowBrowser' ya no es necesario
    });

    // 5. Crear el resumen
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Se te va a pasar el texto de una conversación entre el usuario y un NPC llamado ${NPCName}. Tu misión es resumirlo lo más posible, eliminando información redundante o intrascendente, pero manteniendo información importante.
          El resumen puede tener un máximo de 400 tokens.
          No hagas comentarios sobre el resumen. Limítate a devolver el resumen.
          Cuando veas en la conversación que viene marcado entre asteriscos quién va hablar a continuación ( por ejemplo: "*Usuario*: Hola, ¿cómo estás? *${NPCName}*: Bien, gracias. ¿Y tú?"), quiere decir que esa parte nunca ha sido resumida previamente. Utiliza esto para identificar fácilmente quién habla, pero no incluyas estos marcadores en el resumen.
          Si aparecen en la conversación, los siguientes elementos deben quedar siempre reflejados en el resumen y no borrarse: ${keyTopics}. En caso de llegar al límite de tokens, dales prioridad a estos elementos.
          `,
        },
        {
          role: "user",
          content: textToResume,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_completion_tokens: maxResponseTokens,
      top_p: 1,
      stop: null,
      stream: false,
    });

    // 6. Extraer y devolver el resumen
    const summary = chatCompletion.choices[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: 200,
        summary,
        errText: "",
      }),
    };
  } catch (error) {
    if (error instanceof Groq.APIError) {
      if (error.status === 429) {
        const retrySeconds = parseInt(error.headers["retry-after"]);
        const hours = Math.floor(retrySeconds / 3600);
        const minutes = Math.floor((retrySeconds % 3600) / 60);
        const seconds = retrySeconds % 60;

        const retryTime = `${hours} horas, ${minutes} minutos, ${seconds} segundos`;

        return {
          statusCode: 429,
          body: JSON.stringify({
            status: 429,
            summary: "",
            errText: `${retryTime}...`,
          }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({
            status: 500,
            summary: "",
            errText: `${error.message}`,
          }),
        };
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: 500,
          summary: "",
          errText: `Error inesperado, inténtelo más tarde: ${error.message}`,
        }),
      };
    }
  }
};
