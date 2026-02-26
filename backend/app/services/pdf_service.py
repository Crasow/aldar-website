import os

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from sqlalchemy.orm import Session
from app.models.database import Product, Category


def _register_cyrillic_font() -> str:
    """Register a TrueType font with Cyrillic support and return its name."""
    _here = os.path.dirname(__file__)
    font_candidates = [
        (os.path.join(_here, "..", "fonts", "DejaVuSans.ttf"), "DejaVuSans"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "DejaVuSans"),
        ("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", "LiberationSans"),
    ]

    for path, name in font_candidates:
        path = os.path.normpath(path)
        if os.path.exists(path):
            if name not in pdfmetrics.getRegisteredFontNames():
                pdfmetrics.registerFont(TTFont(name, path))
            return name

    return "Helvetica"


def generate_price_list(db: Session, category_id: int = None) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    font_name = _register_cyrillic_font()
    for style_key in ("Normal", "Title", "Heading2"):
        if style_key in styles:
            styles[style_key].fontName = font_name

    story = []

    title = Paragraph("ALDAR ZS — Прайс-лист", styles["Title"])
    story.append(title)
    story.append(Spacer(1, 12))

    query = db.query(Product).join(Category).filter(Product.is_active)
    if category_id:
        query = query.filter(Product.category_id == category_id)

    products = query.all()

    if not products:
        no_products = Paragraph("Товари не знайдені", styles["Normal"])
        story.append(no_products)
    else:
        current_category = None
        for product in products:
            if current_category != product.category.name:
                current_category = product.category.name
                category_title = Paragraph(
                    f"<b>{current_category}</b>", styles["Heading2"]
                )
                story.append(category_title)
                story.append(Spacer(1, 6))

            data = [
                ["Найменування:", product.name],
                ["Фасування:", product.weight_packaging],
                ["Ціна:", f"{product.price:.2f} ₴"],
            ]

            table = Table(data, colWidths=[2 * inch, 4 * inch])
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
                        ("GRID", (0, 0), (-1, -1), 1, colors.black),
                        ("PADDING", (0, 0), (-1, -1), 6),
                        ("FONTNAME", (0, 0), (-1, -1), font_name),
                    ]
                )
            )

            story.append(table)
            story.append(Spacer(1, 12))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
