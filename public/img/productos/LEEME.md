# Imágenes del carrusel de productos

Estas imágenes aparecen al pulsar **"Ver imágenes"** en cada línea de la página
**Productos** (`/productos`). Hoy son **ilustraciones provisionales** (archivos `.svg`
con la marca "Imagen ilustrativa"). Reemplázalas por fotos reales de tus productos.

## Carpetas

| Carpeta              | Línea de producto            | Imágenes actuales              |
|----------------------|------------------------------|--------------------------------|
| `comerciales/`       | Medicamentos comerciales     | 1 OTC · 2 fórmula médica · 3 laboratorios aliados |
| `institucionales/`   | Medicamentos institucionales | 1 uso hospitalario · 2 abastecimiento · 3 trazabilidad |
| `nutricionales/`     | Productos nutricionales      | 1 vitaminas · 2 nutrición deportiva · 3 naturales |
| `dermocosmeticos/`   | Belleza y dermocosmética     | 1 limpieza e hidratación · 2 protección solar · 3 tratamientos |
| `cuidado-personal/`  | Cuidado personal             | 1 higiene · 2 cuidado infantil · 3 adulto mayor |
| `insumos/`           | Insumos médicos              | 1 curación · 2 bioseguridad · 3 suministros clínicos |

## Cómo reemplazar una imagen

1. Copia tu foto a la carpeta de la línea, por ejemplo `insumos/1.jpg`.
2. Abre `public/js/productos.js` y, en la lista `GALERIAS`, cambia el archivo de esa imagen:
   `{ archivo: '1.svg', texto: '...' }` → `{ archivo: '1.jpg', texto: '...' }`.
   Si la foto muestra otra cosa, cambia también el `texto` (es el pie de foto y la descripción
   para lectores de pantalla).
3. Borra el `.svg` que ya no se usa.
4. Revisa con `npm run dev` en http://localhost:3000/productos y luego haz commit.

Puedes poner más o menos de 3 imágenes por línea: agrega o quita elementos de la lista.
Si un archivo de la lista no existe, el carrusel muestra una tarjeta con el logo y
"Imagen próximamente", así que no se rompe.

## Recomendaciones para las fotos

- Formato JPG o WebP, **1200 × 800 px** (horizontal, proporción 3:2). Otras proporciones
  se ven completas pero con bordes blancos.
- Menos de **250 KB** por foto (puedes comprimirlas gratis en https://squoosh.app).
- Usa fotos propias o con licencia de uso comercial. No uses imágenes de laboratorios o
  marcas sin autorización.
- Medicamentos con fórmula médica: muestra la línea o el empaque de forma institucional,
  sin mensajes promocionales dirigidos al público.
