/* ══════════════════════════════════════════════
   LOGIN (Pantalla 1)
   Valida el formulario, verifica el usuario contra
   los datos guardados y redirige según el rol:
     • empleado → Pantalla 2 (configurar asistencia)
     • admin    → Pantalla 5 (panel / consolidado)
   Usuarios de prueba:
     empleado: carlosperez@gmail.com / carlos1234
     admin:    admin@aromaslight.com / admin1234
   ══════════════════════════════════════════════ */

const form = document.querySelector('.formulario');
const inputEmail = document.querySelector('#usuario-email');
const inputContrasena = document.querySelector('#usuario-password');
const cajaErrorEmail = document.querySelector('#errorEmail');
const cajaErrorContrasena = document.querySelector('#errorContraseña');

function mostrarError(caja, texto) {
  caja.textContent = texto;
  caja.classList.add('visible');
}

function limpiarError(caja) {
  caja.textContent = '';
  caja.classList.remove('visible');
}

// Si ya hay una sesión activa, no tiene sentido volver a loguearse.
const sesionActual = AL.sesion.estado();
if (sesionActual.estado === 'activa') {
  AL.ui.irA(AL.ui.INICIO[sesionActual.usuario.rol]);
}

// Mensajes que llegan por URL (?expirada=1 o ?email=... desde el registro)
const params = new URLSearchParams(window.location.search);
if (params.get('expirada') === '1') {
  mostrarError(cajaErrorContrasena, 'Tu sesión expiró por inactividad. Ingresá nuevamente.');
}
if (params.get('email')) {
  inputEmail.value = params.get('email');
  inputContrasena.focus();
}

form.addEventListener('submit', function (evento) {
  evento.preventDefault(); // quita el parpadeo o el refresh de la pagina

  const email = inputEmail.value.trim();
  const contrasena = inputContrasena.value;
  let esValido = true;

  // --- Validación de email ---
  if (email === '') {
    mostrarError(cajaErrorEmail, 'Campo Obligatorio');
    esValido = false;
  } else if (!AL.util.emailValido(email)) {
    mostrarError(cajaErrorEmail, 'Esto no es un correo');
    esValido = false;
  } else {
    limpiarError(cajaErrorEmail);
  }

  // --- Validación de contraseña ---
  if (contrasena.length < 8) {
    mostrarError(cajaErrorContrasena, 'La contraseña debe tener al menos 8 caracteres');
    esValido = false;
  } else {
    limpiarError(cajaErrorContrasena);
  }

  if (!esValido) return;

  // --- Verificación de credenciales ---
  const resultado = AL.usuarios.autenticar(email, contrasena);
  if (!resultado.ok) {
    mostrarError(cajaErrorContrasena, resultado.error);
    return;
  }

  AL.sesion.iniciar(resultado.usuario);
  AL.ui.irA(AL.ui.INICIO[resultado.usuario.rol]);
});

// Al escribir se borra el error del campo.
inputEmail.addEventListener('input', () => limpiarError(cajaErrorEmail));
inputContrasena.addEventListener('input', () => limpiarError(cajaErrorContrasena));

// Botón "Registrarse" → Pantalla 9
document.querySelector('.btn-registrar').addEventListener('click', () => {
  AL.ui.irA(AL.ui.PAGINAS.registro);
});
