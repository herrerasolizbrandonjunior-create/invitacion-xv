// =====================================================
// AVISO POR CORREO · usa EmailJS (se envía desde el navegador)
// Si falla, no molesta al invitado: la confirmación ya quedó en Firebase.
// =====================================================
import { EMAILJS, emailConfigurado } from '../config.js';

export async function avisarPorCorreo(d) {
  if (!emailConfigurado) return;
  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS.serviceId,
        template_id: EMAILJS.templateId,
        user_id: EMAILJS.publicKey,
        template_params: {
          nombre: d.nombre,
          asiste: d.asistira === 'si' ? 'Sí asistirá' : 'No asistirá',
          personas: d.asistira === 'si' ? String(d.personas) : '-',
          telefono: d.telefono || '-',
        },
      }),
    });
  } catch (err) {
    console.warn('No se pudo enviar el correo de aviso', err);
  }
}