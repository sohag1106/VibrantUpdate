import { jsPDF } from 'jspdf';
import { Order } from '../types';

/**
 * Generates and downloads a beautifully formatted, professional business Invoice PDF
 * for the restaurant VibrantFood.
 */
export function downloadInvoicePdf(order: Order, cashierNameOverride?: string) {
  const cashier = cashierNameOverride || order.cashierName || (typeof localStorage !== 'undefined' ? localStorage.getItem('vibrant_cashier_name') : null) || 'Ratul';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Color Palette
  const colorPrimary = [0, 0, 0]; // Pure black
  const colorAccent = [0, 0, 0]; // Pure black
  const colorGray = [0, 0, 0]; // Pure black
  const bgLight = [245, 245, 245]; // Light background

  // 1. Header Area
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('VibrantFood', 14, 20);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text('Dhulipara, Cumilla', 14, 25);
  doc.text('Hotline: 01795711270', 14, 29);
  doc.text('Email: vibrantfood2026@gmail.com', 14, 33);

  // Invoice Meta on Top Right
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(colorAccent[0], colorAccent[1], colorAccent[2]);
  doc.text('INVOICE', 196, 20, { align: 'right' });

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text(`Token No: ${order.tokenNumber || '001'}`, 196, 25, { align: 'right' });
  doc.text(`Order Time: ${new Date(order.createdAt).toLocaleString()}`, 196, 29, { align: 'right' });
  doc.text(`Type: ${order.orderType.toUpperCase()} ${order.tableNumber ? `(Table ${order.tableNumber})` : ''}`, 196, 33, { align: 'right' });
  doc.text(`Cashier: ${cashier}`, 196, 37, { align: 'right' });

  let yPos = 45;
  doc.setDrawColor(226, 232, 240); // slate-200 border
  doc.line(14, yPos, 196, yPos);

  yPos += 7;

  // 2. Customer Section
  if (order.customerName || order.customerMobile || order.customerLocation) {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.text('Billed To:', 14, yPos);
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    const custText = [
      order.customerName || 'Guest Customer',
      order.customerMobile ? `Mobile: ${order.customerMobile}` : '',
      order.customerLocation ? `Address: ${order.customerLocation}` : ''
    ].filter(Boolean).join(' | ');
    doc.text(custText, 14, yPos + 4.5);
    yPos += 13;
  } else {
    yPos += 2;
  }

  // 3. Table Header
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.rect(14, yPos, 182, 8, 'F');
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text('Item Description', 16, yPos + 5.5);
  doc.text('Qty', 115, yPos + 5.5, { align: 'center' });
  doc.text('Unit Price', 145, yPos + 5.5, { align: 'right' });
  doc.text('Total', 194, yPos + 5.5, { align: 'right' });

  yPos += 8;

  // 4. Table Rows
  order.items.forEach((item) => {
    // If we exceed safe A4 space, simple page break can be handled. But generally bills are small.
    const modifierSum = item.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
    const basePrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
    const singleItemTotal = basePrice + modifierSum;
    const lineTotal = singleItemTotal * item.quantity;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    const displaySize = item.selectedVariant?.name || null;
    const displayName = item.product.name + (displaySize ? ` (Size: ${displaySize})` : '');
    doc.text(displayName, 16, yPos + 5);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`${item.quantity}x`, 115, yPos + 5, { align: 'center' });
    doc.setFontSize(9);
    doc.text(`৳${singleItemTotal.toFixed(2)}`, 145, yPos + 5, { align: 'right' });
    doc.text(`৳${lineTotal.toFixed(2)}`, 194, yPos + 5, { align: 'right' });

    yPos += 6.5;

    // Modifiers or notes
    const modifiersText = item.selectedModifiers.map(m => `+ ${m.name}`).join(', ');
    if (modifiersText) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.text(modifiersText, 16, yPos);
      yPos += 4;
    }
    if (item.notes) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0); // black text
      doc.text(`Note: "${item.notes}"`, 16, yPos);
      yPos += 4;
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(14, yPos, 196, yPos);
    yPos += 2.5;
  });

  yPos += 2;

  // 5. Total Calculations Side Block
  doc.setDrawColor(203, 213, 225);
  doc.line(14, yPos, 196, yPos);
  yPos += 6;

  // Subtotal
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text('Subtotal:', 145, yPos, { align: 'right' });
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text(`৳${order.subtotal.toFixed(2)}`, 194, yPos, { align: 'right' });
  yPos += 5.5;

  // Discount
  if (order.discount > 0) {
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    const discountLabel = order.discountType === 'percentage' 
      ? `Discount (${order.discountValue}%):` 
      : 'Discount:';
    doc.text(discountLabel, 145, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0); // Black color for savings/discounts
    doc.text(`-৳${order.discount.toFixed(2)}`, 194, yPos, { align: 'right' });
    yPos += 5.5;
  }

  // Tax
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text('Tax (0%):', 145, yPos, { align: 'right' });
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text('৳0.00', 194, yPos, { align: 'right' });
  yPos += 6.5;

  // Grand Total Highlight
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.rect(125, yPos - 1.5, 71, 8.5, 'F');
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colorAccent[0], colorAccent[1], colorAccent[2]);
  doc.text('GRAND TOTAL:', 145, yPos + 4.5, { align: 'right' });
  doc.text(`৳${order.total.toFixed(2)}`, 194, yPos + 4.5, { align: 'right' });

  yPos += 18;

  // 6. Footer Signature
  doc.setDrawColor(226, 232, 240);
  doc.line(14, yPos, 196, yPos);
  yPos += 6;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.text('Dhulipara Chowmuny, Medical College Road, Cumilla', 105, yPos, { align: 'center' });
  doc.text('Thank you for your order.', 105, yPos + 4.5, { align: 'center' });
  doc.text('Hotline: 01795711270', 105, yPos + 9, { align: 'center' });
  doc.text('Powered by BildovaTech', 105, yPos + 13.5, { align: 'center' });

  // Download Action
  doc.save(`Invoice_${order.orderNumber}.pdf`);
}

/**
 * Generates and downloads a beautifully formatted, professional Kitchen Order Ticket (KOT) PDF
 * strictly designed for kitchen staff: clean, bold, minimal, and kitchen-focused.
 */
export function downloadKitchenKotPdf(order: Order) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const colorPrimary = [0, 0, 0]; // Pure black

  // Resolve Order Type Header
  let orderTypeHeader = 'DINE-IN';
  if (order.orderType === 'takeaway') {
    orderTypeHeader = 'TAKEAWAY';
  } else if (order.orderType === 'pickup') {
    orderTypeHeader = 'ONLINE ORDER';
  } else if (order.orderType === 'dine-in') {
    orderTypeHeader = 'DINE-IN';
  } else {
    orderTypeHeader = String(order.orderType || 'DINE-IN').toUpperCase();
  }

  const tableHeader = (order.orderType === 'dine-in' && order.tableNumber)
    ? `TABLE ${String(order.tableNumber).padStart(2, '0')}`
    : '';

  const tokenFormatted = order.tokenNumber
    ? `#${String(order.tokenNumber).replace(/^#/, '').padStart(3, '0')}`
    : null;

  let yPos = 25;

  // Header: Centered Order Type
  doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(orderTypeHeader, 105, yPos, { align: 'center' });

  // Header: Centered Table Number (if Dine-In)
  if (tableHeader) {
    yPos += 8;
    doc.setFontSize(18);
    doc.text(tableHeader, 105, yPos, { align: 'center' });
  }

  // Header: Centered Token Number (if present)
  if (tokenFormatted) {
    yPos += 8;
    doc.setFontSize(20);
    doc.text(tokenFormatted, 105, yPos, { align: 'center' });
  }

  yPos += 10;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Order Items
  order.items.forEach((item) => {
    // 1. Item Main Line (Qty x Product Name)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`${item.quantity} x ${item.product.name}`, 25, yPos);
    yPos += 6;

    // 2. Add-ons
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      item.selectedModifiers.forEach(m => {
        doc.text(`+ ${m.name}`, 32, yPos);
        yPos += 5;
      });
    }

    // 3. Variant
    if (item.selectedVariant && item.selectedVariant.name) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`Variant: ${item.selectedVariant.name}`, 32, yPos);
      yPos += 5;
    }

    // 4. Special Note
    if (item.notes && item.notes.trim()) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Special Note:', 32, yPos);
      yPos += 5;
      doc.text(item.notes.trim(), 32, yPos);
      yPos += 5;
    }

    yPos += 4;
  });

  // Global Special Instructions
  if (order.customerLocation && order.orderType !== 'dine-in') {
    yPos += 6;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`*** ${order.customerLocation.toUpperCase()} ***`, 105, yPos, { align: 'center' });
  }

  doc.save(`KOT_${order.orderNumber}.pdf`);
}
