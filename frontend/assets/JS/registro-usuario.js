/*
 Valida cada campo y muestra el error debajo.
 Verifica que el usuario y el email no existan simulando la base de datos con usuarios.json.
 Si todo está bien, crea la cuenta y lleva al login.
 */

const RUTA_USUARIOS = 'data/usuarios.json';
const PANTALLA_LOGIN = 'Pantalla_1-login.html';

const form = document.querySelector('.register-form');
const linkLogin = document.querySelector('.login-link');

const campos = {
  nombre: document.querySelector('#nombre'),
  fecha: document.querySelector('#fecha'),
  email: document.querySelector('#email'),
  telefono: document.querySelector('#telefono'),
  usuario: document.querySelector('#usuario'),
  contrasena: document.querySelector('#contrasena')
};

// Un <small> de error debajo de cada campo (el HTML no los trae).
const errores = {};
for (const clave in campos) {
  const small = document.createElement('small');
  small.style.cssText = 'color:#c0182a;margin-top:6px;font-size:13px;';
  small.hidden = true;
  campos[clave].closest('.form-group').append(small);
  errores[clave] = small;
}

const mensaje = document.createElement('p');
mensaje.setAttribute('role', 'status');
mensaje.style.cssText = 'margin-top:20px;font-weight:600;';
mensaje.hidden = true;
document.querySelector('.form-footer').after(mensaje);

/* ── Helpers ── */

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

// Cada función devuelve el mensaje de error o '' si el valor es válido.
const validaciones = {
  nombre: v => (v.length >= 3 ? '' : 'Ingresá tu nombre completo.'),
  fecha: v => (esFechaValida(v) ? '' : 'Usá el formato dd/mm/aaaa con una fecha válida.'),
  email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingresá un email válido.'),
  telefono: v => (/^\d{10}$/.test(v) ? '' : 'Debe tener 10 números (con característica, sin 0 ni 15).'),
  usuario: v => (/^[a-zA-Z0-9._]{4,20}$/.test(v) ? '' : 'Entre 4 y 20 caracteres: letras, números, punto o guion bajo.'),
  contrasena: v => (v.length >= 8 ? '' : 'La contraseña debe tener al menos 8 caracteres.')
};

function mostrarError(clave, texto) {
  errores[clave].textContent = texto;
  errores[clave].hidden = texto === '';
}

function mostrarMensaje(texto, esError) {
  mensaje.textContent = texto;
  mensaje.style.color = esError ? '#c0182a' : '#1d7a2b';
  mensaje.hidden = false;
}

function leerDatos() {
  const datos = {};
  for (const clave in campos) {
    // La contraseña no se recorta: los espacios pueden ser parte de ella.
    datos[clave] = clave === 'contrasena' ? campos[clave].value : campos[clave].value.trim();
  }
  return datos;
}

// Simula la consulta al backend.
async function buscarDuplicados(datos) {
  const respuesta = await fetch(RUTA_USUARIOS);
  if (!respuesta.ok) throw new Error('Estado: ' + respuesta.status);
  const usuarios = await respuesta.json();
  return {
    usuario: usuarios.some(u => u.usuario.toLowerCase() === datos.usuario.toLowerCase()),
    email: usuarios.some(u => u.email.toLowerCase() === datos.email.toLowerCase())
  };
}

/* ── Eventos ── */

// Al escribir en un campo se borra su error.
for (const clave in campos) {
  campos[clave].addEventListener('input', () => {
    mostrarError(clave, '');
    mensaje.hidden = true;
  });
}

// El ojo del campo contraseña muestra / oculta lo escrito.
const iconoOjo = campos.contrasena.parentElement.querySelector('.icon');
iconoOjo.style.pointerEvents = 'auto';
iconoOjo.style.cursor = 'pointer';
iconoOjo.addEventListener('click', () => {
  campos.contrasena.type = campos.contrasena.type === 'password' ? 'text' : 'password';
});

linkLogin.addEventListener('click', (evento) => {
  evento.preventDefault();
  window.location.href = PANTALLA_LOGIN;
});

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const datos = leerDatos();
  let esValido = true;

  for (const clave in validaciones) {
    const error = validaciones[clave](datos[clave]);
    mostrarError(clave, error);
    if (error) esValido = false;
  }

  if (!esValido) return;

  try {
    const duplicados = await buscarDuplicados(datos);
    if (duplicados.usuario) mostrarError('usuario', 'Ese nombre de usuario ya está en uso.');
    if (duplicados.email) mostrarError('email', 'Ya existe una cuenta con ese email.');
    if (duplicados.usuario || duplicados.email) return;
  } catch (error) {
    console.error('Error al verificar usuarios:', error);
    mostrarMensaje('No se pudo crear la cuenta. Intentá nuevamente más tarde.', true);
    return;
  }

  // Nunca se muestra la contraseña en consola.
  const { contrasena, ...usuarioNuevo } = datos;
  console.log('Usuario a registrar:', usuarioNuevo); // acá iría el POST al backend

  form.querySelector('.btn-primary').disabled = true;
  mostrarMensaje('¡Cuenta creada! Te llevamos al inicio de sesión...', false);
  setTimeout(() => { window.location.href = PANTALLA_LOGIN; }, 2000);
});
