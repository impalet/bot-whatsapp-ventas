// controllers/botController.js
require('dotenv').config();
const axios = require('axios');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// GET /webhook -> verificación de Meta
exports.getWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado');
    return res.status(200).send(challenge);
  }
  console.log('❌ Error de verificación');
  return res.sendStatus(403);
};

// POST /webhook -> mensajes entrantes
exports.postWebhook = async (req, res) => {
  try {
    const body = req.body;

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200); // nada que responder

    const from = message.from;
    const text = message.text?.body || '';

    console.log(`👤 Mensaje de ${from}: ${text}`);

    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      data: {
        messaging_product: 'whatsapp',
        to: from,
        type: 'text',
        text: { body: `Hola 👋, recibí tu mensaje: "${text}"` },
      },
    });

    console.log('📤 Respuesta enviada');
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Error en postWebhook:', err.response?.data || err.message);
    res.sendStatus(500);
  }
};
