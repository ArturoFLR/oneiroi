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

  // 2. Obtener datos del cuerpo de la petición
  const { textToResume } = JSON.parse(event.body);
  const maxResponseTokens = 400;

  try {
    // 3. Acceder a la variable de entorno (configurada en Netlify)
    // Para Netlify, debe estar activa "process.env.GROQ_API_KEY". Para probar en local, usar "import.meta.env.VITE_APP_GROQKEY"

    // const groqKey = process.env.GROQ_API_KEY;
    const groqKey = import.meta.env.VITE_APP_GROQKEY;

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
          content: `El usuario te va a pasar el texto de una conversación entre el usuario y una IA. Tu misión es resumirlo lo más posible pero sin eliminar información importante, ya que tu resumen se le va a pasar a esa misma IA para que sepa de qué estaba hablando con el usuario y poder recordar datos importantes. El resumen puede tener un máximo de 400 tokens.
          Elimina toda la información redundante.
          No hagas comentarios sobre el resumen. Limítate a devolver el resumen.
          Es muy importante que si el usuario da su nombre o alguna característica personal, lo incluyas siempre en el resumen.
          En la conversación viene marcado entre asteriscos quién va hablar a continuación. Por ejemplo: "*Usuario*: Hola, ¿cómo estás? *IA*: Bien, gracias. ¿Y tú?". Esto es sólo para que puedas identificar fácilmente quién habla, pero no incluyas estos marcadores en el resumen.`,
        },
        {
          role: "user",
          content: textToResume,
        },
      ],
      model: "llama-3.3-70b-versatile",
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
      body: JSON.stringify({ summary }),
    };
  } catch (error) {
    console.error("Error en Groq API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al procesar la solicitud" }),
    };
  }
};
