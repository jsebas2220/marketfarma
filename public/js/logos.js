'use strict';

/* ==========================================================
   Franjas de logos que se desplazan solas
   - "marcas":  página Productos (debajo de las líneas de producto)
   - "aliados": página Aliados (debajo de los dos recuadros)

   HOY SON LOGOS FICTICIOS DE EJEMPLO. Para poner los reales:
   1. Guarda cada logo en la carpeta indicada abajo (SVG, o PNG con fondo transparente).
   2. Reemplaza la lista correspondiente: archivo + nombre (el nombre es el texto alternativo).
   3. Borra los archivos *-ejemplo.svg de esa carpeta.
   Guías detalladas: public/img/marcas/LEEME.md y public/img/aliados/LEEME.md
   Puedes poner tantos logos como quieras; la velocidad se ajusta sola a la cantidad.
   ========================================================== */
const LOGOS = {
  // Carpeta: public/img/marcas/
  marcas: {
    carpeta: 'marcas',
    lista: [
      { archivo: 'lab-ejemplo.svg', nombre: 'Laboratorio Ejemplo' },
      { archivo: 'vita-ejemplo.svg', nombre: 'Vita Ejemplo' },
      { archivo: 'dermo-ejemplo.svg', nombre: 'Dermo Ejemplo' },
      { archivo: 'nutri-ejemplo.svg', nombre: 'Nutri Ejemplo' },
      { archivo: 'pharma-ejemplo.svg', nombre: 'Pharma Ejemplo' },
      { archivo: 'bio-ejemplo.svg', nombre: 'Bio Ejemplo' },
      { archivo: 'med-ejemplo.svg', nombre: 'Med Ejemplo' },
      { archivo: 'cuidado-ejemplo.svg', nombre: 'Cuidado Ejemplo' },
      { archivo: 'sport-ejemplo.svg', nombre: 'Sport Ejemplo' },
      { archivo: 'natural-ejemplo.svg', nombre: 'Natural Ejemplo' },
    ],
  },

  // Carpeta: public/img/aliados/
  aliados: {
    carpeta: 'aliados',
    lista: [
      { archivo: 'clinica-ejemplo.svg', nombre: 'Clínica Ejemplo' },
      { archivo: 'drogueria-ejemplo.svg', nombre: 'Droguería Ejemplo' },
      { archivo: 'laboratorio-aliado-ejemplo.svg', nombre: 'LabAliado Ejemplo' },
      { archivo: 'ips-ejemplo.svg', nombre: 'IPS Ejemplo' },
      { archivo: 'distribuidora-ejemplo.svg', nombre: 'Distribuidora Ejemplo' },
      { archivo: 'hospital-ejemplo.svg', nombre: 'Hospital Ejemplo' },
      { archivo: 'importadora-ejemplo.svg', nombre: 'Importadora Ejemplo' },
      { archivo: 'fundacion-ejemplo.svg', nombre: 'Fundación Ejemplo' },
    ],
  },
};

const SEGUNDOS_POR_LOGO = 4; // velocidad: más alto = más lento

(function () {
  document.querySelectorAll('.brands__track[data-logos]').forEach((track) => {
    const grupo = LOGOS[track.dataset.logos];
    if (!grupo || !grupo.lista.length) return;

    const item = (logo, copia) => {
      const li = document.createElement('li');
      li.className = 'brands__item';
      if (copia) li.setAttribute('aria-hidden', 'true'); // la copia solo sirve para que el giro no tenga cortes
      const img = document.createElement('img');
      img.src = `/img/${grupo.carpeta}/${logo.archivo}`;
      img.alt = copia ? '' : logo.nombre;
      img.loading = 'lazy';
      img.width = 160;
      img.height = 60;
      li.append(img);
      return li;
    };

    // Dos copias seguidas de la lista: al llegar a la mitad, la animación vuelve al inicio sin que se note
    grupo.lista.forEach((logo) => track.append(item(logo, false)));
    grupo.lista.forEach((logo) => track.append(item(logo, true)));
    track.style.setProperty('--brands-duration', `${grupo.lista.length * SEGUNDOS_POR_LOGO}s`);
  });
})();
