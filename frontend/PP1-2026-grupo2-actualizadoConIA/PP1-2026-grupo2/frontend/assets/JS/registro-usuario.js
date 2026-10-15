/* ══════════════════════════════════════════════
   REGISTRO DE USUARIO (Pantalla 9) — Público
   • Valida cada campo y muestra el error debajo.
   • Formatea la fecha mientras se escribe (dd/mm/aaaa).
   • El ícono del ojo muestra/oculta la contraseña.
   • Crea la cuenta (rol empleado) y lleva al login con
     el email ya cargado.
   ══════════════════════════════════════════════ */

const form = document.querySelector('.register-form');
const botonCrear = form.querySelector('.btn-primary');

const campos = {
  nombre: document.querySelector('#nombre'),
  fecha: document.querySelector('#fecha'),
  email: document.querySelector('#email'),
  telefono: document.querySelector('#telefono'),
  usuario: document.querySelector('#usuario'),
  contrasena: document.querySelector('#contrasena')
};

const EDAD_MINIMA = 16;

/* ── Mensajes de error por campo ── */
function cajaError(input) {
  const grupo = input.closest('.form-group');
  let caja = grupo.querySelector('.error-campo');
  if (!caja) {
    caja = document.createElement('p');
    caja.className = 'error-campo';
    caja.id = 'error-' + input.id;
    caja.setAttribute('role', 'alert');
    grupo.appendChild(caja);
    input.setAttribute('aria-describedby', caja.id);
  }
  return caja;
}

function mostrarError(input, texto) {
  cajaError(input).textContent = texto;
  input.classList.add('input-invalido');
  input.setAttribute('aria-invalid', 'true');
}

function limpiarError(input) {
  const caja = input.closest('.form-group').querySelector('.error-campo');
  if (caja) caja.textContent = '';
  input.classList.remove('input-invalido');
  input.removeAttribute('aria-invalid');
}

/* ── Reglas de validación (devuelven el texto del error o '') ── */
function calcularEdad(iso) {
  const nacimiento = AL.fechas.desdeISO(iso);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumplioEsteAnio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());
  if (!cumplioEsteAnio) edad -= 1;
  return edad;
}

const reglas = {
  nombre(valor) {
    if (!valor) return 'Campo obligatorio.';
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/.test(valor)) return 'Usá solo letras y espacios.';
    if (valor.split(' ').filter(Boolean).length < 2) return 'Ingresá nombre y apellido.';
    return '';
  },
  fecha(valor) {
    if (!valor) return 'Campo obligatorio.';
    const iso = AL.fechas.dmyAISO(valor);
    if (!iso) return 'Ingresá una fecha válida con el formato dd/mm/aaaa.';
    if (iso >= AL.fechas.hoyISO()) return 'La fecha debe ser anterior a hoy.';
    const edad = calcularEdad(iso);
    if (edad < EDAD_MINIMA) return `Tenés que tener al menos ${EDAD_MINIMA} años.`;
    if (edad > 100) return 'Revisá el año de nacimiento.';
    return '';
  },
  email(valor) {
    if (!valor) return 'Campo obligatorio.';
    if (!AL.util.emailValido(valor)) return 'Ingresá un email válido (ej.: nombre@correo.com).';
    if (AL.usuarios.porEmail(valor)) return 'Ya existe una cuenta con ese email.';
    return '';
  },
  telefono(valor) {
    if (!valor) return 'Campo obligatorio.';
    if (!/^\d{10}$/.test(valor)) return 'Ingresá 10 números: código de área sin 0 y número sin 15.';
    return '';
  },
  usuario(valor) {
    if (!valor) return 'Campo obligatorio.';
    if (!/^[a-zA-Z0-9._]{4,20}$/.test(valor)) return 'Entre 4 y 20 caracteres: letras, números, punto o guion bajo.';
    if (AL.usuarios.porNombreUsuario(valor)) return 'Ese nombre de usuario ya está en uso.';
    return '';
  },
  contrasena(valor) {
    if (!valor) return 'Campo obligatorio.';
    if (valor.length < 8) return 'Debe tener al menos 8 caracteres.';
    if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) return 'Debe combinar letras y números.';
    return '';
  }
};

function valorDe(clave) {
  const valor = campos[clave].value;
  return clave === 'contrasena' ? valor : valor.trim().replace(/\s+/g, ' ');
}

function validarCampo(clave) {
  const error = reglas[clave](valorDe(clave));
  if (error) mostrarError(campos[clave], error);
  else limpiarError(campos[clave]);
  return !error;
}

/* ── Ayudas al escribir ── */

// Fecha: agrega las barras automáticamente (06041996 -> 06/04/1996).
campos.fecha.addEventListener('input', () => {
  const numeros = campos.fecha.value.replace(/\D/g, '').slice(0, 8);
  let formateada = numeros;
  if (numeros.length > 4) formateada = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
  else if (numeros.length > 2) formateada = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  campos.fecha.value = formateada;
});
campos.fecha.setAttribute('inputmode', 'numeric');
campos.fecha.setAttribute('maxlength', '10');

// Teléfono: solo números.
campos.telefono.addEventListener('input', () => {
  campos.telefono.value = campos.telefono.value.replace(/\D/g, '').slice(0, 10);
});

// Ojo de la contraseña: mostrar / ocultar.
const ojo = campos.contrasena.parentElement.querySelector('.icon');
if (ojo) {
  ojo.classList.add('icono-ojo');
  ojo.setAttribute('role', 'button');
  ojo.setAttribute('tabindex', '0');
  ojo.setAttribute('aria-label', 'Mostrar contraseña');
  ojo.removeAttribute('aria-hidden');
  const alternar = () => {
    const mostrar = campos.contrasena.type === 'password';
    campos.contrasena.type = mostrar ? 'text' : 'password';
    ojo.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña');
    ojo.classList.toggle('icono-ojo--activo', mostrar);
  };
  ojo.addEventListener('click', alternar);
  ojo.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(); }
  });
}

// Se valida al salir de cada campo y se limpia el error al corregir.
Object.keys(campos).forEach(clave => {
  campos[clave].addEventListener('blur', () => {
    if (campos[clave].value !== '') validarCampo(clave);
  });
  campos[clave].addEventListener('input', () => limpiarError(campos[clave]));
});

/* ── Envío ── */
form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const resultados = Object.keys(campos).map(validarCampo);
  if (resultados.includes(false)) {
    const primerError = form.querySelector('.input-invalido');
    if (primerError) primerError.focus();
    return;
  }

  botonCrear.disabled = true;

  const resultado = AL.usuarios.registrar({
    nombre: valorDe('nombre'),
    fechaNacimiento: valorDe('fecha'),
    email: valorDe('email'),
    telefono: valorDe('telefono'),
    usuario: valorDe('usuario'),
    contrasena: valorDe('contrasena')
  });

  if (!resultado.ok) {
    const campo = resultado.campo === 'usuario' ? campos.usuario : campos.email;
    mostrarError(campo, resultado.error);
    botonCrear.disabled = false;
    return;
  }

  AL.ui.notificarAlCargar('¡Cuenta creada! Ya podés iniciar sesión.');
  AL.ui.irA(AL.ui.PAGINAS.login, { email: resultado.usuario.email });
});

// "¿Ya tenés cuenta? Iniciar sesión"
document.querySelector('.login-link').href = AL.ui.PAGINAS.login;
