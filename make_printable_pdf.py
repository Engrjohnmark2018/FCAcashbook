#!/usr/bin/env python3
# ============================================================
# FCA Cash Book — Printable Manual Record Book (PDF)
# Developed by ENGR. JOHN MARK C. CONTILLO
# Cover + instructions, 12 cash-book ledger pages, monthly summary.
# ============================================================
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

OUT = "FCA-Cash-Book-Printable.pdf"

W, H = A4  # 595.27 x 841.89 pt
M = 12 * mm

# palette (matches the web app)
GREEN_D = (0.106, 0.369, 0.125)   # #1b5e20
GREEN   = (0.180, 0.490, 0.196)   # #2e7d32
GREEN_L = (0.910, 0.953, 0.914)   # #e8f3e9
RED     = (0.776, 0.157, 0.157)   # #c62828
RED_L   = (0.992, 0.925, 0.918)   # #fdecea
GRAY_L  = (0.933, 0.929, 0.914)   # #eeede9
CREAM   = (0.969, 0.961, 0.933)   # #f7f5ee
INK     = (0.137, 0.188, 0.141)   # #233024
MUTED   = (0.42, 0.48, 0.43)
LINE    = (0.76, 0.75, 0.70)
WHITE   = (1, 1, 1)

MONTHS_EN = ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"]
MONTHS_ILO = ["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunio",
              "Hulio", "Agosto", "Septiembre", "Oktubre", "Nobiembre", "Disiembre"]

N_LEDGER = 12
DEVELOPER = "Developed by: ENGR. JOHN MARK C. CONTILLO"


def fill(cv, c, a=None):
    if a is None:
        cv.setFillColorRGB(*c)
    else:
        cv.setFillColorRGB(*c, a)


def stroke(cv, c, w=0.8):
    cv.setStrokeColorRGB(*c)
    cv.setLineWidth(w)


def band(cv, text_left, text_right, h=12 * mm):
    fill(cv, GREEN_D)
    cv.rect(0, H - h, W, h, stroke=0, fill=1)
    fill(cv, WHITE)
    cv.setFont("Helvetica-Bold", 10)
    cv.drawString(M, H - h + 4.1 * mm, text_left)
    if text_right:
        cv.drawRightString(W - M, H - h + 4.1 * mm, text_right)
    fill(cv, RED)
    cv.rect(0, H - h - 1.6 * mm, W, 1.6 * mm, stroke=0, fill=1)
    return H - h - 1.6 * mm  # y just below band


def label_line(cv, x, y, label, length):
    """A bold label followed by a writing line. Returns end x."""
    cv.setFont("Helvetica-Bold", 8)
    fill(cv, GREEN_D)
    cv.drawString(x, y, label)
    lw = cv.stringWidth(label, "Helvetica-Bold", 8)
    stroke(cv, LINE, 0.9)
    cv.line(x + lw + 5, y - 2, x + lw + 5 + length, y - 2)
    return x + lw + 5 + length


def footer_credit(cv):
    cv.setFont("Helvetica", 7)
    fill(cv, MUTED)
    cv.drawCentredString(W / 2, 8.5 * mm,
                         "FCA Cash Book · Developed by Engr. John Mark C. Contillo")


# ------------------------------------------------------------
# PAGE 1 — COVER + INSTRUCTIONS
# ------------------------------------------------------------
def draw_cover(cv):
    fill(cv, CREAM)
    cv.rect(0, 0, W, H, stroke=0, fill=1)

    # top title band
    bh = 46 * mm
    fill(cv, GREEN_D)
    cv.rect(0, H - bh, W, bh, stroke=0, fill=1)
    fill(cv, RED)
    cv.rect(0, H - bh - 2 * mm, W, 2 * mm, stroke=0, fill=1)

    fill(cv, WHITE, 0.92)
    cv.setFont("Helvetica", 8.5)
    cv.drawCentredString(W / 2, H - 11 * mm, "FOR FARMERS' COOPERATIVES AND ASSOCIATIONS · PARA KADAGITI KOOPERATIBA KEN ASOSASION DAGITI MANNALON")
    fill(cv, WHITE)
    cv.setFont("Helvetica-Bold", 34)
    cv.drawCentredString(W / 2, H - 27 * mm, "FCA CASH BOOK")
    cv.setFont("Helvetica", 10.5)
    cv.drawCentredString(W / 2, H - 36 * mm, "Manual Financial Record Book · Manual nga Libro ti Pirak")

    # cooperative information box
    bw = 165 * mm
    x0 = (W - bw) / 2
    y = H - 56 * mm
    cv.setFont("Helvetica-Bold", 9.5)
    fill(cv, GREEN_D)
    cv.drawCentredString(W / 2, y, "COOPERATIVE INFORMATION · PAKAAMMO TI KOOPERATIBA")
    stroke(cv, LINE, 1)
    cv.line(x0, y - 3 * mm, x0 + bw, y - 3 * mm)

    fields = [
        "Name of Cooperative / Association  (Nagan ti Kooperatiba / Asosasion)",
        "Barangay / Address  (Barangay / Pagtaengan)",
        "Municipality / City  (Ili / Siudad)",
        "Province  (Probinsia)",
        "Year  (Tawen)",
        "Record Keeper / Treasurer  (Agtengtengel ti Libro / Tesorero)",
    ]
    y -= 11 * mm
    for f in fields:
        cv.setFont("Helvetica-Bold", 8.5)
        fill(cv, INK)
        cv.drawString(x0, y, f)
        stroke(cv, LINE, 0.9)
        cv.line(x0, y - 6 * mm, x0 + bw, y - 6 * mm)
        y -= 19 * mm

    # how-to-use box
    box_h = 80 * mm
    box_y = y - 4 * mm - box_h
    fill(cv, GREEN_L)
    stroke(cv, GREEN, 1.2)
    cv.roundRect(x0, box_y, bw, box_h, 4 * mm, stroke=1, fill=1)

    cv.setFont("Helvetica-Bold", 9.5)
    fill(cv, GREEN_D)
    cv.drawCentredString(W / 2, box_y + box_h - 9 * mm, "HOW TO USE THIS BOOK · NO KASANO TI PANAGUSAR")

    steps = [
        ("Write one line for every transaction: the date, who it was with, and what it was for.",
         "Isurat ti maysa a linia para iti tunggal transaksion: ti petsa, siasino, ken no ania."),
        ("Money received? Write the amount in the MONEY IN (Simrek) column.",
         "Nakawat ti pirak? Isurat ti gatad iti columna ti SIMREK."),
        ("Money spent? Write the amount in the MONEY OUT (Rimmuar) column.",
         "Nagastos ti pirak? Isurat ti gatad iti columna ti RIMMUAR."),
        ("Always write the receipt or OR number, if there is one.",
         "Kanayon nga isurat ti numero ti resibo no adda."),
        ("When the page is full, compute the totals and carry the balance to the next page.",
         "No napno ti panid, dagupen ken i-carry over ti balanse iti sumaruno a panid."),
        ("At month end, fill in the Monthly Summary page and have the officers sign.",
         "Iti gibus ti bulan, punnuan ti Monthly Summary ken pirmaan dagiti opisial."),
    ]
    sy = box_y + box_h - 18 * mm
    for i, (en, ilo) in enumerate(steps, 1):
        cv.setFont("Helvetica-Bold", 9.5)
        fill(cv, GREEN)
        cv.drawString(x0 + 6 * mm, sy, f"{i}.")
        cv.setFont("Helvetica", 8.5)
        fill(cv, INK)
        cv.drawString(x0 + 13 * mm, sy, en)
        cv.setFont("Helvetica-Oblique", 8)
        fill(cv, MUTED)
        cv.drawString(x0 + 13 * mm, sy - 4.6 * mm, ilo)
        sy -= 11 * mm

    # developer credit
    cy = box_y - 16 * mm
    fill(cv, WHITE)
    stroke(cv, GREEN, 1.2)
    cv.roundRect(x0 + 25 * mm, cy - 4.5 * mm, bw - 50 * mm, 12 * mm, 3 * mm, stroke=1, fill=1)
    cv.setFont("Helvetica-Bold", 10)
    fill(cv, GREEN_D)
    cv.drawCentredString(W / 2, cy, DEVELOPER)

    cv.setFont("Helvetica", 7)
    fill(cv, MUTED)
    cv.drawCentredString(W / 2, 8.5 * mm, "FCA Cash Book · Simple accounting for Farmers' Cooperatives and Associations")

    cv.showPage()


# ------------------------------------------------------------
# LEDGER PAGES
# ------------------------------------------------------------
def draw_ledger(cv, pn):
    band(cv, "FCA CASH BOOK — CASH RECORDS · LISTAAN TI PIRAK", f"Page {pn} of {N_LEDGER}")

    # fill-in row
    y = H - 21 * mm
    labels = ["Cooperative / Kooperatiba:", "Month / Bulan:", "Year / Tawen:"]
    cv.setFont("Helvetica-Bold", 8)
    fill(cv, GREEN_D)
    widths = [cv.stringWidth(l, "Helvetica-Bold", 8) for l in labels]
    usable = W - 2 * M - sum(widths) - 3 * 5 - 2 * (6 * mm)
    share = [0.58, 0.24, 0.18]
    x = M
    for lab, lw, sh in zip(labels, widths, share):
        cv.drawString(x, y, lab)
        x += lw + 5
        ln = usable * sh
        stroke(cv, LINE, 0.9)
        cv.line(x, y - 2, x + ln, y - 2)
        x += ln + 6 * mm

    # table geometry
    cols = [62, 165, 52, 88, 52, 52, 56.27]  # sum ≈ W - 2M
    headers = [
        ("Date", "Petsa"),
        ("Particulars — who / what", "Nailista — siasino / ania"),
        ("Ref / OR #", "Resibo"),
        ("Category", "Kategoria"),
        ("Money In", "Simrek (Php)"),
        ("Money Out", "Rimmuar (Php)"),
        ("Balance", "Balanse (Php)"),
    ]
    hdr_h = 30
    n_rows, rh = 24, 25
    x0 = M
    y_top = H - 27 * mm
    table_w = sum(cols)

    # column tints for the amount columns (In = green, Out = red, Balance = gray)
    tint_y = y_top - hdr_h - n_rows * rh
    cx = x0
    for i, wcol in enumerate(cols):
        if i == 4:
            fill(cv, GREEN_L); cv.rect(cx, tint_y, wcol, n_rows * rh, stroke=0, fill=1)
        if i == 5:
            fill(cv, RED_L); cv.rect(cx, tint_y, wcol, n_rows * rh, stroke=0, fill=1)
        if i == 6:
            fill(cv, GRAY_L); cv.rect(cx, tint_y, wcol, n_rows * rh, stroke=0, fill=1)
        cx += wcol

    # header row
    fill(cv, GREEN)
    cv.rect(x0, y_top - hdr_h, table_w, hdr_h, stroke=0, fill=1)
    cx = x0
    for (en, ilo), wcol in zip(headers, cols):
        fill(cv, WHITE)
        cv.setFont("Helvetica-Bold", 7.6)
        cv.drawCentredString(cx + wcol / 2, y_top - 13, en)
        cv.setFont("Helvetica-Oblique", 6.4)
        fill(cv, WHITE, 0.9)
        cv.drawCentredString(cx + wcol / 2, y_top - 22, ilo)
        cx += wcol

    # grid
    stroke(cv, GREEN_D, 1.1)
    cv.rect(x0, tint_y, table_w, hdr_h + n_rows * rh, stroke=1, fill=0)
    stroke(cv, LINE, 0.55)
    for r in range(1, n_rows):
        yy = y_top - hdr_h - r * rh
        cv.line(x0, yy, x0 + table_w, yy)
    cv.setStrokeColorRGB(*GREEN_D); cv.setLineWidth(0.5)
    cx = x0
    for wcol in cols[:-1]:
        cx += wcol
        cv.line(cx, y_top, cx, tint_y)
    # header dividers
    cx = x0
    stroke(cv, WHITE, 0.6)
    for wcol in cols[:-1]:
        cx += wcol
        cv.line(cx, y_top, cx, y_top - hdr_h)

    # totals strip
    ty = tint_y - 7 * mm - 20
    cells = [
        ("TOTAL MONEY IN · DAGUP A SIMREK (Php)", GREEN_L, GREEN_D),
        ("TOTAL MONEY OUT · DAGUP A RIMMUAR (Php)", RED_L, RED),
        ("CASH ON HAND / BALANCE · BALANSE (Php)", GRAY_L, INK),
    ]
    cw = table_w / 3
    for i, (lab, bgc, tc) in enumerate(cells):
        fill(cv, bgc)
        cv.rect(x0 + i * cw, ty, cw, 20, stroke=0, fill=1)
        stroke(cv, GREEN_D, 0.8)
        cv.rect(x0 + i * cw, ty, cw, 20, stroke=1, fill=0)
        cv.setFont("Helvetica-Bold", 6.4)
        fill(cv, tc)
        cv.drawString(x0 + i * cw + 5, ty + 12, lab)

    # prepared / checked
    sy = ty - 17
    cv.setFont("Helvetica-Bold", 7.5)
    fill(cv, GREEN_D)
    cv.drawString(x0, sy, "Prepared by / Insagana ni:")
    w1 = cv.stringWidth("Prepared by / Insagana ni:", "Helvetica-Bold", 7.5)
    stroke(cv, LINE, 0.9)
    cv.line(x0 + w1 + 5, sy - 2, x0 + table_w / 2 - 8, sy - 2)
    x2 = x0 + table_w / 2 + 8
    cv.drawString(x2, sy, "Checked by / Sinukimat ni:")
    w2 = cv.stringWidth("Checked by / Sinukimat ni:", "Helvetica-Bold", 7.5)
    cv.line(x2 + w2 + 5, sy - 2, x0 + table_w, sy - 2)

    footer_credit(cv)
    cv.showPage()


# ------------------------------------------------------------
# MONTHLY SUMMARY PAGE
# ------------------------------------------------------------
def draw_summary(cv):
    band(cv, "FCA CASH BOOK — MONTHLY SUMMARY · DAGUP TI TINAWEN", "")

    # fill-in row
    y = H - 21 * mm
    x = M
    x = label_line(cv, x, y, "Cooperative / Kooperatiba:", 70 * mm) + 8 * mm
    label_line(cv, x, y, "Year / Tawen:", 30 * mm)

    cols = [170, 119.1, 119.1, 119.07]
    headers = [
        ("Month", "Bulan"),
        ("Money In (Php)", "Simrek a Pirak"),
        ("Money Out (Php)", "Rimmuar a Pirak"),
        ("Cash on Hand (Php)", "Balanse"),
    ]
    hdr_h = 30
    rh = 30
    x0 = M
    y_top = H - 27 * mm
    table_w = sum(cols)
    n_rows = 12

    # tint the Balance column
    tint_y = y_top - hdr_h - n_rows * rh - 30  # includes TOTAL row
    cx = x0 + sum(cols[:3])
    fill(cv, GRAY_L)
    cv.rect(cx, tint_y, cols[3], n_rows * rh + 30, stroke=0, fill=1)

    # header
    fill(cv, GREEN)
    cv.rect(x0, y_top - hdr_h, table_w, hdr_h, stroke=0, fill=1)
    cx = x0
    for (en, ilo), wcol in zip(headers, cols):
        fill(cv, WHITE)
        cv.setFont("Helvetica-Bold", 8)
        cv.drawCentredString(cx + wcol / 2, y_top - 13, en)
        cv.setFont("Helvetica-Oblique", 6.6)
        fill(cv, WHITE, 0.9)
        cv.drawCentredString(cx + wcol / 2, y_top - 22, ilo)
        cx += wcol

    # month rows
    for r in range(n_rows):
        yy = y_top - hdr_h - (r + 1) * rh
        cv.setFont("Helvetica-Bold", 9)
        fill(cv, INK)
        cv.drawString(x0 + 6, yy + rh / 2 - 3, f"{MONTHS_EN[r]}  ({MONTHS_ILO[r]})")

    # TOTAL row
    tot_y = y_top - hdr_h - n_rows * rh - 30
    fill(cv, GREEN_L)
    cv.rect(x0, tot_y, table_w, 30, stroke=0, fill=1)
    cv.setFont("Helvetica-Bold", 9.5)
    fill(cv, GREEN_D)
    cv.drawString(x0 + 6, tot_y + 11, "TOTAL FOR THE YEAR · DAGUP TI TINAWEN")

    # grid
    bottom = tot_y
    stroke(cv, GREEN_D, 1.1)
    cv.rect(x0, bottom, table_w, hdr_h + n_rows * rh + 30, stroke=1, fill=0)
    stroke(cv, LINE, 0.55)
    for r in range(1, n_rows + 1):
        yy = y_top - hdr_h - r * rh
        cv.line(x0, yy, x0 + table_w, yy)
    cv.line(x0, tot_y, x0 + table_w, tot_y)
    cx = x0
    stroke(cv, GREEN_D, 0.5)
    for wcol in cols[:-1]:
        cx += wcol
        cv.line(cx, y_top, cx, bottom)
    cx = x0
    stroke(cv, WHITE, 0.6)
    for wcol in cols[:-1]:
        cx += wcol
        cv.line(cx, y_top, cx, y_top - hdr_h)

    # signatures
    sy = bottom - 24 * mm
    sigs = [
        ("Prepared by", "Insagana ni", "Treasurer / Tesorero"),
        ("Checked by", "Sinukimat ni", "Auditor"),
        ("Approved by", "Inanamongan ni", "Chairperson / Presidente"),
    ]
    sw = table_w / 3
    for i, (en, ilo, role) in enumerate(sigs):
        sx = x0 + i * sw + 8
        ex = x0 + (i + 1) * sw - 8
        stroke(cv, INK, 0.9)
        cv.line(sx, sy, ex, sy)
        cv.setFont("Helvetica-Bold", 8)
        fill(cv, GREEN_D)
        lab = f"{en} / {ilo}"
        cv.drawCentredString((sx + ex) / 2, sy - 4 * mm, lab)
        cv.setFont("Helvetica-Oblique", 7)
        fill(cv, MUTED)
        cv.drawCentredString((sx + ex) / 2, sy - 8.5 * mm, f"({role})")

    footer_credit(cv)
    cv.showPage()


def main():
    cv = canvas.Canvas(OUT, pagesize=A4)
    cv.setTitle("FCA Cash Book — Printable Manual Record Book")
    cv.setAuthor("Engr. John Mark C. Contillo")
    cv.setSubject("Manual financial record book for Farmers' Cooperatives and Associations (English / Ilokano)")

    draw_cover(cv)
    for pn in range(1, N_LEDGER + 1):
        draw_ledger(cv, pn)
    draw_summary(cv)
    cv.save()
    print(f"OK: wrote {OUT} ({N_LEDGER + 2} pages)")


if __name__ == "__main__":
    main()
