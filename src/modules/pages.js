// =====================================================
// PÁGINAS · se ve una a la vez
// Navegación: botones Anterior/Siguiente, puntos, teclado (← →) y deslizar con el dedo
// =====================================================
export class PageNavigator {
  #paginas; #actual = 0; #puntos = [];
  #barra; #btnAnterior; #btnSiguiente;

  constructor({ paginas, barra, anterior, siguiente, puntos }) {
    this.#paginas = paginas;
    this.#barra = barra;
    this.#btnAnterior = anterior;
    this.#btnSiguiente = siguiente;

    paginas.forEach((p) => (p.tabIndex = -1)); // permite enfocar la página al cambiar (lectores de pantalla)
    this.#crearPuntos(puntos);
    anterior.addEventListener('click', () => this.anterior());
    // En la última página el botón se convierte en "Inicio" y vuelve a la portada
    siguiente.addEventListener('click', () => (this.#esUltima ? this.irA(0) : this.siguiente()));
    this.#activarTeclado();
    this.#activarDeslizar();
    this.#mostrar(0, { enfocar: false });
  }

  get #esUltima() { return this.#actual === this.#paginas.length - 1; }

  siguiente() { this.irA(this.#actual + 1); }
  anterior() { this.irA(this.#actual - 1); }

  /** Va a una página por posición (número) o por su id. */
  irA(destino) {
    const i = typeof destino === 'string' ? this.#paginas.findIndex((p) => p.id === destino) : destino;
    if (i < 0 || i >= this.#paginas.length || i === this.#actual) return;
    this.#mostrar(i);
  }

  #mostrar(i, { enfocar = true } = {}) {
    this.#actual = i;
    this.#paginas.forEach((p, n) => {
      const activa = n === i;
      p.toggleAttribute('data-activa', activa);
      p.inert = !activa;          // las páginas ocultas no reciben foco ni clics
      if (activa) p.scrollTop = 0;
    });
    this.#puntos.forEach((d, n) => d.toggleAttribute('data-activo', n === i));
    this.#barra.toggleAttribute('data-oculta', i === 0);                       // la portada tiene su propio botón play
    this.#btnAnterior.toggleAttribute('data-oculto', i === 0);
    this.#btnSiguiente.querySelector('[data-etiqueta]').textContent = this.#esUltima ? 'Inicio' : 'Siguiente';
    if (enfocar) this.#paginas[i].focus({ preventScroll: true });
  }

  #crearPuntos(contenedor) {
    this.#puntos = this.#paginas.map((pagina, i) => {
      const b = Object.assign(document.createElement('button'), {
        type: 'button',
        className: 'relative h-1.5 w-1.5 cursor-pointer rounded-full bg-white/35 transition-all duration-300 before:absolute before:-inset-1.5 data-[activo]:w-5 data-[activo]:bg-crema',
      });
      b.setAttribute('aria-label', `Ir a: ${pagina.dataset.titulo}`);
      b.addEventListener('click', () => this.irA(i));
      return b;
    });
    contenedor.append(...this.#puntos);
  }

  /** ¿El gesto ocurre dentro de un campo de texto o de la ventana de confirmación? */
  #ignorar(e) {
    return e.target.closest('input, textarea, select, dialog') || document.querySelector('dialog[open]');
  }

  #activarTeclado() {
    addEventListener('keydown', (e) => {
      if (this.#ignorar(e)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') this.siguiente();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') this.anterior();
    });
  }

  /** Deslizar a la izquierda = siguiente · a la derecha = anterior. */
  #activarDeslizar() {
    let x0 = 0, y0 = 0;
    addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchend', (e) => {
      if (this.#ignorar(e)) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return; // solo gestos horizontales claros
      dx < 0 ? this.siguiente() : this.anterior();
    }, { passive: true });
  }
}
