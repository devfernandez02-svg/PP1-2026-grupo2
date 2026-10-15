/* ══════════════════════════════════════════════
   PERFIL DE USUARIO (Pantalla 6) — Empleado / Admin
   • Carga los datos del usuario logueado.
   • El lápiz activa el "modo edición" (checkbox #modoEdicion,
     que ya manejaba el CSS). El JS agrega lo que el CSS no
     puede: habilitar el teclado, validar, guardar y cancelar.
   • Permite subir una foto de perfil (solo en modo edición).
   ══════════════════════════════════════════════ */

const USUARIO = AL.ui.usuario;

const checkboxEdicion = document.querySelector('#modoEdicion');
const form = document.querySelector('#formPerfil');
const avatar = document.querySelector('.perfil-avatar-placeholder');
const inputFoto = document.querySelector('#inputFoto');

const campos = {
  nombre: document.querySelector('.perfil-nombre-input'),
  fechaNacimiento: document.querySelector('#fechaNacimiento'),
  email: document.querySelector('#email'),
  dni: document.querySelector('#dni'),
  telefono: document.querySelector('#telefono'),
  comentarios: document.querySelector('#comentarios')
};

// Foto elegida pero todavía no guardada.
let fotoPendiente = null;

/* ── Mostrar datos ── */
function pintarFoto(foto) {
  if (foto) {
    avatar.innerHTML = '';
    const img = document.createElement('img');
    img.src = foto;
    img.alt = 'Foto de perfil';
    avatar.appendChild(img);
  } else {
    avatar.innerHTML = '<span>Foto de perfil</span>';
  }
}

function cargarDatos() {
  const usuario = AL.usuarios.porId(USUARIO.id);
  Object.entries(campos).forEach(([clave, input]) => {
    input.value = usuario[clave] || '';
  });
  pintarFoto(usuario.foto);
  fotoPendiente = null;
  limpiarErrores();
}

/* ── Modo edición ── */
function aplicarModoEdicion(editando) {
  Object.values(campos).forEach(input => {
    input.readOnly = !editando;
    input.tabIndex = editando ? 0 : -1;
  });
  avatar.classList.toggle('avatar-editable', editando);
  avatar.tabIndex = editando ? 0 : -1;
  avatar.title = editando ? 'Cambiar foto de perfil' : '';

  if (editando) {
    campos.nombre.focus();
  } else {
    cargarDatos(); // Cancelar: se descartan los cambios no guardados
  }
}

/* ── Validaciones ── */
function mostrarErrorCampo(input, texto) {
  const clave = input.id || 'nombre';
  let caja = document.querySelector(`.error-campo[data-para="${clave}"]`);
  if (!caja) {
    caja = document.createElement('p');
    caja.className = 'error-campo';
    caja.dataset.para = clave;
    caja.setAttribute('role', 'alert');
    // El nombre está dentro de una fila flex: el error va debajo de la fila.
    const ancla = input === campos.nombre ? input.closest('.perfil-avatar-wrapper') : input;
    ancla.after(caja);
  }
  caja.textContent = texto;
  input.classList.add('campo-invalido');
}

function limpiarErrores() {
  document.querySelectorAll('.error-campo').forEach(e => e.remove());
  document.querySelectorAll('.campo-invalido').forEach(e => e.classList.remove('campo-invalido'));
}

function validar(datos) {
  let valido = true;
  const error = (campo, texto) => { mostrarErrorCampo(campos[campo], texto); valido = false; };

  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{3,60}$/.test(datos.nombre)) {
    error('nombre', 'Ingresá un nombre válido (solo letras, mínimo 3).');
  }
  if (datos.fechaNacimiento) {
    const iso = AL.fechas.dmyAISO(datos.fechaNacimiento);
    if (!iso) error('fechaNacimiento', 'Usá el formato dd/mm/aaaa con una fecha real.');
    else if (iso >= AL.fechas.hoyISO()) error('fechaNacimiento', 'La fecha debe ser anterior a hoy.');
  }
  if (!AL.util.emailValido(datos.email)) {
    error('email', 'Ingresá un email válido.');
  }
  if (datos.dni && !/^\d{7,8}$/.test(datos.dni)) {
    error('dni', 'El DNI debe tener 7 u 8 números, sin puntos.');
  }
  if (datos.telefono && !/^\d{10}$/.test(datos.telefono)) {
    error('telefono', 'El teléfono debe tener 10 números (código de área sin 0 + número sin 15).');
  }
  if (datos.comentarios.length > 300) {
    error('comentarios', 'Máximo 300 caracteres.');
  }
  return valido;
}

/* ── Guardar ── */
form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limpiarErrores();

  const datos = {
    nombre: campos.nombre.value.trim().replace(/\s+/g, ' '),
    fechaNacimiento: campos.fechaNacimiento.value.trim(),
    email: campos.email.value.trim(),
    dni: campos.dni.value.trim(),
    telefono: campos.telefono.value.trim(),
    comentarios: campos.comentarios.value.trim()
  };

  if (!validar(datos)) {
    AL.ui.notificar('Revisá los campos marcados.', 'error');
    return;
  }
  if (fotoPendiente !== null) datos.foto = fotoPendiente;

  const resultado = AL.usuarios.actualizar(USUARIO.id, datos);
  if (!resultado.ok) {
    if (resultado.campo) mostrarErrorCampo(campos[resultado.campo], resultado.error);
    AL.ui.notificar(resultado.error, 'error');
    return;
  }

  // Actualiza el saludo de la barra de navegación.
  const saludo = document.querySelector('.al-barra__saludo strong');
  if (saludo) saludo.textContent = datos.nombre.split(' ')[0];

  checkboxEdicion.checked = false;
  aplicarModoEdicion(false);
  AL.ui.notificar('Perfil actualizado correctamente.');
});

/* ── Foto de perfil ── */
function elegirFoto() {
  if (checkboxEdicion.checked) inputFoto.click();
}

avatar.addEventListener('click', elegirFoto);
avatar.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegirFoto(); }
});

inputFoto.addEventListener('change', async () => {
  const archivo = inputFoto.files[0];
  inputFoto.value = '';
  if (!archivo) return;
  try {
    fotoPendiente = await AL.util.redimensionarImagen(archivo, 300);
    pintarFoto(fotoPendiente);
    AL.ui.notificar('Foto lista. Tocá "Guardar cambios" para conservarla.', 'info');
  } catch (error) {
    AL.ui.notificar(error.message, 'error');
  }
});

/* ── Arranque ── */
checkboxEdicion.addEventListener('change', () => aplicarModoEdicion(checkboxEdicion.checked));

// Teclado: el lápiz es un <label>, se habilita Enter/Espacio.
const lapiz = document.querySelector('.btn-editar');
lapiz.tabIndex = 0;
lapiz.setAttribute('role', 'button');
lapiz.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); checkboxEdicion.click(); }
});

if (USUARIO && !AL.ui.redirigiendo) {
  checkboxEdicion.checked = false;
  cargarDatos();
  aplicarModoEdicion(false);
}
