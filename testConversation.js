require("dotenv").config();
const {
  buscarProductosPorPreferencia,
  registrarPedido,
} = require("./services/googleSheets");

async function testFlujo() {
  try {
    console.log("🛒 Buscando productos por preferencia...");
    const mensajeCliente = "cargador rápido";
    const productos = await buscarProductosPorPreferencia(mensajeCliente);

    if (productos.length === 0) {
      console.log("⚠️ No se encontraron productos con esa preferencia.");
      return;
    }

    console.log("📦 Productos encontrados:");
    productos.forEach((p, i) => {
      console.log(`\n🔹 Producto ${i + 1}:`);
      console.log(`Nombre: ${p[0]}`);
      console.log(`Precio: ${p[4]}`);
      console.log(`Código: ${p[5]}`);
      console.log(`Descripción: ${p[6]}`);
    });

    // Simulamos que el cliente elige el primer producto y manda sus datos
    const productoElegido = productos[0];

    console.log("\n📝 Registrando pedido de prueba...");

    const pedido = {
      telefono: "51987654321",
      nombreCompleto: "Juan Pérez",
      dni: "12345678",
      direccion: "Av. Principal 123",
      referencia: "Frente a la farmacia",
      distrito: "Los Olivos",
      medioPago: "Yape",
      producto: productoElegido[0],
      precio: productoElegido[4],
      codigo: productoElegido[5],
      observaciones: "Pedido de prueba desde testConversation.js",
    };

    await registrarPedido(pedido);

    console.log(
      "✅ Pedido de prueba registrado exitosamente en la hoja 'PEDIDOS'."
    );
  } catch (error) {
    console.error("❌ Error en la prueba:", error);
  }
}

testFlujo();
