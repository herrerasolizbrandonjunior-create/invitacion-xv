// =====================================================
// FIREBASE · se carga SOLO cuando alguien envía un formulario
// (import dinámico = la invitación abre más rápido)
// =====================================================
import { FIREBASE, firebaseConfigurado } from '../config.js';

let dbPromise;

function obtenerDb() {
  dbPromise ??= Promise.all([import('firebase/app'), import('firebase/firestore')]).then(
    ([{ initializeApp }, firestore]) => ({ db: firestore.getFirestore(initializeApp(FIREBASE)), firestore })
  );
  return dbPromise;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Reintenta con espera creciente (por si el celular tiene mala señal). */
async function conReintentos(fn, intentos = 3, base = 600) {
  for (let i = 0; ; i++) {
    try { return await fn(); }
    catch (err) {
      if (i >= intentos - 1) throw err;
      await esperar(base * 2 ** i);
    }
  }
}

/** Guarda un documento con la fecha del servidor. Lanza 'sin-config' si falta Firebase. */
export async function guardarDocumento(coleccion, datos) {
  if (!firebaseConfigurado) throw new Error('sin-config');
  const { db, firestore } = await obtenerDb();
  return conReintentos(() =>
    firestore.addDoc(firestore.collection(db, coleccion), { ...datos, fecha: firestore.serverTimestamp() })
  );
}
