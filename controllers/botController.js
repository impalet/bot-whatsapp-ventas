const { generarRespuesta } = require("../services/messageHandler");
const { generarRespuestaIA } = require("../services/aiService");

module.exports = async (req, res) => {
  try {
    const { from, message } = req.body;

    if (!message || !from) {
      return res.status(400).json({
        status: "error",
        message: 'Faltan campos "from" o "message" en el body',
      });
    }

    // 1) Lógica normal: buscar producto, registrar pedido básico, etc.
    const respuestaBase = await generarRespuesta(message, from);

    // 2) Mejorar/redactar con IA
    const respuestaFinal = await generarRespuestaIA(message, respuestaBase);

    // 3) Responder al cliente
    res.json({ status: "ok", respuesta: respuestaFinal });
  } catch (error) {
    console.error("Error en botController:", error);

    res.status(500).json({
      status: "error",
      message: "Ocurrió un error procesando el mensaje.",
    });
  }
};
