

// Ruta de la pantalla destino. Si tus HTML están en carpetas
// distintas, cambiá SOLO esta línea (ej: '/frontend/pages/...').
const RUTA_PEDIDO = 'Pantalla_3-registrar-pedido.html';

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

/* ── Utilidades ── */

// El id de cada checkbox (lunes, martes, miercoles...) coincide con el
// campo "dia" de platos.json, así que se usa directamente como valor.
// Se recorre en orden del DOM, por lo que los días quedan Lunes → Sábado.
function obtenerDiasSeleccionados() {
  return Array.from(checkboxesDias)
    .filter(checkbox => checkbox.checked)
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

  // Validación: sin días, la Pantalla 3 mostraría TODOS los días del JSON.
  if (dias.length === 0) {
    mostrarError('Seleccioná al menos un día para continuar.');
    return;
  }

  const destino = construirUrlPedido(dias);
  console.log('Navegando a:', destino); // ayuda a depurar: ver en la consola
  window.location.href = destino;
});

// Cancelar: vuelve cada casilla a su estado inicial del HTML
// (Lunes viene tildado por defecto) sin recargar la página.
btnCancelar.addEventListener('click', (evento) => {
  evento.preventDefault();
  checkboxesDias.forEach(checkbox => {
    checkbox.checked = checkbox.defaultChecked;
  });
  ocultarError();
});

// Apenas el usuario toca un día, desaparece el mensaje de error.
checkboxesDias.forEach(checkbox => {
  checkbox.addEventListener('change', ocultarError);
});
