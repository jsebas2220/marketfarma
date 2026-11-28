# Logos de aliados (franja animada en Aliados)

Los logos de esta carpeta aparecen en la franja **"Nuestros aliados"** que se desplaza sola
debajo de los dos recuadros de la página `/aliados`. Hoy son **logos ficticios de ejemplo**
(`*-ejemplo.svg`): clínica, droguería, laboratorio, IPS, distribuidora, hospital, importadora
y fundación.

## Cómo poner los logos reales

1. Copia cada logo a esta carpeta (`public/img/aliados/`).
   - Mejor en **SVG**; si no, **PNG con fondo transparente** de unos 400 × 150 px.
   - Usa nombres sin espacios ni tildes, por ejemplo `clinica-san-jose.png`.
2. Abre `public/js/logos.js` y reemplaza la lista `aliados` (dentro de `LOGOS`) con tus logos:
   `{ archivo: 'clinica-san-jose.png', nombre: 'Clínica San José' },`
3. Borra los archivos `*-ejemplo.svg`.
4. Revisa con `npm run dev` en http://localhost:3000/aliados y haz commit.

## Ajustes

- **Velocidad:** en `logos.js`, `SEGUNDOS_POR_LOGO` (más alto = más lento; hoy 4).
- **Título de la franja:** en `public/aliados.html`, busca "Nuestros aliados" y "Confían en nosotros".
- La franja se detiene al pasar el mouse. Quien tiene activada la opción de "reducir
  movimiento" en su equipo ve los logos quietos.

## Importante

Publica solo aliados con los que tengas una relación real y que hayan **autorizado** el uso de
su logo (idealmente por escrito). Mostrar logos de clínicas, hospitales o laboratorios sin
permiso puede generar reclamos por uso de marca y afecta la confianza.
