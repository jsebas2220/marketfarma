# MarketFarma – Sitio web informativo

HTML + CSS + JS (frontend) y Node.js con Express (servidor).

## Ejecutar en tu computador
    npm install
    npm start        # http://localhost:3000

## Publicar en GitHub y desplegar en Render
1. Sube el proyecto a un repositorio de GitHub y, en Render, crea un **Web Service** conectado a ese repositorio.
2. Usa `npm ci` como **Build Command** y `npm start` como **Start Command**.
3. En **Environment** de Render, configura `RESEND_API_KEY` con la clave secreta de Resend y `RESEND_FROM` con un remitente de un dominio verificado en Resend (por ejemplo, `MarketFarma <contacto@tudominio.com>`). No guardes estas credenciales en GitHub.
4. Los mensajes se envían por la API HTTPS de Resend a `mf.medicamentoseinsumos@gmail.com`.

Para producción, agrega y verifica en Resend el dominio que usarás como remitente y configura sus registros DNS. El formulario no confirmará el envío si faltan las variables o si Resend rechaza el mensaje.

## Pendiente por completar (busca el texto resaltado en amarillo)
- Teléfono, dirección y horario (contacto.html y pie de página)
- Historia de la empresa (nosotros.html)
- Registros sanitarios y certificaciones reales (calidad.html)
- Productos reales de cada línea (productos.html e insumos-medicos.html)
- URL de la tienda virtual (constante STORE_URL en public/js/main.js y enlaces "Tienda" de las páginas)

## Estructura
    server.js            servidor Express + endpoint /api/contacto
    public/              páginas, css, js e imágenes
    public/css/styles.css  colores de marca (variables --blue y --sky)
