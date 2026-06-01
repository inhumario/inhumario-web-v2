/* === Inhumario — Nav embebible ===
 * Uso: en cualquier sub-web añade:
 *   <div id="inhumario-nav"></div>
 *   <script src="https://www.inhumario.com/nav.js"></script>
 * Editar el nav UNA vez aquí actualiza todas las sub-webs automáticamente.
 */
(function() {
  'use strict';

  // Detectar si estamos en www.inhumario.com o en una sub-web
  const onMainSite = /(^|\.)inhumario\.com$/.test(location.hostname) && !/^app\./.test(location.hostname);
  const HOME = 'https://www.inhumario.com';
  const link = (path) => onMainSite ? path : HOME + path;

  const NAV_HTML = `
    <nav class="inh-nav">
      <div class="inh-wrap inh-nav-inner">
        <a class="inh-logo" href="${HOME}/" aria-label="Inhumario — Inicio">
          <img src="${HOME}/assets/logo.png" alt="Inhumario" width="220" height="50">
        </a>
        <div class="inh-nav-links">
          <div class="inh-dropdown">
            <button class="inh-dropdown-toggle" aria-haspopup="true" aria-expanded="false" type="button">
              Servicios
              <svg class="inh-chev" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 1 5 5 9 1"/></svg>
            </button>
            <div class="inh-dropdown-menu" role="menu">
              <a href="https://app.inhumario.com/" role="menuitem">
                <strong>App para e-commerce</strong>
                <span>Tu tienda en el bolsillo de tus clientes</span>
              </a>
              <a href="${link('/#soluciones')}" role="menuitem">
                <strong>Automatizaciones</strong>
                <span>Procesos que se ejecutan solos 24/7</span>
              </a>
              <a href="${link('/#soluciones')}" role="menuitem">
                <strong>Agentes de IA</strong>
                <span>Bots que trabajan por ti</span>
              </a>
              <a href="${link('/#soluciones')}" role="menuitem">
                <strong>Integraciones</strong>
                <span>Tus herramientas, conectadas</span>
              </a>
            </div>
          </div>
          <a href="${link('/#caso')}">Caso de éxito</a>
          <a href="${link('/#mario')}">Sobre mí</a>
        </div>
        <a class="inh-nav-cta" href="${onMainSite ? '#contacto' : link('/#contacto')}">Hablemos</a>
      </div>
    </nav>
  `;

  const NAV_CSS = `
    .inh-nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid #E5E5E5;
      font-family: Calibri, 'Helvetica Neue', Arial, sans-serif;
    }
    .inh-wrap { width: min(1180px, 92%); margin: 0 auto; }
    .inh-nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      gap: 28px; padding: 16px 0;
    }
    .inh-logo { display: inline-flex; }
    .inh-logo img { height: 56px; width: auto; display: block; }
    .inh-nav-links {
      display: flex; gap: 26px; align-items: center;
      margin-left: auto; margin-right: 24px;
    }
    .inh-nav-links > a {
      font-size: 14px; color: #111111; text-decoration: none;
      transition: opacity 0.2s;
    }
    .inh-nav-links > a:hover { opacity: 0.6; }

    .inh-dropdown { position: relative; }
    .inh-dropdown-toggle {
      background: none; border: 0; padding: 0;
      font: inherit; font-size: 14px; color: #111111; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      transition: opacity 0.2s;
    }
    .inh-dropdown-toggle:hover { opacity: 0.6; }
    .inh-chev { transition: transform 0.2s; }
    .inh-dropdown:hover .inh-chev,
    .inh-dropdown.open .inh-chev { transform: rotate(180deg); }
    .inh-dropdown::after {
      content: ""; position: absolute; top: 100%; left: 0; right: 0; height: 18px;
    }
    .inh-dropdown-menu {
      position: absolute; top: calc(100% + 14px); left: 50%;
      transform: translateX(-50%) translateY(8px);
      min-width: 320px; background: #FFFFFF;
      border: 1px solid #E5E5E5; padding: 10px;
      opacity: 0; visibility: hidden; pointer-events: none;
      transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
      box-shadow: 0 12px 40px rgba(0,0,0,0.08); z-index: 101;
    }
    .inh-dropdown:hover .inh-dropdown-menu,
    .inh-dropdown.open .inh-dropdown-menu {
      opacity: 1; visibility: visible; pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
    .inh-dropdown-menu a {
      display: block; padding: 12px 14px;
      color: #111111; text-decoration: none;
      transition: background 0.15s;
    }
    .inh-dropdown-menu a:hover { background: #F7F7F7; }
    .inh-dropdown-menu a strong {
      display: block; font-size: 14px; font-weight: 700; margin-bottom: 2px;
    }
    .inh-dropdown-menu a span {
      display: block; font-size: 12px; color: #666666;
    }

    .inh-nav-cta {
      display: inline-block; background: #111111; color: #FFFFFF !important;
      padding: 10px 22px; font-weight: 700; font-size: 14px;
      text-decoration: none; transition: background 0.2s;
    }
    .inh-nav-cta:hover { background: #000000; }

    @media (max-width: 900px) {
      .inh-nav-links { display: none; }
      .inh-logo img { height: 40px; }
    }
  `;

  // Inyectar CSS una sola vez
  if (!document.getElementById('inh-nav-style')) {
    const style = document.createElement('style');
    style.id = 'inh-nav-style';
    style.textContent = NAV_CSS;
    document.head.appendChild(style);
  }

  // Inyectar HTML donde haya placeholder, o al principio del body
  function insertNav() {
    const placeholder = document.getElementById('inhumario-nav');
    if (placeholder) {
      placeholder.outerHTML = NAV_HTML;
    } else {
      document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
    }
    // Bind dropdown
    const dd = document.querySelector('.inh-dropdown');
    if (!dd) return;
    const toggle = dd.querySelector('.inh-dropdown-toggle');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dd.classList.toggle('open');
      toggle.setAttribute('aria-expanded', dd.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    dd.querySelectorAll('.inh-dropdown-menu a').forEach((a) => {
      a.addEventListener('click', () => {
        dd.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertNav);
  } else {
    insertNav();
  }
})();
