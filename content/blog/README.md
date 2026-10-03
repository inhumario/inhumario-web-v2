# Blog de inhumario.com — cómo publicar un artículo

Cada artículo es un fichero markdown en esta carpeta: `content/blog/YYYY-MM-DD-slug.md`.
El servidor (`server.js`) los lee, renderiza y publica automáticamente en:

- Índice: `https://www.inhumario.com/blog`
- Artículo: `https://www.inhumario.com/blog/<slug>`
- Se añaden solos al `sitemap.xml` (dinámico, ya no existe el estático).

## Formato del fichero

```markdown
---
title: Título del artículo (obligatorio)
description: Resumen de 1-2 frases para la tarjeta del índice, meta description y OG (recomendado)
date: 2026-07-31            # obligatorio (o en el nombre del fichero); si es futura, NO se publica hasta ese día
slug: mi-articulo            # opcional; por defecto, el nombre del fichero sin la fecha
cover: /assets/foo.png       # opcional; imagen OG para compartir (ruta dentro de public/); sin ella sale /assets/og-blog.png
meta_description: ...        # opcional; texto para Google (≤158 caracteres). Si falta, se recorta `description` sola
updated: 2026-08-15          # opcional; fecha de la última revisión de fondo (va al sitemap y al JSON-LD)
---

Cuerpo en markdown normal: ##, ###, listas, negritas, enlaces, tablas, citas…
```

Notas:

- Estructura editorial de la pieza semanal: **problema → automatización → números** (ver RUNBOOK del motor).
- Se puede incrustar HTML crudo. Para destacar cifras, usar el bloque de stats de la web:
  ```html
  <div class="stats-grid">
    <div class="stat"><div class="big">46 %</div><div class="lbl">texto de la cifra</div></div>
  </div>
  ```
- Un post con `date` futura queda "programado": no aparece hasta que llegue esa fecha (hora de Madrid). Ojo: el contenedor debe estar ya desplegado con el fichero dentro.
- El tiempo de lectura se calcula solo. El CTA final (contacto) y el bloque de newsletter se añaden solos — no incluirlos en el markdown.

## Publicar

```bash
cd ~/Claude/Code/inhumario-web-v2
git add content/blog/ && git commit -m "Blog: <título>" && git push
source ~/.config/aromas/easypanel.env
curl -sS -X POST "$EASYPANEL_API_BASE/services.app.deployService" \
  -H "Authorization: Bearer $EASYPANEL_TOKEN" -H "Content-Type: application/json" \
  -d '{"json":{"projectName":"travelia","serviceName":"inhumario-web-v2"}}'
```

Verificar tras ~15 s: `curl -sI https://www.inhumario.com/blog/<slug>` debe devolver 200 (si redirige a /blog, el post no cargó: revisar frontmatter o fecha futura).

## SEO (desde 2026-10-03)

- **Una sola URL por artículo**: `https://www.inhumario.com/blog/<slug>` (con www, sin fecha, sin barra final). `inhumario.com` redirige a `www` con 301; `/blog/YYYY-MM-DD-slug` redirige al slug público; un slug que no existe devuelve **404** (ya no redirige a `/blog`).
- **Enlaza desde el cuerpo**: cada artículo lleva al menos un enlace a otro artículo y, si habla de algo que se vende, uno a su página (`/resenas`, `https://app.inhumario.com`, `https://facturas.inhumario.com`…). Al pie sale solo el bloque «Sigue leyendo».
- **Pieza mensual con intención de búsqueda**: además de la pieza editorial de los viernes, una al mes responde a algo que la gente busca en Google (título = la búsqueda, guía práctica con ejemplos). Portada 1200×630 con `tools/og_images.py`. Temas y volúmenes en `~/Claude/Code/Inhumario/motor/seo.md`.
