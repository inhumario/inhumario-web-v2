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

  const SERVICES = [
    { href: 'https://app.inhumario.com/', t: 'App para e-commerce', d: 'Tu tienda en el bolsillo de tus clientes' },
    { href: 'https://voz.inhumario.com/', t: 'Agentes de voz IA', d: 'Atiende tu teléfono 24/7 con voz natural' },
    { href: 'https://easyfactu.inhumario.com/', t: 'EasyFactu', d: 'Adiós a Excel: facturación con IA' },
    { href: 'https://amazon.inhumario.com/', t: 'Gestión de Amazon', d: 'Listings y operativa Amazon automatizadas' },
    { href: 'https://seo.inhumario.com/', t: 'Posicionamiento SEO', d: 'Dashboards y estrategia para subir en Google' },
    { href: link('/#soluciones'),         t: 'Webs a medida', d: 'Plataformas web para tu sector' },
    { href: link('/#soluciones'),         t: 'Automatizaciones', d: 'Procesos que se ejecutan solos 24/7' },
    { href: link('/#soluciones'),         t: 'Agentes de IA', d: 'Bots que trabajan por ti' },
    { href: link('/#soluciones'),         t: 'Integraciones', d: 'Tus herramientas, conectadas' },
  ];
  const serviceItems = SERVICES.map((s) => `
    <a href="${s.href}" role="menuitem">
      <strong>${s.t}</strong>
      <span>${s.d}</span>
    </a>`).join('');

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
            <div class="inh-dropdown-menu" role="menu">${serviceItems}</div>
          </div>
          <a href="${link('/#caso')}">Caso de éxito</a>
          <a href="${link('/#mario')}">Sobre mí</a>
        </div>
        <a class="inh-nav-cta" href="${onMainSite ? '#contacto' : link('/#contacto')}">Hablemos</a>
        <button class="inh-burger" aria-label="Abrir menú" aria-expanded="false" type="button">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="inh-mobile-overlay" aria-hidden="true">
        <div class="inh-mobile-inner">
          <div class="inh-mobile-label">Servicios</div>
          <div class="inh-mobile-services">${serviceItems}</div>
          <div class="inh-mobile-divider"></div>
          <a class="inh-mobile-link" href="${link('/#caso')}">Caso de éxito</a>
          <a class="inh-mobile-link" href="${link('/#mario')}">Sobre mí</a>
          <a class="inh-mobile-cta" href="${onMainSite ? '#contacto' : link('/#contacto')}">Hablemos</a>
        </div>
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
      position: relative;
    }
    html { overflow-x: hidden; }
    body { overflow-x: hidden; max-width: 100vw; }
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
      width: 700px; max-width: calc(100vw - 40px);
      background: #FFFFFF;
      border: 1px solid #E5E5E5; padding: 14px;
      opacity: 0; visibility: hidden; pointer-events: none;
      transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
      box-shadow: 0 12px 40px rgba(0,0,0,0.08); z-index: 101;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
    }
    @media (max-width: 760px) {
      .inh-dropdown-menu {
        width: calc(100vw - 32px);
        grid-template-columns: 1fr;
      }
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

    /* === Burger + Overlay móvil === */
    .inh-burger {
      display: none;
      background: none; border: 0; padding: 8px;
      cursor: pointer;
      position: absolute; right: 0; top: 50%;
      transform: translateY(-50%);
      z-index: 102;
    }
    .inh-burger span {
      display: block; width: 26px; height: 2px;
      background: #111111; margin: 6px 0;
      transition: transform 0.25s, opacity 0.2s;
    }
    .inh-nav.inh-open .inh-burger span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .inh-nav.inh-open .inh-burger span:nth-child(2) { opacity: 0; }
    .inh-nav.inh-open .inh-burger span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
    .inh-mobile-overlay {
      display: none;
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: #FFFFFF;
      z-index: 99;
      padding: 88px 24px 32px;
      overflow-y: auto;
      opacity: 0;
      transition: opacity 0.25s;
    }
    .inh-nav.inh-open .inh-mobile-overlay {
      opacity: 1; pointer-events: auto;
    }
    .inh-mobile-inner { max-width: 540px; margin: 0 auto; }
    .inh-mobile-label {
      font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
      color: #666666; font-weight: 700; margin-bottom: 14px;
    }
    .inh-mobile-services a {
      display: block; padding: 14px 0;
      color: #111111; text-decoration: none;
      border-bottom: 1px solid #E5E5E5;
    }
    .inh-mobile-services a strong { display: block; font-size: 16px; margin-bottom: 2px; }
    .inh-mobile-services a span { display: block; font-size: 13px; color: #666666; }
    .inh-mobile-divider { height: 24px; }
    .inh-mobile-link {
      display: block; padding: 14px 0;
      font-size: 18px; font-weight: 700; color: #111111; text-decoration: none;
      border-bottom: 1px solid #E5E5E5;
    }
    .inh-mobile-cta {
      display: block; margin-top: 28px; padding: 18px 24px;
      text-align: center; background: #111111; color: #FFFFFF !important;
      font-weight: 700; text-decoration: none; font-size: 16px;
    }
    body.inh-locked { overflow: hidden; }

    @media (max-width: 900px) {
      .inh-nav-links { display: none; }
      .inh-nav-cta { display: none; }
      .inh-burger { display: block; }
      .inh-mobile-overlay { display: block; pointer-events: none; }
      .inh-logo img { height: 40px; }
      .inh-nav-inner { padding: 12px 0; }
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

    // Burger móvil
    const nav = document.querySelector('.inh-nav');
    const burger = document.querySelector('.inh-burger');
    if (nav && burger) {
      const close = () => {
        nav.classList.remove('inh-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('inh-locked');
      };
      const open = () => {
        nav.classList.add('inh-open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('inh-locked');
      };
      burger.addEventListener('click', () => {
        nav.classList.contains('inh-open') ? close() : open();
      });
      // Cerrar al hacer click en cualquier enlace del overlay
      nav.querySelectorAll('.inh-mobile-overlay a').forEach((a) => {
        a.addEventListener('click', close);
      });
      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('inh-open')) close();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertNav);
  } else {
    insertNav();
  }
})();
