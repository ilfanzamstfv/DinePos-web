import jsPDF from 'jspdf';
import { CartItem, Order } from './types';
import { formatPrice, formatDate } from './utils';

const BRAND_NAME = 'DinePos';
const BRAND_TAGLINE = 'Modern F&B Point of Sale';
const FOOTER_TEXT = 'Thank you for dining with us! See you again.';

/**
 * Draw a horizontal rule on the PDF
 */
function drawHR(doc: jsPDF, y: number, margin: number, width: number): void {
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, margin + width, y);
}

/**
 * Generate a PDF receipt for a completed order
 */
export function generateReceiptPdf(order: Order): void {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200], // standard 80mm receipt width, dynamic height
    });

    const margin = 5;
    const pageWidth = 80;
    const contentWidth = pageWidth - margin * 2;
    let y = 8;

    // ── Header ──────────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(93, 134, 108); // sage green
    doc.text(BRAND_NAME, pageWidth / 2, y, { align: 'center' });

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(BRAND_TAGLINE, pageWidth / 2, y, { align: 'center' });

    y += 6;
    drawHR(doc, y, margin, contentWidth);
    y += 4;

    // ── Order Meta ───────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text('RECEIPT', pageWidth / 2, y, { align: 'center' });

    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);

    const metaLines: [string, string][] = [
        ['Order ID', order.id],
        ['Date', formatDate(new Date(order.timestamp))],
        ['Status', order.status.toUpperCase()],
    ];

    for (const [label, value] of metaLines) {
        doc.text(label, margin, y);
        doc.text(value, margin + contentWidth, y, { align: 'right' });
        y += 4;
    }

    y += 2;
    drawHR(doc, y, margin, contentWidth);
    y += 4;

    // ── Items ────────────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(40, 40, 40);
    doc.text('Item', margin, y);
    doc.text('Qty', margin + 40, y, { align: 'center' });
    doc.text('Price', margin + contentWidth, y, { align: 'right' });
    y += 3;
    drawHR(doc, y, margin, contentWidth);
    y += 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    for (const item of order.items) {
        const lineTotal = item.price * item.quantity;
        // Wrap long names
        const name = item.name.length > 22 ? item.name.substring(0, 20) + '…' : item.name;
        doc.setTextColor(40, 40, 40);
        doc.text(name, margin, y);
        doc.setTextColor(80, 80, 80);
        doc.text(`x${item.quantity}`, margin + 40, y, { align: 'center' });
        doc.text(formatPrice(lineTotal), margin + contentWidth, y, { align: 'right' });
        y += 4;
    }

    y += 1;
    drawHR(doc, y, margin, contentWidth);
    y += 4;

    // ── Totals ───────────────────────────────────────────────────────────────────
    const totals: [string, string, boolean][] = [
        ['Subtotal', formatPrice(order.subtotal), false],
        ['Tax (10%)', formatPrice(order.tax), false],
        ['TOTAL', formatPrice(order.total), true],
    ];

    for (const [label, value, bold] of totals) {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(bold ? 9 : 7);
        doc.setTextColor(bold ? 93 : 80, bold ? 134 : 80, bold ? 108 : 80);
        doc.text(label, margin, y);
        doc.text(value, margin + contentWidth, y, { align: 'right' });
        y += bold ? 5 : 4;
    }

    y += 3;
    drawHR(doc, y, margin, contentWidth);
    y += 6;

    // ── Footer ───────────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(FOOTER_TEXT, pageWidth / 2, y, { align: 'center' });

    // ── Save ─────────────────────────────────────────────────────────────────────
    doc.save(`receipt-${order.id}.pdf`);
}
