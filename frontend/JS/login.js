const form = document.querySelector(".formulario"); 
form.addEventListener(`submit`,function(evento){ // ese ecucha formularios con el submit
  evento.preventDefault(); //quita el parpadeo o el refresh de la pagina

const email = document.querySelector(`#usuario-email`).value;

const contraseña = document.querySelector(`#usuario-password`).value;

console.log({email,contraseña});
//chequea que no este vacio
const cajaErrorE1 = document.querySelector(`#errorEmail`)
if (email === ``){
  cajaErrorE1.textContent = `Campo Obligatorio`
  cajaErrorE1.classList.add(`visisble`)
return;
}
//chequea el arroba
const cajaErrorE2 = document.querySelector(`#errorEmail`)
if (!email.includes("@")){
  cajaErrorE2.textContent = `Esto no es un correo`
  cajaErrorE2.classList.add(`visisble`)
return;
}
//valida que la contraseña tenga minimo 8 caracteres
const cajaErrorC1 = document.querySelector(`#errorEmail`)
if (contraseña.length < 8){
  cajaErrorC1.textContent = `La tenes re corta`
  cajaErrorC1.classList.add(`visisble`)
return;
}


})