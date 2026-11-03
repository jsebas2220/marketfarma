/* ==========================================================
   MarketFarma - Encabezado y pie de página compartidos
   Se inyectan en todas las páginas para editar en un solo lugar.
   ========================================================== */

(function () {
  // ----- Datos de la empresa: editar aquí y se actualiza en todo el sitio -----
  const EMPRESA = {
    nombre: 'MarketFarma',
    lema: 'Medicamentos e insumos',
    telefono: '[Completar teléfono]',
    whatsapp: '', // Ejemplo: '573001234567' (con indicativo, sin + ni espacios)
    correo: '[Completar correo]',
    direccion: '[Completar dirección], Colombia',
    horario: 'Lunes a viernes: [Completar horario]'
  };
  window.EMPRESA = EMPRESA;

  const paginas = [
    { href: '/', texto: 'Inicio', id: 'inicio' },
    { href: '/nosotros.html', texto: 'Nosotros', id: 'nosotros' },
    { href: '/productos.html', texto: 'Productos', id: 'productos' },
    { href: '/insumos-medicos.html', texto: 'Insumos médicos', id: 'insumos' },
    { href: '/calidad.html', texto: 'Calidad', id: 'calidad' }
  ];

  const actual = document.body.dataset.pagina || '';

  const enlaces = paginas
    .map(
      (p) =>
        `<li><a href="${p.href}"${p.id === actual ? ' aria-current="page"' : ''}>${p.texto}</a></li>`
    )
    .join('');

  const encabezado = `
    <a class="saltar" href="#contenido">Saltar al contenido</a>
    <header class="encabezado">
      <div class="contenedor">
        <a class="marca" href="/" aria-label="${EMPRESA.nombre} - Inicio">
          <img src="/img/logo.png" alt="${EMPRESA.nombre} - ${EMPRESA.lema}" width="223" height="38">
        </a>
        <button class="boton-menu" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16"/>
          </svg>
        </button>
        <nav aria-label="Principal">
          <ul class="menu" id="menu">
            ${enlaces}
            <li><a class="boton boton-primario" href="/contacto.html">Contáctanos</a></li>
            <li><a href="https://TU-TIENDA-VIRTUAL.com" target="_blank" rel="noopener noreferrer">Tienda</a></li>
          </ul>
        </nav>
      </div>
    </header>`;

  const anio = new Date().getFullYear();

  const pie = `
    <footer class="pie">
      <div class="contenedor">
        <div class="pie-rejilla">
          <div>
            <a class="pie-logo" href="/" aria-label="${EMPRESA.nombre}">
              <img src="/img/logo.png" alt="${EMPRESA.nombre}" width="188" height="32">
            </a>
            <p>Creamos, desarrollamos y distribuimos medicamentos, vitaminas e insumos médicos para cuidar la salud y el bienestar de las personas.</p>
          </div>
          <div>
            <h4>Sitio</h4>
            <ul>
              ${paginas.map((p) => `<li><a href="${p.href}">${p.texto}</a></li>`).join('')}
              <li><a href="/contacto.html">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4>Líneas de producto</h4>
            <ul>
              <li><a href="/productos.html#recetados">Medicamentos recetados</a></li>
              <li><a href="/productos.html#naturales">Productos naturales</a></li>
              <li><a href="/productos.html#vitaminas">Vitaminas y suplementos</a></li>
              <li><a href="/productos.html#deportivos">Línea deportiva</a></li>
              <li><a href="/productos.html#faciales">Cuidado facial</a></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>${EMPRESA.telefono}</li>
              <li>${EMPRESA.correo}</li>
              <li>${EMPRESA.direccion}</li>
              <li>${EMPRESA.horario}</li>
            </ul>
          </div>
        </div>
        <div class="pie-legal">
          <span>© ${anio} ${EMPRESA.nombre}. Todos los derechos reservados.</span>
          <span>La información de este sitio es informativa y no reemplaza la consulta con un profesional de la salud.</span>
        </div>
      </div>
    </footer>`;

  document.body.insertAdjacentHTML('afterbegin', encabezado);
  document.body.insertAdjacentHTML('beforeend', pie);

  // Menú móvil
  const boton = document.querySelector('.boton-menu');
  const menu = document.getElementById('menu');
  if (boton && menu) {
    boton.addEventListener('click', () => {
      const abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
    });
    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        menu.classList.remove('abierto');
        boton.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
