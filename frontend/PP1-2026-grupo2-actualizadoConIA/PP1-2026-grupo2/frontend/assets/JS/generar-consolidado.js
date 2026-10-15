/* ══════════════════════════════════════════════
   GENERAR CONSOLIDADO DIARIO (Pantalla 5) — Administrador
   CU "Visualizar pedido" / HU-14 y HU-16
   • Muestra por defecto el día actual.
   • Une los pedidos de ejemplo (data/pedidos.json) con los
     pedidos que confirman los empleados en la Pantalla 4.
   • Se actualiza solo si otro usuario confirma un pedido
     (evento "storage", RNF-09).
   • Descargar: genera un CSV que abre Excel.
   • Enviar al proveedor: arma un correo con el detalle.
   ══════════════════════════════════════════════ */

const EMAIL_PROVEEDOR = 'AromasLight@gmail.com';
const esc = AL.util.escaparHTML;

const inputFecha = document.querySelector('#fecha');
const cuerpoTabla = document.querySelector('#cuerpo-consolidado');
const listaTotales = document.querySelector('#lista-totales');
const totalEmpleados = document.querySelector('#total-empleados');
const botonGenerar = document.querySelector('.btn-generar');
const botonDescargar = document.querySelector('.btn-descargar');
const botonEnviar = document.querySelector('.btn-enviar');

// Último consolidado generado (lo usan Descargar y Enviar).
let consolidadoActual = { fecha: null, pedidos: [], totales: {} };

function mostrarPedidos(pedidos) {
  if (pedidos.length === 0) {
    cuerpoTabla.innerHTML = `
      <tr>
        <td colspan="3" class="sin-pedidos">No hay pedidos confirmados para el día seleccionado.</td>
      </tr>`;
    return;
  }

  // esc(): los comentarios los escriben los empleados, se escapan siempre.
  cuerpoTabla.innerHTML = pedidos.map(pedido => `
    <tr>
      <td>${esc(pedido.empleado)}</td>
      <td>${esc(pedido.menu)}</td>
      <td>${esc(pedido.comentario || 'Sin comentarios')}</td>
    </tr>
  `).join('');
}

function calcularTotales(pedidos) {
  const totales = {};
  pedidos.forEach(pedido => {
    totales[pedido.menu] = (totales[pedido.menu] || 0) + 1;
  });
  return totales;
}

function mostrarTotales(pedidos, totales) {
  const entradas = Object.entries(totales).sort((a, b) => b[1] - a[1]);

  listaTotales.innerHTML = entradas.length
    ? entradas.map(([menu, cantidad]) => `<li>${esc(menu)} × ${cantidad}</li>`).join('')
    : '<li>Sin pedidos (0)</li>';

  totalEmpleados.textContent = 'Total de empleados del día: ' + pedidos.length;
}

async function cargarPedidos({ silencioso = false } = {}) {
  const fechaSeleccionada = inputFecha.value;
  if (!fechaSeleccionada) {
    AL.ui.notificar('Elegí una fecha para generar el consolidado.', 'error');
    return;
  }

  try {
    const pedidos = await AL.pedidos.todos();

    const pedidosFiltrados = pedidos
      .filter(pedido => pedido.fecha === fechaSeleccionada && pedido.estado !== 'cancelado')
      .sort((a, b) => a.empleado.localeCompare(b.empleado));

    const totales = calcularTotales(pedidosFiltrados);
    consolidadoActual = { fecha: fechaSeleccionada, pedidos: pedidosFiltrados, totales };

    mostrarPedidos(pedidosFiltrados);
    mostrarTotales(pedidosFiltrados, totales);

    if (!silencioso) {
      const motivo = AL.feriados.motivo(fechaSeleccionada);
      if (motivo) AL.ui.notificar(`Atención: el ${AL.fechas.isoADMY(fechaSeleccionada)} es feriado (${motivo}).`, 'info', 5000);

      const envio = AL.envios.obtener(fechaSeleccionada);
      if (envio) {
        const hora = new Date(envio.enviadoEn).toLocaleString('es-AR');
        AL.ui.notificar(`Este consolidado ya se envió al proveedor (${hora}).`, 'info', 5000);
      }
    }
  } catch (error) {
    console.error('Error al cargar los pedidos:', error);
    AL.ui.notificar('No se pudieron cargar los pedidos. Intentá nuevamente.', 'error');
  }
}

/* ── Descargar (CSV compatible con Excel) ── */
function campoCSV(valor) {
  const texto = String(valor ?? '');
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function descargarConsolidado() {
  if (!consolidadoActual.fecha || consolidadoActual.pedidos.length === 0) {
    AL.ui.notificar('No hay pedidos para descargar. Generá un consolidado con pedidos primero.', 'error');
    return;
  }
  const { fecha, pedidos, totales } = consolidadoActual;
  const filas = [
    ['Consolidado diario Aromas Light', AL.fechas.isoADMY(fecha)],
    [],
    ['Empleado', 'Opción de menú', 'Comentarios'],
    ...pedidos.map(p => [p.empleado, p.menu, p.comentario || 'Sin comentarios']),
    [],
    ['Totales por opción', 'Cantidad'],
    ...Object.entries(totales),
    ['Total de empleados', pedidos.length]
  ];
  // ";" como separador y BOM (﻿) para que Excel en español
  // lo abra en columnas y respete las tildes.
  const csv = '﻿' + filas.map(fila => fila.map(campoCSV).join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `consolidado-${fecha}.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);

  AL.ui.notificar('Consolidado descargado.');
}

/* ── Enviar al proveedor ── */
async function enviarAlProveedor() {
  if (!consolidadoActual.fecha || consolidadoActual.pedidos.length === 0) {
    AL.ui.notificar('No hay pedidos para enviar. Generá un consolidado con pedidos primero.', 'error');
    return;
  }
  const { fecha, pedidos, totales } = consolidadoActual;
  const fechaTexto = AL.fechas.isoADMY(fecha);

  const confirmado = await AL.ui.confirmar({
    titulo: 'Enviar al proveedor',
    mensaje: `Se enviará el consolidado del ${fechaTexto} (${pedidos.length} pedidos) a ${EMAIL_PROVEEDOR}.`,
    aceptar: 'Enviar'
  });
  if (!confirmado) return;

  const cuerpo = [
    `Consolidado de pedidos del ${fechaTexto}`,
    '',
    'TOTALES POR OPCIÓN:',
    ...Object.entries(totales).map(([menu, cant]) => `- ${menu}: ${cant}`),
    `Total: ${pedidos.length}`,
    '',
    'DETALLE:',
    ...pedidos.map(p => `- ${p.empleado}: ${p.menu} (${p.comentario || 'Sin comentarios'})`)
  ].join('\n');

  // Hasta que exista el backend (que enviará el mail solo, HU-17),
  // se abre el cliente de correo con el mensaje ya armado.
  const mailto = `mailto:${EMAIL_PROVEEDOR}` +
    `?subject=${encodeURIComponent('Pedidos Aromas Light - ' + fechaTexto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;
  window.location.href = mailto;

  AL.envios.registrar(fecha, pedidos.length);
  AL.ui.notificar('Consolidado enviado al proveedor.');
}

/* ── Eventos ── */
botonGenerar.addEventListener('click', () => cargarPedidos());
botonDescargar.addEventListener('click', descargarConsolidado);
botonEnviar.addEventListener('click', enviarAlProveedor);
inputFecha.addEventListener('change', () => cargarPedidos());

// Tiempo real: si en otra pestaña se confirma un pedido, se refresca.
window.addEventListener('storage', (evento) => {
  if (evento.key === AL.PREFIJO + 'pedidos') cargarPedidos({ silencioso: true });
});

// Ícono de inicio del header
const iconoInicio = document.querySelector('.header-icons .icon-btn');
if (iconoInicio) iconoInicio.href = AL.ui.PAGINAS.consolidado;

// Por defecto: el día actual, generado automáticamente.
if (!AL.ui.redirigiendo) {
  inputFecha.value = AL.fechas.hoyISO();
  cargarPedidos({ silencioso: true });
}
