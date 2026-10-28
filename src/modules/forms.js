// =====================================================
// FORMULARIOS · libro de firmas y confirmación de asistencia
// Cada formulario se describe con un objeto: leer -> validar -> guardar
// =====================================================
import { EVENT } from '../config.js';
import { $, $$, aviso } from '../lib/dom.js';
import { guardarDocumento } from '../lib/firebase.js';
import { avisarPorCorreo } from '../lib/email.js';

const texto = (v) => String(v ?? '').trim();

/** Descripción de cada formulario (para agregar otro solo se agrega otro objeto). */
const FORMULARIOS = {
  firma: {
    coleccion: 'firmas',
    leer: (f) => ({ nombre: texto(f.nombre.value), mensaje: texto(f.mensaje.value) }),
    validar: (d) =>
      (!d.nombre && 'Escribe tu nombre.') ||
      (!d.mensaje && 'Escribe un mensaje.') ||
      (d.nombre.length > 100 && 'El nombre es muy largo.') ||
      (d.mensaje.length > 500 && 'El mensaje es muy largo.') || null,
    exito: () => '¡Gracias! Tu mensaje fue guardado en el libro de firmas 💚',
  },
  rsvp: {
    coleccion: 'confirmaciones',
    leer: (f) => {
      const asistira = f.asistira.value; // 'si' | 'no'
      return {
        nombre: texto(f.nombre.value),
        asistira,
        personas: asistira === 'si' ? Number(f.personas.value) : 0,
        telefono: texto(f.telefono.value),
        avisarCorreo: true, // al confirmar, te llega un correo
      };
    },
    validar: (d) => (!d.nombre && 'Escribe tu nombre.') || (d.nombre.length > 100 && 'El nombre es muy largo.') || null,
    exito: (d) => (d.asistira === 'si' ? '¡Confirmado! Te esperamos 💚' : 'Gracias por avisarnos 💚'),
  },
};

/** Contadores 0/100: cualquier campo con data-contador="idDelSpan". */
function activarContadores() {
  for (const campo of $$('[data-contador]')) {
    const salida = document.getElementById(campo.dataset.contador);
    campo.addEventListener('input', () => (salida.textContent = `${campo.value.length}/${campo.maxLength}`));
  }
}

function activarFormulario(form, alTerminar) {
  const def = FORMULARIOS[form.dataset.form];
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.web.value) return; // campo trampa anti-spam: si tiene algo es un robot
    const datos = def.leer(form);
    const error = def.validar(datos);
    if (error) return aviso(error);

    const boton = $('[type="submit"]', form);
    boton.disabled = true;
    try {
      await guardarDocumento(def.coleccion, datos);
      if (def.avisarCorreo) avisarPorCorreo(datos); // sin esperar: no retrasa al invitado
      form.reset();
      activarContadoresReset(form);
      alTerminar?.();
      aviso(def.exito(datos));
    } catch (err) {
      console.error(err);
      aviso(err.message === 'sin-config' ? 'Modo prueba: falta configurar Firebase.' : 'No se pudo enviar. Intenta de nuevo.');
    } finally {
      boton.disabled = false;
    }
  });
}

function activarContadoresReset(form) {
  for (const campo of $$('[data-contador]', form))
    document.getElementById(campo.dataset.contador).textContent = `0/${campo.maxLength}`;
}

export function iniciarFormularios() {
  activarContadores();

  // ----- Libro de firmas -----
  activarFormulario($('[data-form="firma"]'));

  // ----- Confirmación de asistencia (ventana <dialog>) -----
  const dialogo = $('#dlgConfirmar');
  const boton = $('#btnConfirmar');
  const form = $('[data-form="rsvp"]');

  if (Date.now() > new Date(EVENT.fechaLimite).getTime()) {
    boton.disabled = true;
    boton.textContent = 'El plazo de confirmación terminó';
  }

  // Enlace personalizado: tusitio.com/?invitado=Familia%20Perez  ->  nombre prellenado
  const invitado = new URLSearchParams(location.search).get('invitado');
  if (invitado) form.nombre.value = invitado.slice(0, 100);

  boton.addEventListener('click', () => dialogo.showModal());
  $('#btnCerrarDlg').addEventListener('click', () => dialogo.close());
  // Clic fuera de la ventana = cerrar
  dialogo.addEventListener('click', (e) => e.target === dialogo && dialogo.close());

  // Si responde "No", se oculta la pregunta de cuántas personas
  form.addEventListener('change', (e) => {
    if (e.target.name === 'asistira') $('#bloquePersonas').hidden = e.target.value === 'no';
  });

  activarFormulario(form, () => dialogo.close());
}

