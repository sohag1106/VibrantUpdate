import { Order } from '../types';

/**
 * Helper to format price in printer-safe ASCII (BDT prefix, no special font symbols).
 * Specifically designed for 58mm ESC/POS thermal printing.
 */
export function formatReceiptPrice(val: number): string {
  return `BDT${val.toFixed(2)}`;
}

/**
 * Format timestamp into DD-MM-YYYY HH:mm standard thermal format
 */
export function formatReceiptDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}

/**
 * Redesigned 58mm ESC/POS Customer Invoice / Customer Receipt Generator
 * Optimized for 58mm width (~48mm printable area / 384 dots).
 * Monospaced, aligned, printer-safe, inspired by modern food-delivery order receipts.
 */
export function generate58mmThermalReceiptHtml(
  order: Order, 
  cashierNameOverride?: string,
  paymentMethodOverride?: string
): string {
  const cashier = cashierNameOverride || order.cashierName || (typeof localStorage !== 'undefined' ? localStorage.getItem('vibrant_cashier_name') : null) || 'Ratul';
  
  // Resolve payment method dynamically
  const rawPaymentMethod = paymentMethodOverride || order.paymentMethod || 'CASH';
  const paymentMethodDisplay = (rawPaymentMethod === 'mobile_pay' ? 'ONLINE PAID' : rawPaymentMethod).toUpperCase();

  // Resolve Order Type Header
  let orderTypeHeader = 'DINE-IN';
  if (order.orderType === 'takeaway') {
    orderTypeHeader = 'TAKEAWAY';
  } else if (order.orderType === 'pickup') {
    orderTypeHeader = 'ONLINE ORDER';
  } else if (order.orderType === 'dine-in') {
    orderTypeHeader = 'DINE-IN';
  } else {
    orderTypeHeader = String(order.orderType).toUpperCase();
  }

  const tableHeader = (order.orderType === 'dine-in' && order.tableNumber) 
    ? `TABLE ${String(order.tableNumber).padStart(2, '0')}` 
    : '';

  const tokenFormatted = `#${String(order.tokenNumber || '001').replace(/^#/, '')}`;
  const formattedDate = formatReceiptDate(order.createdAt || new Date().toISOString());

  // Build items section
  const itemsHtml = order.items.map((item) => {
    const modifierSum = item.selectedModifiers ? item.selectedModifiers.reduce((acc, m) => acc + m.price, 0) : 0;
    const baseUnitPrice = (item.selectedVariant ? item.selectedVariant.price : item.product.price) + modifierSum;
    const lineTotal = baseUnitPrice * item.quantity;
    
    // Variant name
    const variantName = item.selectedVariant?.name || null;

    // Modifiers / Add-ons HTML
    const modifiersHtml = (item.selectedModifiers && item.selectedModifiers.length > 0)
      ? item.selectedModifiers.map(m => `
          <div class="addon-line">
            <span class="addon-name">+ ${m.name}</span>
            <span class="addon-price">${formatReceiptPrice(m.price)}</span>
          </div>
        `).join('')
      : '';

    // Variant line HTML
    const variantHtml = variantName
      ? `<div class="variant-line">Variant: ${variantName}</div>`
      : '';

    // Note HTML
    const noteHtml = item.notes
      ? `<div class="note-line">Special Note:<br/>${item.notes}</div>`
      : '';

    return `
      <div class="item-block">
        <div class="item-main-line">
          <div class="item-qty-name">
            <span class="item-qty">${item.quantity} x</span>
            <span class="item-name">${item.product.name}</span>
          </div>
          <span class="item-price">${formatReceiptPrice(lineTotal)}</span>
        </div>
        ${variantHtml}
        ${modifiersHtml}
        ${noteHtml}
      </div>
    `;
  }).join('');

  // Special instructions (from customer location or notes if applicable)
  const specialInstructions = order.customerLocation && order.orderType !== 'dine-in'
    ? `*** DELIVERY: ${order.customerLocation.toUpperCase()} ***`
    : '';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Customer Receipt - ${order.orderNumber}</title>
    <style>
      @page {
        size: 58mm auto;
        margin: 0mm;
      }
      *, *:before, *:after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: #000000 !important;
        font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body {
        width: 58mm;
        max-width: 58mm;
        margin: 0 auto;
        padding: 3mm 2mm;
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 11px;
        line-height: 1.25;
        font-weight: 700;
        overflow-x: hidden;
      }
      
      /* UTILITIES & ALIGNMENT */
      .center {
        text-align: center;
      }
      .left {
        text-align: left;
      }
      .right {
        text-align: right;
      }
      .bold {
        font-weight: 900 !important;
      }
      
      /* DIVIDERS */
      .divider {
        border-top: 1px dashed #000000;
        margin: 6px 0;
        width: 100%;
        line-height: 1;
        font-size: 10px;
        letter-spacing: -0.5px;
        white-space: nowrap;
        overflow: hidden;
      }
      .double-divider {
        border-top: 2px solid #000000;
        margin: 6px 0;
        width: 100%;
      }
      .equals-divider {
        border-top: 2px solid #000000;
        border-bottom: 2px solid #000000;
        padding: 2px 0;
        margin: 6px 0;
      }

      /* HEADER SECTION */
      .header-section {
        text-align: center;
        margin-bottom: 4px;
      }
      .order-type-title {
        font-size: 15px;
        font-weight: 900 !important;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        line-height: 1.2;
      }
      .table-title {
        font-size: 13px;
        font-weight: 900 !important;
        letter-spacing: 0.5px;
        margin-top: 1px;
      }
      .token-container {
        margin: 6px 0;
        text-align: center;
      }
      .token-number {
        font-size: 20px;
        font-weight: 900 !important;
        letter-spacing: 1px;
        display: inline-block;
      }
      .receipt-title {
        font-size: 12px;
        font-weight: 900 !important;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        padding: 2px 0;
      }
      .store-name {
        font-size: 13px;
        font-weight: 900 !important;
        letter-spacing: 0.5px;
        margin-top: 2px;
      }
      .date-time {
        font-size: 10px;
        font-weight: 700;
        margin-top: 2px;
      }

      /* CUSTOMER INFO */
      .customer-section {
        margin: 4px 0;
        font-size: 10.5px;
        line-height: 1.3;
      }
      .customer-label {
        font-size: 10px;
        font-weight: 700;
      }
      .customer-name {
        font-size: 12px;
        font-weight: 900 !important;
        word-break: break-word;
      }
      .customer-extra {
        font-size: 10px;
        font-weight: 700;
      }

      /* PAYMENT BOX */
      .payment-box-wrapper {
        margin: 6px 0;
        text-align: center;
      }
      .payment-box {
        display: block;
        border: 1.5px solid #000000;
        padding: 3px 6px;
        font-size: 12px;
        font-weight: 900 !important;
        letter-spacing: 1px;
        text-transform: uppercase;
        text-align: center;
        background: #ffffff;
      }

      /* ITEMS SECTION */
      .items-container {
        margin: 6px 0;
      }
      .item-block {
        margin-bottom: 6px;
        padding-bottom: 4px;
        border-bottom: 1px dotted #000000;
      }
      .item-block:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .item-main-line {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 11px;
        font-weight: 900 !important;
        gap: 4px;
      }
      .item-qty-name {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        flex: 1;
        min-width: 0;
      }
      .item-qty {
        font-weight: 900 !important;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .item-name {
        font-weight: 900 !important;
        word-break: break-word;
      }
      .item-price {
        font-weight: 900 !important;
        white-space: nowrap;
        text-align: right;
        flex-shrink: 0;
      }
      .variant-line {
        font-size: 9.5px;
        font-weight: 700;
        padding-left: 18px;
        margin-top: 1px;
      }
      .addon-line {
        display: flex;
        justify-content: space-between;
        font-size: 9.5px;
        font-weight: 700;
        padding-left: 14px;
        margin-top: 1px;
      }
      .addon-name {
        word-break: break-word;
      }
      .addon-price {
        white-space: nowrap;
        text-align: right;
      }
      .note-line {
        font-size: 9px;
        font-weight: 700;
        font-style: italic;
        padding-left: 14px;
        margin-top: 2px;
        word-break: break-word;
      }
      .special-instruction-box {
        margin: 6px 0;
        text-align: center;
        font-size: 10px;
        font-weight: 900 !important;
        text-transform: uppercase;
        border: 1px dashed #000000;
        padding: 3px;
        word-break: break-word;
      }

      /* BILLING SECTION */
      .billing-section {
        margin: 6px 0;
        font-size: 10.5px;
      }
      .billing-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 2px 0;
        font-weight: 700;
      }
      .billing-label {
        flex: 1;
      }
      .billing-value {
        text-align: right;
        white-space: nowrap;
        font-weight: 900 !important;
      }

      /* TOTAL BLOCK */
      .total-container {
        border-top: 2px solid #000000;
        border-bottom: 2px solid #000000;
        padding: 4px 0;
        margin: 6px 0;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 900 !important;
        letter-spacing: 0.5px;
      }
      .total-label {
        font-weight: 900 !important;
      }
      .total-value {
        font-weight: 900 !important;
        white-space: nowrap;
      }
      
      .vat-info-row {
        display: flex;
        justify-content: space-between;
        font-size: 9.5px;
        font-weight: 700;
        margin-top: 3px;
      }

      /* FOOTER */
      .footer-section {
        text-align: center;
        margin-top: 10px;
        padding-top: 6px;
        border-top: 1px dashed #000000;
        font-size: 9px;
        line-height: 1.4;
      }
      .footer-address {
        font-size: 9.5px;
        font-weight: 700;
        margin-bottom: 4px;
        line-height: 1.35;
      }
      .footer-thankyou {
        font-size: 10px;
        font-weight: 900 !important;
        margin-bottom: 2px;
      }
      .footer-hotline {
        font-size: 9.5px;
        font-weight: 900 !important;
        margin-bottom: 3px;
      }
      .footer-powered {
        font-size: 8px;
        font-weight: 700;
        margin-top: 4px;
        letter-spacing: 0.2px;
      }

      @media print {
        body {
          padding: 1mm 1mm;
          margin: 0;
          width: 58mm;
        }
      }
    </style>
  </head>
  <body>
    <!-- 3. HEADER: Dynamic Order Type & Table -->
    <div class="header-section">
      <div class="order-type-title">${orderTypeHeader}</div>
      ${tableHeader ? `<div class="table-title">${tableHeader}</div>` : ''}
    </div>

    <!-- 4. TOKEN NUMBER: Large, Bold, Centered -->
    <div class="token-container">
      <div class="token-number">${tokenFormatted}</div>
    </div>

    <!-- 5. RECEIPT TITLE -->
    <div class="divider">--------------------------------</div>
    <div class="center bold receipt-title">CUSTOMER RECEIPT</div>
    <div class="divider">--------------------------------</div>

    <!-- 6. STORE INFORMATION & DATE/TIME -->
    <div class="center">
      <div class="store-name">Vibrant</div>
      <div class="date-time">${formattedDate}</div>
    </div>
    <div class="divider">--------------------------------</div>

    <!-- 7. CUSTOMER INFORMATION (Only if exists) -->
    ${order.customerName ? `
    <div class="customer-section left">
      <div class="customer-label">Customer:</div>
      <div class="customer-name">${order.customerName}</div>
      ${order.customerMobile ? `<div class="customer-extra">Mobile: ${order.customerMobile}</div>` : ''}
    </div>
    ` : ''}

    <!-- 8. PAYMENT METHOD BOX -->
    <div class="payment-box-wrapper">
      <div class="payment-box">
        ${paymentMethodDisplay}
      </div>
    </div>

    <!-- 9-13. ORDER ITEMS (Product, Quantity, Price, Variants, Addons, Notes) -->
    <div class="items-container">
      ${itemsHtml}
    </div>

    <!-- 14. SPECIAL INSTRUCTIONS (If any) -->
    ${specialInstructions ? `
    <div class="special-instruction-box">
      ${specialInstructions}
    </div>
    ` : ''}

    <!-- 15-17. BILLING BREAKDOWN (Subtotal, Discount, Tax, Delivery/Packaging) -->
    <div class="divider">--------------------------------</div>
    
    <div class="billing-section">
      <div class="billing-row">
        <span class="billing-label">Subtotal</span>
        <span class="billing-value">${formatReceiptPrice(order.subtotal)}</span>
      </div>

      ${order.discount && order.discount > 0 ? `
      <div class="billing-row">
        <span class="billing-label">Discount ${order.discountType === 'percentage' ? `(${order.discountValue}%)` : ''}</span>
        <span class="billing-value">-${formatReceiptPrice(order.discount)}</span>
      </div>
      ` : ''}

      ${order.tax && order.tax > 0 ? `
      <div class="billing-row">
        <span class="billing-label">Tax</span>
        <span class="billing-value">${formatReceiptPrice(order.tax)}</span>
      </div>
      ` : ''}

      ${order.packagingCharge && order.packagingCharge > 0 ? `
      <div class="billing-row">
        <span class="billing-label">${order.orderType === 'pickup' ? 'Delivery Charge' : 'Packaging Charge'}</span>
        <span class="billing-value">${formatReceiptPrice(order.packagingCharge)}</span>
      </div>
      ` : ''}
    </div>

    <!-- 18. TOTAL (Prominent Double-Border) -->
    <div class="total-container">
      <div class="total-row">
        <span class="total-label">TOTAL</span>
        <span class="total-value">${formatReceiptPrice(order.total)}</span>
      </div>
    </div>

    <!-- 17. VAT (Incl.) (If tax is applicable) -->
    ${order.tax && order.tax > 0 ? `
    <div class="vat-info-row">
      <span>VAT (Incl.)</span>
      <span>${formatReceiptPrice(order.tax)}</span>
    </div>
    ` : ''}

    <!-- 19. FOOTER: Store Address, Thank you, Hotline, Powered by BildovaTech -->
    <div class="footer-section">
      <div class="footer-address">
        Dhulipara Chowmuny,<br />
        Medical College Road,<br />
        Cumilla
      </div>
      <p class="footer-thankyou">Thank you for your order.</p>
      <p class="footer-hotline">Hotline: 01795711270</p>
      <p class="footer-powered">Powered by BildovaTech</p>
    </div>
  </body>
</html>
  `;
}

/**
 * Redesigned 58mm ESC/POS Kitchen Order Ticket (KOT) Generator
 * Optimized strictly for kitchen staff: minimal, bold, spacious, and fast to read.
 * Contains only preparation-related details: Order Type, Table Number, Token, Items with Quantities,
 * Add-ons, Variants, Item Special Notes, and Global Special Instructions.
 * Strictly NO prices, NO billing info, NO customer contact details.
 */
export function generate58mmThermalKotHtml(order: Order): string {
  // 1. Resolve Order Type (Center, Bold, Double Width + Double Height)
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

  // 2. Resolve Table Number (Only for DINE-IN with assigned table)
  const tableHeader = (order.orderType === 'dine-in' && order.tableNumber)
    ? `TABLE ${String(order.tableNumber).padStart(2, '0')}`
    : '';

  // 3. Resolve Token Number (Preserve existing token workflow)
  const tokenFormatted = order.tokenNumber
    ? `#${String(order.tokenNumber).replace(/^#/, '').padStart(3, '0')}`
    : null;

  // 4. Build Order Items Section
  const itemsHtml = order.items.map((item) => {
    // Add-ons (Indented, clean '+ ' prefix, NO prices)
    const addonsHtml = (item.selectedModifiers && item.selectedModifiers.length > 0)
      ? item.selectedModifiers.map(m => `
          <div class="addon-line">+ ${m.name}</div>
        `).join('')
      : '';

    // Variant (Indented, clean 'Variant: ' prefix, omitted if empty)
    const variantHtml = item.selectedVariant && item.selectedVariant.name
      ? `<div class="variant-line">Variant: ${item.selectedVariant.name}</div>`
      : '';

    // Item Special Note (Indented, bold label, wrapped note value, omitted if empty)
    const noteHtml = item.notes && item.notes.trim()
      ? `
        <div class="note-block">
          <div class="note-label">Special Note:</div>
          <div class="note-value">${item.notes.trim()}</div>
        </div>
      `
      : '';

    return `
      <div class="item-block">
        <div class="item-main-line">
          <span class="item-qty">${item.quantity} x</span>
          <span class="item-name">${item.product.name}</span>
        </div>
        ${addonsHtml}
        ${variantHtml}
        ${noteHtml}
      </div>
    `;
  }).join('');

  // 5. Global Special Instructions (Dynamic, Bold, Centered, UPPERCASE)
  const globalInstruction = (order.customerLocation && order.orderType !== 'dine-in')
    ? `*** ${order.customerLocation.toUpperCase()} ***`
    : '';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>KOT - ${order.orderNumber}</title>
    <style>
      @page {
        size: 58mm auto;
        margin: 0mm;
      }
      *, *:before, *:after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: #000000 !important;
        font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body {
        width: 58mm;
        max-width: 58mm;
        margin: 0 auto;
        padding: 4mm 2mm;
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 13px;
        line-height: 1.35;
        font-weight: 700;
        overflow-x: hidden;
      }
      
      .center {
        text-align: center;
      }
      .left {
        text-align: left;
      }
      .bold {
        font-weight: 900 !important;
      }

      /* KOT HEADER */
      .kot-header {
        text-align: center;
        margin-bottom: 12px;
      }
      .order-type {
        font-size: 18px;
        font-weight: 900 !important;
        letter-spacing: 1px;
        text-transform: uppercase;
        line-height: 1.2;
      }
      .table-number {
        font-size: 16px;
        font-weight: 900 !important;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-top: 3px;
        line-height: 1.2;
      }
      .token-number {
        font-size: 18px;
        font-weight: 900 !important;
        letter-spacing: 1px;
        margin-top: 3px;
        line-height: 1.2;
      }

      /* ITEMS CONTAINER */
      .items-container {
        margin-top: 8px;
        margin-bottom: 8px;
      }
      .item-block {
        margin-bottom: 14px;
      }
      .item-block:last-child {
        margin-bottom: 0;
      }
      .item-main-line {
        font-size: 13.5px;
        font-weight: 900 !important;
        line-height: 1.3;
        word-break: break-word;
      }
      .item-qty {
        font-weight: 900 !important;
        margin-right: 2px;
        white-space: nowrap;
      }
      .item-name {
        font-weight: 900 !important;
      }
      .addon-line {
        font-size: 12px;
        font-weight: 700;
        padding-left: 14px;
        margin-top: 2px;
        word-break: break-word;
      }
      .variant-line {
        font-size: 12px;
        font-weight: 700;
        padding-left: 14px;
        margin-top: 2px;
        word-break: break-word;
      }
      .note-block {
        font-size: 11.5px;
        padding-left: 14px;
        margin-top: 3px;
      }
      .note-label {
        font-weight: 900 !important;
      }
      .note-value {
        font-weight: 700;
        word-break: break-word;
      }

      /* GLOBAL SPECIAL INSTRUCTIONS */
      .special-instruction {
        margin-top: 16px;
        padding-top: 8px;
        text-align: center;
        font-size: 13px;
        font-weight: 900 !important;
        text-transform: uppercase;
        line-height: 1.35;
        word-break: break-word;
      }

      @media print {
        body {
          padding: 1mm 1mm;
          margin: 0;
          width: 58mm;
        }
      }
    </style>
  </head>
  <body>
    <!-- 1. ORDER TYPE & TABLE NUMBER & TOKEN -->
    <div class="kot-header">
      <div class="order-type">${orderTypeHeader}</div>
      ${tableHeader ? `<div class="table-number">${tableHeader}</div>` : ''}
      ${tokenFormatted ? `<div class="token-number">${tokenFormatted}</div>` : ''}
    </div>

    <!-- 2. ORDER ITEMS -->
    <div class="items-container">
      ${itemsHtml}
    </div>

    <!-- 3. GLOBAL SPECIAL INSTRUCTIONS (If any) -->
    ${globalInstruction ? `
      <div class="special-instruction">
        ${globalInstruction}
      </div>
    ` : ''}
  </body>
</html>
  `;
}

