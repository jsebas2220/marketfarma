'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const CONTACT_EMAIL = 'mf.medicamentoseinsumos@gmail.com';
const RESEND_API_URL = 'https://api.resend.com/emails';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;

app.disable('x-powered-by');
// Render (y otros hosts) ponen un proxy delante: así req.ip es la IP real del visitante
app.set('trust proxy', 1);

// Cabeceras de seguridad básicas
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; frame-ancestors 'self'"
  );
  next();
});

app.use(express.json({ limit: '10kb' }));

// Archivos estáticos (con caché para recursos y sin extensión .html en las URLs)
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  })
);

// ---- Formulario de contacto ----
const RATE_LIMIT_MS = 30000;
const lastByIp = new Map(); // límite simple: 1 envío cada 30 s por IP
// Limpia las IP antiguas para que el mapa no crezca sin límite
setInterval(() => {
  const limit = Date.now() - RATE_LIMIT_MS;
  for (const [ip, time] of lastByIp) if (time < limit) lastByIp.delete(ip);
}, 10 * 60 * 1000).unref();
const clean = (v, max) => String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

app.post('/api/contacto', async (req, res) => {
  const ip = req.ip || 'x';
  const now = Date.now();
  if (now - (lastByIp.get(ip) || 0) < RATE_LIMIT_MS) {
    return res.status(429).json({ ok: false, error: 'Espera unos segundos antes de enviar otro mensaje.' });
  }

  const { nombre, email, telefono, asunto, mensaje, website } = req.body || {};
  if (website) return res.json({ ok: true }); // campo trampa anti-spam: los bots lo llenan

  const data = {
    nombre: clean(nombre, 100),
    email: clean(email, 150),
    telefono: clean(telefono, 30),
    asunto: clean(asunto, 80),
    mensaje: clean(mensaje, 2000),
  };

  const validationErrors = [];
  if (data.nombre.length < 2) validationErrors.push('El nombre debe tener al menos 2 caracteres.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) validationErrors.push('Ingresa un correo válido.');
  if (data.mensaje.length < 10) validationErrors.push('El mensaje debe tener al menos 10 caracteres.');
  if (validationErrors.length) {
    return res.status(400).json({ ok: false, error: validationErrors.join(' ') });
  }

  if (!RESEND_API_KEY || !RESEND_FROM) {
    console.error('No se pudo enviar el mensaje: faltan RESEND_API_KEY o RESEND_FROM.');
    return res.status(503).json({ ok: false, error: 'No pudimos enviar tu mensaje. Intenta más tarde.' });
  }

  try {
    const emailResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [CONTACT_EMAIL],
        reply_to: data.email,
        subject: `[MarketFarma] ${data.asunto || 'Nuevo mensaje de contacto'}`,
        text: [
          `Nombre: ${data.nombre}`,
          `Correo: ${data.email}`,
          `Teléfono: ${data.telefono || 'No indicado'}`,
          `Asunto: ${data.asunto || 'No indicado'}`,
          '',
          'Mensaje:',
          data.mensaje,
        ].join('\n'),
      }),
    });
    if (!emailResponse.ok) {
      const providerError = await emailResponse.text();
      console.error(`Resend rechazó el mensaje (${emailResponse.status}): ${providerError}`);
      return res.status(502).json({ ok: false, error: 'No pudimos enviar tu mensaje. Intenta más tarde.' });
    }
    lastByIp.set(ip, now); // solo cuenta para el límite si el envío salió bien
    return res.json({ ok: true });
  } catch (err) {
    console.error('No se pudo enviar el mensaje:', err.message);
    return res.status(502).json({ ok: false, error: 'No pudimos enviar tu mensaje. Intenta más tarde.' });
  }
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`MarketFarma en http://localhost:${PORT}`));
