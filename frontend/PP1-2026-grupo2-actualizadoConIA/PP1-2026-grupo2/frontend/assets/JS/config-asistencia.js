/* ══════════════════════════════════════════════
   CONFIGURAR ASISTENCIA (Pantalla 2) — Empleado
   CU "Configurar asistencia" / HU-06 y HU-12
   • Muestra los días con el estado GUARDADO del empleado.
   • Bloquea los días que el administrador marcó como feriado.
   • Al confirmar guarda la configuración y navega a la
     Pantalla 3 con el menú filtrado (?dias=lunes,martes...).
   ══════════════════════════════════════════════ */

// Ruta de la pantalla destino.
const RUTA_PEDIDO = AL.ui.PAGINAS.menu;

const usuario = AL.ui.usuario;
const checkboxesDias = document.querySelectorAll('.day-input');

// Se busca por id y, si el HTML es una versión anterior sin ids,
// por clase. Así el script no se rompe por una diferencia de HTML.
const btnConfirmar = document.querySelector('#btn-confirmar, .btn-confirm');
const btnCancelar = document.querySelector('#btn-cancelar, .btn-cancel');

// Si el HTML no trae el <p> del mensaje, se crea desde JS.
let mensajeError = document.querySelector('#mensaje-error');
if (!mensajeError) {
  mensajeError = document.createElement('p');
  mensajeError.id = 'mensaje-error';
  mensajeError.className = 'mensaje-error-dias';
  mensajeError.setAttribute('role', 'alert');
  mensajeError.hidden = true;
  document.querySelector('.days-grid').after(mensajeError);
}

/* ── Estado inicial ── */

// Estado "guardado" de cada casilla, para que Cancelar vuelva a él.
const estadoGuardado = {};

function cargarEstadoInicial() {
  const guardados = usuario ? AL.asistencia.obtener(usuario.id) : null;
  const lunes = AL.fechas.lunesSemanaMenu();

  checkboxesDias.forEach(checkbox => {
    const dia = checkbox.id;
    const fecha = AL.fechas.fechaDelDia(dia, lunes);
    const motivo = fecha ? AL.feriados.motivo(fecha) : null;
    const label = document.querySelector(`label[for="${dia}"]`);

    // Si el empleado ya configuró sus días, se respetan; si no,
    // queda el valor por defecto del HTML (Lunes tildado).
    if (guardados) checkbox.checked = guardados.includes(dia);

    // Días feriados: bloqueados con indicador visual (HU-12).
    if (motivo !== null) {
      checkbox.checked = false;
      checkbox.disabled = true;
      label.classList.add('dia-feriado');
      label.title = `Feriado: ${motivo}`;
      label.setAttribute('data-feriado', 'Feriado');
    }

    // Fecha debajo del nombre (ej.: "12/10")
    if (fecha && label && !label.querySelector('.dia-fecha')) {
      const fechaSpan = document.createElement('small');
      fechaSpan.className = 'dia-fecha';
      fechaSpan.textContent = AL.fechas.isoACorta(fecha);
      label.appendChild(fechaSpan);
    }

    estadoGuardado[dia] = checkbox.checked;
  });

  // Rango de la semana debajo del subtítulo
  const subtitulo = document.querySelector('.subtitle');
  if (subtitulo && !document.querySelector('.semana-info')) {
    const sabado = AL.fechas.fechaDelDia('sabado', lunes);
    const info = document.createElement('p');
    info.className = 'semana-info';
    info.textContent = `Semana del ${AL.fechas.isoACorta(AL.fechas.aISO(lunes))} al ${AL.fechas.isoACorta(sabado)}`;
    subtitulo.after(info);
  }
}

// El id de cada checkbox (lunes, martes, miercoles...) coincide con el
// campo "dia" de platos.json, así que se usa directamente como valor.
function obtenerDiasSeleccionados() {
  return Array.from(checkboxesDias)
    .filter(checkbox => checkbox.checked && !checkbox.disabled)
    .map(checkbox => checkbox.id);
}

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.hidden = false;
}

function ocultarError() {
  mensajeError.hidden = true;
  mensajeError.textContent = '';
}

// URL y URLSearchParams se encargan de codificar el parámetro correctamente.
function construirUrlPedido(dias) {
  const url = new URL(RUTA_PEDIDO, window.location.href);
  url.searchParams.set('dias', dias.join(','));
  return url.toString();
}

/* ── Eventos ── */

btnConfirmar.addEventListener('click', (evento) => {
  evento.preventDefault(); // el <a href="#"> no debe navegar por sí solo

  const dias = obtenerDiasSeleccionados();

  // CU: sin días seleccionados se advierte que no se generarán pedidos.
  if (dias.length === 0) {
    mostrarError('Seleccioná al menos un día para continuar. Sin días de asistencia no se generarán pedidos.');
    return;
  }

  AL.asistencia.guardar(usuario.id, dias);
  window.location.href = construirUrlPedido(dias);
});

// Cancelar: vuelve cada casilla al último estado guardado, sin recargar.
btnCancelar.addEventListener('click', (evento) => {
  evento.preventDefault();
  checkboxesDias.forEach(checkbox => {
    checkbox.checked = estadoGuardado[checkbox.id];
  });
  ocultarError();
});

// Apenas el usuario toca un día, desaparece el mensaje de error.
checkboxesDias.forEach(checkbox => {
  checkbox.addEventListener('change', ocultarError);
});

/* ── Íconos del header ── */
const [iconoInicio, iconoUsuario] = document.querySelectorAll('.header-icons .icon-btn');
if (iconoInicio) iconoInicio.href = AL.ui.PAGINAS.asistencia;
if (iconoUsuario) iconoUsuario.href = AL.ui.PAGINAS.perfil;

// La flecha "›" del header lleva al menú con los días guardados.
const flecha = document.querySelector('.header-arrow');
if (flecha) {
  flecha.setAttribute('role', 'link');
  flecha.setAttribute('tabindex', '0');
  flecha.title = 'Ir al menú semanal';
  const irAlMenu = () => btnConfirmar.click();
  flecha.addEventListener('click', irAlMenu);
  flecha.addEventListener('keydown', e => { if (e.key === 'Enter') irAlMenu(); });
}

if (usuario) cargarEstadoInicial();
