// =====================================================
// PANEL PRIVADO · login + datos en tiempo real + exportar CSV
// Los datos solo se pueden leer si inicias sesión con TU correo
// (lo garantizan las reglas de firestore.rules).
// =====================================================
import './style.css';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE } from './config.js';
import { $ } from './lib/dom.js';

const app = initializeApp(FIREBASE);
const auth = getAuth(app);
const db = getFirestore(app);

let confirmaciones = [];
let cancelar = []; // funciones para dejar de escuchar al cerrar sesión

const fechaTexto = (ts) => ts?.toDate?.().toLocaleString('es-BO') ?? '';

/** Agrega una fila usando textContent (nunca innerHTML: evita inyección de código). */
function fila(tbody, celdas) {
  const tr = document.createElement('tr');
  for (const c of celdas) {
    const td = document.createElement('td');
    if (c && typeof c === 'object') { td.textContent = c.texto; td.className = c.clase; }
    else td.textContent = c ?? '';
    tr.append(td);
  }
  tbody.append(tr);
}

/** Escucha una colección en tiempo real, ordenada por fecha. */
const escuchar = (nombre, alCambiar) =>
  onSnapshot(query(collection(db, nombre), orderBy('fecha', 'desc')), alCambiar);

function iniciarPanel() {
  cancelar.push(
    escuchar('confirmaciones', (snap) => {
      const cuerpo = $('#tbConf');
      cuerpo.replaceChildren();
      confirmaciones = snap.docs.map((d) => d.data());
      const si = confirmaciones.filter((c) => c.asistira === 'si');
      for (const c of confirmaciones)
        fila(cuerpo, [
          c.nombre,
          c.asistira === 'si' ? { texto: 'Sí', clase: 'font-semibold text-green-700' } : { texto: 'No', clase: 'font-semibold text-red-700' },
          c.personas || '-', c.telefono || '-', fechaTexto(c.fecha),
        ]);
      $('#tSi').textContent = si.length;
      $('#tNo').textContent = confirmaciones.length - si.length;
      $('#tPers').textContent = si.reduce((suma, c) => suma + (c.personas || 0), 0);
    }),
    escuchar('firmas', (snap) => {
      const cuerpo = $('#tbFirmas');
      cuerpo.replaceChildren();
      snap.forEach((d) => { const f = d.data(); fila(cuerpo, [f.nombre, f.mensaje, fechaTexto(f.fecha)]); });
      $('#tFirmas').textContent = snap.size;
    })
  );
}

// ---- Sesión ----
$('#login').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#error').textContent = '';
  try { await signInWithEmailAndPassword(auth, $('#email').value, $('#clave').value); }
  catch { $('#error').textContent = 'Correo o contraseña incorrectos.'; }
});
$('#btnSalir').addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (usuario) => {
  $('#login').hidden = !!usuario;
  $('#login').classList.toggle('grid', !usuario);
  $('#panel').hidden = !usuario;
  cancelar.forEach((f) => f());
  cancelar = [];
  if (usuario) iniciarPanel();
});

// ---- Exportar CSV (se abre en Excel) ----
$('#btnCsv').addEventListener('click', () => {
  const celda = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const filas = [['Nombre', 'Asiste', 'Personas', 'Celular', 'Fecha'],
    ...confirmaciones.map((c) => [c.nombre, c.asistira, c.personas, c.telefono, fechaTexto(c.fecha)])];
  const csv = '\ufeff' + filas.map((f) => f.map(celda).join(',')).join('\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })),
    download: 'confirmaciones-xv.csv',
  });
  a.click();
  URL.revokeObjectURL(a.href);
});
