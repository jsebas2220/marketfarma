'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'mensajes.jsonl');

app.disable('x-powered-by');

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
const lastByIp = new Map(); // límite simple: 1 envío cada 30 s por IP
const clean = (v, max) => String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

app.post('/api/contacto', (req, res) => {
  const ip = req.ip || 'x';
  const now = Date.now();
  if (now - (lastByIp.get(ip) || 0) < 30000) {
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

  if (data.nombre.length < 2 || data.mensaje.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({ ok: false, error: 'Revisa nombre, correo y mensaje.' });
  }

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(MESSAGES_FILE, JSON.stringify({ fecha: new Date().toISOString(), ...data }) + '\n');
    lastByIp.set(ip, now);
    return res.json({ ok: true });
  } catch (err) {
    console.error('No se pudo guardar el mensaje:', err.message);
    return res.status(500).json({ ok: false, error: 'No pudimos enviar tu mensaje. Intenta más tarde.' });
  }
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, () => console.log(`MarketFarma en http://localhost:${PORT}`));
