require('dotenv').config();
const express = require('express');
const app = express();
const botController = require('./controllers/botController');

app.use(express.json());

app.get('/webhook', botController.getWebhook);   // verificación
app.post('/webhook', botController.postWebhook); // mensajes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
