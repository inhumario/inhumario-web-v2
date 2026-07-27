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
cover: /assets/foo.png       # opcional; imagen OG para compartir (ruta dentro de public/)
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
