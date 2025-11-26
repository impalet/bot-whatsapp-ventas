const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generarRespuestaIA(mensajeUsuario, respuestaBase = "") {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini", // o el modelo que prefieras
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente de ventas por WhatsApp. Respondes corto, claro y amable. Si ya te dan una respuesta base, solo mejórala un poco, no inventes productos.",
        },
        {
          role: "user",
          content: `Mensaje del cliente: "${mensajeUsuario}". Respuesta base del sistema: "${respuestaBase}".`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error al llamar a OpenAI:", error.message || error);
    return "Hubo un problema con la IA.";
  }
}

module.exports = { generarRespuestaIA };
