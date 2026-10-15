/* ══════════════════════════════════════════════════════════════
   datos.js — CAPA DE DATOS COMPARTIDA (Aromas Light)
   ──────────────────────────────────────────────────────────────
   Todavía no hay backend, así que este archivo SIMULA uno:
     • Los datos iniciales salen de /data/*.json (platos y pedidos).
     • Todo lo que el usuario crea o modifica se guarda en
       localStorage (usuarios, sesión, asistencia, borradores,
       pedidos confirmados, menú publicado y feriados).

   Todas las pantallas usan el objeto global `AL` (Aromas Light).
   Cuando exista la API de Spring Boot, alcanza con cambiar el
   cuerpo de estas funciones por fetch() al servidor: las
   pantallas no se enteran del cambio.

   ORDEN DE CARGA en cada HTML:
     1) datos.js   2) ui.js   3) el JS propio de la pantalla
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ───────────── Almacenamiento (localStorage) ───────────── */
  const PREFIJO = 'al_';

  // try/catch: en modo privado o con almacenamiento bloqueado
  // localStorage puede lanzar error. La app no debe romperse.
  function leer(clave, porDefecto) {
    try {
      const valor = localStorage.getItem(PREFIJO + clave);
      return valor === null ? porDefecto : JSON.parse(valor);
    } catch (error) {
      console.warn('No se pudo leer', clave, error);
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error('No se pudo guardar', clave, error);
      return false;
    }
  }

  function borrar(clave) {
    try { localStorage.removeItem(PREFIJO + clave); } catch (e) { /* sin acción */ }
  }

  /* ───────────── Constantes de días ───────────── */
  // Coinciden con el campo "dia" de platos.json y con los ids
  // de los checkboxes de la Pantalla 2.
  const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  const NOMBRES_DIA = {
    lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
    jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
  };

  /* ───────────── Utilidades ───────────── */
  const util = {
    // Evita inyección de HTML (XSS) cuando se pinta texto que
    // escribió un usuario (comentarios, nombres, etc.).
    escaparHTML(texto) {
      return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    // "  Miércoles " -> "miercoles"
    normalizar(texto) {
      return String(texto ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
    },

    emailValido(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
    },

    generarId(prefijo) {
      return prefijo + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    },

    // Achica una imagen subida por el usuario y la devuelve como
    // dataURL (texto) para poder guardarla en localStorage sin
    // ocupar demasiado espacio.
    redimensionarImagen(archivo, ladoMaximo = 600) {
      return new Promise((resolve, reject) => {
        if (!archivo || !archivo.type.startsWith('image/')) {
          reject(new Error('El archivo no es una imagen.'));
          return;
        }
        const lector = new FileReader();
        lector.onerror = () => reject(new Error('No se pudo leer la imagen.'));
        lector.onload = () => {
          const img = new Image();
          img.onerror = () => reject(new Error('Formato de imagen no soportado.'));
          img.onload = () => {
            const escala = Math.min(1, ladoMaximo / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * escala);
            canvas.height = Math.round(img.height * escala);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          };
          img.src = lector.result;
        };
        lector.readAsDataURL(archivo);
      });
    }
  };

  /* ───────────── Fechas ─────────────
     Se trabaja con fechas ISO "AAAA-MM-DD" en hora LOCAL
     (no se usa toISOString porque convierte a UTC y en Argentina
     puede devolver el día anterior). */
  const fechas = {
    aISO(fecha) {
      const a = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, '0');
      const d = String(fecha.getDate()).padStart(2, '0');
      return `${a}-${m}-${d}`;
    },

    desdeISO(iso) {
      const [a, m, d] = iso.split('-').map(Number);
      return new Date(a, m - 1, d);
    },

    hoyISO() {
      return fechas.aISO(new Date());
    },

    // "2026-10-12" -> "12/10/2026"
    isoADMY(iso) {
      const [a, m, d] = iso.split('-');
      return `${d}/${m}/${a}`;
    },

    // "2026-10-12" -> "12/10"
    isoACorta(iso) {
      const [, m, d] = iso.split('-');
      return `${d}/${m}`;
    },

    // "12/10/2026" -> "2026-10-12" (o null si la fecha no existe)
    dmyAISO(texto) {
      const coincide = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(texto).trim());
      if (!coincide) return null;
      const [, d, m, a] = coincide.map(Number);
      const fecha = new Date(a, m - 1, d);
      const existe = fecha.getFullYear() === a && fecha.getMonth() === m - 1 && fecha.getDate() === d;
      return existe ? fechas.aISO(fecha) : null;
    },

    // Lunes de la "semana del menú": la semana en curso.
    // Si hoy es domingo, se toma la semana siguiente.
    lunesSemanaMenu(base = new Date()) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
      const diaSemana = d.getDay(); // 0 = domingo
      d.setDate(d.getDate() + (diaSemana === 0 ? 1 : 1 - diaSemana));
      return d;
    },

    semanaMenuISO() {
      return fechas.aISO(fechas.lunesSemanaMenu());
    },

    // 'miercoles' -> '2026-10-14' (fecha de ese día en la semana del menú)
    fechaDelDia(dia, lunes = fechas.lunesSemanaMenu()) {
      const indice = DIAS.indexOf(dia);
      if (indice === -1) return null;
      const d = new Date(lunes);
      d.setDate(d.getDate() + indice);
      return fechas.aISO(d);
    },

    // '2026-10-14' -> 'miercoles'
    diaDeFecha(iso) {
      const nombres = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      return nombres[fechas.desdeISO(iso).getDay()];
    }
  };

  async function cargarJSON(ruta) {
    const respuesta = await fetch(ruta, { cache: 'no-store' });
    if (!respuesta.ok) {
      throw new Error(`No se pudo leer ${ruta}. Estado: ${respuesta.status}`);
    }
    return respuesta.json();
  }

  /* ═════════════ USUARIOS ═════════════ */
  // Usuarios de prueba. En producción las contraseñas se guardan
  // cifradas en el backend (RNF-04); acá es solo una simulación.
  const USUARIOS_INICIALES = [
    {
      id: 'usr-admin',
      nombre: 'Administrador',
      usuario: 'admin',
      email: 'admin@aromaslight.com',
      contrasena: 'admin1234',
      rol: 'admin',
      activo: true,
      fechaNacimiento: '',
      telefono: '',
      dni: '',
      comentarios: '',
      foto: ''
    },
    {
      id: 'usr-carlos',
      nombre: 'Carlos Perez',
      usuario: 'carlosperez',
      email: 'carlosperez@gmail.com',
      contrasena: 'carlos1234',
      rol: 'empleado',
      activo: true,
      fechaNacimiento: '06/04/1996',
      telefono: '3422222222',
      dni: '11200300',
      comentarios: '',
      foto: ''
    }
  ];

  const usuarios = {
    todos() {
      let lista = leer('usuarios', null);
      if (!Array.isArray(lista)) {
        lista = USUARIOS_INICIALES;
        guardar('usuarios', lista);
      }
      return lista;
    },

    porId(id) {
      return usuarios.todos().find(u => u.id === id) || null;
    },

    porEmail(email) {
      const buscado = String(email).trim().toLowerCase();
      return usuarios.todos().find(u => u.email.toLowerCase() === buscado) || null;
    },

    porNombreUsuario(nombreUsuario) {
      const buscado = String(nombreUsuario).trim().toLowerCase();
      return usuarios.todos().find(u => (u.usuario || '').toLowerCase() === buscado) || null;
    },

    // Devuelve el usuario si email + contraseña coinciden y la cuenta está activa.
    autenticar(email, contrasena) {
      const usuario = usuarios.porEmail(email);
      if (!usuario || usuario.contrasena !== contrasena) return { ok: false, error: 'Email o contraseña incorrectos.' };
      if (!usuario.activo) return { ok: false, error: 'La cuenta está desactivada. Contactá al administrador.' };
      return { ok: true, usuario };
    },

    registrar(datos) {
      if (usuarios.porEmail(datos.email)) return { ok: false, campo: 'email', error: 'Ya existe una cuenta con ese email.' };
      if (usuarios.porNombreUsuario(datos.usuario)) return { ok: false, campo: 'usuario', error: 'Ese nombre de usuario ya está en uso.' };

      const nuevo = {
        id: util.generarId('usr'),
        nombre: datos.nombre.trim(),
        usuario: datos.usuario.trim(),
        email: datos.email.trim(),
        contrasena: datos.contrasena,
        rol: 'empleado',          // toda cuenta nueva es de empleado
        activo: true,
        fechaNacimiento: datos.fechaNacimiento,
        telefono: datos.telefono,
        dni: '',
        comentarios: '',
        foto: ''
      };
      const lista = usuarios.todos();
      lista.push(nuevo);
      guardar('usuarios', lista);
      return { ok: true, usuario: nuevo };
    },

    actualizar(id, cambios) {
      const lista = usuarios.todos();
      const indice = lista.findIndex(u => u.id === id);
      if (indice === -1) return { ok: false, error: 'Usuario inexistente.' };

      if (cambios.email) {
        const otro = usuarios.porEmail(cambios.email);
        if (otro && otro.id !== id) return { ok: false, campo: 'email', error: 'Ese email ya pertenece a otra cuenta.' };
      }
      lista[indice] = { ...lista[indice], ...cambios, id };
      if (!guardar('usuarios', lista)) {
        return { ok: false, error: 'No hay espacio para guardar los cambios (¿la foto es muy pesada?).' };
      }
      return { ok: true, usuario: lista[indice] };
    }
  };

  /* ═════════════ SESIÓN ═════════════ */
  // RNF-08: la sesión expira tras 60 minutos de inactividad.
  const MINUTOS_INACTIVIDAD = 60;

  const sesion = {
    iniciar(usuario) {
      guardar('sesion', { usuarioId: usuario.id, rol: usuario.rol, ultimaActividad: Date.now() });
    },

    cerrar() {
      borrar('sesion');
    },

    // { estado: 'activa' | 'expirada' | 'ninguna', usuario }
    estado() {
      const datos = leer('sesion', null);
      if (!datos) return { estado: 'ninguna', usuario: null };

      const inactivo = Date.now() - (datos.ultimaActividad || 0);
      if (inactivo > MINUTOS_INACTIVIDAD * 60 * 1000) {
        sesion.cerrar();
        return { estado: 'expirada', usuario: null };
      }
      const usuario = usuarios.porId(datos.usuarioId);
      if (!usuario || !usuario.activo) {
        sesion.cerrar();
        return { estado: 'ninguna', usuario: null };
      }
      return { estado: 'activa', usuario };
    },

    usuarioActual() {
      return sesion.estado().usuario;
    },

    registrarActividad() {
      const datos = leer('sesion', null);
      if (datos) {
        datos.ultimaActividad = Date.now();
        guardar('sesion', datos);
      }
    }
  };

  /* ═════════════ ASISTENCIA (Pantalla 2) ═════════════ */
  const asistencia = {
    obtener(usuarioId) {
      const todas = leer('asistencia', {});
      return Array.isArray(todas[usuarioId]) ? todas[usuarioId] : null;
    },
    guardar(usuarioId, dias) {
      const todas = leer('asistencia', {});
      todas[usuarioId] = DIAS.filter(d => dias.includes(d));
      return guardar('asistencia', todas);
    }
  };

  /* ═════════════ BORRADOR DEL PEDIDO (Pantallas 3 y 4) ═════════════
     HU-01: el pedido primero es un BORRADOR. Se confirma en la Pantalla 4.
     Forma: { semana: '2026-10-12', platos: { lunes: 'Titulo' }, comentarios: { lunes: '...' } } */
  const borrador = {
    obtener(usuarioId) {
      const todos = leer('borradores', {});
      const b = todos[usuarioId];
      // Un borrador de otra semana ya no sirve.
      if (!b || b.semana !== fechas.semanaMenuISO()) return null;
      return b;
    },
    guardar(usuarioId, platos, comentarios = {}) {
      const todos = leer('borradores', {});
      todos[usuarioId] = { semana: fechas.semanaMenuISO(), platos, comentarios };
      return guardar('borradores', todos);
    },
    borrar(usuarioId) {
      const todos = leer('borradores', {});
      delete todos[usuarioId];
      guardar('borradores', todos);
    }
  };

  /* ═════════════ MENÚ / PLATOS (Pantallas 3, 4 y 7) ═════════════
     Si el administrador publicó un menú (Pantalla 7) se usa ese;
     si no, el de data/platos.json. */
  const menu = {
    async obtener() {
      const publicado = leer('platos', null);
      if (Array.isArray(publicado)) return publicado;
      return cargarJSON('data/platos.json');
    },
    publicar(platos) {
      return guardar('platos', platos);
    },
    fuePublicado() {
      return Array.isArray(leer('platos', null));
    },
    // Vuelve al menú original del JSON (útil para pruebas).
    restaurarOriginal() {
      borrar('platos');
    }
  };

  /* ═════════════ PEDIDOS CONFIRMADOS (Pantallas 4 y 5) ═════════════
     Pedido: { id, usuarioId, empleado, menu, comentario, fecha, dia, estado, confirmadoEn } */
  const pedidos = {
    // Une los pedidos de ejemplo del JSON con los confirmados en la app.
    async todos() {
      let delJSON = [];
      try {
        delJSON = await cargarJSON('data/pedidos.json');
      } catch (error) {
        console.warn('No se pudieron leer los pedidos de ejemplo:', error);
      }
      const base = delJSON.map(p => ({ estado: 'confirmado', origen: 'ejemplo', ...p }));
      return base.concat(leer('pedidos', []));
    },

    locales() {
      return leer('pedidos', []);
    },

    deUsuarioEnSemana(usuarioId) {
      const lunes = fechas.lunesSemanaMenu();
      const fechasSemana = DIAS.map(d => fechas.fechaDelDia(d, lunes));
      return pedidos.locales().filter(p => p.usuarioId === usuarioId && fechasSemana.includes(p.fecha));
    },

    // Confirma (o MODIFICA, HU-04) el pedido semanal de un empleado.
    // Reemplaza lo que ese empleado tenía confirmado en la semana.
    confirmarSemana(usuario, items) {
      const lunes = fechas.lunesSemanaMenu();
      const fechasSemana = DIAS.map(d => fechas.fechaDelDia(d, lunes));
      const ahora = new Date().toISOString();

      const resto = pedidos.locales().filter(
        p => !(p.usuarioId === usuario.id && fechasSemana.includes(p.fecha))
      );
      const nuevos = items.map(item => ({
        id: util.generarId('ped'),
        usuarioId: usuario.id,
        empleado: usuario.nombre,
        menu: item.menu,
        comentario: item.comentario || 'Sin comentarios',
        fecha: item.fecha,
        dia: item.dia,
        estado: 'confirmado',
        confirmadoEn: ahora
      }));
      const ok = guardar('pedidos', resto.concat(nuevos));
      return { ok, pedidos: nuevos };
    },

    // Cuántos pedidos confirmados tiene un plato en una fecha.
    // Se usa para controlar el stock (HU-15).
    contar(lista, fecha, nombrePlato, excluirUsuarioId = null) {
      return lista.filter(p =>
        p.fecha === fecha &&
        p.menu === nombrePlato &&
        p.estado !== 'cancelado' &&
        (!excluirUsuarioId || p.usuarioId !== excluirUsuarioId)
      ).length;
    }
  };

  /* ═════════════ FERIADOS (Pantalla 8) ═════════════
     Objeto { 'AAAA-MM-DD': 'motivo' } */
  const FERIADOS_INICIALES = {
    '2026-08-17': 'Paso a la Inmortalidad del General José de San Martín'
  };

  const feriados = {
    todos() {
      let lista = leer('feriados', null);
      if (!lista || typeof lista !== 'object') {
        lista = { ...FERIADOS_INICIALES };
        guardar('feriados', lista);
      }
      return lista;
    },
    motivo(iso) {
      const lista = feriados.todos();
      return Object.prototype.hasOwnProperty.call(lista, iso) ? lista[iso] : null;
    },
    esFeriado(iso) {
      return feriados.motivo(iso) !== null;
    },
    marcar(iso, motivo) {
      const lista = feriados.todos();
      lista[iso] = motivo;
      return guardar('feriados', lista);
    },
    quitar(iso) {
      const lista = feriados.todos();
      delete lista[iso];
      return guardar('feriados', lista);
    }
  };

  /* ═════════════ ENVÍOS AL PROVEEDOR (Pantalla 5) ═════════════ */
  const envios = {
    registrar(fecha, cantidad) {
      const lista = leer('envios', {});
      lista[fecha] = { enviadoEn: new Date().toISOString(), cantidad };
      guardar('envios', lista);
    },
    obtener(fecha) {
      return leer('envios', {})[fecha] || null;
    }
  };

  // Único objeto global que exponen los scripts compartidos.
  window.AL = {
    DIAS,
    NOMBRES_DIA,
    PREFIJO,
    util,
    fechas,
    cargarJSON,
    usuarios,
    sesion,
    asistencia,
    borrador,
    menu,
    pedidos,
    feriados,
    envios
  };
})();
