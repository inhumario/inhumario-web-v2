const express = require("express");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // node:crypto — el `crypto` global es Web Crypto y no trae randomBytes
const { marked } = require("marked");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Config (vía env vars de EasyPanel)
// ============================================================
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const TO_EMAIL = process.env.TO_EMAIL || "cuadrado.mario@aromasdete.com";
const FROM_LABEL = process.env.FROM_LABEL || "Inhumario · app.inhumario.com";

if (!SMTP_USER || !SMTP_PASS) {
  console.warn("[WARN] SMTP_USER / SMTP_PASS no configurados. El formulario no enviará emails.");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

// ============================================================
// Rate limit muy simple por IP (memoria, sin Redis)
// ============================================================
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const RATE_MAX = 5; // 5 envíos por IP/hora
const ipHits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return false;
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

// Limpieza periódica (cada hora)
setInterval(() => {
  const now = Date.now();
  for (const [ip, hits] of ipHits) {
    const fresh = hits.filter((t) => now - t < RATE_WINDOW_MS);
    if (fresh.length === 0) ipHits.delete(ip);
    else ipHits.set(ip, fresh);
  }
}, RATE_WINDOW_MS);

// ============================================================
// Middlewares
// ============================================================
app.set("trust proxy", true);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

// Static
app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, filePath) => {
    const file = path.basename(filePath);
    // nav.js: CORS abierto (lo cargan sub-webs como app.inhumario.com) + cache corto
    if (file === "nav.js") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
    } else if (file === "logo.png" || file === "logo-white.png" || file === "banner-linkedin.png" || file === "icon-square.png" || file === "icon-square-512.png" || file === "portada-fb.png") {
      // Logos también CORS abierto (los carga nav.js desde otros dominios)
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=604800");
    } else if (/\.(css|js|png|jpe?g|webp|svg|gif|ico|woff2?|ttf|eot)$/.test(filePath)) {
      // Todo lo de /assets con CORS abierto: son piezas públicas pensadas para
      // incrustarse fuera (imágenes de posts que suben IG/FB por URL, y la
      // publicación por navegador, que las lee con fetch desde linkedin.com).
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
      res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    } else if (/\.html$|\.xml$/.test(filePath)) {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
    }
  },
}));

// Security headers — X-Frame-Options no en nav.js para que pueda embeberse
app.use((req, res, next) => {
  if (!req.path.startsWith("/nav.js")) {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// ============================================================
// API
// ============================================================
function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 200;
}
function isPhone(v) {
  return typeof v === "string" && /^[+0-9\s().-]{6,30}$/.test(v);
}
function clean(v, max = 2000) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

app.post("/api/contact", async (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim();

  // Honeypot anti-bot
  if (req.body.website && req.body.website.length > 0) {
    return res.status(200).json({ ok: true }); // fingir éxito al bot
  }

  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, error: "Demasiados envíos. Inténtalo más tarde." });
  }

  const name = clean(req.body.name, 120);
  const email = clean(req.body.email, 200);
  const phone = clean(req.body.phone, 30);
  const message = clean(req.body.message, 4000);
  const tienda = clean(req.body.tienda, 300);

  const errors = [];
  if (!name) errors.push("Falta el nombre.");
  if (!isEmail(email)) errors.push("Email no válido.");
  if (!isPhone(phone)) errors.push("Teléfono no válido.");
  if (!message) errors.push("Falta el mensaje.");

  if (errors.length) {
    return res.status(400).json({ ok: false, error: errors.join(" ") });
  }

  // Construir email
  const subject = `Petición desde app.inhumario.com — ${name}`;
  const text = [
    `Nueva petición desde app.inhumario.com`,
    ``,
    `Nombre: ${name}`,
    `Email:  ${email}`,
    `Teléfono: ${phone}`,
    tienda ? `Tienda / web: ${tienda}` : null,
    ``,
    `Mensaje:`,
    message,
    ``,
    `---`,
    `IP: ${ip}`,
    `User-Agent: ${req.headers["user-agent"] || "—"}`,
    `Fecha: ${new Date().toISOString()}`,
  ].filter(Boolean).join("\n");

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; color:#111;">
      <h2 style="margin:0 0 16px;">Nueva petición desde <a href="https://app.inhumario.com">app.inhumario.com</a></h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:6px 0; color:#666; width:120px;">Nombre</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 0; color:#666;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 0; color:#666;">Teléfono</td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        ${tienda ? `<tr><td style="padding:6px 0; color:#666;">Tienda</td><td>${escapeHtml(tienda)}</td></tr>` : ""}
      </table>
      <h3 style="margin:24px 0 8px;">Mensaje</h3>
      <div style="white-space: pre-wrap; background:#F7F7F7; padding:14px; border-left:3px solid #111;">${escapeHtml(message)}</div>
      <hr style="border:0; border-top:1px solid #E5E5E5; margin:24px 0;">
      <p style="font-size:12px; color:#999;">IP: ${escapeHtml(ip)} · ${new Date().toLocaleString("es-ES")}</p>
    </div>
  `;

  if (!SMTP_USER || !SMTP_PASS) {
    console.log("[FORM] sin SMTP configurado, payload:", { name, email, phone, message, tienda });
    return res.status(500).json({ ok: false, error: "Servicio de email no configurado." });
  }

  try {
    await transporter.sendMail({
      from: `"${FROM_LABEL}" <${SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[FORM] error envío:", err.message);
    return res.status(500).json({ ok: false, error: "No se pudo enviar el email. Inténtalo más tarde." });
  }
});

// Newsletter: desde 2026-07-27 el alta va a Mautic (mismo flujo que la guía).
// Se mantiene la ruta por compatibilidad con páginas cacheadas.
app.post("/api/newsletter", (req, res) => altaGuia(req, res, "newsletter"));

// ── Arranque de prueba desde la landing ────────────────────────────────────
// El visitante escribe empresa + email aquí; la contraseña la elige ya en la
// app (que es quien tiene la BD y el cifrado — no se duplica esa lógica).
// Para no pasar el email por la URL, los datos se guardan en memoria bajo un
// token efímero que la app canjea una sola vez.
const prefills = new Map(); // token -> { empresa, email, expira }
const PREFILL_TTL_MS = 20 * 60 * 1000;

function limpiaPrefills() {
  const ahora = Date.now();
  for (const [t, v] of prefills) if (v.expira < ahora) prefills.delete(t);
}
setInterval(limpiaPrefills, 5 * 60 * 1000).unref();

app.post("/api/prefill", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim();
  if (req.body.website && req.body.website.length > 0) {
    return res.status(200).json({ ok: true, token: "" }); // honeypot
  }
  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, error: "Demasiados intentos. Espera un momento." });
  }
  const empresa = clean(req.body.empresa, 120);
  const email = clean(req.body.email, 200);
  if (!empresa) return res.status(400).json({ ok: false, error: "Escribe el nombre de tu tienda." });
  if (!isEmail(email)) return res.status(400).json({ ok: false, error: "Escribe un email válido." });

  limpiaPrefills();
  if (prefills.size > 5000) return res.status(503).json({ ok: false, error: "Servicio saturado. Inténtalo en un minuto." });

  const token = crypto.randomBytes(12).toString("base64url");
  prefills.set(token, { empresa, email, expira: Date.now() + PREFILL_TTL_MS });
  return res.json({ ok: true, token });
});

// La app llama a este endpoint (servidor a servidor) para recuperar los datos.
// Un solo uso: se borra al leerlo.
app.get("/api/prefill/:token", (req, res) => {
  const v = prefills.get(req.params.token);
  if (!v || v.expira < Date.now()) {
    prefills.delete(req.params.token);
    return res.status(404).json({ ok: false });
  }
  prefills.delete(req.params.token);
  return res.json({ ok: true, empresa: v.empresa, email: v.email });
});

// Lead magnet: alta en Mautic (m.inhumario.com) vía submit del formulario.
// El email con el enlace de la guía lo envía Mautic (campaña de bienvenida).
const MAUTIC_BASE = process.env.MAUTIC_BASE || "https://m.inhumario.com";
const MAUTIC_GUIA_FORM_ID = process.env.MAUTIC_GUIA_FORM_ID; // id del form "guia-automatizaciones"

async function altaGuia(req, res, origenPorDefecto) {
  const ip = (req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim();
  if (req.body.website && req.body.website.length > 0) {
    return res.status(200).json({ ok: true }); // honeypot
  }
  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, error: "Demasiados envíos. Inténtalo más tarde." });
  }
  const email = clean(req.body.email, 200);
  if (!isEmail(email)) {
    return res.status(400).json({ ok: false, error: "Email no válido." });
  }
  if (!MAUTIC_GUIA_FORM_ID) {
    console.error("[GUIA] MAUTIC_GUIA_FORM_ID no configurado");
    return res.status(500).json({ ok: false, error: "Servicio no disponible." });
  }
  const origen = clean(req.body.origen, 60) || origenPorDefecto;
  try {
    const body = new URLSearchParams();
    body.set("mauticform[email]", email);
    body.set("mauticform[origen]", origen);
    body.set("mauticform[formId]", MAUTIC_GUIA_FORM_ID);
    body.set("mauticform[return]", "");
    body.set("mauticform[formName]", "guia_autom");
    const r = await fetch(`${MAUTIC_BASE}/form/submit?formId=${MAUTIC_GUIA_FORM_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Forwarded-For": ip,
      },
      body: body.toString(),
      redirect: "manual", // Mautic responde 302 al terminar
    });
    if (r.status >= 400) {
      console.error("[GUIA] Mautic", r.status, (await r.text()).slice(0, 300));
      return res.status(500).json({ ok: false, error: "No se pudo completar el alta. Inténtalo más tarde." });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("[GUIA] error:", err.message);
    return res.status(500).json({ ok: false, error: "No se pudo completar el alta. Inténtalo más tarde." });
  }
}

app.post("/api/guia", (req, res) => altaGuia(req, res, "blog"));

app.get("/api/health", (req, res) => res.json({ ok: true, version: "1.0" }));

// ============================================================
// Blog — artículos markdown en content/blog/*.md
// Frontmatter: title, description, date (YYYY-MM-DD), slug y cover opcionales.
// Un post con fecha futura no se publica hasta que llegue el día.
// ============================================================
const BLOG_DIR = path.join(__dirname, "content", "blog");
const BLOG_TTL_MS = 60 * 1000;
let blogCache = { at: 0, posts: [] };

function hoyMadrid() {
  // YYYY-MM-DD en hora española (en-CA da formato ISO)
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: raw.slice(m[0].length) };
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
function fechaBonita(iso) {
  const [y, mo, d] = iso.split("-").map(Number);
  if (!y || !mo || !d) return iso;
  return `${d} de ${MESES[mo - 1]} de ${y}`;
}

function loadPosts() {
  const now = Date.now();
  if (now - blogCache.at < BLOG_TTL_MS) return blogCache.posts;
  const posts = [];
  let files = [];
  try {
    files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("README"));
  } catch { /* sin carpeta de blog aún */ }
  const hoy = hoyMadrid();
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { meta, body } = parseFrontmatter(raw);
      const base = file.replace(/\.md$/, "");
      const slug = (meta.slug || base.replace(/^\d{4}-\d{2}-\d{2}-/, "")).toLowerCase();
      const date = meta.date || (base.match(/^\d{4}-\d{2}-\d{2}/) || [""])[0];
      if (!meta.title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.warn(`[BLOG] ${file}: falta title o date (YYYY-MM-DD) — no se publica`);
        continue;
      }
      if (date > hoy) continue; // programado a futuro
      const minutos = Math.max(1, Math.round(body.split(/\s+/).length / 200));
      posts.push({
        slug,
        date,
        fecha: fechaBonita(date),
        minutos,
        title: meta.title,
        description: meta.description || "",
        cover: meta.cover || "",
        html: marked.parse(body),
      });
    } catch (err) {
      console.error(`[BLOG] error leyendo ${file}:`, err.message);
    }
  }
  posts.sort((a, b) => b.date.localeCompare(a.date));
  blogCache = { at: now, posts };
  return posts;
}

function pageShell({ title, description, canonical, ogImage, jsonld, content }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#111111">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:image" content="${escapeHtml(ogImage || "https://www.inhumario.com/assets/logo.png")}">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="icon" type="image/png" href="/assets/logo.png">
<link rel="stylesheet" href="/styles.css?v=6">
${jsonld ? `<script type="application/ld+json">${jsonld}</script>` : ""}
</head>
<body>

<div id="inhumario-nav"></div>
<script src="/nav.js?v=2"></script>

${content}

<section id="guia" style="background:#111; padding:60px 0;">
  <div class="wrap" style="max-width:680px; text-align:center;">
    <div class="eyebrow" style="color:#B5B5B5;">Guía gratuita</div>
    <h2 style="color:#fff; font-size:1.6rem; margin:0 0 10px;">📘 Las automatizaciones que usamos en nuestra propia tienda</h2>
    <p style="color:#B5B5B5; margin:0 0 22px;">Los casos de este blog, en una guía PDF con los números de cada uno — y a partir de ahí, un caso nuevo cada semana en tu email. Sin spam.</p>
    <form id="guia-form" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
      <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
      <input type="email" name="email" required placeholder="tu@email.com" style="flex:1 1 240px; max-width:320px; padding:12px 14px; border-radius:8px; border:1px solid #333; background:#1F1F1F; color:#fff; font-size:1rem;">
      <button type="submit" style="padding:12px 22px; border-radius:8px; border:0; background:#FF8080; color:#111; font-weight:700; font-size:1rem; cursor:pointer;">Quiero la guía</button>
      <div id="guia-status" role="status" aria-live="polite" style="flex-basis:100%; color:#B5B5B5; margin-top:8px; min-height:1.2em;"></div>
    </form>
  </div>
</section>

<footer>
  <div class="wrap">
    <img src="/assets/logo.png" alt="Inhumario">
    <div class="divider"></div>
    <p>© <span id="year"></span> Inhumario · Mario Cuadrado · Sonseca, Toledo</p>
    <p class="tagline">Automatizaciones que trabajan por tí</p>
    <p class="footer-links">
      <a href="/blog">Blog</a>
      <span>·</span>
      <a href="https://app.inhumario.com" target="_blank" rel="noopener">App móvil para tu tienda</a>
      <span>·</span>
      <a href="https://www.aromasdete.com" target="_blank" rel="noopener">Aromas de Té</a>
    </p>
  </div>
</footer>

<script>
  document.getElementById('year').textContent = new Date().getFullYear();

  const gForm = document.getElementById('guia-form');
  if (gForm) {
    gForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('guia-status');
      const data = Object.fromEntries(new FormData(gForm));
      data.origen = new URLSearchParams(location.search).get('de') || 'blog';
      status.textContent = 'Un momento…';
      try {
        const r = await fetch('/api/guia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const j = await r.json();
        if (j.ok) {
          status.textContent = '✅ ¡Hecho! Revisa tu email: la guía va de camino.';
          gForm.querySelector('[name=email]').value = '';
        } else {
          status.textContent = j.error || 'No se pudo completar el alta.';
        }
      } catch {
        status.textContent = 'Error de conexión. Inténtalo de nuevo.';
      }
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
</script>

</body>
</html>`;
}

app.get("/blog", (req, res) => {
  const posts = loadPosts();
  const cards = posts.map((p) => `
      <a class="blog-card reveal" href="/blog/${escapeHtml(p.slug)}">
        <div class="blog-card-meta">${escapeHtml(p.fecha)} · ${p.minutos} min de lectura</div>
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(p.description)}</p>
        <span class="solution-cta">Leer artículo <span class="arr">→</span></span>
      </a>`).join("\n");

  const content = `
<section class="blog-hero dark" style="background:#111;">
  <div class="wrap">
    <div class="eyebrow reveal">Blog</div>
    <h1 class="reveal" style="font-size:clamp(34px,5vw,56px); color:#fff;">Casos reales de automatización.</h1>
    <p class="lead reveal">Cada semana, un caso con nombre y números: el problema, la automatización que lo resuelve y el resultado. Sin humo.</p>
  </div>
</section>
<section style="padding:70px 0;">
  <div class="wrap">
    <div class="blog-list">
      ${posts.length ? cards : '<p style="color:var(--mute);">Todavía no hay artículos publicados. Vuelve pronto.</p>'}
    </div>
  </div>
</section>`;

  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.send(pageShell({
    title: "Blog · Inhumario — Casos reales de automatización",
    description: "Casos reales de automatización para e-commerce y pymes: el problema, la solución y los números. Un artículo nuevo cada semana.",
    canonical: "https://www.inhumario.com/blog",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Blog de Inhumario",
      "url": "https://www.inhumario.com/blog",
      "description": "Casos reales de automatización para e-commerce y pymes.",
    }),
    content,
  }));
});

app.get("/blog/:slug", (req, res, next) => {
  const posts = loadPosts();
  const post = posts.find((p) => p.slug === req.params.slug.toLowerCase());
  if (!post) return res.redirect(302, "/blog");
  const url = `https://www.inhumario.com/blog/${post.slug}`;

  const content = `
<section class="post-header dark" style="background:#111;">
  <div class="wrap">
    <div class="eyebrow reveal"><a href="/blog" style="color:inherit;">Blog</a> · ${escapeHtml(post.fecha)} · ${post.minutos} min</div>
    <h1 class="reveal" style="font-size:clamp(30px,4.6vw,50px); color:#fff; max-width:20ch;">${escapeHtml(post.title)}</h1>
    ${post.description ? `<p class="lead reveal">${escapeHtml(post.description)}</p>` : ""}
  </div>
</section>
<article class="post-body-section">
  <div class="wrap">
    <div class="post-body">
${post.html}
    </div>
    <div class="post-footer">
      <p>¿Tienes un problema parecido en tu negocio?</p>
      <a class="btn btn-dark" href="/#contacto">Cuéntamelo y te paso propuesta <span class="arr">→</span></a>
      <p class="post-back"><a href="/blog">← Volver al blog</a></p>
    </div>
  </div>
</article>`;

  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.send(pageShell({
    title: `${post.title} · Blog de Inhumario`,
    description: post.description || post.title,
    canonical: url,
    ogImage: post.cover ? `https://www.inhumario.com${post.cover}` : undefined,
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": post.date,
      "url": url,
      "image": post.cover ? `https://www.inhumario.com${post.cover}` : "https://www.inhumario.com/assets/logo.png",
      "author": { "@type": "Person", "name": "Mario Cuadrado" },
      "publisher": { "@type": "Organization", "name": "Inhumario", "url": "https://www.inhumario.com/" },
    }),
    content,
  }));
});

// Sitemap dinámico: páginas fijas + artículos del blog
app.get("/sitemap.xml", (req, res) => {
  const fijas = [
    { loc: "https://www.inhumario.com/", changefreq: "weekly", priority: "1.0" },
    { loc: "https://www.inhumario.com/resenas", changefreq: "monthly", priority: "0.9" },
    { loc: "https://www.inhumario.com/asistentes-virtuales", changefreq: "monthly", priority: "0.9" },
    { loc: "https://www.inhumario.com/blog", changefreq: "weekly", priority: "0.9" },
    { loc: "https://app.inhumario.com/", changefreq: "monthly", priority: "0.8" },
  ];
  const urls = fijas.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`);
  for (const p of loadPosts()) {
    urls.push(`  <url>
    <loc>https://www.inhumario.com/blog/${escapeHtml(p.slug)}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
  res.type("application/xml");
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
});

// Landing de respuesta a reseñas con IA
app.get(["/resenas", "/reseñas"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resenas.html"));
});

app.get(["/asistentes-virtuales", "/asistentes"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "asistentes-virtuales.html"));
});

// Fallback SPA: cualquier ruta no encontrada → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`[inhumario-app-landing] escuchando en :${PORT}`);
});
