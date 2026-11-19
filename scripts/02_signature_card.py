"""Phase 5 (partie carton) : genere les 3 PNG du carton de signature CANAL-FOUR."""
from __future__ import annotations

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from utils import ASSETS, WIDTH, HEIGHT, ensure_dirs

BORDEAUX_CENTER = (92, 26, 38)     # #5C1A26
BORDEAUX_EDGE = (28, 8, 13)        # #1C080D
GOLD = (212, 175, 55)              # #D4AF37
CREAM = (243, 233, 215)            # #F3E9D7

FONT_DIR = ASSETS / "fonts"
TITLE_FONT_PATH = FONT_DIR / "GeorgiaPro-SemiBold.ttf"
TAGLINE_FONT_PATH = FONT_DIR / "GeorgiaPro-Italic.ttf"


def radial_gradient_bg() -> Image.Image:
    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
    cx, cy = WIDTH / 2, HEIGHT / 2
    max_dist = np.hypot(cx, cy)
    dist = np.hypot(xx - cx, yy - cy) / max_dist
    dist = np.clip(dist, 0, 1)

    img = np.zeros((HEIGHT, WIDTH, 3), dtype=np.float32)
    for c in range(3):
        img[..., c] = BORDEAUX_CENTER[c] * (1 - dist) + BORDEAUX_EDGE[c] * dist

    # Leger grain pour eviter le banding et donner une texture papier/matiere.
    rng = np.random.default_rng(42)
    grain = rng.normal(0, 2.5, size=(HEIGHT, WIDTH, 1)).astype(np.float32)
    img = np.clip(img + grain, 0, 255).astype(np.uint8)
    return Image.fromarray(img)


def draw_tracked_text(draw: ImageDraw.ImageDraw, center_x: int, y: int, text: str, font: ImageFont.FreeTypeFont, fill, tracking: int) -> int:
    """Dessine du texte centre horizontalement avec un espacement de lettres manuel. Renvoie la hauteur du texte."""
    widths = [draw.textlength(ch, font=font) for ch in text]
    total_width = sum(widths) + tracking * (len(text) - 1)
    x = center_x - total_width / 2
    bbox = font.getbbox(text)
    text_height = bbox[3] - bbox[1]
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking
    return text_height


def main() -> None:
    ensure_dirs()

    bg = radial_gradient_bg()
    bg.save(ASSETS / "signature_bg.png")

    title_img = bg.copy()
    draw = ImageDraw.Draw(title_img)
    title_font = ImageFont.truetype(str(TITLE_FONT_PATH), 118)
    draw_tracked_text(draw, WIDTH // 2, HEIGHT // 2 - 60, "CANAL-FOUR", title_font, GOLD, tracking=14)
    title_img.save(ASSETS / "signature_title.png")

    full_img = title_img.copy()
    draw = ImageDraw.Draw(full_img)

    rule_y = HEIGHT // 2 + 90
    rule_half_w = 90
    draw.line([(WIDTH // 2 - rule_half_w, rule_y), (WIDTH // 2 + rule_half_w, rule_y)], fill=GOLD, width=2)

    tagline_font = ImageFont.truetype(str(TAGLINE_FONT_PATH), 40)
    tagline = "L'art de la gourmandise, le goût de l'exception."
    tw = draw.textlength(tagline, font=tagline_font)
    draw.text((WIDTH // 2 - tw / 2, rule_y + 35), tagline, font=tagline_font, fill=CREAM)

    full_img.save(ASSETS / "signature_full.png")

    print("Cartons generes :", ASSETS / "signature_bg.png", ASSETS / "signature_title.png", ASSETS / "signature_full.png")


if __name__ == "__main__":
    main()
