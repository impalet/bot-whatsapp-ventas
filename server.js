require('dotenv').config();
const express = require('express');
const app = express();
const botController = require('./controllers/botController');

app.use(express.json());
app.post('/webhook', botController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));