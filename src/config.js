// =====================================================
// CONFIGURACIÓN · aquí cambias los datos importantes
// =====================================================

export const EVENT = Object.freeze({
  // Fecha y hora del evento (Bolivia = -04:00). Formato: AAAA-MM-DDTHH:MM:SS-04:00
  fecha: '2026-12-04T19:00:00-04:00',

  // Último momento para confirmar asistencia (después se desactiva el botón)
  fechaLimite: '2026-11-04T23:59:59-04:00',

  // Enlace del botón "Ver ubicación".
  // Google Maps: busca el salón > Compartir > Copiar enlace > pégalo aquí.
  ubicacionUrl: 'https://maps.app.goo.gl/feMKuXLsMsgURj637',
});
// Datos de Firebase (consola de Firebase > Configuración del proyecto > Tus apps).
// NO son secretos: la seguridad la dan las reglas de Firestore (firestore.rules).
export const FIREBASE = Object.freeze({
  apiKey: 'AIzaSyDRpHOlRqNmwbsoLaT_izgCQTI-P7i8kpU',
  authDomain: 'xv-najavi.firebaseapp.com',
  projectId: 'xv-najavi',
  storageBucket: 'xv-najavi.firebasestorage.app',
  messagingSenderId: '166802565117',
  appId: '1:166802565117:web:71c02b1ac9285b36409b94',
  measurementId: "G-05KJN6HWSQ",
});
// Initialize Firebase

export const firebaseConfigurado = Boolean(FIREBASE.apiKey && FIREBASE.projectId);