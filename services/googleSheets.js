const { google } = require("googleapis");
const path = require("path");

const SPREADSHEET_ID = process.env.SHEET_ID;

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "..", process.env.CREDENTIALS_PATH),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Lee filas desde una hoja (CATALOGO, PEDIDOS, etc.)
async function obtenerFilasDesdeHoja(nombreHoja) {
  const respuesta = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${nombreHoja}!A2:Z`, // desde fila 2, columnas A..Z
  });

  return respuesta.data.values || [];
}

// Busca productos en la hoja CATALOGO según el texto
async function buscarProductosPorPreferencia(texto) {
  const filas = await obtenerFilasDesdeHoja("CATALOGO");
  texto = texto.toLowerCase();

  return filas
    .filter((row) => {
      const nombre = (row[0] || "").toLowerCase();      // NOMBRE
      const descripcion = (row[6] || "").toLowerCase(); // DESCRIPCIÓN
      return nombre.includes(texto) || descripcion.includes(texto);
    })
    .slice(0, 3); // máximo 3 resultados
}

// Devuelve un solo producto (el primero que coincida) como objeto
async function buscarProducto(texto) {
  const resultados = await buscarProductosPorPreferencia(texto);
  if (resultados.length === 0) return null;

  const row = resultados[0];
  return {
    nombre: row[0] || "",
    imagen: row[1] || "",
    empaque: row[2] || "",
    color: row[3] || "",
    precio: row[4] || "",
    codigo: row[5] || "",
    descripcion: row[6] || "",
  };
}

// Registra un pedido en la hoja PEDIDOS
async function registrarPedido(pedido) {
  const fila = [
    new Date().toISOString(),        // FechaHora
    pedido.telefono || "",           // Teléfono
    pedido.nombreCompleto || "",     // Nombre
    pedido.dni || "",
    pedido.direccion || "",
    pedido.referencia || "",
    pedido.distrito || "",
    pedido.medioPago || "",
    pedido.producto || "",
    pedido.precio || "",
    pedido.codigo || "",
    "Pendiente",                     // Estado
    pedido.observaciones || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "PEDIDOS!A1",
    valueInputOption: "RAW",
    requestBody: { values: [fila] },
  });

  console.log("✅ Pedido guardado en la hoja 'PEDIDOS'.");
}

module.exports = {
  obtenerFilasDesdeHoja,
  buscarProductosPorPreferencia,
  buscarProducto,
  registrarPedido,
};
