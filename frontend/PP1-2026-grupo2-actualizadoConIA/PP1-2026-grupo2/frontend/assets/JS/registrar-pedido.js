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

const USUARIO = AL.ui.usuario;

function obtenerDiasRecibidos() {
  const params = new URLSearchParams(window.location.search);
  const diasParam = params.get('dias');

  // Si no llegó el parámetro se usan los días que el empleado
  // guardó en la Pantalla 2. Si tampoco hay, se devuelve vacío
  // y cargarPlatos() muestra un aviso en lugar de todo el menú.
  if (!diasParam) {
    return (USUARIO && AL.asistencia.obtener(USUARIO.id)) || [];
  }

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
//const inputComentarios = document.querySelector('#comentarios');
const dialogError = document.querySelector('#modal-error');
const mensajeErrorTexto = document.querySelector('#mensaje-error-texto');

/* ══════════════════════════════════════════════
   RENDER
   ══════════════════════════════════════════════ */
// Fecha real de cada día dentro de la semana del menú (ej.: lunes -> 2026-10-12)
const FECHAS_SEMANA = {};
DIAS_VALIDOS.forEach(dia => { FECHAS_SEMANA[dia] = AL.fechas.fechaDelDia(dia); });

function crearSeccionDia(dia) {
  const nombre = NOMBRES_DIA[dia] || dia.toUpperCase();
  return `
    <section class="day-section" data-dia="${dia}" id="dia-${dia}">
      <div class="day-header">
        <div class="day-line"></div>
        <h2 class="day-title">${nombre}<span class="al-fecha-dia">${AL.fechas.isoACorta(FECHAS_SEMANA[dia])}</span></h2>
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

// Pedidos confirmados de todos los empleados (para calcular el stock).
let pedidosConfirmados = [];

// Cuántas unidades le quedan a un plato ese día (null = sin límite).
function unidadesRestantes(plato) {
  if (plato.stock === undefined || plato.stock === null || plato.stock === '') return null;
  const usados = AL.pedidos.contar(
    pedidosConfirmados, FECHAS_SEMANA[plato.dia], plato.titulo, USUARIO && USUARIO.id
  );
  return Math.max(0, Number(plato.stock) - usados);
}

function crearTarjeta(plato) {
  const esc = AL.util.escaparHTML;
  const restantes = unidadesRestantes(plato);
  const agotado = restantes === 0;

  let badge = '';
  if (agotado) badge = '<span class="al-badge al-badge--agotado">Agotado</span>';
  else if (restantes !== null && restantes <= 5) badge = `<span class="al-badge">Quedan ${restantes}</span>`;

  return `
  <article class="dish-card${agotado ? ' al-agotada' : ''}" data-dia="${esc(plato.dia)}" data-titulo="${esc(plato.titulo)}" data-agotado="${agotado}">
    ${badge}
    <h3 class="card-title">${esc(plato.titulo)}</h3>
    <div class="card-img-wrap">
      <img src="${esc(plato.imagen)}" alt="${esc(plato.alt || plato.titulo)}" class="card-img" />
    </div>
    <p class="card-desc">${esc(plato.descripcion)}</p>
    <button class="card-btn" type="button" aria-label="Seleccionar plato" data-dia="${esc(plato.dia)}" data-titulo="${esc(plato.titulo)}"${agotado ? ' aria-disabled="true"' : ''}>
      ${ICONO_CHECK}
      <span class="card-btn-label">${agotado ? 'Agotado' : 'Seleccionar'}</span>
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
  contenedor.innerHTML = `<p class="mensaje-vacio">Aún no hay platos asignados para el ${NOMBRES_DIA[dia].toLowerCase()}.</p>`;
}

// Día feriado: bloqueado con indicador visual (CU Consultar menú, paso 5).
function mostrarFeriado(dia, motivo) {
  const contenedor = document.querySelector(`#grid-${dia}`);
  if (!contenedor) return;
  contenedor.innerHTML = `<p class="al-mensaje-feriado">Feriado: ${AL.util.escaparHTML(motivo)}. Este día no se reciben pedidos.</p>`;
}

function mostrarErrorGeneral(texto) {
  const contenedor = document.querySelector('#dias-container');
  contenedor.innerHTML = `<p class="mensaje-error">${texto}</p>`;
}

/* ══════════════════════════════════════════════
   CARGA DE PLATOS
   ══════════════════════════════════════════════ */
async function cargarPlatos() {
  if (AL.ui.redirigiendo) return; // sin sesión: ui.js ya está redirigiendo

  // Sin días recibidos no hay nada que mostrar: se avisa y se corta.
  if (DIAS_RECIBIDOS.length === 0) {
    mostrarErrorGeneral(
      'No se recibieron días de asistencia. ' +
      `<a href="${AL.ui.PAGINAS.asistencia}">Volver a configurar los días</a>`
    );
    document.querySelector('.actions-bar').style.display = 'none';
    return;
  }

  try {
    // Menú publicado por el administrador (o platos.json) + pedidos para el stock
    const [platos, todosLosPedidos] = await Promise.all([AL.menu.obtener(), AL.pedidos.todos()]);
    pedidosConfirmados = todosLosPedidos;

    crearContenedoresDias();
    diasConPlatosDisponibles = [];

    DIAS_RECIBIDOS.forEach(dia => {
      const motivoFeriado = AL.feriados.motivo(FECHAS_SEMANA[dia]);
      if (motivoFeriado !== null) {
        mostrarFeriado(dia, motivoFeriado);
        return;
      }

      const platosDelDia = platos.filter(p => p.dia === dia);

      if (platosDelDia.length === 0) {
        mostrarErrorDia(dia);
      } else {
        renderPlato(platosDelDia, `#grid-${dia}`);
        diasConPlatosDisponibles.push(dia);
      }
    });

    activarSeleccionDePlatos();
    restaurarSeleccionPrevia();
    enfocarDiaPedido();
  } catch (error) {
    console.error('Error al cargar los platos:', error);
    mostrarErrorGeneral('Error al cargar los platos. Intente nuevamente más tarde.');
  }
}

// Si el empleado ya tenía un borrador (o un pedido confirmado esta semana),
// sus platos aparecen marcados para poder MODIFICARLOS (HU-04).
function restaurarSeleccionPrevia() {
  if (!USUARIO) return;
  let elegidos = {};
  const borrador = AL.borrador.obtener(USUARIO.id);

  if (borrador) {
    elegidos = borrador.platos;
  } else {
    AL.pedidos.deUsuarioEnSemana(USUARIO.id).forEach(p => { elegidos[p.dia] = p.menu; });
  }

  Object.entries(elegidos).forEach(([dia, titulo]) => {
    const seccion = document.querySelector(`.day-section[data-dia="${dia}"]`);
    if (!seccion) return;
    const tarjeta = Array.from(seccion.querySelectorAll('.dish-card'))
      .find(t => t.dataset.titulo === titulo && t.dataset.agotado !== 'true');
    if (tarjeta) {
      tarjeta.classList.add('dish-card--seleccionada');
      actualizarTextoBoton(tarjeta.querySelector('.card-btn'), true);
    }
  });
}

// Desde la Pantalla 4, "Modificar" de un día llega con ?foco=dia
function enfocarDiaPedido() {
  const foco = new URLSearchParams(window.location.search).get('foco');
  const seccion = foco && document.querySelector(`#dia-${normalizarDia(foco)}`);
  if (seccion) seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    // CU Realizar pedido: un menú agotado no se puede seleccionar.
    if (tarjeta.dataset.agotado === 'true') {
      mostrarError('Ese plato está agotado. Elegí otra opción para ese día.');
      return;
    }

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
      return `<li><strong>${nombreDia}:</strong> ${AL.util.escaparHTML(plato.titulo)}</li>`;
    })
    .join('');

  //inputComentarios.value = '';
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
  
// HU-01: el pedido queda guardado como BORRADOR (localStorage).
// Se confirma recién en la Pantalla 4.
async function guardarPedido(pedido) {
  pedidos.push(pedido);
  const platos = {};
  Object.entries(pedido.platos).forEach(([dia, plato]) => { platos[dia] = plato.titulo; });
  const anterior = AL.borrador.obtener(USUARIO.id);
  AL.borrador.guardar(USUARIO.id, platos, anterior ? anterior.comentarios : {});
}

function renderPedidos() {
  // Por ahora solo lo dejamos ver en consola para comprobar que
  // se guardó. Más adelante esto puede pintar una lista en pantalla
  // (por ejemplo, un historial de pedidos del usuario).
  console.log('Pedidos guardados hasta ahora:', pedidos);
}

// Aviso centrado de éxito (reemplaza al toast chico de abajo).
// Se crea desde JS, así no hace falta tocar el HTML.
const PANTALLA_RESUMEN = AL.ui.PAGINAS.resumen;
const ESPERA_REDIRECCION_MS = 2000; // tiempo que se ve "Pedido guardado"

function mostrarMensajeExito(texto) {
  const aviso = document.createElement('div');
  aviso.className = 'aviso-exito';
  aviso.setAttribute('role', 'status');      // los lectores de pantalla lo anuncian
  aviso.setAttribute('aria-live', 'polite');
  aviso.innerHTML = `
    <div class="aviso-exito__caja">
      <div class="aviso-exito__icono">${ICONO_CHECK}</div>
      <p class="aviso-exito__texto"></p>
    </div>
  `;
  // textContent y no innerHTML: el texto nunca se interpreta como HTML
  aviso.querySelector('.aviso-exito__texto').textContent = texto;
  document.body.appendChild(aviso);

  // Un instante después se agrega la clase para que corra la animación
  requestAnimationFrame(() => aviso.classList.add('aviso-exito--visible'));
}

// Si el usuario vuelve con el botón "atrás" y el navegador restaura
// la página desde memoria, se limpia el aviso y se rehabilita el botón.
window.addEventListener('pageshow', (evento) => {
  if (!evento.persisted) return;
  document.querySelector('.aviso-exito')?.remove();
  const botonConfirmar = formPedido.querySelector('button[type="submit"]');
  if (botonConfirmar) botonConfirmar.disabled = false;
});

formPedido.addEventListener('submit', async (e) => {
  e.preventDefault(); // evita que el form recargue la página

  // Si por algún motivo no hay pedido pendiente (se envió el
  // form estando en modo error), no hay nada que guardar.
  if (!pedidoPendiente) {
    dialogResumen.close();
    return;
  }

  // Evita que un doble clic guarde el pedido dos veces
  const botonConfirmar = formPedido.querySelector('button[type="submit"]');
  botonConfirmar.disabled = true;

  const nuevoPedido = {
    platos: pedidoPendiente,
  //  comentarios: inputComentarios.value.trim(),
    fecha: new Date().toISOString()
  };

  await guardarPedido(nuevoPedido);
  renderPedidos();

  // Armamos la query string con lo que eligió el usuario:
  // ?lunes=Milanesa&miercoles=Tarta ...
  // URLSearchParams se encarga de codificar tildes, espacios y símbolos.
  const params = new URLSearchParams();
  Object.entries(nuevoPedido.platos).forEach(([dia, plato]) => {
    params.set(dia, plato.titulo);
  });

  dialogResumen.close();
  pedidoPendiente = null;

  // Mensaje visible, y recién después de un momento pasamos a la Pantalla 4
  // LLEVANDO los platos en la URL.
  mostrarMensajeExito('Pedido guardado');
  setTimeout(() => {
    window.location.href = PANTALLA_RESUMEN + '?' + params.toString();
  }, ESPERA_REDIRECCION_MS);
});

function cancelarPedido() {
  document.querySelectorAll('.dish-card--seleccionada').forEach(tarjeta => {
    tarjeta.classList.remove('dish-card--seleccionada');
    actualizarTextoBoton(tarjeta.querySelector('.card-btn'), false);
  });
}

document.querySelector('#btn-cancelar').addEventListener('click', cancelarPedido);




cargarPlatos();
