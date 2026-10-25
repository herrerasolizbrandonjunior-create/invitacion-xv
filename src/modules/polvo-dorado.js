// =====================================================
// POLVO DORADO · lluvia de partículas sobre toda la invitación
// Se dibuja en un <canvas id="polvoDorado"> que no bloquea los toques.
// Ajustes rápidos: las constantes de abajo.
// =====================================================
const CANTIDAD = 45;     // más partículas = más polvo (30 sutil · 80 abundante)
const TAMANO = [0.6, 2.4]; // radio mínimo y máximo
const VELOCIDAD = [0.25, 0.75]; // caída: mínimo y máximo
const COLORES = ['255,215,120', '240,190,80', '255,236,170', '212,165,60']; // R,G,B

export class PolvoDorado {
  #canvas; #ctx; #ancho = 0; #alto = 0; #particulas = [];

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
  }

  iniciar() {
    // Quien tiene activado "reducir movimiento" no ve la animación
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    new ResizeObserver(() => this.#ajustar()).observe(this.#canvas);
    this.#ajustar();
    requestAnimationFrame(() => this.#dibujar());
  }

  #azar(min, max) { return Math.random() * (max - min) + min; }

  #nueva(enTodaLaPantalla) {
    return {
      x: Math.random() * this.#ancho,
      y: enTodaLaPantalla ? Math.random() * this.#alto : -10,
      r: this.#azar(...TAMANO),
      v: this.#azar(...VELOCIDAD),
      balanceo: this.#azar(0.5, 2),
      fase: Math.random() * Math.PI * 2,
      brillo: Math.random() * Math.PI * 2,
      color: COLORES[Math.floor(Math.random() * COLORES.length)],
    };
  }

  #ajustar() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.#ancho = this.#canvas.clientWidth;
    this.#alto = this.#canvas.clientHeight;
    this.#canvas.width = this.#ancho * dpr;
    this.#canvas.height = this.#alto * dpr;
    this.#ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.#particulas = Array.from({ length: CANTIDAD }, () => this.#nueva(true));
  }

  #dibujar() {
    const ctx = this.#ctx;
    ctx.clearRect(0, 0, this.#ancho, this.#alto);
    for (const p of this.#particulas) {
      p.y += p.v;
      p.fase += 0.015;
      p.brillo += 0.04;
      p.x += Math.sin(p.fase) * 0.3 * p.balanceo;
      if (p.y > this.#alto + 10) Object.assign(p, this.#nueva(false));

      const alfa = 0.35 + 0.5 * Math.abs(Math.sin(p.brillo)); // titileo
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      g.addColorStop(0, `rgba(${p.color},${alfa})`);
      g.addColorStop(1, `rgba(${p.color},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(() => this.#dibujar());
  }
}
