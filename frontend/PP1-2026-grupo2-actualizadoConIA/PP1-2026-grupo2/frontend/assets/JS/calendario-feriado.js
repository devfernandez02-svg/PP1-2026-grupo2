/* ══════════════════════════════════════════════
   CALENDARIO DE FERIADOS (Pantalla 8) — Administrador
   CU "Gestionar feriados" / HU-12
   • Dibuja el mes (lunes a domingo) y permite navegar.
   • Al tocar un día se cargan sus datos en el panel derecho.
   • "Guardar cambios" lo marca como feriado (con motivo)
     o lo vuelve a día hábil.
   • Los feriados bloquean ese día en las Pantallas 2 y 3.
   ══════════════════════════════════════════════ */

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const grilla = document.querySelector('#grilla-calendario');
const tituloMes = document.querySelector('#titulo-mes');
const form = document.querySelector('#form-feriado');
const inputFecha = document.querySelector('#fecha');
const radiosEstado = form.querySelectorAll('input[name="estado"]');
const inputMotivo = document.querySelector('#motivo');

// Mes que se está mostrando (siempre el día 1) y día seleccionado (ISO).
let mesVisible = new Date();
mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1);
let fechaSeleccionada = AL.fechas.hoyISO();

let pedidosConfirmados = [];

/* ── Dibujo del calendario ── */
function crearCelda(fecha) {
  const iso = AL.fechas.aISO(fecha);
  const diaSemana = fecha.getDay(); // 0 domingo, 6 sábado
  const motivo = AL.feriados.motivo(iso);

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'dia';
  boton.textContent = fecha.getDate();
  boton.dataset.fecha = iso;

  if (diaSemana === 0 || diaSemana === 6) boton.classList.add('fin-semana');
  if (motivo !== null) {
    boton.classList.add('feriado');
    boton.title = 'Feriado: ' + motivo;
  }
  if (iso === fechaSeleccionada) boton.classList.add('seleccionado');
  if (iso === AL.fechas.hoyISO()) {
    boton.classList.add('hoy');
    boton.setAttribute('aria-current', 'date');
  }

  const descripcion = `${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  boton.setAttribute('aria-label', motivo !== null ? `${descripcion}, feriado: ${motivo}` : descripcion);
  boton.setAttribute('aria-pressed', iso === fechaSeleccionada ? 'true' : 'false');
  return boton;
}

function crearVacio() {
  const vacio = document.createElement('div');
  vacio.className = 'dia vacio';
  return vacio;
}

function renderCalendario() {
  const anio = mesVisible.getFullYear();
  const mes = mesVisible.getMonth();
  tituloMes.textContent = `${MESES[mes].toUpperCase()} ${anio}`;

  // Se borran solo los días; los encabezados (Lun, Mar...) quedan.
  grilla.querySelectorAll('.dia').forEach(celda => celda.remove());

  const fragmento = document.createDocumentFragment();
  const primerDia = new Date(anio, mes, 1);
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const espaciosAntes = (primerDia.getDay() + 6) % 7; // semana empieza el lunes

  for (let i = 0; i < espaciosAntes; i++) fragmento.appendChild(crearVacio());
  for (let d = 1; d <= diasEnMes; d++) fragmento.appendChild(crearCelda(new Date(anio, mes, d)));

  const usadas = espaciosAntes + diasEnMes;
  const espaciosDespues = (7 - (usadas % 7)) % 7;
  for (let i = 0; i < espaciosDespues; i++) fragmento.appendChild(crearVacio());

  grilla.appendChild(fragmento);
}

/* ── Panel de detalle ── */
function actualizarEstadoMotivo() {
  const esFeriado = form.querySelector('input[name="estado"]:checked').value === 'feriado';
  inputMotivo.disabled = !esFeriado;
  inputMotivo.placeholder = esFeriado ? 'Ingrese el motivo del feriado' : 'Solo para días feriados';
}

function cargarDetalle(iso) {
  fechaSeleccionada = iso;
  const motivo = AL.feriados.motivo(iso);
  inputFecha.value = AL.fechas.isoADMY(iso);
  radiosEstado.forEach(r => { r.checked = r.value === (motivo !== null ? 'feriado' : 'habil'); });
  inputMotivo.value = motivo || '';
  actualizarEstadoMotivo();
}

function seleccionarDia(iso) {
  cargarDetalle(iso);
  grilla.querySelectorAll('.dia.seleccionado').forEach(c => {
    c.classList.remove('seleccionado');
    c.setAttribute('aria-pressed', 'false');
  });
  const celda = grilla.querySelector(`.dia[data-fecha="${iso}"]`);
  if (celda) {
    celda.classList.add('seleccionado');
    celda.setAttribute('aria-pressed', 'true');
  }
}

/* ── Guardar ── */
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (!fechaSeleccionada) {
    AL.ui.notificar('Seleccioná un día del calendario.', 'error');
    return;
  }

  const estado = form.querySelector('input[name="estado"]:checked').value;
  const fechaTexto = AL.fechas.isoADMY(fechaSeleccionada);

  if (estado === 'feriado') {
    const motivo = inputMotivo.value.trim();
    if (motivo.length < 3) {
      AL.ui.notificar('Ingresá el motivo del feriado (mínimo 3 caracteres).', 'error');
      inputMotivo.focus();
      return;
    }

    // Si ya hay pedidos confirmados ese día, se avisa antes de marcarlo.
    const cantidad = pedidosConfirmados.filter(p => p.fecha === fechaSeleccionada).length;
    if (cantidad > 0) {
      const ok = await AL.ui.confirmar({
        titulo: 'Hay pedidos ese día',
        mensaje: `El ${fechaTexto} tiene ${cantidad} pedido(s) confirmado(s). Si lo marcás como feriado, los empleados ya no podrán pedir para ese día. ¿Continuar?`,
        aceptar: 'Marcar feriado',
        peligro: true
      });
      if (!ok) return;
    }

    AL.feriados.marcar(fechaSeleccionada, motivo);
    AL.ui.notificar(`El ${fechaTexto} quedó marcado como feriado.`);
  } else {
    if (AL.feriados.esFeriado(fechaSeleccionada)) {
      AL.feriados.quitar(fechaSeleccionada);
      AL.ui.notificar(`El ${fechaTexto} volvió a ser día hábil.`);
    } else {
      AL.ui.notificar(`El ${fechaTexto} ya es día hábil.`, 'info');
    }
  }
  renderCalendario();
  cargarDetalle(fechaSeleccionada);
});

/* ── Eventos ── */
grilla.addEventListener('click', (e) => {
  const celda = e.target.closest('.dia[data-fecha]');
  if (celda) seleccionarDia(celda.dataset.fecha);
});

radiosEstado.forEach(radio => radio.addEventListener('change', actualizarEstadoMotivo));

document.querySelector('#btn-mes-anterior').addEventListener('click', () => {
  mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1);
  renderCalendario();
});

document.querySelector('#btn-mes-siguiente').addEventListener('click', () => {
  mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1);
  renderCalendario();
});

/* ── Arranque ── */
async function iniciar() {
  if (AL.ui.redirigiendo) return;
  renderCalendario();
  cargarDetalle(fechaSeleccionada);
  try {
    pedidosConfirmados = await AL.pedidos.todos();
  } catch (error) {
    console.warn('No se pudieron leer los pedidos:', error);
  }
}

iniciar();
