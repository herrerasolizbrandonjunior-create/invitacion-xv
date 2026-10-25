// =====================================================
// CONFIGURACIÓN DE VITE
// =====================================================
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const pagina = (archivo) => fileURLToPath(new URL(archivo, import.meta.url));

export default defineConfig({
  // './' = rutas relativas: funciona en GitHub Pages sin importar el nombre del repositorio
  base: './',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      // Dos páginas: la invitación y el panel privado
      input: { main: pagina('index.html'), admin: pagina('admin.html') },
    },
  },
});
