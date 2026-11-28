# Logos de marcas (franja animada en Productos)

Los logos de esta carpeta aparecen en la franja que se desplaza sola debajo de las líneas
de producto en `/productos`. Hoy son **logos ficticios de ejemplo** (`*-ejemplo.svg`).

## Cómo poner los logos reales

1. Copia cada logo a esta carpeta (`public/img/marcas/`).
   - Mejor en **SVG**; si no, **PNG con fondo transparente** de unos 400 × 150 px.
   - Usa nombres sin espacios ni tildes, por ejemplo `laboratorio-abc.png`.
2. Abre `public/js/logos.js` y reemplaza la lista `marcas` (dentro de `LOGOS`) con tus logos:
   `{ archivo: 'laboratorio-abc.png', nombre: 'Laboratorio ABC' },`
3. Borra los archivos `*-ejemplo.svg`.
4. Revisa con `npm run dev` en http://localhost:3000/productos y haz commit.

## Ajustes

- **Velocidad:** en `logos.js`, `SEGUNDOS_POR_LOGO` (más alto = más lento; hoy 4). Aplica a
  las dos franjas (marcas y aliados).
- **Colores:** los logos se muestran a color. Si prefieres una franja más sobria en gris, en
  `public/css/styles.css` agrega `filter: grayscale(1);` a `.brands__item img`.
- La franja se detiene al pasar el mouse. Quien tiene activada la opción de "reducir
  movimiento" en su equipo ve los logos quietos.

## Importante

Muestra solo marcas que realmente distribuyes y con autorización del titular para usar su
logo. Publicar logos de laboratorios sin relación comercial puede generar reclamos por uso
de marca.
