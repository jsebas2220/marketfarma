# MarketFarma – Sitio web informativo

HTML + CSS + JS (frontend) y Node.js con Express (servidor).

## Ejecutar en tu computador
Requiere Node.js 22 o superior (https://nodejs.org, versión LTS).

    npm install      # solo la primera vez
    npm run dev      # http://localhost:3000

`npm run dev` reinicia el servidor al guardar `server.js`, desactiva la caché (basta con recargar
la página para ver cambios de HTML, CSS y JS) y lee las variables de un archivo `.env` si existe.
Para probar el envío real del formulario, crea `.env` en la raíz con:

    RESEND_API_KEY=re_xxxxxxxx
    RESEND_FROM=MarketFarma <contacto@tudominio.com>

`npm start` es el comando de producción (el que usa Render).

## Publicar en GitHub y desplegar en Render
1. Sube el proyecto a un repositorio de GitHub y, en Render, crea un **Web Service** conectado a ese repositorio.
2. Usa `npm ci` como **Build Command** y `npm start` como **Start Command**.
3. En **Environment** de Render, configura `RESEND_API_KEY` con la clave secreta de Resend y `RESEND_FROM` con un remitente de un dominio verificado en Resend (por ejemplo, `MarketFarma <contacto@tudominio.com>`). No guardes estas credenciales en GitHub.
4. Los mensajes se envían por la API HTTPS de Resend a `mf.medicamentoseinsumos@gmail.com`.

Para producción, agrega y verifica en Resend el dominio que usarás como remitente y configura sus registros DNS. El formulario no confirmará el envío si faltan las variables o si Resend rechaza el mensaje.

## Pendiente por completar (busca el texto resaltado en amarillo)
- Historia de la empresa (nosotros.html)
- Registros sanitarios y certificaciones reales (calidad.html)
- Productos reales de cada línea (productos.html) y sus fotos: hoy son ilustraciones provisionales, ver public/img/productos/LEEME.md
- Logos reales de marcas y aliados: hoy son ficticios, ver public/img/marcas/LEEME.md y public/img/aliados/LEEME.md
- URL de la tienda virtual (constante STORE_URL en public/js/main.js y enlaces "Tienda" de las páginas)

## Estructura
    server.js            servidor Express + endpoint /api/contacto
    public/              páginas, css, js e imágenes
    public/css/styles.css  colores de marca (variables --blue y --sky)
