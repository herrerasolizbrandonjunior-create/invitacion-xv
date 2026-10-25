# Invitación XV · Najavi

Vite + Tailwind CSS v4 + JavaScript (módulos). Base de datos: Firebase Firestore.

## Usar en tu PC
1. Instala Node.js (versión LTS) desde nodejs.org
2. En la carpeta del proyecto abre una terminal (en VS Code: Terminal > Nuevo terminal) y ejecuta:
   npm install
   npm run dev
3. Abre el enlace que aparece (http://localhost:5173). El panel privado está en /admin.html

## Qué editar
- src/config.js        fecha, enlace de Google Maps y datos de Firebase
- index.html           textos y espacios de imagen ("AQUÍ VA IMAGEN")
- public/img/          tus imágenes
- public/audio/        musica.mp3
- src/style.css        paleta de colores (bloque @theme)

## Firebase (confirmaciones y libro de firmas)
1. console.firebase.google.com > crear proyecto > agregar app web > copiar los datos a src/config.js
2. Activar Firestore Database
3. Activar Authentication > correo/contraseña > crear tu usuario
4. Firestore > Reglas > pegar firestore.rules (cambiando TU_CORREO@gmail.com) > Publicar

## Subir a GitHub Pages
1. Crea un repositorio y sube TODO el proyecto (git add . / git commit / git push)
2. GitHub > Settings > Pages > Source: "GitHub Actions"
3. Cada "git push" a la rama main publica la invitación automáticamente
   (.github/workflows/deploy.yml)
