// =====================================================
// MÚSICA · reproductor con fade-in, silenciar y pausa automática
// =====================================================
export class MusicPlayer {
  #audio; #boton; #volumen; #iniciada = false; #pausadaPorPestana = false;

  constructor({ audio, boton, volumen = 0.6 }) {
    this.#audio = audio;
    this.#boton = boton;
    this.#volumen = volumen;
    this.#boton.addEventListener('click', () => this.alternar());
    // Si el celular se bloquea o cambian de pestaña, la música se pausa sola
    document.addEventListener('visibilitychange', () => {
      if (!this.#iniciada) return;
      if (document.hidden && !this.#audio.paused) { this.#audio.pause(); this.#pausadaPorPestana = true; }
      else if (!document.hidden && this.#pausadaPorPestana) { this.#audio.play().catch(() => {}); this.#pausadaPorPestana = false; }
    });
  }

  /** Los navegadores solo permiten sonido tras un toque: el primer toque o tecla la inicia. */
  armarInicioAutomatico() {
    const ac = new AbortController();
    for (const ev of ['pointerdown', 'keydown'])
      addEventListener(ev, () => { ac.abort(); this.iniciar(); }, { signal: ac.signal, capture: true });
  }

  async iniciar() {
    if (this.#iniciada) return;
    this.#iniciada = true;
    try {
      this.#audio.volume = 0;
      await this.#audio.play();
      this.#boton.hidden = false;
      this.#fadeA(this.#volumen, 2500);
    } catch {
      this.#iniciada = false; // sin archivo de música o bloqueado
    }
  }

  alternar() {
    const sonando = !this.#audio.paused;
    sonando ? this.#audio.pause() : this.#audio.play().catch(() => {});
    this.#boton.toggleAttribute('data-mute', sonando); // data-mute = silenciada (tacha el ♪)
    this.#boton.setAttribute('aria-pressed', String(sonando));
  }

  /** Sube el volumen poco a poco. */
  #fadeA(objetivo, ms) {
    const t0 = performance.now();
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      this.#audio.volume = objetivo * k;
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }
}
