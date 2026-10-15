/* ══════════════════════════════════════════════════════════════
   ui.js — NAVEGACIÓN, SESIÓN Y AVISOS COMPARTIDOS (Aromas Light)
   ──────────────────────────────────────────────────────────────
   Requiere datos.js cargado antes. Hace tres cosas:
     1) PROTEGE las pantallas: si no hay sesión (o el rol no
        corresponde) redirige al login o al inicio del rol.
     2) Agrega una BARRA DE NAVEGACIÓN debajo del header para
        moverse entre pantallas según el rol (empleado / admin).
     3) Ofrece avisos reutilizables: AL.ui.notificar(),
        AL.ui.confirmar() y AL.ui.mostrarExito().
   Todas las clases CSS empiezan con "al-" (ver comun.css) para
   no chocar con los estilos propios de cada pantalla ni con Bootstrap.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const PAGINAS = {
    login: 'Pantalla_1-login.html',
    asistencia: 'Pantalla_2-config-asistencia.html',
    menu: 'Pantalla_3-registrar-pedido.html',
    resumen: 'Pantalla_4-resumen-pedido.html',
    consolidado: 'Pantalla_5-generar-consolidado.html',
    perfil: 'Pantalla_6-perfil-cliente.html',
    adminMenu: 'Pantalla_7-admin-menu.html',
    feriados: 'Pantalla_8-calendario-feriado.html',
    registro: 'Pantalla_9-Registro-usuario.html',
    recuperar: 'Pantalla_10-recuperar-contrasena.html'
  };

  // Qué roles pueden entrar a cada pantalla. Las que no figuran son públicas.
  const ACCESO = {
    [PAGINAS.asistencia]: ['empleado'],
    [PAGINAS.menu]: ['empleado'],
    [PAGINAS.resumen]: ['empleado'],
    [PAGINAS.consolidado]: ['admin'],
    [PAGINAS.perfil]: ['empleado', 'admin'],
    [PAGINAS.adminMenu]: ['admin'],
    [PAGINAS.feriados]: ['admin']
  };

  // Pantalla de inicio de cada rol (a donde va después del login).
  const INICIO = {
    empleado: PAGINAS.asistencia,
    admin: PAGINAS.consolidado
  };

  // Ítems de la barra de navegación según el rol.
  const MENU_POR_ROL = {
    empleado: [
      { texto: 'Mis días', href: PAGINAS.asistencia },
      { texto: 'Menú semanal', href: PAGINAS.menu },
      { texto: 'Mi pedido', href: PAGINAS.resumen },
      { texto: 'Mi perfil', href: PAGINAS.perfil }
    ],
    admin: [
      { texto: 'Consolidado', href: PAGINAS.consolidado },
      { texto: 'Administrar menú', href: PAGINAS.adminMenu },
      { texto: 'Feriados', href: PAGINAS.feriados },
      { texto: 'Mi perfil', href: PAGINAS.perfil }
    ]
  };

  const paginaActual = decodeURIComponent(window.location.pathname.split('/').pop() || '');

  const ui = {
    PAGINAS,
    INICIO,
    usuario: null,          // usuario logueado (o null)
    redirigiendo: false,    // true si la pantalla se está yendo

    irA(pagina, params) {
      const url = new URL(pagina, window.location.href);
      if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      ui.redirigiendo = true;
      window.location.href = url.toString();
    },

    cerrarSesion() {
      AL.sesion.cerrar();
      ui.irA(PAGINAS.login);
    }
  };

  /* ───────────── 1) PROTECCIÓN DE PANTALLAS ───────────── */
  function proteger() {
    const { estado, usuario } = AL.sesion.estado();
    ui.usuario = usuario;

    const rolesPermitidos = ACCESO[paginaActual];
    if (!rolesPermitidos) return; // pantalla pública

    if (estado !== 'activa') {
      ui.irA(PAGINAS.login, estado === 'expirada' ? { expirada: '1' } : undefined);
      return;
    }
    if (!rolesPermitidos.includes(usuario.rol)) {
      ui.irA(INICIO[usuario.rol]);
      return;
    }
    AL.sesion.registrarActividad();
  }

  /* ───────────── 2) BARRA DE NAVEGACIÓN ───────────── */
  function crearBarra() {
    const usuario = ui.usuario;
    if (!usuario || !ACCESO[paginaActual] || ui.redirigiendo) return;

    const nav = document.createElement('nav');
    nav.className = 'al-barra';
    nav.setAttribute('aria-label', 'Navegación principal');

    const items = MENU_POR_ROL[usuario.rol] || [];
    const primerNombre = usuario.nombre.split(' ')[0];

    nav.innerHTML = `
      <div class="al-barra__interior">
        <span class="al-barra__saludo">
          Hola, <strong>${AL.util.escaparHTML(primerNombre)}</strong>
          <span class="al-barra__rol">${usuario.rol === 'admin' ? 'Administrador' : 'Empleado'}</span>
        </span>
        <ul class="al-barra__links">
          ${items.map(item => `
            <li><a href="${item.href}" class="al-barra__link${item.href === paginaActual ? ' al-barra__link--activo' : ''}"
                   ${item.href === paginaActual ? 'aria-current="page"' : ''}>${item.texto}</a></li>
          `).join('')}
          <li><button type="button" class="al-barra__salir">Cerrar sesión</button></li>
        </ul>
      </div>
    `;
    nav.querySelector('.al-barra__salir').addEventListener('click', ui.cerrarSesion);

    const header = document.querySelector('body > header');
    if (header) header.after(nav);
    else document.body.prepend(nav);
  }

  /* ───────────── 3) AVISOS REUTILIZABLES ───────────── */

  // Mensaje chico arriba a la derecha que desaparece solo.
  // tipo: 'exito' | 'error' | 'info'
  ui.notificar = function (texto, tipo = 'exito', duracionMs = 3500) {
    let contenedor = document.querySelector('.al-toasts');
    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.className = 'al-toasts';
      contenedor.setAttribute('aria-live', 'polite');
      document.body.appendChild(contenedor);
    }
    const toast = document.createElement('div');
    toast.className = `al-toast al-toast--${tipo}`;
    toast.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    toast.textContent = texto;
    contenedor.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('al-toast--visible'));

    setTimeout(() => {
      toast.classList.remove('al-toast--visible');
      setTimeout(() => toast.remove(), 300);
    }, duracionMs);
  };

  // Guarda un aviso para mostrarlo en la PRÓXIMA pantalla
  // (ej.: "Cuenta creada" y luego se redirige al login).
  ui.notificarAlCargar = function (texto, tipo = 'exito') {
    try { sessionStorage.setItem('al_flash', JSON.stringify({ texto, tipo })); } catch (e) { /* sin acción */ }
  };

  function mostrarFlash() {
    try {
      const flash = JSON.parse(sessionStorage.getItem('al_flash') || 'null');
      if (flash) {
        sessionStorage.removeItem('al_flash');
        ui.notificar(flash.texto, flash.tipo);
      }
    } catch (e) { /* sin acción */ }
  }

  // Ventana de confirmación propia (reemplaza a window.confirm).
  // Devuelve una Promise<boolean>.
  ui.confirmar = function ({ titulo = '¿Estás seguro?', mensaje = '', aceptar = 'Aceptar', cancelar = 'Cancelar', peligro = false } = {}) {
    return new Promise(resolve => {
      const dialog = document.createElement('dialog');
      dialog.className = 'al-dialogo';
      dialog.innerHTML = `
        <h2 class="al-dialogo__titulo"></h2>
        <p class="al-dialogo__mensaje"></p>
        <div class="al-dialogo__acciones">
          <button type="button" class="al-btn al-btn--secundario" data-valor="no"></button>
          <button type="button" class="al-btn ${peligro ? 'al-btn--peligro' : 'al-btn--primario'}" data-valor="si"></button>
        </div>
      `;
      dialog.querySelector('.al-dialogo__titulo').textContent = titulo;
      dialog.querySelector('.al-dialogo__mensaje').textContent = mensaje;
      dialog.querySelector('[data-valor="no"]').textContent = cancelar;
      dialog.querySelector('[data-valor="si"]').textContent = aceptar;

      const cerrar = valor => {
        dialog.close();
        dialog.remove();
        resolve(valor);
      };
      dialog.addEventListener('click', e => {
        const boton = e.target.closest('[data-valor]');
        if (boton) cerrar(boton.dataset.valor === 'si');
      });
      dialog.addEventListener('cancel', e => { e.preventDefault(); cerrar(false); }); // tecla Esc

      document.body.appendChild(dialog);
      dialog.showModal();
      dialog.querySelector('[data-valor="si"]').focus();
    });
  };

  // Aviso grande centrado con tilde verde (ej.: "¡Pedido confirmado!").
  ui.mostrarExito = function (texto) {
    const aviso = document.createElement('div');
    aviso.className = 'al-exito';
    aviso.setAttribute('role', 'status');
    aviso.innerHTML = `
      <div class="al-exito__caja">
        <div class="al-exito__icono">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p class="al-exito__texto"></p>
      </div>
    `;
    aviso.querySelector('.al-exito__texto').textContent = texto;
    document.body.appendChild(aviso);
    requestAnimationFrame(() => aviso.classList.add('al-exito--visible'));
    return aviso;
  };

  /* ───────────── Actividad del usuario (RNF-08) ───────────── */
  let ultimoRegistro = 0;
  function registrarActividad() {
    const ahora = Date.now();
    if (ahora - ultimoRegistro > 30000) { // como mucho cada 30 s
      ultimoRegistro = ahora;
      AL.sesion.registrarActividad();
    }
  }

  /* ───────────── Arranque ───────────── */
  window.AL.ui = ui;
  proteger();

  function alCargar() {
    crearBarra();
    mostrarFlash();
    if (ui.usuario) {
      ['click', 'keydown'].forEach(evento =>
        document.addEventListener(evento, registrarActividad, { passive: true }));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', alCargar);
  } else {
    alCargar();
  }
})();
