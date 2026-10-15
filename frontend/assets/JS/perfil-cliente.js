/* ══════════════════════════════════════════════
   PERFIL DE USUARIO (Pantalla 6)
   - Carga los datos del usuario desde data/usuario-perfil.json.
   - El lápiz (checkbox #modoEdicion, manejado por CSS) activa el
     modo edición; acá solo habilitamos/deshabilitamos los campos.
   - "Guardar cambios" valida y guarda los datos (en memoria,
     hasta que exista el backend).
   - "Cancelar" descarta lo escrito y vuelve a los datos guardados.
   ══════════════════════════════════════════════ */

const RUTA_PERFIL = 'data/usuario-perfil.json';

const chkEdicion = document.querySelector('#modoEdicion');
const form = document.querySelector('#formPerfil');

const campos = {
  nombre: document.querySelector('.perfil-nombre-input'),
  fechaNacimiento: document.querySelector('#fechaNacimiento'),
  email: document.querySelector('#email'),
  dni: document.querySelector('#dni'),
  telefono: document.querySelector('#telefono'),
  comentarios: document.querySelector('#comentarios')
};

// Mensaje de éxito / error (se crea desde JS porque el HTML no lo trae).
const mensaje = document.createElement('p');
mensaje.setAttribute('role', 'status');
mensaje.style.marginTop = '12px';
mensaje.style.fontWeight = '600';
mensaje.hidden = true;
form.after(mensaje);

// Últimos datos guardados. Arranca con lo que trae el HTML
// por si el JSON no se puede leer.
let datosGuardados = leerFormulario();

/* ── Helpers ── */

function leerFormulario() {
  const datos = {};
  for (const clave in campos) {
    datos[clave] = campos[clave].value.trim();
  }
  return datos;
}

function cargarEnFormulario(datos) {
  for (const clave in campos) {
    campos[clave].value = datos[clave] ?? '';
  }
}

// Sin modo edición los campos son de solo lectura y no reciben foco con Tab.
function habilitarEdicion(habilitar) {
  for (const clave in campos) {
    campos[clave].readOnly = !habilitar;
    campos[clave].tabIndex = habilitar ? 0 : -1;
  }
  if (habilitar) campos.nombre.focus();
}

function mostrarMensaje(texto, esError) {
  mensaje.textContent = texto;
  mensaje.style.color = esError ? '#c0182a' : '#1d7a2b';
  mensaje.hidden = false;
}

function ocultarMensaje() {
  mensaje.hidden = true;
  mensaje.textContent = '';
}

// Valida formato dd/mm/aaaa y que la fecha exista y no sea futura.
function esFechaValida(texto) {
  const partes = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!partes) return false;
  const dia = Number(partes[1]);
  const mes = Number(partes[2]) - 1;
  const anio = Number(partes[3]);
  const fecha = new Date(anio, mes, dia);
  const existe = fecha.getFullYear() === anio && fecha.getMonth() === mes && fecha.getDate() === dia;
  return existe && fecha <= new Date();
}

// Devuelve el primer error encontrado o '' si todo está bien.
function validar(datos) {
  if (datos.nombre.length < 3) return 'Ingresá tu nombre completo.';
  if (!esFechaValida(datos.fechaNacimiento)) return 'La fecha de nacimiento debe tener el formato dd/mm/aaaa y ser válida.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) return 'Ingresá un email válido.';
  if (!/^\d{7,8}$/.test(datos.dni)) return 'El DNI debe tener 7 u 8 números, sin puntos.';
  if (!/^\d{10}$/.test(datos.telefono)) return 'El teléfono debe tener 10 números (con característica, sin 0 ni 15).';
  return '';
}

/* ── Carga inicial ── */

async function cargarPerfil() {
  try {
    const respuesta = await fetch(RUTA_PERFIL);
    if (!respuesta.ok) throw new Error('Estado: ' + respuesta.status);
    datosGuardados = await respuesta.json();
    cargarEnFormulario(datosGuardados);
  } catch (error) {
    // Si falla, se quedan los datos que trae el HTML.
    console.warn('No se pudo leer el perfil, se usan los datos del HTML.', error);
  }
}

/* ── Eventos ── */

// Entrar o salir del modo edición (lápiz o "Cancelar").
chkEdicion.addEventListener('change', () => {
  ocultarMensaje();
  if (chkEdicion.checked) {
    habilitarEdicion(true);
  } else {
    // Salir sin guardar = cancelar: se vuelven a mostrar los datos guardados.
    cargarEnFormulario(datosGuardados);
    habilitarEdicion(false);
  }
});

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const datos = leerFormulario();
  const error = validar(datos);
  if (error) {
    mostrarMensaje(error, true);
    return;
  }

  datosGuardados = datos;
  console.log('Perfil guardado:', datosGuardados); // acá iría el PUT al backend

  chkEdicion.checked = false; // cambiarlo por código no dispara "change"
  habilitarEdicion(false);
  mostrarMensaje('Los cambios se guardaron correctamente.', false);
});

habilitarEdicion(false);
cargarPerfil();
