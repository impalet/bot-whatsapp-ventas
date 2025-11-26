require("dotenv").config();
const { obtenerFilasDesdeHoja, registrarPedido } = require("./services/googleSheets");

async function testFlujo() {
  try {
    console.log("🛒 Leyendo productos del catálogo...");
    const productos = await obtenerFilasDesdeHoja("CATÁLOGO");

    if (productos.length === 0) {
      console.log("⚠️ No se encontraron productos en la hoja 'CATÁLOGO'.");
      return;
    }

    // Mostramos algunos productos como ejemplo
    console.log("📦 Productos encontrados:");
    productos.slice(0, 3).forEach((p, i) => {
      console.log(`\n🔹 Producto ${i + 1}:`);
      console.log(`Nombre: ${p[0]}`);
      console.log(`Precio: ${p[4]}`);
      console.log(`Código: ${p[5]}`);
      console.log(`Descripción: ${p[6]}`);
    });

    // Simulamos que el cliente elige el primer producto y envía sus datos
    const productoElegido = productos[0]; // Elegimos el primer producto para la prueba

    console.log("\n📝 Simulando registro de pedido...");

    const datosCliente = "Juan Pérez - 12345678 - Av. Principal 123 - Frente a la farmacia - Los Olivos - Yape - 987654321";
    const partes = datosCliente.split(" - ");

    const pedido = {
      telefono: "51987654321",
      nombreCompleto: partes[0],
      dni: partes[1],
      direccion: partes[2],
      referencia: partes[3],
      distrito: partes[4],
      medioPago: partes[5],
      producto: productoElegido[0], // Nombre del producto
      precio: productoElegido[4],    // Precio del producto
      codigo: productoElegido[5],    // Código del producto
      observaciones: "",
    };

    await registrarPedido(pedido);

    console.log("✅ Pedido registrado exitosamente en la hoja 'PEDIDOS'.");
  } catch (error) {
    console.error("❌ Ocurrió un error durante la prueba:", error);
  }
}

testFlujo();
