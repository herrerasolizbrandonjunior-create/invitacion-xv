// =====================================================
// PUNTO DE ENTRADA · une todos los módulos
// =====================================================
import './style.css';
import { EVENT } from './config.js';
import { $, $$ } from './lib/dom.js';
import { marcarImagenesFaltantes } from './modules/image-slots.js';
import { MusicPlayer } from './modules/music.js';
import { Countdown } from './modules/countdown.js';
import { PageNavigator } from './modules/pages.js';
import { iniciarFormularios } from './modules/forms.js';
import { PolvoDorado } from './modules/polvo-dorado.js';

marcarImagenesFaltantes();

// Decoración: lluvia de polvo dorado sobre todas las páginas
new PolvoDorado($('#polvoDorado')).iniciar();

// Páginas: se ve una a la vez, con botones Anterior / Siguiente
const paginas = new PageNavigator({
  paginas: $$('.pagina'),
  barra: $('#barra'),
  anterior: $('#btnAnterior'),
  siguiente: $('#btnSiguiente'),
  puntos: $('#puntos'),
});

// Música: el botón play de la portada inicia la música y pasa a la siguiente página
const musica = new MusicPlayer({ audio: $('#musica'), boton: $('#btnSonido') });
musica.armarInicioAutomatico();
$('#btnAbrir').addEventListener('click', () => {
  musica.iniciar();
  paginas.siguiente();
});

// Cuenta regresiva
new Countdown($('#reloj'), EVENT.fecha).iniciar();

// Botón de ubicación
$('#btnUbicacion').href = EVENT.ubicacionUrl;

// Libro de firmas y confirmación
iniciarFormularios();
