# MarketFarma – Sitio web informativo

HTML + CSS + JS (frontend) y Node.js con Express (servidor).

## Ejecutar en tu computador
    npm install
    npm start        # http://localhost:3000

## Subir a Hostinger (Node.js Web App)
1. Sube esta carpeta (sin `node_modules`) o conéctala por GitHub.
2. Archivo de entrada: `server.js` · Comando: `npm start` (Hostinger instala las dependencias).
3. Los mensajes del formulario se guardan en `data/mensajes.jsonl`.

## Pendiente por completar (busca el texto resaltado en amarillo)
- Correo, teléfono, dirección y horario (contacto.html y pie de página)
- Historia de la empresa (nosotros.html)
- Misión y visión oficiales (nosotros.html)
- Registros sanitarios y certificaciones reales (calidad.html)
- Productos reales de cada línea (productos.html)

## Estructura
    server.js            servidor Express + endpoint /api/contacto
    public/              páginas, css, js e imágenes
    public/css/styles.css  colores de marca (variables --blue y --sky)
