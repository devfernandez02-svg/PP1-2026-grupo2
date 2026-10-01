const ICONO_CHECK = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
`;

/* ══════════════════════════════════════════════
   DÍAS RECIBIDOS
   La pantalla recibe los días a mostrar. Acá se leen
   desde la query string (?dias=lunes,miercoles,jueves).
   Si no viene nada, NO se muestra el menú: se avisa al usuario
   y se le ofrece volver a la pantalla de configuración.
   ══════════════════════════════════════════════ */
// Días permitidos, en el orden en que se muestran en pantalla.
// Sirve como "lista blanca": cualquier otro valor de la URL se descarta.
const DIAS_VALIDOS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

// "  Miércoles " -> "miercoles" (sin tildes, sin espacios, en minúsculas)
function normalizarDia(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function obtenerDiasRecibidos() {
  const params = new URLSearchParams(window.location.search);
  const diasParam = params.get('dias');

  // Si no llegó el parámetro NO se inventan días: se devuelve vacío
  // y cargarPlatos() muestra un aviso en lugar de todo el menú.
  if (!diasParam) return [];

  const recibidos = new Set(diasParam.split(',').map(normalizarDia));

  // Se filtra contra DIAS_VALIDOS: descarta días inexistentes,
  // elimina repetidos y ordena de lunes a sábado.
  return DIAS_VALIDOS.filter(dia => recibidos.has(dia));
}

// Días que se van a mostrar. Nunca se reasigna.
const DIAS_RECIBIDOS = obtenerDiasRecibidos();

const NOMBRES_DIA = {
  lunes: 'LUNES',
  martes: 'MARTES',
  miercoles: 'MIÉRCOLES',
  jueves: 'JUEVES',
  viernes: 'VIERNES',
  sabado: 'SÁBADO'
};

// Días que efectivamente tienen al menos un plato cargado.
// Solo a estos se les va a exigir una selección al guardar el pedido.
let diasConPlatosDisponibles = [];

/* ══════════════════════════════════════════════
   ESTADO DEL PEDIDO
   ══════════════════════════════════════════════ */
// "Base de datos" en memoria por ahora. El día de mañana,
// guardarPedido() puede cambiar a un fetch y esta línea
// puede seguir existiendo como caché local si querés.
const pedidos = [];

// El pedido que el usuario armó con las tarjetas, mostrado en
// el popup, pero que todavía NO se confirmó ni se guardó.
let pedidoPendiente = null;

const dialogResumen = document.querySelector('#modal-resumen');
const formPedido = document.querySelector('#form-pedido');
const listaResumen = document.querySelector('#resumen-lista');
const inputComentarios = document.querySelector('#comentarios');
const dialogError = document.querySelector('#modal-error');
const mensajeErrorTexto = document.querySelector('#mensaje-error-texto');

/* ══════════════════════════════════════════════
   RENDER
   ══════════════════════════════════════════════ */
function crearSeccionDia(dia) {
  const nombre = NOMBRES_DIA[dia] || dia.toUpperCase();
  return `
    <section class="day-section" data-dia="${dia}">
      <div class="day-header">
        <div class="day-line"></div>
        <h2 class="day-title">${nombre}</h2>
        <div class="day-line"></div>
      </div>
      <div class="cards-grid" id="grid-${dia}"></div>
    </section>
  `;
}

function crearContenedoresDias() {
  const contenedor = document.querySelector('#dias-container');
  contenedor.innerHTML = DIAS_RECIBIDOS.map(crearSeccionDia).join('');
}

function crearTarjeta(plato) {
  return `
  <article class="dish-card" data-dia="${plato.dia}" data-titulo="${plato.titulo}">
    <h3 class="card-title">${plato.titulo}</h3>
    <div class="card-img-wrap">
      <img src="${plato.imagen}" alt="${plato.alt}" class="card-img" />
    </div>
    <p class="card-desc">${plato.descripcion}</p>
    <button class="card-btn" type="button" aria-label="Seleccionar plato" data-dia="${plato.dia}" data-titulo="${plato.titulo}">
      ${ICONO_CHECK}
      <span class="card-btn-label">Seleccionar</span>
    </button>
  </article>
  `;
}

function renderPlato(lista, selector) {
  const contenedor = document.querySelector(selector);
  if (!contenedor) {
    console.warn('No existe el contenedor', selector);
    return;
  }
  contenedor.innerHTML = lista.map(crearTarjeta).join('');
}

function mostrarErrorDia(dia) {
  const contenedor = document.querySelector(`#grid-${dia}`);
  if (!contenedor) return;
  contenedor.innerHTML = `<p class="mensaje-vacio">no hay platos asignados para el dia: ${dia}</p>`;
}

function mostrarErrorGeneral(texto) {
  const contenedor = document.querySelector('#dias-container');
  contenedor.innerHTML = `<p class="mensaje-error">${texto}</p>`;
}

/* ══════════════════════════════════════════════
   CARGA DE PLATOS
   ══════════════════════════════════════════════ */
async function cargarPlatos() {
  // Sin días recibidos no hay nada que mostrar: se avisa y se corta.
  if (DIAS_RECIBIDOS.length === 0) {
    mostrarErrorGeneral(
      'No se recibieron días de asistencia. ' +
      '<a href="Pantalla_2-config-asistencia.html">Volver a configurar los días</a>'
    );
    document.querySelector('.actions-bar').style.display = 'none';
    return;
  }

  try {
    const respuesta = await fetch('data/platos.json');
    if (!respuesta.ok) {
      throw new Error('No se pudo leer el JSON. Estado: ' + respuesta.status);
    }
    const platos = await respuesta.json();

    crearContenedoresDias();
    diasConPlatosDisponibles = [];

    DIAS_RECIBIDOS.forEach(dia => {
      const platosDelDia = platos.filter(p => p.dia === dia);

      if (platosDelDia.length === 0) {
        mostrarErrorDia(dia);
      } else {
        renderPlato(platosDelDia, `#grid-${dia}`);
        diasConPlatosDisponibles.push(dia);
      }
    });

    activarSeleccionDePlatos();
  } catch (error) {
    console.error('Error al cargar los platos:', error);
    mostrarErrorGeneral('Error al cargar los platos. Intente nuevamente más tarde.');
  }
}

/* ══════════════════════════════════════════════
   SELECCIÓN (un plato por día)
   ══════════════════════════════════════════════ */
function actualizarTextoBoton(boton, seleccionado) {
  const label = boton.querySelector('.card-btn-label');
  label.textContent = seleccionado ? 'Seleccionado' : 'Seleccionar';
}

function activarSeleccionDePlatos() {
  const contenedor = document.querySelector('#dias-container');

  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.card-btn');
    if (!boton) return;

    const tarjeta = boton.closest('.dish-card');
    const seccion = boton.closest('.day-section');
    if (!tarjeta || !seccion) return;

    const yaSeleccionada = tarjeta.classList.contains('dish-card--seleccionada');

    // Como máximo un plato seleccionado por día: se limpia
    // cualquier otra tarjeta seleccionada dentro de la misma sección.
    seccion.querySelectorAll('.dish-card--seleccionada').forEach(otra => {
      otra.classList.remove('dish-card--seleccionada');
      actualizarTextoBoton(otra.querySelector('.card-btn'), false);
    });

    if (!yaSeleccionada) {
      tarjeta.classList.add('dish-card--seleccionada');
      actualizarTextoBoton(boton, true);
    }
  });
}

/* ══════════════════════════════════════════════
   PASO 1: ARMAR EL PEDIDO A PARTIR DE LAS TARJETAS
   ══════════════════════════════════════════════ */
function obtenerPedidoSeleccionado() {
  const pedido = {};
  const faltantes = [];

  diasConPlatosDisponibles.forEach(dia => {
    const seccion = document.querySelector(`.day-section[data-dia="${dia}"]`);
    const tarjetaSeleccionada = seccion
      ? seccion.querySelector('.dish-card--seleccionada')
      : null;

    if (tarjetaSeleccionada) {
      pedido[dia] = { titulo: tarjetaSeleccionada.dataset.titulo };
    } else {
      faltantes.push(dia);
    }
  });

  return { pedido, faltantes };
}

/* ══════════════════════════════════════════════
   PASO 2: MOSTRAR EL POPUP CON EL RESUMEN
   ══════════════════════════════════════════════ */
   
function abrirResumen(pedido) {
  pedidoPendiente = pedido;

  listaResumen.innerHTML = Object.entries(pedido)
    .map(([dia, plato]) => {
      const nombreDia = NOMBRES_DIA[dia] || dia.toUpperCase();
      return `<li><strong>${nombreDia}:</strong> ${plato.titulo}</li>`;
    })
    .join('');

  inputComentarios.value = '';
  dialogResumen.showModal();
}

// Muestra un error en un popup aparte, chico, solo con "Aceptar".
function mostrarError(texto) {
  mensajeErrorTexto.textContent = texto;
  dialogError.showModal();
}

document.querySelector('#btn-aceptar-error').addEventListener('click', () => {
  dialogError.close();
});

document.querySelector('#btn-guardar').addEventListener('click', () => {
  if (diasConPlatosDisponibles.length === 0) {
    mostrarError('No hay platos disponibles para guardar un pedido.');
    return;
  }

  const { pedido, faltantes } = obtenerPedidoSeleccionado();

  if (faltantes.length > 0) {
    mostrarError('Falta elegir un plato para: ' + faltantes.join(', '));
    return;
  }

  abrirResumen(pedido);
});

// "Volver a seleccionar": cierra el popup sin guardar nada.
// Las tarjetas siguen tal cual estaban marcadas.
document.querySelector('#btn-volver-seleccionar').addEventListener('click', () => {
  dialogResumen.close();
});

/* ══════════════════════════════════════════════
   PASO 3: CONFIRMAR Y GUARDAR
   ══════════════════════════════════════════════ */
  
async function guardarPedido(pedido) {
  pedidos.push(pedido); // hoy: en memoria
}

function renderPedidos() {
  // Por ahora solo lo dejamos ver en consola para comprobar que
  // se guardó. Más adelante esto puede pintar una lista en pantalla
  // (por ejemplo, un historial de pedidos del usuario).
  console.log('Pedidos guardados hasta ahora:', pedidos);
}

// Toast simple para avisar que el pedido se confirmó, sin usar alert().
function mostrarToast(texto) {
  const toast = document.createElement('div');
  toast.className = 'toast-confirmacion';
  toast.textContent = texto;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('toast-visible'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

formPedido.addEventListener('submit', async (e) => {
  e.preventDefault(); // evita que el form recargue la página

  // Si por algún motivo no hay pedido pendiente (se envió el
  // form estando en modo error), no hay nada que guardar.
  if (!pedidoPendiente) {
    dialogResumen.close();
    return;
  }

  const nuevoPedido = {
    platos: pedidoPendiente,
    comentarios: inputComentarios.value.trim(),
    fecha: new Date().toISOString()
  };

  await guardarPedido(nuevoPedido);
  renderPedidos();

  dialogResumen.close();
  pedidoPendiente = null;
  cancelarPedido(); // limpia las tarjetas ya que el pedido quedó confirmado
  mostrarToast('¡Pedido confirmado!');

  // Pasa a la Pantalla 4 el plato elegido para cada día, por URL
  // (?lunes=Guiso+de+Arroz&miercoles=Tarta+de+Verdura)
  const parametros = new URLSearchParams();
  Object.entries(nuevoPedido.platos).forEach(([dia, plato]) => {
    parametros.append(dia, plato.titulo);
  });
  setTimeout(() => {
    window.location.href = 'Pantalla_4-resumen-pedido.html?' + parametros.toString();
  }, 1500);
});

function cancelarPedido() {
  document.querySelectorAll('.dish-card--seleccionada').forEach(tarjeta => {
    tarjeta.classList.remove('dish-card--seleccionada');
    actualizarTextoBoton(tarjeta.querySelector('.card-btn'), false);
  });
}

document.querySelector('#btn-cancelar').addEventListener('click', cancelarPedido);




cargarPlatos();