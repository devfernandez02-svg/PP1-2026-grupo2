/* ══════════════════════════════════════════════
   RESUMEN DEL PEDIDO (Pantalla 4)
   Recibe por URL el plato elegido para cada día
   lo busca en platos.json y lo muestra en pantalla.
   ══════════════════════════════════════════════ */

const NOMBRES_DIA = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado'
};

// Lee la URL y devuelve una lista de pares [dia, titulo].
function obtenerPlatosRecibidos() {
  const params = new URLSearchParams(window.location.search);
  return [...params.entries()];
}

// Arma la tarjeta de un día con el mismo HTML y las mismas clases
// que tenía la pantalla cuando los platos estaban escritos a mano.
function crearDia(dia, plato) {
  const nombre = NOMBRES_DIA[dia] || dia;
  return `
      <article class="Dia">
        <h3>${nombre}</h3>
        <div class="pedido">
          <h4>${plato.titulo}</h4>
          <img src="${plato.imagen}" alt="${plato.alt}">
          <p>${plato.descripcion}</p>
          <button class="mod">Modificar</button>
        </div>
        <div class="caja-comentarios">
          <textarea name="comentario-${dia}" placeholder="Comentarios para el ${nombre.toLowerCase()}..."></textarea>
          <div class="fila-enviar">
            <button class="btn-verde">Enviar</button>
          </div>
        </div>
      </article>
  `;
}

async function cargarResumen() {
  const contenedor = document.querySelector('.contenedor');
  const recibidos = obtenerPlatosRecibidos();

  if (recibidos.length === 0) {
    contenedor.innerHTML = '<p>No hay platos seleccionados.</p>';
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
          return `<p>No se encontró el plato elegido para el día: ${dia}</p>`;
        }
        return crearDia(dia, plato);
      })
      .join('');
  } catch (error) {
    console.error('Error al cargar el resumen:', error);
    contenedor.innerHTML = '<p>Error al cargar el pedido. Intente nuevamente más tarde.</p>';
  }
}

cargarResumen();