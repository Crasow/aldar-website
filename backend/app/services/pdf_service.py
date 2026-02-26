import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from io import BytesIO
from sqlalchemy.orm import Session
from app.models.database import Product, Category


def _register_fonts() -> tuple[str, str]:
    """Register DejaVu fonts and return (regular_name, bold_name)."""
    _fonts_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "fonts"))

    regular_candidates = [
        (os.path.join(_fonts_dir, "DejaVuSans.ttf"), "DejaVuSans"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "DejaVuSans"),
    ]
    bold_candidates = [
        (os.path.join(_fonts_dir, "DejaVuSans-Bold.ttf"), "DejaVuSans-Bold"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "DejaVuSans-Bold"),
    ]

    regular_name = "Helvetica"
    for path, name in regular_candidates:
        if os.path.exists(path):
            if name not in pdfmetrics.getRegisteredFontNames():
                pdfmetrics.registerFont(TTFont(name, path))
            regular_name = name
            break

    bold_name = "Helvetica-Bold"
    for path, name in bold_candidates:
        if os.path.exists(path):
            if name not in pdfmetrics.getRegisteredFontNames():
                pdfmetrics.registerFont(TTFont(name, path))
            bold_name = name
            break

    if regular_name != "Helvetica" and bold_name != "Helvetica-Bold":
        pdfmetrics.registerFontFamily(
            regular_name,
            normal=regular_name,
            bold=bold_name,
            italic=regular_name,
            boldItalic=bold_name,
        )

    return regular_name, bold_name


def generate_price_list(db: Session, category_id: int = None) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)

    font, font_bold = _register_fonts()

    style_title = ParagraphStyle("title", fontName=font_bold, fontSize=18, spaceAfter=12)
    style_heading = ParagraphStyle("heading", fontName=font_bold, fontSize=13, spaceAfter=6)
    style_normal = ParagraphStyle("normal", fontName=font, fontSize=10)

    story = []
    story.append(Paragraph("ALDAR ZS — Прайс-лист", style_title))
    story.append(Spacer(1, 12))

    query = db.query(Product).join(Category).filter(Product.is_active == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    products = query.all()

    if not products:
        story.append(Paragraph("Товари не знайдені", style_normal))
    else:
        current_category = None
        for product in products:
            if current_category != product.category.name:
                current_category = product.category.name
                story.append(Paragraph(current_category, style_heading))
                story.append(Spacer(1, 6))

            data = [
                ["Найменування:", product.name],
                ["Фасування:", product.weight_packaging],
                ["Ціна:", f"{product.price:.2f} грн"],
            ]

            table = Table(data, colWidths=[2 * inch, 4 * inch])
            table.setStyle(
                TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                    ("PADDING", (0, 0), (-1, -1), 6),
                    ("FONTNAME", (0, 0), (-1, -1), font),
                    ("FONTSIZE", (0, 0), (-1, -1), 10),
                ])
            )

            story.append(table)
            story.append(Spacer(1, 12))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
