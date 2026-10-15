/* ══════════════════════════════════════════════
   RESUMEN DEL PEDIDO (Pantalla 4)
   Recibe por URL el plato elegido para cada día
   (?lunes=Titulo&miercoles=Titulo), lo busca en
   platos.json y lo muestra en pantalla.
   ══════════════════════════════════════════════ */

const NOMBRES_DIA = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado'
};

// Lista blanca de días, en el orden en que se muestran.
const DIAS_VALIDOS = Object.keys(NOMBRES_DIA);

const PANTALLA_REGISTRAR = 'Pantalla_3-registrar-pedido.html';

// Lee la URL y devuelve pares [dia, titulo] SOLO de días válidos,
// ordenados de lunes a sábado. Cualquier otro parámetro se ignora
// (así nadie puede meter texto raro en la página desde la URL).
function obtenerPlatosRecibidos() {
  const params = new URLSearchParams(window.location.search);
  return DIAS_VALIDOS
    .filter(dia => params.has(dia))
    .map(dia => [dia, params.get(dia)]);
}

// Arma la tarjeta de un día.
function crearDia(dia, plato) {
  const nombre = NOMBRES_DIA[dia];
  return `
      <article class="Dia">
        <h3>${nombre}</h3>
        <div class="pedido">
          <h4>${plato.titulo}</h4>
          <img src="${plato.imagen}" alt="${plato.alt}">
          <p>${plato.descripcion}</p>
          <button class="mod" type="button">Modificar</button>
        </div>
        <div class="caja-comentarios">
          <label for="comentario-${dia}">Comentarios para el ${nombre.toLowerCase()}</label>
          <textarea id="comentario-${dia}" name="comentario-${dia}" placeholder="Ej: sin cebolla, entregar después de las 18 hs..."></textarea>
         
        </div>
      </article>
  `;
}

// Vuelve a la pantalla de selección. Si hay historial usa "atrás"
// (conserva la URL con ?dias=...); si no, arma la URL con los días recibidos.
function volverAlMenu() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  const dias = obtenerPlatosRecibidos().map(([dia]) => dia).join(',');
  window.location.href = PANTALLA_REGISTRAR + (dias ? '?dias=' + dias : '');
}

async function cargarResumen() {
  const contenedor = document.querySelector('.contenedor');
  const recibidos = obtenerPlatosRecibidos();

  if (recibidos.length === 0) {
    contenedor.innerHTML = `
      <p class="mensaje">
        No hay platos seleccionados.
        <a href="${PANTALLA_REGISTRAR}">Volver a elegir</a>
      </p>`;
    document.querySelector('.seccion-inferior').style.display = 'none';
    return;
  }

  try {
    const respuesta = await fetch('data/platos.json');
    if (!respuesta.ok) {
      throw new Error('No se pudo leer el JSON. Estado: ' + respuesta.status);
    }
    const platos = await respuesta.json();

    contenedor.innerHTML = recibidos
      .map(([dia, titulo]) => {
        const plato = platos.find(p => p.dia === dia && p.titulo === titulo);
        if (!plato) {
          return `<p class="mensaje">No se encontró el plato elegido para el ${NOMBRES_DIA[dia].toLowerCase()}.</p>`;
        }
        return crearDia(dia, plato);
      })
      .join('');
  } catch (error) {
    console.error('Error al cargar el resumen:', error);
    contenedor.innerHTML = '<p class="mensaje">Error al cargar el pedido. Intente nuevamente más tarde.</p>';
  }
}

// "Modificar" (dentro de cada tarjeta) y "Cancelar" vuelven a elegir platos.
document.querySelector('.contenedor').addEventListener('click', (e) => {
  if (e.target.closest('.mod')) volverAlMenu();
});
document.querySelector('#btn-cancelar').addEventListener('click', volverAlMenu);

cargarResumen();
