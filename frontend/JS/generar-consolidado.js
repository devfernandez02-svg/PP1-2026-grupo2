function mostrarPedidos(pedidos) {
  const cuerpoTabla = document.querySelector('#cuerpo-consolidado');

  cuerpoTabla.innerHTML = pedidos.map(pedido => `
    <tr>
      <td>${pedido.empleado}</td>
      <td>${pedido.menu}</td>
      <td>${pedido.comentario}</td>
    </tr>
  `).join('');
}

async function cargarPedidos() {
  try {
    const respuesta = await fetch('data/pedidos.json');

    if (!respuesta.ok) {
      throw new Error('No se pudo leer el JSON. Estado: ' + respuesta.status);
    }

    const pedidos = await respuesta.json();

const fechaSeleccionada = document.querySelector('#fecha').value;

const pedidosFiltrados = pedidos.filter(
  pedido => pedido.fecha === fechaSeleccionada
);

mostrarPedidos(pedidosFiltrados);
mostrarTotales(pedidosFiltrados);

  } catch (error) {
    console.error('Error al cargar los pedidos:', error);
  }
}
const botonGenerar = document.querySelector('.btn-generar');


function mostrarTotales(pedidos) {
  const listaTotales = document.querySelector('#lista-totales');
  const totalEmpleados = document.querySelector('#total-empleados');

  listaTotales.innerHTML = '';

  const totales = {};

  pedidos.forEach(pedido => {
    if (totales[pedido.menu]) {
    totales[pedido.menu] = totales[pedido.menu] + 1;
    } else {
      totales[pedido.menu] = 1;
    }

  });
  
for (const menu in totales) {
    listaTotales.innerHTML += `<li>${menu} × ${totales[menu]}</li>`;
  }

  totalEmpleados.textContent = 'Total de empleados del día: ' + pedidos.length;
}

botonGenerar.addEventListener('click', cargarPedidos);
