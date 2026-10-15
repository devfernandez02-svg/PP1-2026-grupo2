/* ══════════════════════════════════════════════
   RESUMEN DEL PEDIDO (Pantalla 4) — Empleado
   CU "Confirmar pedido" (HU-02) y "Modificar pedido" (HU-04)
   Recibe por URL el plato elegido para cada día
   (?lunes=Titulo&miercoles=Titulo). Si no llega nada,
   usa el borrador guardado o el pedido ya confirmado.
   Al confirmar, el pedido pasa al consolidado diario
   del administrador (Pantalla 5).
   ══════════════════════════════════════════════ */

const NOMBRES_DIA = AL.NOMBRES_DIA;

// Lista blanca de días, en el orden en que se muestran.
const DIAS_VALIDOS = AL.DIAS;

const PANTALLA_REGISTRAR = AL.ui.PAGINAS.menu;
const USUARIO = AL.ui.usuario;
const esc = AL.util.escaparHTML;

const contenedor = document.querySelector('.contenedor');
const intro = document.querySelector('#intro');
const seccionInferior = document.querySelector('.seccion-inferior');
const btnConfirmar = document.querySelector('#btn-confirmar');
const btnCancelar = document.querySelector('#btn-cancelar');

// 'url' | 'borrador' | 'confirmado'
let origenDatos = 'url';

// Mientras se confirma no se vuelve a escribir el borrador.
let confirmando = false;
let temporizador = null;

// Lee la URL y devuelve pares [dia, titulo] SOLO de días válidos,
// ordenados de lunes a sábado. Cualquier otro parámetro se ignora.
function obtenerPlatosDeURL() {
  const params = new URLSearchParams(window.location.search);
  return DIAS_VALIDOS
    .filter(dia => params.has(dia))
    .map(dia => [dia, params.get(dia)]);
}

// Si no llegó nada por URL: borrador → pedido confirmado de la semana.
function obtenerPlatosRecibidos() {
  const deURL = obtenerPlatosDeURL();
  if (deURL.length > 0) { origenDatos = 'url'; return deURL; }

  const borrador = AL.borrador.obtener(USUARIO.id);
  if (borrador && Object.keys(borrador.platos).length > 0) {
    origenDatos = 'borrador';
    return DIAS_VALIDOS.filter(d => borrador.platos[d]).map(d => [d, borrador.platos[d]]);
  }

  const confirmados = AL.pedidos.deUsuarioEnSemana(USUARIO.id);
  origenDatos = 'confirmado';
  return DIAS_VALIDOS
    .map(dia => confirmados.find(p => p.dia === dia))
    .filter(Boolean)
    .map(p => [p.dia, p.menu]);
}

// Comentario previo de un día (borrador o pedido confirmado).
function comentarioPrevio(dia) {
  const borrador = AL.borrador.obtener(USUARIO.id);
  if (borrador && borrador.comentarios && borrador.comentarios[dia]) return borrador.comentarios[dia];
  const confirmado = AL.pedidos.deUsuarioEnSemana(USUARIO.id).find(p => p.dia === dia);
  if (confirmado && confirmado.comentario !== 'Sin comentarios') return confirmado.comentario;
  return '';
}

// Arma la tarjeta de un día.
function crearDia(dia, plato) {
  const nombre = NOMBRES_DIA[dia];
  const fecha = AL.fechas.fechaDelDia(dia);
  return `
      <article class="Dia" data-dia="${dia}" data-titulo="${esc(plato.titulo)}">
        <h3>${nombre} ${AL.fechas.isoACorta(fecha)}</h3>
        <div class="pedido">
          <h4>${esc(plato.titulo)}</h4>
          <img src="${esc(plato.imagen)}" alt="${esc(plato.alt || plato.titulo)}">
          <p>${esc(plato.descripcion)}</p>
          <button class="mod" type="button" data-dia="${dia}">Modificar</button>
        </div>
        <div class="caja-comentarios">
          <label for="comentario-${dia}">Comentarios para el ${nombre.toLowerCase()}</label>
          <textarea id="comentario-${dia}" name="comentario-${dia}" maxlength="200"
            placeholder="Ej: sin cebolla, entregar después de las 18 hs...">${esc(comentarioPrevio(dia))}</textarea>
        </div>
      </article>
  `;
}

// Días que tiene el pedido actual, para volver a la Pantalla 3.
function diasDelPedido() {
  const asistencia = AL.asistencia.obtener(USUARIO.id) || [];
  const delPedido = Array.from(document.querySelectorAll('.Dia')).map(a => a.dataset.dia);
  return DIAS_VALIDOS.filter(d => asistencia.includes(d) || delPedido.includes(d));
}

// Vuelve a la pantalla de selección (con foco en un día, si se indica).
function volverAlMenu(foco) {
  guardarComentariosEnBorrador();
  const params = { dias: diasDelPedido().join(',') };
  if (foco) params.foco = foco;
  AL.ui.irA(PANTALLA_REGISTRAR, params);
}

// Los comentarios se guardan en el borrador para no perderlos
// si el empleado vuelve a modificar un plato.
function guardarComentariosEnBorrador() {
  if (confirmando) return;
  const platos = {};
  const comentarios = {};
  document.querySelectorAll('.Dia').forEach(articulo => {
    const dia = articulo.dataset.dia;
    platos[dia] = articulo.dataset.titulo;
    comentarios[dia] = articulo.querySelector('textarea').value.trim();
  });
  if (Object.keys(platos).length > 0) AL.borrador.guardar(USUARIO.id, platos, comentarios);
}

function actualizarIntro() {
  if (origenDatos === 'confirmado') {
    intro.textContent = 'Tu pedido de esta semana está confirmado ✔ Podés modificarlo y volver a confirmar.';
    btnConfirmar.textContent = 'Guardar cambios';
  } else {
    intro.textContent = 'Verificá tus pedidos antes de confirmar';
    btnConfirmar.textContent = 'Confirmar';
  }
}

async function cargarResumen() {
  if (AL.ui.redirigiendo || !USUARIO) return;

  const recibidos = obtenerPlatosRecibidos();

  if (recibidos.length === 0) {
    contenedor.innerHTML = `
      <p class="mensaje">
        Todavía no tenés un pedido para esta semana.
        <a href="${PANTALLA_REGISTRAR}">Elegir platos</a>
      </p>`;
    seccionInferior.style.display = 'none';
    return;
  }

  actualizarIntro();

  try {
    const platos = await AL.menu.obtener();

    contenedor.innerHTML = recibidos
      .map(([dia, titulo]) => {
        const plato = platos.find(p => p.dia === dia && p.titulo === titulo);
        if (!plato) {
          return `<p class="mensaje">El plato elegido para el ${NOMBRES_DIA[dia].toLowerCase()} ya no está en el menú.
                  <a href="#" data-foco="${dia}">Elegir otro</a></p>`;
        }
        return crearDia(dia, plato);
      })
      .join('');

    // Si hubo cambios por URL, se guardan como borrador.
    if (origenDatos === 'url') guardarComentariosEnBorrador();
  } catch (error) {
    console.error('Error al cargar el resumen:', error);
    contenedor.innerHTML = '<p class="mensaje">Error al cargar el pedido. Intente nuevamente más tarde.</p>';
  }
}

/* ══════════════════════════════════════════════
   CONFIRMAR PEDIDO
   ══════════════════════════════════════════════ */
async function confirmarPedido() {
  const articulos = Array.from(document.querySelectorAll('.Dia'));
  if (articulos.length === 0) {
    AL.ui.notificar('No hay platos para confirmar.', 'error');
    return;
  }
  if (document.querySelector('.contenedor .mensaje')) {
    AL.ui.notificar('Hay un día con un plato que ya no existe. Elegí otro antes de confirmar.', 'error');
    return;
  }

  btnConfirmar.disabled = true;
  confirmando = true;
  clearTimeout(temporizador); // evita que un guardado pendiente recree el borrador

  try {
    const [platos, todosLosPedidos] = await Promise.all([AL.menu.obtener(), AL.pedidos.todos()]);
    const items = [];
    const problemas = [];

    articulos.forEach(articulo => {
      const dia = articulo.dataset.dia;
      const titulo = articulo.dataset.titulo;
      const fecha = AL.fechas.fechaDelDia(dia);
      const plato = platos.find(p => p.dia === dia && p.titulo === titulo);

      // El admin pudo marcar el día como feriado mientras tanto.
      if (AL.feriados.esFeriado(fecha)) {
        problemas.push(`${NOMBRES_DIA[dia]} es feriado`);
        return;
      }
      // Control de stock (CU Realizar pedido / HU-15)
      if (plato && plato.stock !== undefined && plato.stock !== null && plato.stock !== '') {
        const usados = AL.pedidos.contar(todosLosPedidos, fecha, titulo, USUARIO.id);
        if (usados >= Number(plato.stock)) {
          problemas.push(`${titulo} (${NOMBRES_DIA[dia]}) está agotado`);
          return;
        }
      }
      items.push({
        dia,
        fecha,
        menu: titulo,
        comentario: articulo.querySelector('textarea').value.trim()
      });
    });

    if (problemas.length > 0) {
      AL.ui.notificar('No se pudo confirmar: ' + problemas.join(', ') + '. Modificá esos días.', 'error', 6000);
      btnConfirmar.disabled = false;
      confirmando = false;
      return;
    }

    const resultado = AL.pedidos.confirmarSemana(USUARIO, items);
    if (!resultado.ok) throw new Error('No se pudo guardar el pedido');

    AL.borrador.borrar(USUARIO.id);
    AL.ui.mostrarExito(origenDatos === 'confirmado' ? '¡Pedido actualizado!' : '¡Pedido confirmado!');

    // Se recarga la pantalla sin parámetros: muestra el pedido confirmado.
    setTimeout(() => AL.ui.irA(AL.ui.PAGINAS.resumen), 1800);
  } catch (error) {
    console.error(error);
    AL.ui.notificar('Ocurrió un error al confirmar el pedido. Intentá nuevamente.', 'error');
    btnConfirmar.disabled = false;
    confirmando = false;
  }
}

/* ── Eventos ── */

// "Modificar" (dentro de cada tarjeta) lleva al menú enfocando ese día.
contenedor.addEventListener('click', (e) => {
  const boton = e.target.closest('.mod');
  if (boton) { volverAlMenu(boton.dataset.dia); return; }

  const enlace = e.target.closest('[data-foco]');
  if (enlace) { e.preventDefault(); volverAlMenu(enlace.dataset.foco); }
});

// Los comentarios se guardan en el borrador mientras se escriben.
contenedor.addEventListener('input', (e) => {
  if (e.target.tagName !== 'TEXTAREA' || origenDatos === 'confirmado') return;
  clearTimeout(temporizador);
  temporizador = setTimeout(guardarComentariosEnBorrador, 400);
});

// "Cancelar": vuelve al menú para modificar todos los días.
btnCancelar.addEventListener('click', () => volverAlMenu());
btnConfirmar.addEventListener('click', confirmarPedido);

cargarResumen();
