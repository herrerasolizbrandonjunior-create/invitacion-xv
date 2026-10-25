// Marca con data-missing los espacios de imagen cuyo archivo aún no existe
import { $$ } from '../lib/dom.js';

export function marcarImagenesFaltantes() {
  for (const img of $$('.slot > img')) {
    const marcar = () => (img.parentElement.dataset.missing = '');
    if (img.complete && img.naturalWidth === 0) marcar(); // ya falló antes de ejecutar este código
    else img.addEventListener('error', marcar, { once: true });
  }
}
