const { buscarProducto, registrarPedido } = require("./googleSheets");

async function generarRespuesta(mensaje, cliente) {
  // Buscar producto en el catálogo
  const producto = await buscarProducto(mensaje);

  if (!producto) {
    return "❌ Producto no encontrado. Intenta con otro nombre o describe mejor lo que buscas.";
  }

  // Registrar un pedido sencillo (solo para prueba, luego se completa con más datos)
  await registrarPedido({
    telefono: cliente,
    producto: producto.nombre,
    precio: producto.precio,
    codigo: producto.codigo,
    observaciones: `Pedido pendiente generado automáticamente. Mensaje original: ${mensaje}`,
  });

  return `✅ Tenemos el *${producto.nombre}* a *${producto.precio}* (código ${producto.codigo}).\nHe registrado tu pedido como *pendiente* asociado a tu número. Cuando confirmes el pago, programaremos el delivery.`;
}

module.exports = { generarRespuesta };
