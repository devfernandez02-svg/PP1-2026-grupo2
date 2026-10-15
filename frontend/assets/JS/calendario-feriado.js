/* ══════════════════════════════════════════════
   CALENDARIO DE FERIADOS (Pantalla 8) — rol Administrador
   - Dibuja el mes con JS y permite navegar con < >.
   - Marca en rojo los feriados de data/feriados.json.
   - Al tocar un día se completa el panel "Detalle del día".
   - "Guardar cambios" marca/desmarca el feriado (en memoria,
     hasta que exista el backend).
   ══════════════════════════════════════════════ */

const RUTA_FERIADOS = 'data/feriados.json';

const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

// Feriados cargados: { 'AAAA-MM-DD': 'motivo' }
let feriados = {};

// El diseño arranca en agosto 2026 con el 17 seleccionado.
let anioVisible = 2026;
let mesVisible = 7; // 0 = enero
let fechaSeleccionada = '2026-08-17';

const tabla = document.querySelector('.tabla-calendario');
const tituloMes = document.querySelector('.calendario-navegacion h3');
const [btnAnterior, btnSiguiente] = document.querySelectorAll('.btn-mes');

const form = document.querySelector('.detalle-box form');
const inputFecha = document.querySelector('#fecha');
const radiosEstado = document.querySelectorAll('input[name="estado"]');
const inputMotivo = document.querySelector('#motivo');

const mensaje = document.createElement('p');
mensaje.setAttribute('role', 'status');
mensaje.style.cssText = 'margin:12px 0 0;font-size:.85rem;font-weight:600;';
mensaje.hidden = true;
form.append(mensaje);

/* ── Helpers ── */

const dosDigitos = n => String(n).padStart(2, '0');

function armarClave(anio, mes, dia) {
  return `${anio}-${dosDigitos(mes + 1)}-${dosDigitos(dia)}`;
}

// 'AAAA-MM-DD' -> 'DD/MM/AAAA'
function claveATexto(clave) {
  const [anio, mes, dia] = clave.split('-');
  return `${dia}/${mes}/${anio}`;
}

function mostrarMensaje(texto, esError) {
  mensaje.textContent = texto;
  mensaje.style.color = esError ? '#d9534f' : '#1d7a2b';
  mensaje.hidden = false;
}

function estadoElegido() {
  return document.querySelector('input[name="estado"]:checked').value;
}

/* ── Calendario ── */

function dibujarCalendario() {
  tituloMes.textContent = `${MESES[mesVisible]} ${anioVisible}`;

  // Se borran los días anteriores y se dejan los encabezados (Lun, Mar...).
  tabla.querySelectorAll('.dia').forEach(celda => celda.remove());

  // getDay(): 0 = domingo. Se corre para que la semana empiece en lunes.
  const primerDia = (new Date(anioVisible, mesVisible, 1).getDay() + 6) % 7;
  const diasDelMes = new Date(anioVisible, mesVisible + 1, 0).getDate();

  let html = '<div class="dia vacio"></div>'.repeat(primerDia);

  for (let dia = 1; dia <= diasDelMes; dia++) {
    const clave = armarClave(anioVisible, mesVisible, dia);
    const columna = (primerDia + dia - 1) % 7;
    const clases = ['dia'];
    if (columna >= 5) clases.push('fin-semana');
    if (feriados[clave]) clases.push('feriado');
    if (clave === fechaSeleccionada) clases.push('seleccionado');

    const titulo = feriados[clave] ? ` title="${feriados[clave]}"` : '';
    html += `<button type="button" class="${clases.join(' ')}" data-fecha="${clave}"${titulo}>${dia}</button>`;
  }

  // Celdas vacías para completar la última fila.
  const resto = (primerDia + diasDelMes) % 7;
  if (resto !== 0) html += '<div class="dia vacio"></div>'.repeat(7 - resto);

  tabla.insertAdjacentHTML('beforeend', html);
}

/* ── Panel de detalle ── */

function mostrarDetalle(clave) {
  const esFeriado = Boolean(feriados[clave]);
  inputFecha.value = claveATexto(clave);
  radiosEstado.forEach(radio => {
    radio.checked = radio.value === (esFeriado ? 'feriado' : 'habil');
  });
  inputMotivo.value = feriados[clave] || '';
  inputMotivo.disabled = !esFeriado;
}

function seleccionarDia(clave) {
  fechaSeleccionada = clave;
  mensaje.hidden = true;
  mostrarDetalle(clave);
  dibujarCalendario();
}

/* ── Carga inicial ── */

async function cargarFeriados() {
  try {
    const respuesta = await fetch(RUTA_FERIADOS);
    if (!respuesta.ok) throw new Error('Estado: ' + respuesta.status);
    const lista = await respuesta.json();
    lista.forEach(item => { feriados[item.fecha] = item.motivo; });
  } catch (error) {
    console.error('Error al cargar los feriados:', error);
    mostrarMensaje('No se pudieron cargar los feriados.', true);
  }
  seleccionarDia(fechaSeleccionada);
}

/* ── Eventos ── */

btnAnterior.addEventListener('click', () => {
  mesVisible--;
  if (mesVisible < 0) { mesVisible = 11; anioVisible--; }
  dibujarCalendario();
});

btnSiguiente.addEventListener('click', () => {
  mesVisible++;
  if (mesVisible > 11) { mesVisible = 0; anioVisible++; }
  dibujarCalendario();
});

tabla.addEventListener('click', (evento) => {
  const celda = evento.target.closest('.dia[data-fecha]');
  if (celda) seleccionarDia(celda.dataset.fecha);
});

// El motivo solo se puede escribir si el día es feriado.
radiosEstado.forEach(radio => {
  radio.addEventListener('change', () => {
    inputMotivo.disabled = estadoElegido() !== 'feriado';
    mensaje.hidden = true;
  });
});

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  if (!fechaSeleccionada) {
    mostrarMensaje('Seleccioná un día del calendario.', true);
    return;
  }

  if (estadoElegido() === 'feriado') {
    const motivo = inputMotivo.value.trim();
    if (motivo === '') {
      mostrarMensaje('Ingresá el motivo del feriado.', true);
      return;
    }
    feriados[fechaSeleccionada] = motivo;
  } else {
    delete feriados[fechaSeleccionada];
    inputMotivo.value = '';
  }

  console.log('Feriados actualizados:', feriados); // acá iría el guardado en el backend
  dibujarCalendario();
  mostrarMensaje('Cambios guardados.', false);
});

dibujarCalendario();
cargarFeriados();
