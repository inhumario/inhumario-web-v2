#!/usr/bin/env python3
"""Imágenes para compartir (Open Graph, 1200×630) con la marca Inhumario.

Uso:  python3 tools/og_images.py            → regenera las de esta web
      og(destino, eyebrow, titular)          → reutilizable desde las landings de subdominio
Fondo tinta #111, logo en blanco, antetítulo coral y titular en blanco (Nimbus Sans, la
Helvetica libre del VPS). El titular se parte con \\n; el tamaño baja solo si no cabe.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
LOGO = RAIZ / "public/assets/logo-white.png"
BOLD = "/usr/share/fonts/opentype/urw-base35/NimbusSans-Bold.otf"
REG = "/usr/share/fonts/opentype/urw-base35/NimbusSans-Regular.otf"
W, H, M = 1200, 630, 80
TINTA, CORAL, GRIS = "#111111", "#FF8080", "#B5B5B5"


def og(destino, eyebrow, titular, pie="inhumario.com"):
    img = Image.new("RGB", (W, H), TINTA)
    d = ImageDraw.Draw(img)
    logo = Image.open(LOGO).convert("RGBA")
    lw = 250
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    img.paste(logo, (M, 64), logo)

    lineas = titular.split("\n")
    size = 84
    while size > 40:
        f = ImageFont.truetype(BOLD, size)
        if max(d.textlength(l, font=f) for l in lineas) <= W - 2 * M and len(lineas) * size * 1.12 <= 300:
            break
        size -= 2
    alto = len(lineas) * size * 1.12
    y = 205 + (300 - alto) / 2
    fe = ImageFont.truetype(BOLD, 22)
    # antetítulo con tracking ancho, como los .eyebrow de la web
    x = M
    for ch in eyebrow.upper():
        d.text((x, y - 46), ch, font=fe, fill=CORAL)
        x += d.textlength(ch, font=fe) + 4
    for i, l in enumerate(lineas):
        d.text((M, y + i * size * 1.12), l, font=f, fill="#FFFFFF")
    d.rectangle([M, H - 96, M + 64, H - 92], fill=CORAL)
    d.text((M, H - 76), pie, font=ImageFont.truetype(REG, 26), fill=GRIS)
    Path(destino).parent.mkdir(parents=True, exist_ok=True)
    img.save(destino, optimize=True)
    return destino


if __name__ == "__main__":
    A = RAIZ / "public/assets"
    og(A / "og-home.png", "Apps · Automatizaciones · IA", "Tu negocio\ntrabajando solo.")
    og(A / "og-resenas.png", "Respuesta a reseñas con IA", "Todas tus reseñas\nrespondidas.\nSin dedicarles tiempo.")
    og(A / "og-asistentes.png", "Para asistentes virtuales", "Ofrece automatizaciones\ncon IA a tus clientes.\nSin programar.")
    og(A / "og-blog.png", "Blog", "Casos reales\nde automatización.")
    print("ok")
