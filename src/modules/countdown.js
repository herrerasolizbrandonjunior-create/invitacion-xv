// =====================================================
// CUENTA REGRESIVA · se sincroniza con el segundo exacto
// y se detiene cuando la pestaña no está visible
// =====================================================
const dos = (n) => String(n).padStart(2, '0');

export class Countdown {
  #meta; #contenedor; #valores; #timer;

  constructor(contenedor, fechaISO) {
    this.#contenedor = contenedor;
    this.#meta = new Date(fechaISO).getTime();
    this.#valores = Object.fromEntries(
      [...contenedor.querySelectorAll('[data-unidad]')].map((el) => [el.dataset.unidad, el])
    );
    document.addEventListener('visibilitychange', () => (document.hidden ? this.#parar() : this.iniciar()));
  }

  iniciar() {
    this.#parar();
    this.#actualizar();
  }

  #parar() { clearTimeout(this.#timer); }

  #actualizar() {
    const seg = Math.max(0, Math.floor((this.#meta - Date.now()) / 1000));
    if (seg === 0) return this.#mostrarFin();
    const v = this.#valores;
    v.dias.textContent = dos(Math.floor(seg / 86_400));
    v.horas.textContent = dos(Math.floor((seg % 86_400) / 3600));
    v.min.textContent = dos(Math.floor((seg % 3600) / 60));
    v.seg.textContent = dos(seg % 60);
    // Se programa justo al inicio del siguiente segundo (sin desfase acumulado)
    this.#timer = setTimeout(() => this.#actualizar(), 1000 - (Date.now() % 1000));
  }

  #mostrarFin() {
    this.#contenedor.replaceChildren(
      Object.assign(document.createElement('p'), { textContent: '¡Hoy es el gran día!', className: 'font-script text-4xl' })
    );
  }
}
