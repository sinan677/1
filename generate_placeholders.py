"""
Nurullah Clinic — placeholder asset generator.
Generates on-brand (noir + gold) placeholder images so the site never
breaks with missing-image icons. Each placeholder is labelled with the
exact filename to drop a real photo into, plus the recommended size.
Run: python3 generate_placeholders.py
"""
from PIL import Image, ImageDraw, ImageFont
import os, math

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "images")
os.makedirs(OUT, exist_ok=True)

NOIR = (11, 11, 13)
NOIR2 = (18, 17, 22)
SURFACE = (23, 22, 27)
GOLD = (201, 166, 100)
GOLD_BRIGHT = (228, 199, 132)
IVORY_DIM = (150, 145, 134)
LINE = (244, 239, 228)

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
def font(size, bold=False):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)

def gradient_bg(w, h):
    img = Image.new("RGB", (w, h), NOIR)
    px = img.load()
    cx, cy = w * 0.5, h * 0.35
    maxd = math.hypot(w, h) * 0.65
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            d = math.hypot(x - cx, y - cy) / maxd
            d = min(d, 1)
            r = int(NOIR2[0] + (NOIR[0] - NOIR2[0]) * d)
            g = int(NOIR2[1] + (NOIR[1] - NOIR2[1]) * d)
            b = int(NOIR2[2] + (NOIR[2] - NOIR2[2]) * d)
            for yy in range(y, min(y+2, h)):
                for xx in range(x, min(x+2, w)):
                    px[xx, yy] = (r, g, b)
    return img

def draw_camera_icon(draw, cx, cy, s, color):
    # simple camera glyph
    body_w, body_h = s * 1.6, s
    draw.rounded_rectangle(
        [cx - body_w/2, cy - body_h/2 + s*0.15, cx + body_w/2, cy + body_h/2 + s*0.15],
        radius=s*0.12, outline=color, width=max(2, int(s*0.05))
    )
    draw.rectangle(
        [cx - s*0.28, cy - body_h/2 - s*0.18, cx + s*0.28, cy - body_h/2 + s*0.15],
        outline=color, width=max(2, int(s*0.05))
    )
    r = s * 0.32
    draw.ellipse([cx - r, cy + s*0.12 - r, cx + r, cy + s*0.12 + r], outline=color, width=max(2, int(s*0.05)))

def draw_play_icon(draw, cx, cy, s, color):
    r = s
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=max(2, int(s*0.06)))
    tri = [(cx - r*0.35, cy - r*0.5), (cx - r*0.35, cy + r*0.5), (cx + r*0.55, cy)]
    draw.polygon(tri, fill=color)

def draw_badge_icon(draw, cx, cy, s, color):
    draw.ellipse([cx - s, cy - s, cx + s, cy + s], outline=color, width=max(2, int(s*0.08)))
    draw.ellipse([cx - s*0.55, cy - s*0.55, cx + s*0.55, cy + s*0.55], outline=color, width=max(2, int(s*0.05)))

def make_placeholder(filename, w, h, category, label, icon="photo"):
    img = gradient_bg(w, h)
    d = ImageDraw.Draw(img)

    border = max(2, int(min(w, h) * 0.006))
    margin = int(min(w, h) * 0.035)
    d.rectangle([margin, margin, w - margin, h - margin], outline=GOLD, width=border)

    # corner ticks
    tick = int(min(w, h) * 0.05)
    for (cx, cy, dx, dy) in [(margin, margin, 1, 1), (w-margin, margin, -1, 1),
                              (margin, h-margin, 1, -1), (w-margin, h-margin, -1, -1)]:
        d.line([(cx, cy), (cx + tick*dx, cy)], fill=GOLD_BRIGHT, width=border+1)
        d.line([(cx, cy), (cx, cy + tick*dy)], fill=GOLD_BRIGHT, width=border+1)

    icon_size = min(w, h) * 0.09
    icon_cy = h * 0.42
    if icon == "play":
        draw_play_icon(d, w/2, icon_cy, icon_size, GOLD)
    elif icon == "badge":
        draw_badge_icon(d, w/2, icon_cy, icon_size, GOLD)
    else:
        draw_camera_icon(d, w/2, icon_cy, icon_size, GOLD)

    cat_font = font(max(11, int(min(w,h)*0.028)), bold=True)
    cat_text = category.upper()
    bbox = d.textbbox((0,0), cat_text, font=cat_font)
    d.text(((w-(bbox[2]-bbox[0]))/2, icon_cy + icon_size*1.5), cat_text, font=cat_font, fill=GOLD, spacing=4)

    lbl_font = font(max(13, int(min(w,h)*0.034)), bold=True)
    bbox2 = d.textbbox((0,0), label, font=lbl_font)
    d.text(((w-(bbox2[2]-bbox2[0]))/2, icon_cy + icon_size*1.5 + (bbox[3]-bbox[1]) + 14), label, font=lbl_font, fill=LINE)

    dim_font = font(max(10, int(min(w,h)*0.024)))
    dim_text = f"{w} × {h} px"
    bbox3 = d.textbbox((0,0), dim_text, font=dim_font)
    d.text(((w-(bbox3[2]-bbox3[0]))/2, h - margin - (bbox3[3]-bbox3[1]) - 18), dim_text, font=dim_font, fill=IVORY_DIM)

    path = os.path.join(OUT, filename)
    img.save(path, quality=90)
    print("✓", filename)

# ---------------- image manifest ----------------
IMAGES = [
    # (filename, w, h, category, label, icon)
    ("about-clinic.jpg", 1000, 1250, "Hakkımızda", "Klinik / Operasyon Odası Fotoğrafı", "photo"),
    ("clinic-interior-1.jpg", 1200, 800, "Kliniğimiz", "Bekleme / Konsültasyon Alanı", "photo"),
    ("clinic-interior-2.jpg", 1200, 800, "Kliniğimiz", "Operasyon Odası", "photo"),
    ("vip-transfer.jpg", 1000, 1250, "VIP Transfer", "Karşılama / Araç Fotoğrafı", "photo"),

    ("treatment-fue.jpg", 800, 600, "Hizmet", "FUE Saç Ekimi", "photo"),
    ("treatment-dhi.jpg", 800, 600, "Hizmet", "DHI Tekniği", "photo"),
    ("treatment-beard.jpg", 800, 600, "Hizmet", "Sakal & Bıyık Ekimi", "photo"),
    ("treatment-eyebrow.jpg", 800, 600, "Hizmet", "Kaş Ekimi", "photo"),
    ("treatment-prp.jpg", 800, 600, "Hizmet", "PRP & Mezoterapi", "photo"),
    ("treatment-woman.jpg", 800, 600, "Hizmet", "Kadınlarda Saç Ekimi", "photo"),
    ("treatment-afro.jpg", 800, 600, "Hizmet", "Afro Tip Saç Ekimi", "photo"),

    ("ba-before.jpg", 1200, 800, "Öncesi / Sonrası", "Operasyon Öncesi", "photo"),
    ("ba-after.jpg", 1200, 800, "Öncesi / Sonrası", "Operasyon Sonrası", "photo"),
    ("gallery-1.jpg", 800, 1000, "Galeri", "Sonuç Fotoğrafı 1", "photo"),
    ("gallery-2.jpg", 800, 1000, "Galeri", "Sonuç Fotoğrafı 2", "photo"),
    ("gallery-3.jpg", 800, 1000, "Galeri", "Sonuç Fotoğrafı 3", "photo"),
    ("gallery-4.jpg", 800, 1000, "Galeri", "Sonuç Fotoğrafı 4", "photo"),

    ("doctor-1.jpg", 600, 750, "Doktor Kadrosu", "Doktor Portresi 1", "photo"),
    ("doctor-2.jpg", 600, 750, "Doktor Kadrosu", "Doktor Portresi 2", "photo"),
    ("doctor-3.jpg", 600, 750, "Doktor Kadrosu", "Doktor Portresi 3", "photo"),
    ("doctor-4.jpg", 600, 750, "Doktor Kadrosu", "Doktor Portresi 4", "photo"),

    ("hotel-1.jpg", 900, 650, "Otel Ortağı", "Otel Fotoğrafı 1", "photo"),
    ("hotel-2.jpg", 900, 650, "Otel Ortağı", "Otel Fotoğrafı 2", "photo"),
    ("hotel-3.jpg", 900, 650, "Otel Ortağı", "Otel Fotoğrafı 3", "photo"),

    ("blog-1.jpg", 700, 480, "Blog", "Yazı Görseli 1", "photo"),
    ("blog-2.jpg", 700, 480, "Blog", "Yazı Görseli 2", "photo"),
    ("blog-3.jpg", 700, 480, "Blog", "Yazı Görseli 3", "photo"),

    ("product-aftercare.jpg", 700, 700, "Bakım Ürünü", "Ürün Fotoğrafı", "photo"),

    ("video-thumb-1.jpg", 900, 560, "Video", "Hasta Hikayesi 1 — Kapak", "play"),
    ("video-thumb-2.jpg", 900, 560, "Video", "Hasta Hikayesi 2 — Kapak", "play"),
    ("video-thumb-3.jpg", 900, 560, "Video", "Hasta Hikayesi 3 — Kapak", "play"),
    ("video-thumb-4.jpg", 900, 560, "Video", "Hasta Hikayesi 4 — Kapak", "play"),

    ("accred-1.png", 260, 110, "Logo", "Akreditasyon 1", "badge"),
    ("accred-2.png", 260, 110, "Logo", "Akreditasyon 2", "badge"),
    ("accred-3.png", 260, 110, "Logo", "Akreditasyon 3", "badge"),

    ("press-1.png", 220, 90, "Logo", "Basın Logosu 1", "badge"),
    ("press-2.png", 220, 90, "Logo", "Basın Logosu 2", "badge"),
    ("press-3.png", 220, 90, "Logo", "Basın Logosu 3", "badge"),
    ("press-4.png", 220, 90, "Logo", "Basın Logosu 4", "badge"),

    ("dubai-office.jpg", 1000, 1250, "Dubai Ofisi", "Dubai Ofis Fotoğrafı", "photo"),
    ("og-cover.jpg", 1200, 630, "Sosyal Medya", "Paylaşım Kapak Görseli", "photo"),
]

for fn, w, h, cat, lbl, icon in IMAGES:
    make_placeholder(fn, w, h, cat, lbl, icon)

print(f"\n{len(IMAGES)} placeholder görsel oluşturuldu → {os.path.abspath(OUT)}")
