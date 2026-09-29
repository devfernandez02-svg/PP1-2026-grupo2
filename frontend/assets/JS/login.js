const form = document.querySelector(".formulario");

form.addEventListener(`submit`, function (evento) {
  evento.preventDefault(); // quita el parpadeo o el refresh de la pagina

  const email = document.querySelector(`#usuario-email`).value;
  const contraseña = document.querySelector(`#usuario-password`).value;

  console.log({ email, contraseña });

  let esValido = true;

  // --- Validación de email ---
  const cajaErrorEmail = document.querySelector(`#errorEmail`);

  if (email === ``) {
    cajaErrorEmail.textContent = `Campo Obligatorio`;
    cajaErrorEmail.classList.add(`visible`);
    esValido = false;
  } else if (!email.includes(`@`)) {
    cajaErrorEmail.textContent = `Esto no es un correo`;
    cajaErrorEmail.classList.add(`visible`);
    esValido = false;
  } else {
    cajaErrorEmail.textContent = ``;
    cajaErrorEmail.classList.remove(`visible`);
  }

  // --- Validación de contraseña ---
  const cajaErrorContraseña = document.querySelector(`#errorContraseña`);

  if (contraseña.length < 8) {
    cajaErrorContraseña.textContent = `La contraseña debe tener al menos 8 caracteres`;
    cajaErrorContraseña.classList.add(`visible`);
    esValido = false;
  } else {
    cajaErrorContraseña.textContent = ``;
    cajaErrorContraseña.classList.remove(`visible`);
  }

 
  if (esValido) {
    console.log(`Formulario válido, se puede enviar`);
   
     window.location.href = "Pantalla_2-config-asistencia.html";
  }

});