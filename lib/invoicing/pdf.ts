import fs from "node:fs";
import path from "node:path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import {
  formatDateDe,
  formatEurDe,
  formatQuantityDe,
  formatVatRateDe,
} from "./money";
import type { InvoicePdfDocumentData } from "./types";
import { formatIbanGrouped } from "./validators";

// A4 portrait dimensions in PDF points (1 mm = 2.83464567 pt)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// DIN 5008 Form B inspired margins
const MARGIN_LEFT = 70.87; // 25 mm
const MARGIN_RIGHT = 56.69; // 20 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // ~467.72 pt
const RIGHT_EDGE = PAGE_WIDTH - MARGIN_RIGHT;

// Reserved footer area at bottom of every page (§35a GmbHG + "Seite x von y")
const FOOTER_TOP_Y = 98;
const MIN_CONTENT_Y = FOOTER_TOP_Y + 14;

// Brand & neutral print palette (clean German business letter aesthetic)
const COLOR_TEXT = rgb(0.09, 0.12, 0.18); // slate-900
const COLOR_MUTED = rgb(0.39, 0.45, 0.54); // slate-500
const COLOR_LIGHT = rgb(0.58, 0.64, 0.72); // slate-400
const COLOR_BORDER = rgb(0.84, 0.87, 0.91); // slate-200
const COLOR_BG_SOFT = rgb(0.965, 0.972, 0.985); // slate-50
const COLOR_ACCENT = rgb(0.31, 0.275, 0.898); // indigo-600
const COLOR_ACCENT_SOFT = rgb(0.933, 0.949, 1.0); // indigo-50
const COLOR_DANGER = rgb(0.75, 0.12, 0.22); // rose-700

/**
 * WinAnsi (Windows-1252) safe sanitizer for StandardFonts.Helvetica.
 * Preserves all German characters (ä ö ü Ä Ö Ü ß € § „ “ – — °) and Western European accents;
 * replaces any unsupported Unicode symbols with safe ASCII approximations so PDF generation never throws.
 */
export function sanitizeWinAnsi(input: string): string {
  const normalized = input
    .replace(/\u202F|\u00A0/g, " ")
    .replace(/\u2011/g, "-")
    .replace(/\u2212/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  let out = "";
  for (const ch of normalized) {
    const code = ch.codePointAt(0) ?? 32;
    if (
      ch === "\n" ||
      ch === "\t" ||
      (code >= 0x20 && code <= 0x7e) ||
      (code >= 0xa0 && code <= 0xff) ||
      code === 0x20ac || // €
      code === 0x2013 || // –
      code === 0x2014 || // —
      code === 0x2018 || // ‘
      code === 0x2019 || // ’
      code === 0x201a || // ‚
      code === 0x201c || // “
      code === 0x201d || // ”
      code === 0x201e || // „
      code === 0x2022 || // •
      code === 0x2030 // ‰
    ) {
      out += ch === "\t" ? "  " : ch;
    } else {
      out += "?";
    }
  }
  return out;
}

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const safe = sanitizeWinAnsi(text);
  const paragraphs = safe.split("\n");
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (para.trim() === "") {
      lines.push("");
      continue;
    }
    const words = para.split(/\s+/);
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
        current = candidate;
      } else {
        if (current) {
          lines.push(current);
          current = "";
        }
        // Hard-wrap single ultra-long words (e.g. long URLs or IBANs)
        if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
          current = word;
        } else {
          let chunk = "";
          for (const char of word) {
            if (font.widthOfTextAtSize(chunk + char, fontSize) <= maxWidth) {
              chunk += char;
            } else {
              if (chunk) lines.push(chunk);
              chunk = char;
            }
          }
          current = chunk;
        }
      }
    }
    if (current) {
      lines.push(current);
    }
  }

  return lines;
}

function drawRightAlignedText(
  page: PDFPage,
  text: string,
  rightX: number,
  y: number,
  font: PDFFont,
  size: number,
  color = COLOR_TEXT
) {
  const safe = sanitizeWinAnsi(text);
  const w = font.widthOfTextAtSize(safe, size);
  page.drawText(safe, { x: rightX - w, y, size, font, color });
}

function resolveCountryNameDe(isoCode: string | null | undefined): string {
  const code = (isoCode ?? "DE").trim().toUpperCase();
  const map: Record<string, string> = {
    DE: "Deutschland",
    AT: "Österreich",
    CH: "Schweiz",
    NL: "Niederlande",
    BE: "Belgien",
    FR: "Frankreich",
    LU: "Luxemburg",
    IT: "Italien",
    ES: "Spanien",
    PL: "Polen",
    GB: "Vereinigtes Königreich",
    US: "USA",
    MY: "Malaysia",
    AE: "Vereinigte Arabische Emirate",
  };
  return map[code] ?? code;
}

const logoBytesCache = new Map<string, Buffer | null>();

async function tryEmbedLogo(
  pdfDoc: PDFDocument,
  logoPath: string
): Promise<PDFImage | null> {
  if (!logoPath) return null;
  try {
    const cleaned = logoPath.replace(/^\/+/, "");
    const absPath = path.resolve(process.cwd(), "public", cleaned);
    const publicDir = path.resolve(process.cwd(), "public");
    if (!absPath.startsWith(publicDir)) {
      return null;
    }

    let bytes = logoBytesCache.get(absPath);
    if (bytes === undefined) {
      bytes = fs.existsSync(absPath) ? fs.readFileSync(absPath) : null;
      logoBytesCache.set(absPath, bytes);
    }
    if (!bytes) return null;

    if (absPath.toLowerCase().endsWith(".png")) {
      return await pdfDoc.embedPng(bytes);
    }
    if (
      absPath.toLowerCase().endsWith(".jpg") ||
      absPath.toLowerCase().endsWith(".jpeg")
    ) {
      return await pdfDoc.embedJpg(bytes);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generates a DIN 5008-inspired German business invoice PDF on the server using `pdf-lib`.
 * Supports:
 * - Full § 14 UStG and § 35a GmbHG mandatory disclosures
 * - German de-DE number & date formatting, full ä ö ü ß € support
 * - Multi-page line item tables with repeated table header & "Seite x von y" pagination
 * - Draft watermark for previewing unissued drafts
 */
export async function generateInvoicePdf(
  data: InvoicePdfDocumentData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(
    sanitizeWinAnsi(
      `${data.type === "CANCELLATION" ? "Stornorechnung" : "Rechnung"} ${data.invoiceNumber} - ${data.issuer.legalName}`
    )
  );
  pdfDoc.setAuthor(sanitizeWinAnsi(data.issuer.legalName));
  pdfDoc.setSubject(
    sanitizeWinAnsi(
      `${data.type === "CANCELLATION" ? "Stornorechnung" : "Rechnung"} Nr. ${data.invoiceNumber}`
    )
  );
  pdfDoc.setCreator("CoreLogic Systems Admin Invoicing");
  pdfDoc.setProducer("pdf-lib (CoreLogic Systems)");

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const logoImage = await tryEmbedLogo(pdfDoc, data.issuer.logoPath);

  const pages: PDFPage[] = [];
  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(currentPage);

  // Table column geometry (within CONTENT_WIDTH = 467.72 pt)
  const colPosX = MARGIN_LEFT;
  const colDescX = MARGIN_LEFT + 28;
  const colDescW = 200;
  const colQtyRightX = MARGIN_LEFT + 300;
  const colUnitRightX = MARGIN_LEFT + 382;
  const colTotalRightX = RIGHT_EDGE;

  const drawTableHeader = (page: PDFPage, yTop: number): number => {
    const barH = 22;
    page.drawRectangle({
      x: MARGIN_LEFT,
      y: yTop - barH,
      width: CONTENT_WIDTH,
      height: barH,
      color: COLOR_BG_SOFT,
      borderColor: COLOR_BORDER,
      borderWidth: 0.75,
    });

    const textY = yTop - 14.5;
    page.drawText("Pos.", {
      x: colPosX + 4,
      y: textY,
      size: 8.5,
      font: fontBold,
      color: COLOR_TEXT,
    });
    page.drawText("Beschreibung", {
      x: colDescX,
      y: textY,
      size: 8.5,
      font: fontBold,
      color: COLOR_TEXT,
    });
    drawRightAlignedText(
      page,
      "Menge",
      colQtyRightX,
      textY,
      fontBold,
      8.5,
      COLOR_TEXT
    );
    drawRightAlignedText(
      page,
      "Einzelpreis",
      colUnitRightX,
      textY,
      fontBold,
      8.5,
      COLOR_TEXT
    );
    drawRightAlignedText(
      page,
      "Gesamt (Netto)",
      colTotalRightX - 4,
      textY,
      fontBold,
      8.5,
      COLOR_TEXT
    );

    return yTop - barH - 6;
  };

  const addContinuationPage = (withTableHeader: boolean): number => {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(currentPage);

    // Compact continuation header
    const headerY = PAGE_HEIGHT - 44;
    currentPage.drawText(sanitizeWinAnsi(data.issuer.legalName), {
      x: MARGIN_LEFT,
      y: headerY,
      size: 9.5,
      font: fontBold,
      color: COLOR_TEXT,
    });
    const docLabel =
      data.type === "CANCELLATION"
        ? `Stornorechnung Nr. ${data.invoiceNumber} (Fortsetzung)`
        : `Rechnung Nr. ${data.invoiceNumber} (Fortsetzung)`;
    drawRightAlignedText(
      currentPage,
      docLabel,
      RIGHT_EDGE,
      headerY,
      fontRegular,
      8.5,
      COLOR_MUTED
    );
    currentPage.drawLine({
      start: { x: MARGIN_LEFT, y: headerY - 8 },
      end: { x: RIGHT_EDGE, y: headerY - 8 },
      thickness: 0.75,
      color: COLOR_BORDER,
    });

    let nextY = headerY - 22;
    if (withTableHeader) {
      nextY = drawTableHeader(currentPage, nextY);
    }
    return nextY;
  };

  // =========================================================================
  // Page 1 Letterhead (Top Header)
  // =========================================================================
  const topY = PAGE_HEIGHT - 42;
  if (logoImage) {
    const maxLogoH = 42;
    const maxLogoW = 135;
    const scale = Math.min(
      maxLogoW / logoImage.width,
      maxLogoH / logoImage.height
    );
    const drawW = logoImage.width * scale;
    const drawH = logoImage.height * scale;
    currentPage.drawImage(logoImage, {
      x: MARGIN_LEFT,
      y: topY - drawH + 8,
      width: drawW,
      height: drawH,
    });
  } else {
    currentPage.drawText(sanitizeWinAnsi(data.issuer.legalName), {
      x: MARGIN_LEFT,
      y: topY - 8,
      size: 13,
      font: fontBold,
      color: COLOR_ACCENT,
    });
  }

  // Top-right issuer compact block
  const issuerRightLines: string[] = [
    data.issuer.legalName,
    [data.issuer.street, `${data.issuer.postalCode} ${data.issuer.city}`.trim()]
      .filter(Boolean)
      .join(", "),
    [
      data.issuer.phone ? `Tel.: ${data.issuer.phone}` : "",
      data.issuer.email ? `E-Mail: ${data.issuer.email}` : "",
    ]
      .filter(Boolean)
      .join(" · "),
    data.issuer.website ? data.issuer.website : "",
  ].filter(Boolean);

  let rightHeaderY = topY;
  issuerRightLines.forEach((line, idx) => {
    drawRightAlignedText(
      currentPage,
      line,
      RIGHT_EDGE,
      rightHeaderY,
      idx === 0 ? fontBold : fontRegular,
      idx === 0 ? 9 : 7.8,
      idx === 0 ? COLOR_TEXT : COLOR_MUTED
    );
    rightHeaderY -= idx === 0 ? 12 : 10.5;
  });

  // Accent rule below letterhead
  const ruleY = topY - 46;
  currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: ruleY },
    end: { x: RIGHT_EDGE, y: ruleY },
    thickness: 1.5,
    color: COLOR_ACCENT,
  });

  // =========================================================================
  // DIN 5008 Address Window (Left) + Metadata Info Block (Right)
  // =========================================================================
  const addressTopY = ruleY - 22;

  // Small 1-line sender return line (Absenderzeile)
  const senderReturnLine = [
    data.issuer.legalName,
    data.issuer.street,
    `${data.issuer.postalCode} ${data.issuer.city}`.trim(),
  ]
    .filter(Boolean)
    .join(" · ");

  const safeReturnLine = sanitizeWinAnsi(senderReturnLine);
  currentPage.drawText(safeReturnLine, {
    x: MARGIN_LEFT,
    y: addressTopY,
    size: 7.2,
    font: fontRegular,
    color: COLOR_MUTED,
  });
  currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: addressTopY - 3 },
    end: { x: MARGIN_LEFT + 235, y: addressTopY - 3 },
    thickness: 0.4,
    color: COLOR_BORDER,
  });

  // Recipient block
  const recipientLines: string[] = [];
  if (data.customer.companyName?.trim()) {
    recipientLines.push(data.customer.companyName.trim());
    const contact = data.customer.contactPerson?.trim() || data.customer.name.trim();
    if (contact && contact !== data.customer.companyName.trim()) {
      recipientLines.push(`z. Hd. ${contact}`);
    }
  } else if (data.customer.name.trim()) {
    recipientLines.push(data.customer.name.trim());
  }
  if (data.customer.street.trim()) {
    recipientLines.push(data.customer.street.trim());
  }
  const cityLine = `${data.customer.postalCode} ${data.customer.city}`.trim();
  if (cityLine) {
    recipientLines.push(cityLine);
  }
  if (data.customer.country && data.customer.country.toUpperCase() !== "DE") {
    recipientLines.push(resolveCountryNameDe(data.customer.country));
  }
  if (data.customer.vatId?.trim()) {
    recipientLines.push(`USt-IdNr.: ${data.customer.vatId.trim()}`);
  }

  let addrY = addressTopY - 18;
  for (let i = 0; i < recipientLines.length; i++) {
    const wrapped = wrapText(
      recipientLines[i],
      i === 0 ? fontBold : fontRegular,
      9.5,
      235
    );
    for (const wLine of wrapped) {
      currentPage.drawText(wLine, {
        x: MARGIN_LEFT,
        y: addrY,
        size: 9.5,
        font: i === 0 ? fontBold : fontRegular,
        color: COLOR_TEXT,
      });
      addrY -= 13;
    }
  }

  // Right Info Block (DIN 5008 Informationsblock)
  const infoBoxX = MARGIN_LEFT + 258;
  const infoBoxW = RIGHT_EDGE - infoBoxX;
  const infoRows: Array<{ label: string; value: string; bold?: boolean }> = [
    {
      label:
        data.type === "CANCELLATION" ? "Stornorechnungsnr.:" : "Rechnungsnummer:",
      value: data.invoiceNumber,
      bold: true,
    },
    {
      label: "Rechnungsdatum:",
      value: formatDateDe(data.issueDate),
    },
  ];

  if (data.servicePeriodStart && data.servicePeriodEnd) {
    infoRows.push({
      label: "Leistungszeitraum:",
      value: `${formatDateDe(data.servicePeriodStart)} – ${formatDateDe(data.servicePeriodEnd)}`,
    });
  } else if (data.serviceDate) {
    infoRows.push({
      label: "Leistungsdatum:",
      value: formatDateDe(data.serviceDate),
    });
  }

  if (data.type === "INVOICE" && data.dueDate) {
    infoRows.push({
      label: "Fälligkeitsdatum:",
      value: formatDateDe(data.dueDate),
    });
  }
  if (data.correctedInvoiceNumber) {
    infoRows.push({
      label: "Zu Rechnung Nr.:",
      value: data.correctedInvoiceNumber,
      bold: true,
    });
  }
  if (data.customer.customerNumber) {
    infoRows.push({
      label: "Kundennummer:",
      value: data.customer.customerNumber,
    });
  }
  if (data.customerReference) {
    infoRows.push({
      label: "Ihre Referenz:",
      value: data.customerReference,
    });
  }
  if (data.buyerReference) {
    infoRows.push({
      label: "Bestell- / Leitweg-ID:",
      value: data.buyerReference,
    });
  }

  const infoBoxPadding = 8;
  const infoRowH = 13.5;
  const infoBoxH = infoRows.length * infoRowH + infoBoxPadding * 2;
  const infoBoxTopY = addressTopY + 4;

  currentPage.drawRectangle({
    x: infoBoxX,
    y: infoBoxTopY - infoBoxH,
    width: infoBoxW,
    height: infoBoxH,
    color: COLOR_BG_SOFT,
    borderColor: COLOR_BORDER,
    borderWidth: 0.75,
  });

  let infoY = infoBoxTopY - infoBoxPadding - 9;
  for (const row of infoRows) {
    currentPage.drawText(sanitizeWinAnsi(row.label), {
      x: infoBoxX + 8,
      y: infoY,
      size: 8.2,
      font: fontRegular,
      color: COLOR_MUTED,
    });
    drawRightAlignedText(
      currentPage,
      row.value,
      RIGHT_EDGE - 8,
      infoY,
      row.bold ? fontBold : fontRegular,
      8.5,
      row.bold ? COLOR_TEXT : COLOR_TEXT
    );
    infoY -= infoRowH;
  }

  // =========================================================================
  // Subject Heading & Intro Text
  // =========================================================================
  let cursorY = Math.min(addrY, infoBoxTopY - infoBoxH) - 24;

  const subjectTitle =
    data.type === "CANCELLATION"
      ? `Stornorechnung Nr. ${data.invoiceNumber}`
      : data.isDraft
        ? "Rechnung (Entwurf – nicht ausgestellt)"
        : `Rechnung Nr. ${data.invoiceNumber}`;

  currentPage.drawText(sanitizeWinAnsi(subjectTitle), {
    x: MARGIN_LEFT,
    y: cursorY,
    size: 14,
    font: fontBold,
    color: data.type === "CANCELLATION" ? COLOR_DANGER : COLOR_TEXT,
  });
  cursorY -= 16;

  if (data.type === "CANCELLATION" && data.correctedInvoiceNumber) {
    currentPage.drawText(
      sanitizeWinAnsi(
        `Korrektur / Vollstornierung zu Rechnung Nr. ${data.correctedInvoiceNumber}`
      ),
      {
        x: MARGIN_LEFT,
        y: cursorY,
        size: 9.5,
        font: fontBold,
        color: COLOR_DANGER,
      }
    );
    cursorY -= 16;
  }

  // Intro text
  const introLines = wrapText(data.introText, fontRegular, 9.5, CONTENT_WIDTH);
  for (const line of introLines) {
    if (line === "") {
      cursorY -= 7;
    } else {
      currentPage.drawText(line, {
        x: MARGIN_LEFT,
        y: cursorY,
        size: 9.5,
        font: fontRegular,
        color: COLOR_TEXT,
      });
      cursorY -= 13;
    }
  }
  cursorY -= 8;

  // =========================================================================
  // Line Items Table (Multi-Page with Repeated Header)
  // =========================================================================
  if (cursorY - 55 < MIN_CONTENT_Y) {
    cursorY = addContinuationPage(true);
  } else {
    cursorY = drawTableHeader(currentPage, cursorY);
  }

  const hasMultipleTaxRates =
    new Set(data.items.map((it) => it.vatRateBps)).size > 1;

  for (let idx = 0; idx < data.items.length; idx++) {
    const item = data.items[idx];
    const descLines = wrapText(item.description, fontRegular, 9, colDescW);

    const subNotes: string[] = [];
    if (item.discountCents !== 0) {
      const pctNum = Number(item.discountPercent);
      const pctLabel = pctNum > 0 ? ` (${pctNum.toString().replace(".", ",")} %)` : "";
      subNotes.push(`Rabatt${pctLabel}: ${formatEurDe(-item.discountCents)}`);
    }
    if (hasMultipleTaxRates) {
      subNotes.push(`USt.-Satz: ${formatVatRateDe(item.vatRateBps)}`);
    }

    const rowHeight =
      Math.max(1, descLines.length) * 12 +
      (subNotes.length > 0 ? 11 : 0) +
      10;

    if (cursorY - rowHeight < MIN_CONTENT_Y) {
      cursorY = addContinuationPage(true);
    }

    const rowTopY = cursorY;

    // Pos.
    currentPage.drawText(String(item.position), {
      x: colPosX + 4,
      y: rowTopY - 10,
      size: 9,
      font: fontRegular,
      color: COLOR_MUTED,
    });

    // Description
    let descY = rowTopY - 10;
    for (const dLine of descLines) {
      currentPage.drawText(dLine, {
        x: colDescX,
        y: descY,
        size: 9,
        font: fontRegular,
        color: COLOR_TEXT,
      });
      descY -= 12;
    }

    if (subNotes.length > 0) {
      currentPage.drawText(sanitizeWinAnsi(subNotes.join(" · ")), {
        x: colDescX,
        y: descY + 1,
        size: 7.8,
        font: fontRegular,
        color: COLOR_MUTED,
      });
    }

    // Menge (Quantity + Unit)
    const qtyText = `${formatQuantityDe(item.quantity)} ${item.unit}`;
    drawRightAlignedText(
      currentPage,
      qtyText,
      colQtyRightX,
      rowTopY - 10,
      fontRegular,
      9,
      COLOR_TEXT
    );

    // Einzelpreis
    drawRightAlignedText(
      currentPage,
      formatEurDe(item.unitPriceNetCents),
      colUnitRightX,
      rowTopY - 10,
      fontRegular,
      9,
      COLOR_TEXT
    );

    // Gesamt (Netto)
    drawRightAlignedText(
      currentPage,
      formatEurDe(item.lineNetCents),
      colTotalRightX - 4,
      rowTopY - 10,
      fontBold,
      9,
      COLOR_TEXT
    );

    cursorY = rowTopY - rowHeight;

    // Subtle row divider
    currentPage.drawLine({
      start: { x: MARGIN_LEFT, y: cursorY + 3 },
      end: { x: RIGHT_EDGE, y: cursorY + 3 },
      thickness: 0.45,
      color: COLOR_BORDER,
    });
  }

  // =========================================================================
  // Totals Summary Block (Netto + VAT per rate + Brutto)
  // =========================================================================
  const summaryLinesNeeded =
    3 + data.taxBreakdown.length + (data.totalDiscountCents !== 0 ? 1 : 0);
  const summaryBlockHeight = summaryLinesNeeded * 16 + 26;

  if (cursorY - summaryBlockHeight < MIN_CONTENT_Y) {
    cursorY = addContinuationPage(false);
  }

  cursorY -= 8;
  const summaryLabelX = MARGIN_LEFT + 205;

  if (data.totalDiscountCents !== 0) {
    currentPage.drawText("Enthaltener Gesamtrabatt (Netto):", {
      x: summaryLabelX,
      y: cursorY,
      size: 8.5,
      font: fontRegular,
      color: COLOR_MUTED,
    });
    drawRightAlignedText(
      currentPage,
      formatEurDe(-data.totalDiscountCents),
      RIGHT_EDGE - 4,
      cursorY,
      fontRegular,
      8.5,
      COLOR_MUTED
    );
    cursorY -= 15;
  }

  // Zwischensumme (Netto)
  currentPage.drawText("Zwischensumme (Netto)", {
    x: summaryLabelX,
    y: cursorY,
    size: 9.2,
    font: fontRegular,
    color: COLOR_TEXT,
  });
  drawRightAlignedText(
    currentPage,
    formatEurDe(data.subtotalNetCents),
    RIGHT_EDGE - 4,
    cursorY,
    fontRegular,
    9.2,
    COLOR_TEXT
  );
  cursorY -= 15;

  // VAT breakdown rows per rate (§ 14 Abs. 4 Nr. 8 UStG)
  for (const bucket of data.taxBreakdown) {
    const label =
      data.taxBreakdown.length > 1
        ? `zzgl. Umsatzsteuer (${formatVatRateDe(bucket.vatRateBps)} auf ${formatEurDe(bucket.netCents)})`
        : `zzgl. Umsatzsteuer (${formatVatRateDe(bucket.vatRateBps)})`;

    currentPage.drawText(sanitizeWinAnsi(label), {
      x: summaryLabelX,
      y: cursorY,
      size: 9,
      font: fontRegular,
      color: COLOR_MUTED,
    });
    drawRightAlignedText(
      currentPage,
      formatEurDe(bucket.vatCents),
      RIGHT_EDGE - 4,
      cursorY,
      fontRegular,
      9,
      COLOR_TEXT
    );
    cursorY -= 15;
  }

  // Highlighted Gesamtbetrag (Brutto)
  cursorY -= 4;
  currentPage.drawRectangle({
    x: summaryLabelX - 8,
    y: cursorY - 7,
    width: RIGHT_EDGE - (summaryLabelX - 8),
    height: 24,
    color: COLOR_ACCENT_SOFT,
    borderColor: COLOR_ACCENT,
    borderWidth: 0.75,
  });
  currentPage.drawText("Gesamtbetrag (Brutto)", {
    x: summaryLabelX,
    y: cursorY + 2,
    size: 10.5,
    font: fontBold,
    color: COLOR_TEXT,
  });
  drawRightAlignedText(
    currentPage,
    formatEurDe(data.totalGrossCents),
    RIGHT_EDGE - 4,
    cursorY + 2,
    fontBold,
    11,
    data.type === "CANCELLATION" ? COLOR_DANGER : COLOR_TEXT
  );
  cursorY -= 26;

  // =========================================================================
  // Tax Legal Notice (for § 19 UStG / Reverse-Charge / Exempt Non-EU)
  // =========================================================================
  if (data.taxLegalNotice?.trim()) {
    const noticeLines = wrapText(
      data.taxLegalNotice.trim(),
      fontBold,
      8.5,
      CONTENT_WIDTH - 16
    );
    const noticeBoxH = noticeLines.length * 12 + 14;
    if (cursorY - noticeBoxH < MIN_CONTENT_Y) {
      cursorY = addContinuationPage(false);
    }

    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: cursorY - noticeBoxH,
      width: CONTENT_WIDTH,
      height: noticeBoxH,
      color: COLOR_BG_SOFT,
      borderColor: COLOR_BORDER,
      borderWidth: 0.75,
    });

    let nY = cursorY - 14;
    for (const nLine of noticeLines) {
      currentPage.drawText(nLine, {
        x: MARGIN_LEFT + 8,
        y: nY,
        size: 8.5,
        font: fontBold,
        color: COLOR_TEXT,
      });
      nY -= 12;
    }
    cursorY -= noticeBoxH + 14;
  }

  // =========================================================================
  // Payment Terms & Bank Details Block
  // =========================================================================
  const paymentLines: string[] = [];
  if (data.type === "INVOICE") {
    const dueStr = data.dueDate ? ` (bis zum ${formatDateDe(data.dueDate)})` : "";
    const termsSentence =
      data.paymentTermsDays > 0
        ? `Zahlungsbedingungen: Bitte überweisen Sie den Gesamtbetrag innerhalb von ${data.paymentTermsDays} Tagen${dueStr} ohne Abzug auf das unten angegebene Konto.`
        : `Zahlungsbedingungen: Der Gesamtbetrag ist sofort ohne Abzug fällig.`;
    paymentLines.push(...wrapText(termsSentence, fontRegular, 9, CONTENT_WIDTH));
  }

  const bankDetailsHeight = data.type === "INVOICE" ? paymentLines.length * 12.5 + 70 : 0;
  if (bankDetailsHeight > 0) {
    if (cursorY - bankDetailsHeight < MIN_CONTENT_Y) {
      cursorY = addContinuationPage(false);
    }

    for (const pLine of paymentLines) {
      currentPage.drawText(pLine, {
        x: MARGIN_LEFT,
        y: cursorY,
        size: 9,
        font: fontRegular,
        color: COLOR_TEXT,
      });
      cursorY -= 12.5;
    }

    cursorY -= 6;
    const bankBoxH = 56;
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: cursorY - bankBoxH,
      width: CONTENT_WIDTH,
      height: bankBoxH,
      color: COLOR_BG_SOFT,
      borderColor: COLOR_BORDER,
      borderWidth: 0.75,
    });

    const bankLeftX = MARGIN_LEFT + 10;
    const bankMidX = MARGIN_LEFT + 235;
    const bankRow1Y = cursorY - 15;
    const bankRow2Y = cursorY - 30;
    const bankRow3Y = cursorY - 45;

    currentPage.drawText(
      sanitizeWinAnsi(`Kontoinhaber: ${data.issuer.bankAccountHolder || "—"}`),
      { x: bankLeftX, y: bankRow1Y, size: 8.5, font: fontRegular, color: COLOR_TEXT }
    );
    currentPage.drawText(
      sanitizeWinAnsi(`Bank: ${data.issuer.bankName || "—"}`),
      { x: bankMidX, y: bankRow1Y, size: 8.5, font: fontRegular, color: COLOR_TEXT }
    );
    currentPage.drawText(
      sanitizeWinAnsi(
        `IBAN: ${data.issuer.bankIban ? formatIbanGrouped(data.issuer.bankIban) : "—"}`
      ),
      { x: bankLeftX, y: bankRow2Y, size: 8.5, font: fontBold, color: COLOR_TEXT }
    );
    currentPage.drawText(
      sanitizeWinAnsi(`BIC: ${data.issuer.bankBic || "—"}`),
      { x: bankMidX, y: bankRow2Y, size: 8.5, font: fontRegular, color: COLOR_TEXT }
    );
    currentPage.drawText(
      sanitizeWinAnsi(
        `Verwendungszweck: ${data.paymentReference || data.invoiceNumber}`
      ),
      { x: bankLeftX, y: bankRow3Y, size: 8.5, font: fontBold, color: COLOR_ACCENT }
    );

    cursorY -= bankBoxH + 14;
  }

  // Optional Free-Text Notes
  if (data.notes?.trim()) {
    const noteLines = wrapText(
      `Hinweis: ${data.notes.trim()}`,
      fontRegular,
      8.5,
      CONTENT_WIDTH
    );
    const needed = noteLines.length * 12 + 10;
    if (cursorY - needed < MIN_CONTENT_Y) {
      cursorY = addContinuationPage(false);
    }
    for (const nLine of noteLines) {
      currentPage.drawText(nLine, {
        x: MARGIN_LEFT,
        y: cursorY,
        size: 8.5,
        font: fontRegular,
        color: COLOR_MUTED,
      });
      cursorY -= 12;
    }
    cursorY -= 6;
  }

  // =========================================================================
  // Outro & Signature Block
  // =========================================================================
  const outroLines = wrapText(data.outroText, fontRegular, 9.2, CONTENT_WIDTH);
  const signatureHeight = outroLines.length * 13 + 56;
  if (cursorY - signatureHeight < MIN_CONTENT_Y) {
    cursorY = addContinuationPage(false);
  }

  for (const oLine of outroLines) {
    if (oLine === "") {
      cursorY -= 6;
    } else {
      currentPage.drawText(oLine, {
        x: MARGIN_LEFT,
        y: cursorY,
        size: 9.2,
        font: fontRegular,
        color: COLOR_TEXT,
      });
      cursorY -= 13;
    }
  }

  cursorY -= 10;
  currentPage.drawText("Mit freundlichen Grüßen", {
    x: MARGIN_LEFT,
    y: cursorY,
    size: 9.2,
    font: fontRegular,
    color: COLOR_TEXT,
  });
  cursorY -= 18;
  currentPage.drawText(
    sanitizeWinAnsi(data.issuer.managingDirector || data.issuer.legalName),
    {
      x: MARGIN_LEFT,
      y: cursorY,
      size: 9.5,
      font: fontBold,
      color: COLOR_TEXT,
    }
  );
  cursorY -= 12;
  currentPage.drawText(
    sanitizeWinAnsi(`Geschäftsführer · ${data.issuer.legalName}`),
    {
      x: MARGIN_LEFT,
      y: cursorY,
      size: 8.3,
      font: fontRegular,
      color: COLOR_MUTED,
    }
  );

  // =========================================================================
  // Second Pass: Footer (§ 35a GmbHG + "Seite x von y") & Draft Watermark
  // =========================================================================
  const totalPages = pages.length;

  pages.forEach((page, pageIdx) => {
    // Draft preview watermark
    if (data.isDraft) {
      page.drawText("ENTWURF / VORSCHAU", {
        x: 135,
        y: 350,
        size: 42,
        font: fontBold,
        color: rgb(0.9, 0.91, 0.94),
        rotate: degrees(35),
      });
    }

    // Horizontal footer divider
    page.drawLine({
      start: { x: MARGIN_LEFT, y: FOOTER_TOP_Y - 2 },
      end: { x: RIGHT_EDGE, y: FOOTER_TOP_Y - 2 },
      thickness: 0.6,
      color: COLOR_BORDER,
    });

    const fSize = 7.1;
    const fLineH = 9.8;
    const col1X = MARGIN_LEFT;
    const col2X = MARGIN_LEFT + 162;
    const col3X = MARGIN_LEFT + 314;

    // Column 1: Company Name, Legal Form, Seat / Address
    const col1Lines = [
      data.issuer.legalName,
      data.issuer.street,
      `${data.issuer.postalCode} ${data.issuer.city}`.trim(),
      `Sitz der Gesellschaft: ${data.issuer.city || "—"}`,
    ].filter(Boolean);

    // Column 2: Contact & Tax Identifiers (§ 14 UStG)
    const col2Lines = [
      data.issuer.email ? `E-Mail: ${data.issuer.email}` : "",
      data.issuer.phone ? `Tel.: ${data.issuer.phone}` : "",
      data.issuer.taxNumber ? `Steuernummer: ${data.issuer.taxNumber}` : "",
      data.issuer.vatId ? `USt-IdNr.: ${data.issuer.vatId}` : "",
    ].filter(Boolean);

    // Column 3: Commercial Register (§ 35a GmbHG) & Bank
    const col3Lines = [
      data.issuer.managingDirector
        ? `Geschäftsführer: ${data.issuer.managingDirector}`
        : "",
      data.issuer.registerCourt
        ? `Registergericht: ${data.issuer.registerCourt}`
        : "",
      data.issuer.registerNumber
        ? `Handelsregister: ${data.issuer.registerNumber}`
        : "",
      data.issuer.bankIban
        ? `IBAN: ${formatIbanGrouped(data.issuer.bankIban)}`
        : "",
    ].filter(Boolean);

    const drawFooterCol = (lines: string[], x: number) => {
      let y = FOOTER_TOP_Y - 13;
      lines.slice(0, 4).forEach((ln, i) => {
        page.drawText(sanitizeWinAnsi(ln), {
          x,
          y,
          size: fSize,
          font: i === 0 && x === col1X ? fontBold : fontRegular,
          color: COLOR_MUTED,
        });
        y -= fLineH;
      });
    };

    drawFooterCol(col1Lines, col1X);
    drawFooterCol(col2Lines, col2X);
    drawFooterCol(col3Lines, col3X);

    // Pagination "Seite x von y"
    drawRightAlignedText(
      page,
      `Seite ${pageIdx + 1} von ${totalPages}`,
      RIGHT_EDGE,
      FOOTER_TOP_Y - 62,
      fontRegular,
      7.5,
      COLOR_LIGHT
    );
  });

  return pdfDoc.save();
}
