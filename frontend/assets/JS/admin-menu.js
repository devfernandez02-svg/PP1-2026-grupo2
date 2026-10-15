
const DIAS = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado'
};
const ORDEN_DIAS = Object.keys(DIAS);

const ICONO_X = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICONO_MAS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const ICONO_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICONO_FLECHA = `<svg class="day-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

// Estilo de los campos de la tarjeta nueva (el CSS no los trae).
const ESTILO_CAMPO = 'width:100%;padding:.5rem .6rem;border:none;border-radius:6px;font-family:inherit;font-size:.85rem;';

const menu = document.querySelector('#menu');
const actionsBar = document.querySelector('.actions-bar');
const [btnAnadirDia, btnPublicar] = actionsBar.querySelectorAll('.btn-confirm');

// Se usa para que cada sección nueva tenga name/id de radios únicos.
let contadorSecciones = menu.querySelectorAll('.day-section').length;

const mensaje = document.createElement('p');
mensaje.setAttribute('role', 'status');
mensaje.style.cssText = 'margin-top:1rem;font-weight:600;text-align:right;';
mensaje.hidden = true;
actionsBar.after(mensaje);

/* ── Helpers ── */

function mostrarMensaje(texto, esError) {
  mensaje.textContent = texto;
  mensaje.style.color = esError ? '#C0182A' : 'green';
  mensaje.hidden = false;
}

function ocultarMensaje() {
  mensaje.hidden = true;
}

function diaDeSeccion(seccion) {
  const radio = seccion.querySelector('.day-radio:checked');
  return radio ? radio.value : null;
}

// Solo cuenta las tarjetas ya guardadas (la tarjeta en edición no tiene .card-title).
function platosDeSeccion(seccion) {
  return Array.from(seccion.querySelectorAll('.dish-card:not(.dish-card-nueva)')).map(card => ({
    titulo: card.querySelector('.card-title').textContent.trim(),
    descripcion: card.querySelector('.card-desc').textContent.trim(),
    imagen: card.querySelector('.card-img').getAttribute('src')
  }));
}

// Tarjeta final, igual a las del HTML. Se arma con textContent
// porque el título y la descripción los escribe el usuario.
function crearTarjeta(plato) {
  const card = document.createElement('article');
  card.className = 'dish-card';
  card.innerHTML = `
    <h3 class="card-title"></h3>
    <div class="card-img-wrap"><img class="card-img"></div>
    <p class="card-desc"></p>
    <button type="button" class="icon-circle-btn card-btn-remove" aria-label="Quitar plato">${ICONO_X}</button>`;
  card.querySelector('.card-title').textContent = plato.titulo;
  card.querySelector('.card-img').src = plato.imagen;
  card.querySelector('.card-img').alt = plato.titulo;
  card.querySelector('.card-desc').textContent = plato.descripcion;
  return card;
}

// Tarjeta en blanco con los campos para cargar el plato nuevo.
function crearTarjetaEditable() {
  const card = document.createElement('article');
  card.className = 'dish-card dish-card-nueva';
  card.innerHTML = `
    <div style="padding:1rem 1rem .6rem;">
      <input type="text" class="nuevo-titulo" placeholder="Título del plato" maxlength="40" aria-label="Título del plato" style="${ESTILO_CAMPO}font-weight:600;">
    </div>
    <label class="card-img-wrap" style="display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(255,255,255,.15);color:#fff;font-size:.85rem;">
      <img class="card-img nuevo-preview" alt="Vista previa del plato" hidden>
      <span class="nuevo-img-texto">+ Elegir imagen</span>
      <input type="file" class="nuevo-imagen" accept="image/*" hidden>
    </label>
    <div style="padding:.75rem 1rem;flex:1;">
      <textarea class="nuevo-desc" rows="3" placeholder="Descripción del plato" aria-label="Descripción del plato" style="${ESTILO_CAMPO}resize:vertical;"></textarea>
      <p class="nuevo-error" role="alert" style="margin-top:.4rem;color:#fff;font-size:.75rem;font-weight:700;" hidden></p>
    </div>
    <div style="display:flex;gap:.6rem;justify-content:center;margin-bottom:1rem;">
      <button type="button" class="icon-circle-btn" data-accion="guardar-plato" aria-label="Guardar plato">${ICONO_CHECK}</button>
      <button type="button" class="icon-circle-btn" data-accion="cancelar-plato" aria-label="Cancelar">${ICONO_X}</button>
    </div>`;
  return card;
}

function agregarTarjetaEditable(seccion) {
  // Una sola tarjeta en edición por día: si ya hay una, se le da foco.
  const existente = seccion.querySelector('.dish-card-nueva');
  if (existente) {
    existente.querySelector('.nuevo-titulo').focus();
    return;
  }
  const card = crearTarjetaEditable();
  seccion.querySelector('.cards-grid').append(card);
  card.querySelector('.nuevo-titulo').focus();
}

// Muestra la imagen elegida dentro de la tarjeta.
function mostrarVistaPrevia(inputArchivo) {
  const card = inputArchivo.closest('.dish-card-nueva');
  const archivo = inputArchivo.files[0];
  if (!archivo || !archivo.type.startsWith('image/')) return;

  const preview = card.querySelector('.nuevo-preview');
  if (preview.src) URL.revokeObjectURL(preview.src);
  preview.src = URL.createObjectURL(archivo);
  preview.hidden = false;
  card.querySelector('.nuevo-img-texto').hidden = true;
  card.querySelector('.nuevo-error').hidden = true;
}

function guardarPlatoNuevo(card) {
  const seccion = card.closest('.day-section');
  const titulo = card.querySelector('.nuevo-titulo').value.trim();
  const descripcion = card.querySelector('.nuevo-desc').value.trim();
  const preview = card.querySelector('.nuevo-preview');
  const error = card.querySelector('.nuevo-error');

  let textoError = '';
  if (titulo.length < 3) textoError = 'El título debe tener al menos 3 caracteres.';
  else if (platosDeSeccion(seccion).some(p => p.titulo.toLowerCase() === titulo.toLowerCase())) textoError = 'Ese plato ya está en este día.';
  else if (preview.hidden) textoError = 'Elegí una imagen.';
  else if (descripcion === '') textoError = 'Escribí una descripción.';

  if (textoError) {
    error.textContent = textoError;
    error.hidden = false;
    return;
  }

  // La URL de la imagen es local (blob:) hasta que exista el backend.
  card.replaceWith(crearTarjeta({ titulo, descripcion, imagen: preview.src }));
  ocultarMensaje();
}

function cancelarPlatoNuevo(card) {
  const preview = card.querySelector('.nuevo-preview');
  if (preview.src) URL.revokeObjectURL(preview.src);
  card.remove();
}

// Misma estructura que las secciones del HTML, pero sin día elegido ni platos.
function crearSeccion(numero) {
  const textos = ORDEN_DIAS
    .map(dia => `<span class="day-chosen" data-day="${dia}">${DIAS[dia]}</span>`)
    .join('');
  const opciones = ORDEN_DIAS
    .map(dia => `<li><input type="radio" name="dia-${numero}" value="${dia}" id="d${numero}-${dia}" class="day-radio"><label for="d${numero}-${dia}">${DIAS[dia]}</label></li>`)
    .join('');

  return `
    <section class="day-section">
      <div class="day-header">
        <details class="day-select">
          <summary class="day-select-summary">
            <span class="day-select-text">
              <span class="day-placeholder">Seleccionar día</span>
              ${textos}
            </span>
            ${ICONO_FLECHA}
          </summary>
          <ul class="day-options">${opciones}</ul>
        </details>
        <button type="button" class="btn-cancel">Borrar día</button>
      </div>
      <div class="day-body">
        <div class="cards-grid"></div>
        <button type="button" class="icon-circle-btn btn-add-dish" aria-label="Agregar plato">${ICONO_MAS}</button>
      </div>
    </section>`;
}

// Arma el menú y devuelve { error } o { menu }.
function armarMenu() {
  const secciones = menu.querySelectorAll('.day-section');
  if (secciones.length === 0) return { error: 'Agregá al menos un día antes de publicar.' };
  if (menu.querySelector('.dish-card-nueva')) return { error: 'Guardá o cancelá el plato que estás cargando.' };

  const resultado = [];
  for (const seccion of secciones) {
    const dia = diaDeSeccion(seccion);
    if (!dia || !DIAS[dia]) return { error: 'Hay un día sin seleccionar.' };
    if (resultado.some(item => item.dia === dia)) return { error: `El ${DIAS[dia]} está repetido.` };

    const platos = platosDeSeccion(seccion);
    if (platos.length === 0) return { error: `El ${DIAS[dia]} no tiene platos cargados.` };

    resultado.push({ dia, platos });
  }

  resultado.sort((a, b) => ORDEN_DIAS.indexOf(a.dia) - ORDEN_DIAS.indexOf(b.dia));
  return { menu: resultado };
}

/* ── Eventos (delegados en <main>, así sirven también para las secciones nuevas) ── */

menu.addEventListener('click', (evento) => {
  const seccion = evento.target.closest('.day-section');
  if (!seccion) return;

  if (evento.target.closest('.card-btn-remove')) {
    evento.target.closest('.dish-card').remove();
    ocultarMensaje();
  } else if (evento.target.closest('.btn-add-dish')) {
    ocultarMensaje();
    agregarTarjetaEditable(seccion);
  } else if (evento.target.closest('[data-accion="guardar-plato"]')) {
    guardarPlatoNuevo(evento.target.closest('.dish-card-nueva'));
  } else if (evento.target.closest('[data-accion="cancelar-plato"]')) {
    cancelarPlatoNuevo(evento.target.closest('.dish-card-nueva'));
  } else if (evento.target.closest('.day-header .btn-cancel')) {
    if (confirm('¿Seguro que querés borrar este día y todos sus platos?')) {
      seccion.remove();
      ocultarMensaje();
    }
  }
});

menu.addEventListener('change', (evento) => {
  // Al elegir un día se cierra el desplegable.
  if (evento.target.matches('.day-radio')) {
    evento.target.closest('details').open = false;
    ocultarMensaje();
  }
  // Al elegir una imagen se muestra en la tarjeta.
  if (evento.target.matches('.nuevo-imagen')) {
    mostrarVistaPrevia(evento.target);
  }
});

btnAnadirDia.addEventListener('click', () => {
  contadorSecciones++;
  actionsBar.insertAdjacentHTML('beforebegin', crearSeccion(contadorSecciones));
  ocultarMensaje();
});

btnPublicar.addEventListener('click', () => {
  const { error, menu: menuSemanal } = armarMenu();
  if (error) {
    mostrarMensaje(error, true);
    return;
  }
  console.log('Menú a publicar:', JSON.stringify(menuSemanal, null, 2)); // acá iría el POST al backend
  mostrarMensaje('Menú publicado correctamente.', false);
});
