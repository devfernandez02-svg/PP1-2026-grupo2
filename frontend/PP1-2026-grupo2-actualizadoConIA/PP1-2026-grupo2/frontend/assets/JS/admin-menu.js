/* ══════════════════════════════════════════════
   ADMINISTRAR MENÚ SEMANAL (Pantalla 7) — Administrador
   CU "Realizar / Modificar / Eliminar / Confirmar menú"
   (HU-08, HU-09, HU-10, HU-11 y HU-15)
   • Arma una sección por día con sus platos.
   • (+) agrega un plato, el lápiz lo edita, (x) lo quita.
   • "Borrar día", "Añadir día" y el selector de día.
   • Los cambios son un BORRADOR hasta tocar "Publicar menús":
     recién ahí los ven los empleados en la Pantalla 3.
   • No permite borrar/renombrar platos que ya tienen pedidos
     confirmados esta semana (CU Eliminar menú, paso 2).
   ══════════════════════════════════════════════ */

const esc = AL.util.escaparHTML;
const DIAS = AL.DIAS;
const NOMBRES_DIA = AL.NOMBRES_DIA;

const contenedor = document.querySelector('#dias-admin');
const estadoCambios = document.querySelector('#estado-cambios');
const dialogPlato = document.querySelector('#modal-plato');
const formPlato = document.querySelector('#form-plato');
const tituloDialog = document.querySelector('#modal-plato-titulo');
const inputNombre = document.querySelector('#plato-nombre');
const inputDescripcion = document.querySelector('#plato-descripcion');
const selectImagen = document.querySelector('#plato-imagen');
const inputArchivo = document.querySelector('#plato-archivo');
const preview = document.querySelector('#plato-preview');
const inputStock = document.querySelector('#plato-stock');
const errorPlato = document.querySelector('#plato-error');

const ICONO_X = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICONO_LAPIZ = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
const ICONO_MAS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const ICONO_FLECHA = `<svg class="day-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

/* ══════════════════════════════════════════════
   ESTADO
   secciones = [{ uid, dia, platos: [{ id, titulo, descripcion, imagen, alt, stock }] }]
   ══════════════════════════════════════════════ */
let secciones = [];
let pedidosConfirmados = [];
let hayCambios = false;
let contadorUid = 0;

// Plato que se está editando en el popup.
let edicion = { uid: null, platoId: null, imagenSubida: null };

function nuevaSeccion(dia, platos = []) {
  contadorUid += 1;
  return { uid: 's' + contadorUid, dia, platos };
}

function marcarCambios(valor = true) {
  hayCambios = valor;
  estadoCambios.hidden = !valor;
}

function seccionPorUid(uid) {
  return secciones.find(s => s.uid === uid);
}

// Pedidos confirmados esta semana para un plato de un día.
function pedidosDelPlato(dia, titulo) {
  return AL.pedidos.contar(pedidosConfirmados, AL.fechas.fechaDelDia(dia), titulo);
}

/* ══════════════════════════════════════════════
   RENDER (mismo HTML que el diseño original)
   ══════════════════════════════════════════════ */
function crearSelectorDia(seccion) {
  const nombreGrupo = 'dia-' + seccion.uid;
  return `
    <details class="day-select">
      <summary class="day-select-summary">
        <span class="day-select-text">
          <span class="day-placeholder">Seleccionar día</span>
          ${DIAS.map(d => `<span class="day-chosen" data-day="${d}">${NOMBRES_DIA[d]}</span>`).join('')}
        </span>
        ${ICONO_FLECHA}
      </summary>
      <ul class="day-options">
        ${DIAS.map(d => `
          <li>
            <input type="radio" name="${nombreGrupo}" value="${d}" id="${seccion.uid}-${d}" class="day-radio"${d === seccion.dia ? ' checked' : ''}>
            <label for="${seccion.uid}-${d}">${NOMBRES_DIA[d]}</label>
          </li>`).join('')}
      </ul>
    </details>
  `;
}

function crearTarjeta(plato) {
  const stock = plato.stock === null || plato.stock === undefined || plato.stock === ''
    ? '' : `<span class="card-badge">Stock: ${esc(plato.stock)}</span>`;
  return `
    <article class="dish-card" data-id="${esc(plato.id)}">
      ${stock}
      <h3 class="card-title">${esc(plato.titulo)}</h3>
      <div class="card-img-wrap">
        <img src="${esc(plato.imagen)}" alt="${esc(plato.alt || plato.titulo)}" class="card-img" />
      </div>
      <p class="card-desc">${esc(plato.descripcion)}</p>
      <div class="card-acciones">
        <button type="button" class="icon-circle-btn card-btn-edit" aria-label="Editar plato ${esc(plato.titulo)}" title="Editar plato">${ICONO_LAPIZ}</button>
        <button type="button" class="icon-circle-btn card-btn-remove" aria-label="Quitar plato ${esc(plato.titulo)}" title="Quitar plato">${ICONO_X}</button>
      </div>
    </article>
  `;
}

function crearSeccion(seccion) {
  const fecha = AL.fechas.fechaDelDia(seccion.dia);
  const motivo = AL.feriados.motivo(fecha);
  const avisoFeriado = motivo
    ? `<p class="aviso-feriado-admin">El ${NOMBRES_DIA[seccion.dia].toLowerCase()} ${AL.fechas.isoACorta(fecha)} es feriado (${esc(motivo)}): esta semana los empleados no podrán pedir ese día.</p>`
    : '';

  return `
    <section class="day-section" data-uid="${seccion.uid}">
      <div class="day-header">
        ${crearSelectorDia(seccion)}
        <button type="button" class="btn-cancel btn-borrar-dia">Borrar día</button>
      </div>
      ${avisoFeriado}
      <div class="day-body">
        <div class="cards-grid">
          ${seccion.platos.length
            ? seccion.platos.map(crearTarjeta).join('')
            : '<p class="sin-platos">Este día todavía no tiene platos. Usá el botón + para agregar uno.</p>'}
        </div>
        <button type="button" class="icon-circle-btn btn-add-dish" aria-label="Agregar plato" title="Agregar plato">${ICONO_MAS}</button>
      </div>
    </section>
  `;
}

function render() {
  // Siempre ordenadas de lunes a sábado.
  secciones.sort((a, b) => DIAS.indexOf(a.dia) - DIAS.indexOf(b.dia));
  contenedor.innerHTML = secciones.length
    ? secciones.map(crearSeccion).join('')
    : '<p class="sin-platos">No hay días cargados. Tocá "Añadir día" para empezar a armar el menú.</p>';
}

/* ══════════════════════════════════════════════
   CARGA INICIAL
   ══════════════════════════════════════════════ */
async function cargarMenu() {
  if (AL.ui.redirigiendo) return;
  try {
    const [platos, pedidos] = await Promise.all([AL.menu.obtener(), AL.pedidos.todos()]);
    pedidosConfirmados = pedidos;

    secciones = DIAS
      .filter(dia => platos.some(p => p.dia === dia))
      .map(dia => nuevaSeccion(dia, platos
        .filter(p => p.dia === dia)
        .map(p => ({ ...p, stock: p.stock ?? null }))));

    render();
    marcarCambios(false);
  } catch (error) {
    console.error('Error al cargar el menú:', error);
    contenedor.innerHTML = '<p class="sin-platos">Error al cargar el menú. Intentá nuevamente más tarde.</p>';
  }
}

/* ══════════════════════════════════════════════
   ACCIONES SOBRE DÍAS
   ══════════════════════════════════════════════ */
function cambiarDia(seccion, nuevoDia, radio) {
  const ocupado = secciones.some(s => s.uid !== seccion.uid && s.dia === nuevoDia);
  if (ocupado) {
    AL.ui.notificar(`El ${NOMBRES_DIA[nuevoDia].toLowerCase()} ya tiene su propia sección.`, 'error');
    render(); // vuelve a marcar el día anterior
    return;
  }
  const conPedidos = seccion.platos.filter(p => pedidosDelPlato(seccion.dia, p.titulo) > 0);
  if (conPedidos.length > 0) {
    AL.ui.notificar('No se puede cambiar el día: hay platos con pedidos confirmados esta semana.', 'error', 5000);
    render();
    return;
  }
  seccion.dia = nuevoDia;
  radio.closest('details').open = false;
  marcarCambios();
  render();
}

async function borrarDia(seccion) {
  const conPedidos = seccion.platos.filter(p => pedidosDelPlato(seccion.dia, p.titulo) > 0);
  if (conPedidos.length > 0) {
    AL.ui.notificar(`No se puede borrar el ${NOMBRES_DIA[seccion.dia].toLowerCase()}: tiene pedidos confirmados esta semana.`, 'error', 5000);
    return;
  }
  const ok = await AL.ui.confirmar({
    titulo: 'Borrar día',
    mensaje: `Se quitará el ${NOMBRES_DIA[seccion.dia].toLowerCase()} con sus ${seccion.platos.length} plato(s) del menú.`,
    aceptar: 'Borrar',
    peligro: true
  });
  if (!ok) return;
  secciones = secciones.filter(s => s.uid !== seccion.uid);
  marcarCambios();
  render();
}

function anadirDia() {
  const libre = DIAS.find(d => !secciones.some(s => s.dia === d));
  if (!libre) {
    AL.ui.notificar('Ya están cargados todos los días de lunes a sábado.', 'info');
    return;
  }
  const seccion = nuevaSeccion(libre);
  secciones.push(seccion);
  marcarCambios();
  render();
  const nueva = contenedor.querySelector(`[data-uid="${seccion.uid}"]`);
  if (nueva) nueva.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ══════════════════════════════════════════════
   ACCIONES SOBRE PLATOS
   ══════════════════════════════════════════════ */
async function quitarPlato(seccion, platoId) {
  const plato = seccion.platos.find(p => p.id === platoId);
  if (!plato) return;

  const cantidad = pedidosDelPlato(seccion.dia, plato.titulo);
  if (cantidad > 0) {
    AL.ui.notificar(`"${plato.titulo}" tiene ${cantidad} pedido(s) confirmado(s) esta semana. No se puede quitar.`, 'error', 5000);
    return;
  }
  const ok = await AL.ui.confirmar({
    titulo: 'Quitar plato',
    mensaje: `¿Quitar "${plato.titulo}" del ${NOMBRES_DIA[seccion.dia].toLowerCase()}?`,
    aceptar: 'Quitar',
    peligro: true
  });
  if (!ok) return;
  seccion.platos = seccion.platos.filter(p => p.id !== platoId);
  marcarCambios();
  render();
}

function mostrarPreview(src) {
  preview.src = src;
}

function abrirDialogPlato(seccion, plato = null) {
  edicion = { uid: seccion.uid, platoId: plato ? plato.id : null, imagenSubida: null };
  errorPlato.hidden = true;
  formPlato.reset();

  tituloDialog.textContent = plato
    ? `Editar plato — ${NOMBRES_DIA[seccion.dia]}`
    : `Agregar plato — ${NOMBRES_DIA[seccion.dia]}`;

  // Quita la opción de "imagen subida" que pudo quedar de antes.
  selectImagen.querySelector('option[data-subida]')?.remove();

  if (plato) {
    inputNombre.value = plato.titulo;
    inputDescripcion.value = plato.descripcion;
    inputStock.value = plato.stock ?? '';
    const existe = Array.from(selectImagen.options).some(o => o.value === plato.imagen);
    if (!existe) agregarOpcionSubida(plato.imagen);
    selectImagen.value = plato.imagen;
  } else {
    selectImagen.selectedIndex = 0;
  }
  mostrarPreview(selectImagen.value);
  dialogPlato.showModal();
  inputNombre.focus();
}

function agregarOpcionSubida(src) {
  selectImagen.querySelector('option[data-subida]')?.remove();
  const opcion = document.createElement('option');
  opcion.value = src;
  opcion.textContent = 'Imagen subida';
  opcion.dataset.subida = 'true';
  selectImagen.insertBefore(opcion, selectImagen.querySelector('option[value="__subir__"]'));
}

function mostrarErrorPlato(texto) {
  errorPlato.textContent = texto;
  errorPlato.hidden = false;
}

selectImagen.addEventListener('change', () => {
  if (selectImagen.value === '__subir__') {
    inputArchivo.click();
    return;
  }
  mostrarPreview(selectImagen.value);
});

inputArchivo.addEventListener('change', async () => {
  const archivo = inputArchivo.files[0];
  inputArchivo.value = '';
  if (!archivo) {
    selectImagen.selectedIndex = 0;
    mostrarPreview(selectImagen.value);
    return;
  }
  try {
    const dataUrl = await AL.util.redimensionarImagen(archivo, 600);
    agregarOpcionSubida(dataUrl);
    selectImagen.value = dataUrl;
    mostrarPreview(dataUrl);
  } catch (error) {
    mostrarErrorPlato(error.message);
    selectImagen.selectedIndex = 0;
    mostrarPreview(selectImagen.value);
  }
});

formPlato.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const seccion = seccionPorUid(edicion.uid);
  if (!seccion) { dialogPlato.close(); return; }

  const titulo = inputNombre.value.trim().replace(/\s+/g, ' ');
  const descripcion = inputDescripcion.value.trim();
  const stockTexto = inputStock.value.trim();
  const imagen = selectImagen.value;

  // Validaciones
  if (titulo.length < 3) return mostrarErrorPlato('El nombre debe tener al menos 3 caracteres.');
  if (descripcion.length < 10) return mostrarErrorPlato('La descripción debe tener al menos 10 caracteres.');
  if (stockTexto !== '' && !/^\d{1,3}$/.test(stockTexto)) return mostrarErrorPlato('La cantidad debe ser un número entero entre 0 y 999.');
  if (!imagen || imagen === '__subir__') return mostrarErrorPlato('Elegí una imagen.');

  const repetido = seccion.platos.some(p =>
    p.id !== edicion.platoId && AL.util.normalizar(p.titulo) === AL.util.normalizar(titulo));
  if (repetido) return mostrarErrorPlato(`Ya existe "${titulo}" en el ${NOMBRES_DIA[seccion.dia].toLowerCase()}.`);

  const stock = stockTexto === '' ? null : Number(stockTexto);

  if (edicion.platoId) {
    const plato = seccion.platos.find(p => p.id === edicion.platoId);
    // Renombrar un plato con pedidos dejaría esos pedidos "huérfanos".
    if (plato.titulo !== titulo && pedidosDelPlato(seccion.dia, plato.titulo) > 0) {
      return mostrarErrorPlato('No se puede cambiar el nombre: el plato ya tiene pedidos confirmados esta semana.');
    }
    Object.assign(plato, { titulo, descripcion, imagen, alt: titulo, stock });
  } else {
    seccion.platos.push({
      id: AL.util.generarId(seccion.dia.slice(0, 3)),
      dia: seccion.dia,
      titulo,
      descripcion,
      imagen,
      alt: titulo,
      stock
    });
  }

  dialogPlato.close();
  marcarCambios();
  render();
  AL.ui.notificar(edicion.platoId ? 'Plato actualizado (recordá publicar).' : 'Plato agregado (recordá publicar).', 'info');
});

document.querySelector('#btn-plato-cancelar').addEventListener('click', () => dialogPlato.close());

/* ══════════════════════════════════════════════
   PUBLICAR (HU-11: Confirmar menú)
   ══════════════════════════════════════════════ */
async function publicar() {
  if (secciones.length === 0) {
    AL.ui.notificar('El menú no tiene días cargados.', 'error');
    return;
  }
  const vacios = secciones.filter(s => s.platos.length === 0).map(s => NOMBRES_DIA[s.dia]);
  if (vacios.length > 0) {
    AL.ui.notificar(`Agregá al menos un plato a: ${vacios.join(', ')} (o borrá ese día).`, 'error', 5000);
    return;
  }

  const feriadosSemana = secciones
    .filter(s => AL.feriados.esFeriado(AL.fechas.fechaDelDia(s.dia)))
    .map(s => NOMBRES_DIA[s.dia]);

  const totalPlatos = secciones.reduce((acc, s) => acc + s.platos.length, 0);
  let mensaje = `Se publicarán ${secciones.length} día(s) con ${totalPlatos} plato(s). Los empleados verán este menú al hacer su pedido.`;
  if (feriadosSemana.length) {
    mensaje += `\n\nAtención: ${feriadosSemana.join(', ')} es feriado esta semana y aparecerá bloqueado.`;
  }

  const ok = await AL.ui.confirmar({ titulo: 'Publicar menú', mensaje, aceptar: 'Publicar' });
  if (!ok) return;

  // Se guarda con el mismo formato que data/platos.json (+ stock).
  const platos = [];
  secciones.forEach(seccion => {
    seccion.platos.forEach(p => {
      platos.push({
        id: p.id,
        dia: seccion.dia,
        titulo: p.titulo,
        imagen: p.imagen,
        alt: p.alt || p.titulo,
        descripcion: p.descripcion,
        stock: p.stock
      });
    });
  });

  if (!AL.menu.publicar(platos)) {
    AL.ui.notificar('No se pudo publicar: no hay espacio suficiente (probá con imágenes más livianas).', 'error', 6000);
    return;
  }
  marcarCambios(false);
  AL.ui.notificar('¡Menú publicado! Los empleados ya pueden verlo.');
}

/* ══════════════════════════════════════════════
   EVENTOS (delegados en el contenedor)
   ══════════════════════════════════════════════ */
contenedor.addEventListener('change', (e) => {
  const radio = e.target.closest('.day-radio');
  if (!radio) return;
  const seccion = seccionPorUid(radio.closest('.day-section').dataset.uid);
  if (seccion) cambiarDia(seccion, radio.value, radio);
});

contenedor.addEventListener('click', (e) => {
  const seccionEl = e.target.closest('.day-section');
  if (!seccionEl) return;
  const seccion = seccionPorUid(seccionEl.dataset.uid);
  if (!seccion) return;

  if (e.target.closest('.btn-borrar-dia')) return borrarDia(seccion);
  if (e.target.closest('.btn-add-dish')) return abrirDialogPlato(seccion);

  const tarjeta = e.target.closest('.dish-card');
  if (!tarjeta) return;
  const plato = seccion.platos.find(p => p.id === tarjeta.dataset.id);

  if (e.target.closest('.card-btn-remove')) return quitarPlato(seccion, tarjeta.dataset.id);
  if (e.target.closest('.card-btn-edit') || e.target.closest('.card-img-wrap') || e.target.closest('.card-title')) {
    abrirDialogPlato(seccion, plato);
  }
});

// Cierra el desplegable de días al hacer clic afuera.
document.addEventListener('click', (e) => {
  document.querySelectorAll('.day-select[open]').forEach(d => {
    if (!d.contains(e.target)) d.open = false;
  });
});

document.querySelector('#btn-anadir-dia').addEventListener('click', anadirDia);
document.querySelector('#btn-publicar').addEventListener('click', publicar);

// Aviso si se intenta salir con cambios sin publicar.
window.addEventListener('beforeunload', (e) => {
  if (hayCambios && !AL.ui.redirigiendo) {
    e.preventDefault();
    e.returnValue = '';
  }
});

cargarMenu();
