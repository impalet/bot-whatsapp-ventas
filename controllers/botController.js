// controllers/botController.js
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'jeandev';

// 👉 GET /webhook  (Meta lo usa SOLO para VERIFICAR)
exports.getWebhook = (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('🔎 Verificando webhook...', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente');
      // Meta espera que respondas **solo el challenge** con 200
      return res.status(200).send(challenge);
    } else {
      console.log('❌ Token de verificación inválido');
      return res.sendStatus(403);
    }
  } catch (err) {
    console.error('❌ Error en getWebhook:', err);
    return res.sendStatus(500);
  }
};

// 👉 POST /webhook  (aquí llegan los MENSAJES)
exports.postWebhook = (req, res) => {
  try {
    const body = req.body;

    // Confirma rápido a Meta que recibiste el evento
    res.sendStatus(200);

    // Seguridad básica
    if (body.object !== 'whatsapp_business_account') {
      console.log('⚠️ Evento que no es de WhatsApp Business:', body.object);
      return;
    }

    // Navegar hasta el mensaje
    const entry = body.entry && body.entry[0];
    const changes = entry && entry.changes && entry.changes[0];
    const value = changes && changes.value;

    const messages = value && value.messages;
    if (!messages || !messages[0]) {
      console.log('⚠️ No hay mensajes en el webhook');
      return;
    }

    const message = messages[0];
    const from = message.from;              // número del cliente
    const text = message.text?.body || '';  // texto que envió

    console.log('💬 Mensaje recibido:', { from, text });

    // 👉 AQUÍ pones la lógica de tu bot
    // Por ahora solo mostramos, luego lo conectas a tu IA / OpenAI, etc.
  } catch (err) {
    console.error('❌ Error en postWebhook:', err);
  }
};
