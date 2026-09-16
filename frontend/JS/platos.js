const ICONO_CHECK = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
`;


function crearTarjeta(plato) {
  return`
  <article class="dish-card">
    <h3 class="card-title">${plato.titulo}</h3>
    <div class="card-img-wrap">
      <img src="${plato.imagen}" alt="${plato.alt}" class="card-img" />
    </div>
    <p class="card-desc">${plato.descripcion}</p>
    <button class="card-btn" aria-label="Agregar al pedido">
      ${ICONO_CHECK}
      Seleccionar
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

async function cargarPlatos() {
  try {
    const respuesta = await fetch('data/platos.json');
    if (!respuesta.ok) {
      throw new Error('No se pudo leer el JSON. Estado: ' + respuesta.status);
    }
    const platos = await respuesta.json();

    renderPlato(platos.filter(p => p.dia === 'lunes'), '#grid-lunes');
    renderPlato(platos.filter(p => p.dia === 'miercoles'), '#grid-miercoles');
  } catch (error) {
    console.error('Error al cargar los platos:', error);
  }
}

cargarPlatos();


