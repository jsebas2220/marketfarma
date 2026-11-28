'use strict';

// Menú móvil
(function () {
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('menu');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Aparición suave al hacer scroll
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
})();

// Año del pie de página
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// Preferencias de cookies
const cookieConsentName = 'marketfarma_cookie_consent';
const cookieConsentEvent = 'marketfarma-cookie-consent';
const excludedWelcomePaths = ['/404', '/404.html'];
// URL de la tienda virtual. Mientras siga el valor de ejemplo, el aviso de la tienda no se muestra.
const STORE_URL = 'https://TU-TIENDA-VIRTUAL.com';
const storeConfigured = !STORE_URL.includes('TU-TIENDA-VIRTUAL');
const storeWelcomeKey = 'marketfarma_store_welcome_seen';

const getCookieConsent = () => {
  const consentCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${cookieConsentName}=`));
  return consentCookie ? consentCookie.split('=')[1] : '';
};

const saveCookieConsent = (choice) => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${cookieConsentName}=${choice}; Max-Age=15552000; Path=/; SameSite=Lax${secure}`;
};

const showStoreWelcome = () => {
  if (!storeConfigured || excludedWelcomePaths.includes(window.location.pathname)) return;
  // Solo una vez por visita (sesión del navegador), no en cada página
  try {
    if (sessionStorage.getItem(storeWelcomeKey)) return;
    sessionStorage.setItem(storeWelcomeKey, '1');
  } catch {
    // Sin sessionStorage (modo privado estricto): se muestra igual
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div class="store-welcome">
      <button class="store-welcome__backdrop" type="button" aria-label="Cerrar aviso"></button>
      <section class="store-welcome__dialog" role="dialog" aria-modal="true" aria-labelledby="store-welcome-title" aria-describedby="store-welcome-description">
        <button class="store-welcome__close" type="button" aria-label="Cerrar ventana">×</button>
        <img class="store-welcome__logo" src="/img/logo-completo.png" alt="MarketFarma" width="1815" height="312">
        <p class="store-welcome__eyebrow">Salud más cerca de ti</p>
        <h2 id="store-welcome-title">Todos nuestros productos en un solo lugar</h2>
        <p id="store-welcome-description">Encuentra todos los productos que buscas en nuestra tienda virtual.</p>
        <a class="store-welcome__shop" href="${STORE_URL}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18l-2-6H5z"/><path d="M4 10v10h16V10M9 20v-6h6v6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></svg>
          <span>Visitar tienda virtual</span>
        </a>
        <button class="store-welcome__continue" type="button">Seguir navegando</button>
      </section>
    </div>`);

  const storeWelcome = document.querySelector('.store-welcome');
  const previousOverflow = document.body.style.overflow;
  const closeStoreWelcome = () => {
    storeWelcome.remove();
    document.body.style.overflow = previousOverflow;
    document.removeEventListener('keydown', handleStoreWelcomeKeydown);
  };
  const handleStoreWelcomeKeydown = (event) => {
    if (event.key === 'Escape') closeStoreWelcome();
  };

  document.body.style.overflow = 'hidden';
  storeWelcome.querySelectorAll('.store-welcome__backdrop, .store-welcome__close, .store-welcome__continue')
    .forEach((button) => button.addEventListener('click', closeStoreWelcome));
  document.addEventListener('keydown', handleStoreWelcomeKeydown);
  storeWelcome.querySelector('.store-welcome__close').focus();
};

const showCookieConsent = () => {
  if (getCookieConsent()) {
    document.dispatchEvent(new Event(cookieConsentEvent));
    return;
  }

  document.body.insertAdjacentHTML('beforeend', `
    <section class="cookie-consent" role="region" aria-label="Preferencias de cookies">
      <div class="cookie-consent__copy">
        <strong>Tu privacidad importa</strong>
        <p>Usamos una cookie para recordar tu respuesta a este aviso. No utilizamos cookies publicitarias.</p>
      </div>
      <div class="cookie-consent__actions">
        <button class="cookie-consent__reject" type="button" data-cookie-choice="rejected">Rechazar</button>
        <button class="cookie-consent__accept" type="button" data-cookie-choice="accepted">Aceptar</button>
      </div>
    </section>`);

  const consentBanner = document.querySelector('.cookie-consent');
  consentBanner.querySelectorAll('[data-cookie-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      saveCookieConsent(button.dataset.cookieChoice);
      consentBanner.remove();
      document.dispatchEvent(new Event(cookieConsentEvent));
    });
  });
};

if (getCookieConsent()) {
  showStoreWelcome();
} else {
  document.addEventListener(cookieConsentEvent, showStoreWelcome, { once: true });
  showCookieConsent();
}

// Redes sociales flotantes
document.body.insertAdjacentHTML('beforeend', `
  <aside class="social-float" aria-label="Redes sociales">
    <div class="social-float__links">
    <span class="social-float__item social-float__item--facebook" role="img" aria-label="Facebook" title="Facebook">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.2v3.1H10V21z"/></svg>
    </span>
    <span class="social-float__item social-float__item--instagram" role="img" aria-label="Instagram" title="Instagram">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-float__dot" cx="17.6" cy="6.8" r=".8"/></svg>
    </span>
    <span class="social-float__item social-float__item--linkedin" role="img" aria-label="LinkedIn" title="LinkedIn">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5.5v.1M10 19v-6c0-2.2 4.5-2.5 4.5.2V19M10 10v9M3.5 9h3M3.5 19h3M9 9h3v1.4M14.5 19v-5.8c0-2.1 4.5-2.4 4.5.3V19"/></svg>
    </span>
    <span class="social-float__item social-float__item--youtube" role="img" aria-label="YouTube" title="YouTube">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 7.2a2.5 2.5 0 0 0-1.8-1.8C17.6 5 12 5 12 5s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 7.2 26 26 0 0 0 2.6 12 26 26 0 0 0 3 16.8a2.5 2.5 0 0 0 1.8 1.8C6.4 19 12 19 12 19s5.6 0 7.2-.4a2.5 2.5 0 0 0 1.8-1.8 26 26 0 0 0 .4-4.8 26 26 0 0 0-.4-4.8Z"/><path class="social-float__play" d="M10 8.8v6.4l5.5-3.2z"/></svg>
    </span>
    <span class="social-float__item social-float__item--x" role="img" aria-label="X" title="X">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 3H21l-6.9 7.9L22.2 21h-6.3l-5-6.5L5.2 21H3l7.4-8.5L2.5 3h6.4l4.5 6zm-1.1 16h1.2L7 4.9H5.7z"/></svg>
    </span>
    </div>
  </aside>
  <div class="business-chat">
      <button class="business-chat__launcher" type="button" aria-label="Abrir chat empresarial" aria-expanded="false" aria-controls="business-chat-panel" title="Chat empresarial">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-5.5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg>
      </button>
      <div class="business-chat__notice" role="status" aria-live="polite" hidden>
        <div class="business-chat__notice-heading">
          <span class="business-chat__avatar" aria-hidden="true">M</span>
          <div><strong>Marketica</strong><span>Asesora en línea</span></div>
          <button class="business-chat__dismiss" type="button" aria-label="Cerrar mensaje">×</button>
        </div>
        <button class="business-chat__greeting" type="button">Bienvenido a Marketfarma, que puedo ayudarte</button>
      </div>
      <section class="business-chat__panel" id="business-chat-panel" aria-label="Chat empresarial" hidden>
        <div class="business-chat__choices">
          <header class="business-chat__header">
            <div><strong>Atención MarketFarma</strong><span>Elige cómo quieres comunicarte</span></div>
            <button class="business-chat__close" type="button" aria-label="Cerrar chat">×</button>
          </header>
          <button class="business-chat__option" type="button" data-chat-online>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-5.5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg>
            <span>Chat en línea</span>
          </button>
          <button class="business-chat__option" type="button" data-chat-whatsapp>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.3 8.3 0 0 1-12.3 7.2L3 20l1.2-5a8.3 8.3 0 1 1 16.3-3.3Z"/><path d="M8.5 8.2c.3-.6.6-.6 1-.6h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .6.5.9 1.3 1.6 2.2 2.1.2.1.4.1.6-.1l.8-.9c.2-.2.4-.3.7-.2l1.7.8c.3.1.4.3.4.5 0 .6-.3 1.3-.8 1.7-.5.4-1.2.6-1.9.4-1.1-.2-2.5-.9-3.8-2.1-1.1-1-2-2.3-2.3-3.3-.3-1 0-1.9.4-2.5Z"/></svg>
            <span>WhatsApp</span>
          </button>
          <p class="business-chat__status" role="status" hidden></p>
        </div>
        <div class="business-chat__conversation" hidden>
          <header class="business-chat__header">
            <button class="business-chat__back" type="button" aria-label="Volver a opciones">‹</button>
            <div><strong>Marketica</strong><span>Asesora en línea</span></div>
            <button class="business-chat__close" type="button" aria-label="Cerrar chat">×</button>
          </header>
          <div class="business-chat__messages" role="log" aria-live="polite">
            <p class="business-chat__message business-chat__message--bot">Bienvenido a Marketfarma, que puedo ayudarte</p>
          </div>
          <form class="business-chat__form">
            <label class="sr-only" for="business-chat-input">Escribe tu mensaje</label>
            <input id="business-chat-input" type="text" placeholder="Escribe tu mensaje..." autocomplete="off" required>
            <button type="submit" aria-label="Enviar mensaje"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 9-18 9 3-9zM6 12h15"/></svg></button>
          </form>
        </div>
      </section>
  </div>`);

const businessChat = document.querySelector('.business-chat');
if (businessChat) {
  const chatLauncher = businessChat.querySelector('.business-chat__launcher');
  const chatPanel = businessChat.querySelector('.business-chat__panel');
  const chatChoices = businessChat.querySelector('.business-chat__choices');
  const chatConversation = businessChat.querySelector('.business-chat__conversation');
  const chatMessages = businessChat.querySelector('.business-chat__messages');
  const chatInput = businessChat.querySelector('#business-chat-input');
  const whatsappStatus = businessChat.querySelector('.business-chat__status');
  const greetingNotice = businessChat.querySelector('.business-chat__notice');
  const businessWhatsAppNumber = '';
  let chatWasOpened = false;

  const closeBusinessChat = () => {
    chatPanel.hidden = true;
    chatLauncher.setAttribute('aria-expanded', 'false');
  };

  chatLauncher.addEventListener('click', () => {
    chatPanel.hidden = !chatPanel.hidden;
    chatLauncher.setAttribute('aria-expanded', String(!chatPanel.hidden));
    if (!chatPanel.hidden) {
      chatWasOpened = true;
      greetingNotice.hidden = true;
      chatLauncher.classList.remove('business-chat__launcher--new');
      businessChat.querySelector('[data-chat-online]').focus();
    }
  });
  businessChat.querySelector('.business-chat__dismiss').addEventListener('click', () => {
    greetingNotice.hidden = true;
    chatLauncher.classList.remove('business-chat__launcher--new');
  });
  businessChat.querySelector('.business-chat__greeting').addEventListener('click', () => {
    chatWasOpened = true;
    greetingNotice.hidden = true;
    chatLauncher.classList.remove('business-chat__launcher--new');
    chatPanel.hidden = false;
    chatLauncher.setAttribute('aria-expanded', 'true');
    chatChoices.hidden = true;
    chatConversation.hidden = false;
    chatInput.focus();
  });
  businessChat.querySelectorAll('.business-chat__close').forEach((button) => button.addEventListener('click', closeBusinessChat));
  businessChat.querySelector('[data-chat-online]').addEventListener('click', () => {
    chatChoices.hidden = true;
    chatConversation.hidden = false;
    chatInput.focus();
  });
  businessChat.querySelector('.business-chat__back').addEventListener('click', () => {
    chatConversation.hidden = true;
    chatChoices.hidden = false;
    businessChat.querySelector('[data-chat-online]').focus();
  });
  businessChat.querySelector('[data-chat-whatsapp]').addEventListener('click', () => {
    chatWasOpened = true;
    const whatsappNumber = businessWhatsAppNumber.replace(/\D/g, '');
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer');
      return;
    }
    whatsappStatus.textContent = 'WhatsApp aún no está configurado. Puedes contactarnos desde la página de Contacto.';
    whatsappStatus.hidden = false;
  });
  businessChat.querySelector('.business-chat__form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    const userMessage = document.createElement('p');
    userMessage.className = 'business-chat__message business-chat__message--user';
    userMessage.textContent = message;
    chatMessages.append(userMessage);

    const normalizedMessage = message.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let reply = 'Puedo orientarte sobre productos, insumos médicos y contacto. ¿Qué necesitas consultar?';
    let replyLink = '';
    if (/aliad|alianza|laboratorio|proveedor|cotiza|institucion|clinica|hospital|ips/.test(normalizedMessage)) {
      reply = 'Para alianzas con laboratorios y proveedores, o cotizaciones institucionales, revisa esta página:';
      replyLink = '/aliados';
    } else if (/insumo|guante|gasa|jeringa|material/.test(normalizedMessage)) {
      reply = 'Puedes consultar nuestras categorías de insumos médicos aquí:';
      replyLink = '/productos#insumos';
    } else if (/producto|medicamento|vitamina|suplemento|nutric|dermo|piel|cuidado|catalogo/.test(normalizedMessage)) {
      reply = 'Revisa nuestras líneas de productos y encuentra la categoría que buscas:';
      replyLink = '/productos';
    } else if (/contacto|asesor|pedido|disponibilidad|horario|telefono/.test(normalizedMessage)) {
      reply = 'Para consultas de disponibilidad o atención personalizada, visita nuestra página de contacto:';
      replyLink = '/contacto';
    }

    const botMessage = document.createElement('p');
    botMessage.className = 'business-chat__message business-chat__message--bot';
    botMessage.textContent = reply;
    if (replyLink) {
      const link = document.createElement('a');
      link.href = replyLink;
      link.textContent = replyLink === '/contacto' ? 'Ir a Contacto' : 'Ver información';
      botMessage.append(' ', link);
    }
    chatMessages.append(botMessage);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.focus();
  });

  businessChat.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeBusinessChat();
  });

  // Muestra el saludo una sola vez, a los 5 s; si el usuario lo cierra no vuelve a aparecer
  // Si el aviso de cookies está visible, espera a que se responda para no encimarse con él
  const scheduleGreeting = () => window.setTimeout(() => {
    if (!chatWasOpened && chatPanel.hidden && !document.querySelector('.cookie-consent, .store-welcome')) {
      greetingNotice.hidden = false;
      chatLauncher.classList.add('business-chat__launcher--new');
    }
  }, 5000);
  if (document.querySelector('.cookie-consent')) {
    document.addEventListener(cookieConsentEvent, scheduleGreeting, { once: true });
  } else {
    scheduleGreeting();
  }
}

// Búsqueda del sitio
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  siteHeader.insertAdjacentHTML('beforeend', `
    <section class="site-search" aria-label="Búsqueda del sitio">
      <div class="wrap site-search__bar">
        <button class="site-search__toggle" type="button" aria-expanded="false" aria-controls="site-search-form" title="Abrir búsqueda">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>
          <span>Buscar</span>
        </button>
      </div>
      <form class="site-search__form wrap" id="site-search-form" role="search" hidden>
        <label for="site-search-input">Buscar en el sitio</label>
        <div class="site-search__controls">
          <input id="site-search-input" type="search" name="q" placeholder="Escribe qué necesitas encontrar" autocomplete="off">
          <button class="site-search__submit" type="submit" aria-label="Buscar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>
          </button>
          <button class="site-search__close" type="button" aria-label="Cerrar búsqueda" title="Cerrar búsqueda">×</button>
        </div>
        <div class="site-search__results" aria-live="polite" hidden></div>
      </form>
    </section>`);

  const searchToggle = siteHeader.querySelector('.site-search__toggle');
  const searchForm = siteHeader.querySelector('.site-search__form');
  const searchInput = siteHeader.querySelector('#site-search-input');
  const searchResults = siteHeader.querySelector('.site-search__results');
  const searchClose = siteHeader.querySelector('.site-search__close');
  const searchPages = ['/', '/nosotros', '/productos', '/calidad', '/contacto', '/aliados'];

  const closeSearch = () => {
    searchForm.hidden = true;
    searchResults.hidden = true;
    searchToggle.setAttribute('aria-expanded', 'false');
  };

  searchToggle.addEventListener('click', () => {
    searchForm.hidden = !searchForm.hidden;
    searchToggle.setAttribute('aria-expanded', String(!searchForm.hidden));
    if (!searchForm.hidden) searchInput.focus();
  });
  searchClose.addEventListener('click', closeSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSearch();
  });

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    searchResults.hidden = false;
    searchResults.replaceChildren();

    if (query.length < 2) {
      searchResults.textContent = 'Escribe al menos dos caracteres para buscar.';
      return;
    }

    searchResults.textContent = 'Buscando...';
    try {
      const pages = await Promise.all(searchPages.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) return null;
        const html = await response.text();
        const page = new DOMParser().parseFromString(html, 'text/html');
        const description = page.querySelector('meta[name="description"]')?.content || '';
        const content = [page.title, description, page.querySelector('main')?.textContent || '']
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        const normalize = (value) => value
          .toLocaleLowerCase('es')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const matchIndex = normalize(content).indexOf(normalize(query));
        if (matchIndex < 0) return null;
        let start = Math.max(0, matchIndex - 55);
        start = start === 0 ? 0 : content.indexOf(' ', start) + 1;
        let end = Math.min(content.length, matchIndex + query.length + 85);
        const endBoundary = content.indexOf(' ', end);
        if (endBoundary !== -1) end = endBoundary;
        return {
          url,
          title: page.querySelector('h1')?.textContent.trim() || page.title,
          excerpt: `${start ? '...' : ''}${content.slice(start, end).trim()}${end < content.length ? '...' : ''}`
        };
      }));

      searchResults.replaceChildren();
      const matches = pages.filter(Boolean);
      if (!matches.length) {
        searchResults.textContent = 'No se encontraron resultados.';
        return;
      }

      const list = document.createElement('ul');
      list.className = 'site-search__results-list';
      matches.forEach((match) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        const title = document.createElement('strong');
        const excerpt = document.createElement('span');
        link.href = match.url;
        title.textContent = match.title;
        excerpt.textContent = match.excerpt;
        link.append(title, excerpt);
        item.append(link);
        list.append(item);
      });
      searchResults.append(list);
    } catch {
      searchResults.textContent = 'No se pudo completar la búsqueda. Intenta de nuevo.';
    }
  });
}

// Formulario de contacto
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const msg = document.getElementById('form-msg');
  const submit = form.querySelector('button[type="submit"]');

  // Preselecciona el asunto si viene en la URL (ej. /contacto?asunto=Cotización institucional)
  const asuntoParam = new URLSearchParams(window.location.search).get('asunto');
  const asuntoSelect = form.querySelector('#asunto');
  if (asuntoParam && asuntoSelect) {
    const option = [...asuntoSelect.options].find((o) => o.value === asuntoParam);
    if (option) asuntoSelect.value = option.value;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';
    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = 'Enviando…';

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        msg.className = 'form-msg ok';
        msg.textContent = '¡Gracias! Recibimos tu mensaje y te responderemos pronto.';
        form.reset();
      } else {
        msg.className = 'form-msg err';
        msg.textContent = out.error || 'No pudimos enviar tu mensaje. Intenta de nuevo.';
      }
    } catch (err) {
      msg.className = 'form-msg err';
      msg.textContent = 'Sin conexión con el servidor. Intenta de nuevo.';
    } finally {
      submit.disabled = false;
      submit.textContent = original;
    }
  });
})();
