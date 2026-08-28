import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Printer, CheckCircle, ChefHat, Copy, Download, User, Edit3 } from 'lucide-react';
import { Order } from '../types';
import { downloadInvoicePdf, downloadKitchenKotPdf } from '../utils/pdfGenerator';
import { generate58mmThermalReceiptHtml, generate58mmThermalKotHtml } from '../utils/receiptGenerator';
import { VIBRANT_LOGO_BASE64 } from './vibrant_logo_base64';

interface ReceiptModalProps {
  order: Order;
  paymentMethod: string;
  splitDetails?: { id: string; personName: string; amount: number; method: string; isPaid: boolean }[];
  onClose: () => void;
}

export default function ReceiptModal({ order, paymentMethod, splitDetails, onClose }: ReceiptModalProps) {
  const formatPrice = (val: number) => `৳${val.toFixed(2)}`;

  const [cashierName, setCashierName] = useState<string>(() => {
    return order.cashierName || localStorage.getItem('vibrant_cashier_name') || 'Ratul';
  });

  const handleCashierChange = (val: string) => {
    setCashierName(val);
    localStorage.setItem('vibrant_cashier_name', val);
  };

  const printHtml = (htmlContent: string) => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.write(htmlContent);
      frameDoc.close();
      setTimeout(() => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        } catch (e) {
          console.error("Print failed:", e);
        }
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 5000);
      }, 500);
    }
  };

  const handlePrintCustomerInvoice = () => {
    const htmlContent = generate58mmThermalReceiptHtml(order, cashierName, paymentMethod);
    printHtml(htmlContent);
  };

  const handlePrintKitchenKOT = () => {
    const htmlContent = generate58mmThermalKotHtml(order);
    printHtml(htmlContent);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-8"
        id="receipt-modal-container"
      >
        {/* Header banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
              <CheckCircle className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Checkout Successful</h2>
              <p className="text-xs text-indigo-300">Order #{order.orderNumber} • Paid First</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Tabs: Receipt & KOT Preview side-by-side */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950 max-h-[70vh] overflow-y-auto">
          
          {/* Customer Receipt Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">Customer Bill receipt</span>
              <span className="text-xs font-mono text-slate-500">FORMAT: 58mm Thermal</span>
            </div>

            {/* Editable Cashier Bar */}
            <div className="mb-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                <User className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Cashier Name:</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => handleCashierChange(e.target.value)}
                  placeholder="Enter cashier name..."
                  className="bg-slate-950 border border-slate-700 focus:border-indigo-500 text-slate-100 text-xs px-2.5 py-1 rounded-lg font-bold w-40 focus:outline-none transition-colors pr-7"
                />
                <Edit3 className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Thermal Slip UI */}
            <div className="bg-white text-slate-950 p-5 rounded-lg font-mono text-[11px] shadow-md border border-slate-300 leading-snug max-w-sm mx-auto relative overflow-hidden font-bold">
              {/* Top dashed divider */}
              <div className="text-center">
                <div className="text-sm font-black uppercase tracking-wide">
                  {order.orderType === 'takeaway' ? 'TAKEAWAY' : order.orderType === 'pickup' ? 'ONLINE ORDER' : 'DINE-IN'}
                </div>
                {order.orderType === 'dine-in' && order.tableNumber && (
                  <div className="text-xs font-black uppercase mt-0.5">
                    TABLE {String(order.tableNumber).padStart(2, '0')}
                  </div>
                )}
                <div className="text-lg font-black tracking-wider my-1.5">
                  #{String(order.tokenNumber || '001').replace(/^#/, '')}
                </div>
              </div>

              <div className="border-t border-dashed border-black my-1.5"></div>
              <div className="text-center font-black uppercase tracking-wider text-xs">
                CUSTOMER RECEIPT
              </div>
              <div className="border-t border-dashed border-black my-1.5"></div>

              <div className="text-center">
                <div className="font-black text-xs">Vibrant</div>
                <div className="text-[10px] text-slate-800">
                  {(() => {
                    try {
                      const d = new Date(order.createdAt);
                      const day = String(d.getDate()).padStart(2, '0');
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const year = d.getFullYear();
                      const hours = String(d.getHours()).padStart(2, '0');
                      const minutes = String(d.getMinutes()).padStart(2, '0');
                      return `${day}-${month}-${year} ${hours}:${minutes}`;
                    } catch {
                      return order.createdAt;
                    }
                  })()}
                </div>
              </div>
              <div className="border-t border-dashed border-black my-1.5"></div>

              {order.customerName && (
                <div className="my-1.5 text-[10.5px]">
                  <div className="text-[10px] font-normal">Customer:</div>
                  <div className="font-black text-xs">{order.customerName}</div>
                  {order.customerMobile && (
                    <div className="text-[10px]">Mobile: {order.customerMobile}</div>
                  )}
                </div>
              )}

              {/* Payment Box */}
              <div className="my-2 text-center">
                <div className="border border-black py-0.5 px-3 font-black text-xs uppercase tracking-widest inline-block w-full">
                  {(paymentMethod === 'mobile_pay' ? 'ONLINE PAID' : paymentMethod || 'CASH').toUpperCase()}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 my-2">
                {order.items.map((item) => {
                  const modifierTotal = item.selectedModifiers ? item.selectedModifiers.reduce((acc, m) => acc + m.price, 0) : 0;
                  const basePrice = (item.selectedVariant ? item.selectedVariant.price : item.product.price) + modifierTotal;
                  const lineTotal = basePrice * item.quantity;
                  const displaySize = item.selectedVariant?.name || null;

                  return (
                    <div key={item.id} className="pb-1 border-b border-dotted border-slate-300 last:border-0">
                      <div className="flex justify-between items-start font-black">
                        <span className="flex-1 pr-1">
                          {item.quantity} x {item.product.name}
                        </span>
                        <span className="shrink-0 text-right">BDT{lineTotal.toFixed(2)}</span>
                      </div>
                      
                      {displaySize && (
                        <div className="text-[9.5px] pl-4 font-normal text-slate-700">
                          Variant: {displaySize}
                        </div>
                      )}

                      {item.selectedModifiers && item.selectedModifiers.map((m) => (
                        <div key={m.id} className="flex justify-between text-[9.5px] pl-4 font-normal text-slate-700">
                          <span>+ {m.name}</span>
                          <span>BDT{m.price.toFixed(2)}</span>
                        </div>
                      ))}

                      {item.notes && (
                        <div className="text-[9px] pl-4 italic text-slate-600">
                          Special Note:<br />{item.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {order.customerLocation && order.orderType !== 'dine-in' && (
                <div className="border border-dashed border-black p-1 text-center text-[10px] font-black uppercase my-1.5">
                  *** DELIVERY: {order.customerLocation} ***
                </div>
              )}

              <div className="border-t border-dashed border-black my-1.5"></div>

              {/* Totals */}
              <div className="space-y-0.5 text-[10.5px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black">BDT{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount {order.discountType === 'percentage' ? `(${order.discountValue}%)` : ''}</span>
                    <span className="font-black">-BDT{order.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-black">BDT{order.tax.toFixed(2)}</span>
                  </div>
                )}
                {order.packagingCharge !== undefined && order.packagingCharge > 0 && (
                  <div className="flex justify-between">
                    <span>{order.orderType === 'pickup' ? 'Delivery Charge' : 'Packaging Charge'}</span>
                    <span className="font-black">BDT{order.packagingCharge.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total Double-Border */}
              <div className="border-t-2 border-b-2 border-black py-1 my-2">
                <div className="flex justify-between font-black text-sm">
                  <span>TOTAL</span>
                  <span>BDT{order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.tax > 0 && (
                <div className="flex justify-between text-[9.5px] font-normal my-1">
                  <span>VAT (Incl.)</span>
                  <span>BDT{order.tax.toFixed(2)}</span>
                </div>
              )}

              {/* Footer */}
              <div className="text-center mt-3 pt-2 border-t border-dashed border-black text-[9px] leading-tight space-y-0.5">
                <div className="font-bold pb-1 text-[8.5px] leading-tight">
                  Dhulipara Chowmuny,<br />
                  Medical College Road,<br />
                  Cumilla
                </div>
                <p className="font-black text-[10px]">Thank you for your order.</p>
                <p className="font-black">Hotline: 01795711270</p>
                <p className="text-[8px] pt-1 text-slate-700">Powered by BildovaTech</p>
              </div>
            </div>
          </div>

          {/* Kitchen Order Ticket (KOT) Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Kitchen Order Ticket (KOT)</span>
              <span className="text-xs font-mono text-slate-500">FORMAT: 58mm Thermal KOT</span>
            </div>

            {/* KOT Slip UI */}
            <div className="bg-white text-black p-5 rounded-lg font-mono text-xs shadow-xl border border-slate-700 leading-relaxed max-w-sm mx-auto relative overflow-hidden">
              {/* Header: Order Type & Table & Token */}
              <div className="text-center mb-3">
                <div className="text-base font-black tracking-wide uppercase">
                  {order.orderType === 'takeaway' 
                    ? 'TAKEAWAY' 
                    : order.orderType === 'pickup' 
                      ? 'ONLINE ORDER' 
                      : 'DINE-IN'}
                </div>
                {order.orderType === 'dine-in' && order.tableNumber && (
                  <div className="text-sm font-black tracking-wider uppercase mt-0.5">
                    TABLE {String(order.tableNumber).padStart(2, '0')}
                  </div>
                )}
                {order.tokenNumber && (
                  <div className="text-base font-black tracking-wider mt-0.5">
                    #{String(order.tokenNumber).replace(/^#/, '').padStart(3, '0')}
                  </div>
                )}
              </div>

              {/* Items List for Kitchen */}
              <div className="space-y-3.5 my-3">
                {order.items.map((item) => (
                  <div key={item.id} className="text-xs">
                    <div className="font-black text-[13px] leading-snug">
                      <span className="font-black mr-1">{item.quantity} x</span>
                      <span>{item.product.name}</span>
                    </div>

                    {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                      <div className="pl-3.5 mt-0.5 space-y-0.5 text-[11px] font-bold">
                        {item.selectedModifiers.map((m) => (
                          <div key={m.id}>+ {m.name}</div>
                        ))}
                      </div>
                    )}

                    {item.selectedVariant && item.selectedVariant.name && (
                      <div className="pl-3.5 mt-0.5 text-[11px] font-bold">
                        Variant: {item.selectedVariant.name}
                      </div>
                    )}

                    {item.notes && item.notes.trim() && (
                      <div className="pl-3.5 mt-1 text-[11px]">
                        <div className="font-black">Special Note:</div>
                        <div className="font-bold">{item.notes.trim()}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Global Special Instructions (if any) */}
              {order.customerLocation && order.orderType !== 'dine-in' && (
                <div className="mt-4 pt-2 text-center text-xs font-black uppercase border-t border-dashed border-black">
                  *** {order.customerLocation.toUpperCase()} ***
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            <span className="text-emerald-400 font-semibold font-mono">Pay-First Pipeline:</span> payment authorization automatically queued receipt printing & kitchen KOT tickets simultaneously.
          </p>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrintCustomerInvoice}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-xl border border-slate-700 transition-colors text-xs font-bold cursor-pointer"
            >
              <Printer className="h-4 w-4 text-indigo-400" />
              Print Customer Invoice
            </button>
            <button
              onClick={() => downloadInvoicePdf(order, cashierName)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-200 rounded-xl border border-indigo-800/60 transition-colors text-xs font-bold cursor-pointer"
            >
              <Download className="h-4 w-4 text-indigo-400" />
              Download PDF Invoice
            </button>
            <button
              onClick={handlePrintKitchenKOT}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-xl border border-slate-700 transition-colors text-xs font-bold cursor-pointer"
            >
              <ChefHat className="h-4 w-4 text-emerald-400" />
              Print Kitchen KOT
            </button>
            <button
              onClick={() => downloadKitchenKotPdf(order)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-200 rounded-xl border border-emerald-800/60 transition-colors text-xs font-bold cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              Download PDF KOT
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md shadow-indigo-600/10 text-xs font-black cursor-pointer"
            >
              Next Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
