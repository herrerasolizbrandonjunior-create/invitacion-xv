// Atajos para buscar elementos y mostrar avisos
export const $ = (selector, raiz = document) => raiz.querySelector(selector);
export const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

export const prefiereMenosMovimiento = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

let temporizador;
/** Muestra un aviso flotante durante 4 segundos. */
export function aviso(texto) {
  const el = $('#toast');
  el.textContent = texto;
  el.dataset.visible = '';
  clearTimeout(temporizador);
  temporizador = setTimeout(() => delete el.dataset.visible, 4000);
}
