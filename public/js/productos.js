'use strict';

/* ==========================================================
   Galería de imágenes por línea de producto (productos.html)

   Hoy cada línea usa 3 ilustraciones provisionales (1.svg, 2.svg, 3.svg).
   Para reemplazarlas por fotos reales (guía completa: public/img/productos/LEEME.md):
   1. Guarda la foto en  public/img/productos/<línea>/  (ej. public/img/productos/insumos/1.jpg)
   2. Cambia abajo el "archivo" de esa imagen (ej. '1.svg' → '1.jpg') y, si quieres, su "texto".
   3. Borra la ilustración .svg que ya no uses.
   Puedes agregar o quitar imágenes de cada lista; si un archivo no existe se muestra una tarjeta provisional.
   Recomendado: JPG o WebP de 1200×800 px (proporción 3:2), menos de 250 KB cada una.
   ========================================================== */
const GALERIAS = {
  comerciales: {
    titulo: 'Medicamentos comerciales',
    imagenes: [
      { archivo: '1.svg', texto: 'Medicamentos de venta libre (OTC)' },
      { archivo: '2.svg', texto: 'Medicamentos con fórmula médica' },
      { archivo: '3.svg', texto: 'Portafolio de laboratorios aliados' },
    ],
  },
  institucionales: {
    titulo: 'Medicamentos institucionales',
    imagenes: [
      { archivo: '1.svg', texto: 'Presentaciones de uso hospitalario' },
      { archivo: '2.svg', texto: 'Abastecimiento planificado para instituciones' },
      { archivo: '3.svg', texto: 'Manejo responsable y trazable' },
    ],
  },
  nutricionales: {
    titulo: 'Productos nutricionales',
    imagenes: [
      { archivo: '1.svg', texto: 'Vitaminas y minerales' },
      { archivo: '2.svg', texto: 'Suplementos y nutrición deportiva' },
      { archivo: '3.svg', texto: 'Productos naturales y de bienestar' },
    ],
  },
  dermocosmeticos: {
    titulo: 'Belleza y dermocosmética',
    imagenes: [
      { archivo: '1.svg', texto: 'Limpieza e hidratación' },
      { archivo: '2.svg', texto: 'Protección solar' },
      { archivo: '3.svg', texto: 'Tratamientos dermocosméticos' },
    ],
  },
  'cuidado-personal': {
    titulo: 'Cuidado personal',
    imagenes: [
      { archivo: '1.svg', texto: 'Higiene personal' },
      { archivo: '2.svg', texto: 'Cuidado infantil' },
      { archivo: '3.svg', texto: 'Cuidado del adulto mayor' },
    ],
  },
  insumos: {
    titulo: 'Insumos médicos',
    imagenes: [
      { archivo: '1.svg', texto: 'Material de curación: gasas, vendajes y apósitos' },
      { archivo: '2.svg', texto: 'Bioseguridad: guantes, tapabocas y desinfección' },
      { archivo: '3.svg', texto: 'Suministros clínicos: jeringas, agujas y toma de muestras' },
    ],
  },
};

(function () {
  const dialog = document.getElementById('product-gallery');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const title = dialog.querySelector('#gallery-title');
  const track = dialog.querySelector('.gallery__track');
  const dots = dialog.querySelector('.gallery__dots');
  const count = dialog.querySelector('.gallery__count');
  const prev = dialog.querySelector('.gallery__nav--prev');
  const next = dialog.querySelector('.gallery__nav--next');
  let index = 0;
  let total = 0;
  let opener = null;

  // Tarjeta provisional cuando la foto aún no existe
  const placeholder = (texto) => {  // el texto ya se ve en el pie de foto
    const box = document.createElement('div');
    box.className = 'gallery__placeholder';
    const logo = document.createElement('img');
    logo.src = '/img/logo-icono.png';
    logo.alt = '';
    logo.width = 96;
    logo.height = 83;
    const note = document.createElement('span');
    note.textContent = 'Imagen próximamente';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', `${texto} (imagen próximamente)`);
    box.append(logo, note);
    return box;
  };

  const go = (i) => {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    track.querySelectorAll('.gallery__slide').forEach((slide, n) => slide.setAttribute('aria-hidden', String(n !== index)));
    dots.querySelectorAll('button').forEach((dot, n) => dot.setAttribute('aria-current', String(n === index)));
    count.textContent = `${index + 1} de ${total}`;
  };

  const open = (id, button) => {
    const galeria = GALERIAS[id];
    if (!galeria) return;
    opener = button;
    title.textContent = galeria.titulo;
    track.replaceChildren();
    dots.replaceChildren();
    total = galeria.imagenes.length;

    galeria.imagenes.forEach((item, n) => {
      const slide = document.createElement('li');
      slide.className = 'gallery__slide';
      slide.setAttribute('aria-roledescription', 'diapositiva');
      slide.setAttribute('aria-label', `${n + 1} de ${total}`);
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = `/img/productos/${id}/${item.archivo}`;
      img.alt = item.texto;
      img.loading = n === 0 ? 'eager' : 'lazy';
      img.addEventListener('error', () => img.replaceWith(placeholder(item.texto)), { once: true });
      const caption = document.createElement('figcaption');
      caption.textContent = item.texto;
      figure.append(img, caption);
      slide.append(figure);
      track.append(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ver imagen ${n + 1}: ${item.texto}`);
      dot.addEventListener('click', () => go(n));
      dots.append(dot);
    });

    const single = total < 2;
    prev.hidden = single;
    next.hidden = single;
    dots.hidden = single;
    go(0);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('[data-gallery]').forEach((button) => {
    button.addEventListener('click', () => open(button.dataset.gallery, button));
  });

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  dialog.querySelector('.gallery__close').addEventListener('click', () => dialog.close());

  // Cerrar al hacer clic fuera del recuadro
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (opener) opener.focus();
  });

  // Flechas del teclado
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') go(index - 1);
    if (event.key === 'ArrowRight') go(index + 1);
  });

  // Deslizar con el dedo en celulares
  let startX = null;
  track.addEventListener('touchstart', (event) => { startX = event.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
    startX = null;
  });
})();
