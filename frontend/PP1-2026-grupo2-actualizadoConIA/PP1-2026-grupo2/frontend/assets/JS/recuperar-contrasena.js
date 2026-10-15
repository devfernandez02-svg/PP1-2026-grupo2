/* ══════════════════════════════════════════════
   RECUPERAR CONTRASEÑA (Pantalla 10)
   Valida el email y muestra una confirmación.
   Por seguridad el mensaje es el MISMO exista o no
   la cuenta (así no se puede averiguar qué emails
   están registrados). El envío real del correo lo
   hará el backend.
   ══════════════════════════════════════════════ */

const form = document.querySelector('.formulario');
const inputEmail = document.querySelector('#email');
const cajaErrorEmail = document.querySelector('#errorEmail');
const mensajeExito = document.querySelector('#mensajeExito');
const botonEnviar = form.querySelector('button[type="submit"]');

function mostrarError(texto) {
  cajaErrorEmail.textContent = texto;
  cajaErrorEmail.classList.add('visible');
}

function limpiarError() {
  cajaErrorEmail.textContent = '';
  cajaErrorEmail.classList.remove('visible');
}

form.addEventListener('submit', function (evento) {
  evento.preventDefault(); // quita el parpadeo o el refresh de la pagina

  const email = inputEmail.value.trim();
  mensajeExito.hidden = true;

  // --- Validación de email ---
  if (email === '') {
    mostrarError('Campo Obligatorio');
    return;
  }
  if (!AL.util.emailValido(email)) {
    mostrarError('Esto no es un correo');
    return;
  }
  limpiarError();

  // Simulación del envío (en el futuro: fetch al backend)
  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Enviando...';

  setTimeout(() => {
    mensajeExito.textContent =
      `Si ${email} está registrado, te enviamos un correo con los pasos para restablecer tu contraseña.`;
    mensajeExito.hidden = false;
    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Recuperar contraseña';
    form.reset();
  }, 800);
});

inputEmail.addEventListener('input', limpiarError);
