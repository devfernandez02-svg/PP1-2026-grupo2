
const form = document.querySelector(".formulario");

form.addEventListener(`submit`, function (evento) {
  evento.preventDefault(); // quita el parpadeo o el refresh de la pagina

  const email = document.querySelector(`#email`).value;


  console.log({ email });

  
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

   
  if (esValido) {
    console.log(`Formulario válido, se puede enviar`);
   
  }


  });