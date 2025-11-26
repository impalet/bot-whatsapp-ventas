// test.js
require("dotenv").config();
const { generarRespuestaIA } = require("./services/aiService.js");

async function probarIA() {
  const mensajeCliente =
    "Hola, quiero comprar algo para regalo, ¿qué me recomiendas?";
  const respuestaBase = "Somos una tienda online de productos de importacion.";

  console.log("Mensaje del cliente:", mensajeCliente);

  const respuestaIA = await generarRespuestaIA(mensajeCliente, respuestaBase);

  console.log("\nRespuesta generada por la IA:\n");
  console.log(respuestaIA);
}

probarIA();
