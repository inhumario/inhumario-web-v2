const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

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

// Newsletter: alta en la lista de Klaviyo "Inhumario — Newsletter"
const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || "S6HWmj";

app.post("/api/newsletter", async (req, res) => {
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
  if (!KLAVIYO_API_KEY) {
    console.error("[NEWSLETTER] KLAVIYO_API_KEY no configurada");
    return res.status(500).json({ ok: false, error: "Servicio no disponible." });
  }
  const origen = clean(req.body.origen, 60) || "web";
  try {
    const r = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "Content-Type": "application/json",
        "revision": "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: `inhumario.com (${origen})`,
            profiles: {
              data: [{
                type: "profile",
                attributes: {
                  email,
                  subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
                },
              }],
            },
          },
          relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
        },
      }),
    });
    if (r.status >= 300) {
      console.error("[NEWSLETTER] Klaviyo", r.status, (await r.text()).slice(0, 300));
      return res.status(500).json({ ok: false, error: "No se pudo completar el alta. Inténtalo más tarde." });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("[NEWSLETTER] error:", err.message);
    return res.status(500).json({ ok: false, error: "No se pudo completar el alta. Inténtalo más tarde." });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true, version: "1.0" }));

// Landing de respuesta a reseñas con IA
app.get(["/resenas", "/reseñas"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resenas.html"));
});

// Fallback SPA: cualquier ruta no encontrada → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`[inhumario-app-landing] escuchando en :${PORT}`);
});
