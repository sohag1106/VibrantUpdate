import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Clock, ChefHat, CheckCircle2, AlertCircle, Utensils, 
  Sparkles, ExternalLink, RefreshCw, Armchair, Truck, Phone, 
  MapPin, User, ChevronRight, Store, ArrowRight, Flame, Bell, QrCode
} from 'lucide-react';
import { Order, CartItem, Product } from '../types';
import FoodIcon from './FoodIcon';

interface CustomerScreenProps {
  products: Product[];
  ordersHistory: Order[];
  latestCompletedOrder?: Order | null;
}

interface LiveCartPayload {
  cart: CartItem[];
  orderType: 'dine-in' | 'takeaway' | 'pickup';
  tableNumber?: string;
  customerName?: string;
  customerMobile?: string;
  customerLocation?: string;
  cashierName?: string;
  subtotal: number;
  discount: number;
  discountType?: 'percentage' | 'flat';
  discountValue?: number;
  tax: number;
  packaging: number;
  total: number;
  itemCount: number;
  updatedAt: number;
}

export default function CustomerScreen({ products, ordersHistory, latestCompletedOrder }: CustomerScreenProps) {
  // Live POS cart state (synchronized via BroadcastChannel & localStorage)
  const [liveCart, setLiveCart] = useState<LiveCartPayload | null>(() => {
    try {
      const saved = localStorage.getItem('vibrant_live_cart_payload');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Selected view on the customer screen
  // 'live' = Live checkout / cart in progress
  // 'status' = Live order tracking & order taken view
  // 'queue' = Token lobby ready board
  // 'menu' = Featured highlights & welcome screen
  const [activeView, setActiveView] = useState<'live' | 'status' | 'queue' | 'menu'>('live');

  // Currently focused order for status tracking
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(latestCompletedOrder || null);
  const [searchToken, setSearchToken] = useState('');
  const [isPopout, setIsPopout] = useState(false);

  // Time & greeting
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update selected order when a new order completes
  useEffect(() => {
    if (latestCompletedOrder) {
      setSelectedOrderForStatus(latestCompletedOrder);
      setActiveView('status');
    }
  }, [latestCompletedOrder]);

  // Synchronize with POS via BroadcastChannel & storage events
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('vibrant_customer_display');
        bc.onmessage = (event) => {
          if (event.data?.type === 'CART_UPDATE') {
            setLiveCart(event.data.payload);
            if (event.data.payload?.cart?.length > 0) {
              setActiveView('live');
            }
          } else if (event.data?.type === 'ORDER_COMPLETED') {
            setSelectedOrderForStatus(event.data.payload.order);
            setActiveView('status');
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error in CustomerScreen:', e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'vibrant_live_cart_payload' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setLiveCart(parsed);
          if (parsed?.cart?.length > 0) {
            setActiveView('live');
          }
        } catch {}
      } else if (e.key === 'vibrant_last_completed_order' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSelectedOrderForStatus(parsed);
          setActiveView('status');
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Separate Pop-out window launcher
  const openPopoutCustomerScreen = () => {
    const width = 1024;
    const height = 768;
    const left = window.screen.width - width;
    const top = 0;
    const popup = window.open(
      window.location.href,
      'VibrantCustomerDisplay',
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    if (popup) {
      popup.focus();
    }
  };

  // Recent orders queue
  const recentOrders = ordersHistory.slice(0, 12);
  const preparingOrders = recentOrders.filter(o => o.status === 'pending' || (o.status === 'completed' && Date.now() - new Date(o.createdAt).getTime() < 15 * 60 * 1000));
  const readyOrders = recentOrders.filter(o => o.status === 'completed' && Date.now() - new Date(o.createdAt).getTime() < 8 * 60 * 1000).slice(0, 4);

  // Determine active display state
  const hasActiveCart = liveCart && liveCart.cart && liveCart.cart.length > 0;
  const currentDisplayedOrder = selectedOrderForStatus || (ordersHistory.length > 0 ? ordersHistory[0] : null);

  // Greeting helper
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[680px]">
      
      {/* Top Customer Display Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Store Location */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-wider uppercase text-white">Vibrant</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live Customer Display
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Dhulipara, Cumilla • Hotline: 01795711270</p>
          </div>
        </div>

        {/* View Mode Navigation Tabs for Customer Display */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setActiveView('live')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'live'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Live Checkout</span>
            {hasActiveCart && (
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {liveCart?.itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('status')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'status'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Order Status</span>
            {currentDisplayedOrder && (
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                #{String(currentDisplayedOrder.tokenNumber || '001').replace(/^#/, '')}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('queue')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'queue'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ChefHat className="h-3.5 w-3.5" />
            <span>Kitchen Queue</span>
          </button>

          <button
            onClick={() => setActiveView('menu')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'menu'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Featured Specials</span>
          </button>
        </div>

        {/* Live Clock & Popout Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={openPopoutCustomerScreen}
            title="Launch Customer Screen on second monitor"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 hover:border-indigo-500 cursor-pointer shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Second Monitor</span>
          </button>
        </div>

      </header>

      {/* Main Customer Screen Content Stages */}
      <div className="flex-1 p-6 overflow-y-auto">
        
        {/* VIEW 1: LIVE CHECKOUT VIEW (Active Cart in Real-Time) */}
        {activeView === 'live' && (
          <div className="h-full flex flex-col">
            {hasActiveCart ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
                
                {/* Left Column: Cart Item Details */}
                <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <span>Your Active Order</span>
                        <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono">
                          {liveCart.itemCount} items
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Items currently added at the cashier register</p>
                    </div>

                    {/* Order Type Badge */}
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-indigo-400 border border-slate-700 px-3 py-1 rounded-xl text-xs font-black uppercase flex items-center gap-1.5">
                        {liveCart.orderType === 'dine-in' ? (
                          <>
                            <Armchair className="h-3.5 w-3.5" />
                            <span>Dine-In • Table {liveCart.tableNumber || '1'}</span>
                          </>
                        ) : liveCart.orderType === 'takeaway' ? (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Takeaway</span>
                          </>
                        ) : (
                          <>
                            <Truck className="h-3.5 w-3.5" />
                            <span>Online Order</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Customer / Cashier Info Pill */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-indigo-400" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Customer</span>
                        <span className="font-bold text-slate-200">
                          {liveCart.customerName ? liveCart.customerName : 'Guest Customer'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-indigo-400" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Cashier Terminal</span>
                        <span className="font-bold text-slate-200">{liveCart.cashierName || 'Ratul'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Item Rows */}
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {liveCart.cart.map((item) => {
                      const modifierSum = item.selectedModifiers ? item.selectedModifiers.reduce((acc, m) => acc + m.price, 0) : 0;
                      const basePrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                      const singleItemTotal = basePrice + modifierSum;
                      const lineTotal = singleItemTotal * item.quantity;

                      return (
                        <div 
                          key={item.id}
                          className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="h-11 w-11 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-indigo-400">
                              <FoodIcon category={item.product.category} className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-white">{item.product.name}</span>
                                {item.selectedVariant && (
                                  <span className="bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 text-[10px] font-bold px-2 py-0.5 rounded">
                                    {item.selectedVariant.name}
                                  </span>
                                )}
                              </div>
                              
                              {/* Modifiers */}
                              {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.selectedModifiers.map((m) => (
                                    <span key={m.id} className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono">
                                      +{m.name} (৳{m.price.toFixed(2)})
                                    </span>
                                  ))}
                                </div>
                              )}

                              {item.notes && (
                                <p className="text-[10px] text-amber-400/90 italic mt-1">
                                  Note: "{item.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity and Price */}
                          <div className="text-right shrink-0">
                            <span className="text-xs bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold text-indigo-300">
                              {item.quantity} × ৳{singleItemTotal.toFixed(2)}
                            </span>
                            <div className="text-base font-black text-white font-mono mt-1">
                              BDT {lineTotal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Billing Summary & Payment Prompt */}
                <div className="lg:col-span-5 flex flex-col space-y-5">
                  
                  {/* Bill Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 pb-2 border-b border-slate-800 flex items-center justify-between">
                      <span>Order Payment Breakdown</span>
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full font-mono">
                        Vibrant POS
                      </span>
                    </h4>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span className="font-mono font-bold text-slate-200">BDT {liveCart.subtotal.toFixed(2)}</span>
                      </div>

                      {liveCart.discount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
                          <span>Discount Applied</span>
                          <span className="font-mono font-bold">-BDT {liveCart.discount.toFixed(2)}</span>
                        </div>
                      )}

                      {liveCart.tax > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>Tax / VAT (Incl.)</span>
                          <span className="font-mono font-bold text-slate-200">BDT {liveCart.tax.toFixed(2)}</span>
                        </div>
                      )}

                      {liveCart.packaging > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>Packaging / Delivery</span>
                          <span className="font-mono font-bold text-slate-200">BDT {liveCart.packaging.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Grand Total</span>
                          <span className="text-[11px] text-slate-500">Payable at cashier counter</span>
                        </div>
                        <div className="text-3xl font-black text-white font-mono tracking-tight text-right">
                          BDT {liveCart.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Instructions Banner */}
                  <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-3xl p-5 text-center space-y-2">
                    <div className="inline-flex p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl mb-1">
                      <Utensils className="h-6 w-6" />
                    </div>
                    <h4 className="font-black text-white text-base">Please review your order</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      We accept Cash, Cards, bKash, and Nagad. Your token will be generated once payment is confirmed.
                    </p>
                  </div>

                </div>

              </div>
            ) : (
              /* Idle Welcome Screen when cart is empty */
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-6">
                <div className="relative">
                  <div className="h-24 w-24 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 mx-auto">
                    <Utensils className="h-12 w-12 text-white" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>

                <div className="space-y-2 max-w-md">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                    {greeting} & Welcome
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    Ready to Take Your Delicious Order
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Please place your order with the cashier. Your items, prices, and live order status will appear right here in real time.
                  </p>
                </div>

                {/* Quick Action Navigation */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveView('status')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="h-4 w-4 text-indigo-400" />
                    <span>Track Previous Order Status</span>
                  </button>

                  <button
                    onClick={() => setActiveView('menu')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Explore Today's Menu</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LIVE ORDER STATUS & ORDER TAKEN CONFIRMATION */}
        {activeView === 'status' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {currentDisplayedOrder ? (
              <div className="space-y-6">
                
                {/* Order Confirmation Banner */}
                <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-5">
                    <div className="h-20 w-20 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-0.5 rounded-full">
                          Order Placed & In Kitchen
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(currentDisplayedOrder.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1">
                        Thank You! Your Food Is Cooking
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Order <span className="font-mono text-slate-200 font-bold">{currentDisplayedOrder.orderNumber}</span> • {currentDisplayedOrder.customerName || 'Customer'}
                      </p>
                    </div>
                  </div>

                  {/* Token Number Card */}
                  <div className="bg-slate-950/90 border-2 border-indigo-500/50 p-4 px-6 rounded-2xl text-center shrink-0 shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block">
                      YOUR TOKEN NUMBER
                    </span>
                    <div className="text-4xl font-black text-white font-mono tracking-wider my-0.5">
                      #{String(currentDisplayedOrder.tokenNumber || '001').replace(/^#/, '')}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {currentDisplayedOrder.orderType === 'dine-in' ? `Table ${currentDisplayedOrder.tableNumber || '1'}` : currentDisplayedOrder.orderType}
                    </span>
                  </div>
                </div>

                {/* Live Progress Stage Tracker */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-indigo-400" />
                        <span>Live Kitchen Progress Status</span>
                      </h3>
                      <p className="text-xs text-slate-400">Estimated preparation time: ~12-15 minutes</p>
                    </div>
                    <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 text-xs px-3 py-1 rounded-full font-bold">
                      Stage 2 of 4: Cooking
                    </span>
                  </div>

                  {/* 4 Step Progress Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                    
                    {/* Step 1: Order Received */}
                    <div className="bg-slate-950/80 border border-emerald-500/40 p-4 rounded-2xl flex flex-col space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="h-7 w-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                          ✓
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Completed</span>
                      </div>
                      <span className="text-xs font-black text-white">1. Order Confirmed</span>
                      <p className="text-[10px] text-slate-400">Payment received & ticket printed</p>
                    </div>

                    {/* Step 2: In Kitchen / Preparing */}
                    <div className="bg-gradient-to-br from-indigo-950/80 to-slate-950 border-2 border-indigo-500 p-4 rounded-2xl flex flex-col space-y-2 relative overflow-hidden shadow-lg shadow-indigo-600/20 animate-pulse">
                      <div className="flex items-center justify-between">
                        <span className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs animate-spin">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[10px] font-black text-indigo-300 uppercase bg-indigo-900/60 px-2 py-0.5 rounded">Active</span>
                      </div>
                      <span className="text-xs font-black text-white">2. Preparing in Kitchen</span>
                      <p className="text-[10px] text-slate-300">Chefs are preparing fresh food</p>
                    </div>

                    {/* Step 3: Quality Check */}
                    <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex flex-col space-y-2 opacity-60">
                      <div className="flex items-center justify-between">
                        <span className="h-7 w-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                          3
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Upcoming</span>
                      </div>
                      <span className="text-xs font-black text-white">3. Plating & Packaging</span>
                      <p className="text-[10px] text-slate-500">Quality check & packing</p>
                    </div>

                    {/* Step 4: Ready for Pickup */}
                    <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex flex-col space-y-2 opacity-60">
                      <div className="flex items-center justify-between">
                        <span className="h-7 w-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                          4
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Ready</span>
                      </div>
                      <span className="text-xs font-black text-white">4. Ready for Service</span>
                      <p className="text-[10px] text-slate-500">Token called at counter/table</p>
                    </div>

                  </div>
                </div>

                {/* Order Itemized Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Item List */}
                  <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
                      Ordered Food Items ({currentDisplayedOrder.items.reduce((s, i) => s + i.quantity, 0)})
                    </h4>

                    <div className="space-y-3">
                      {currentDisplayedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="h-7 w-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                              {item.quantity}x
                            </span>
                            <div>
                              <span className="text-sm font-bold text-white block">{item.product.name}</span>
                              {item.selectedVariant && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Variant: {item.selectedVariant.name}
                                </span>
                              )}
                              {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                                <div className="text-[10px] text-slate-400">
                                  + {item.selectedModifiers.map(m => m.name).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-mono text-sm font-bold text-slate-300">
                            BDT {(((item.selectedVariant ? item.selectedVariant.price : item.product.price) + (item.selectedModifiers ? item.selectedModifiers.reduce((acc, m) => acc + m.price, 0) : 0)) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Side Info */}
                  <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
                        Payment & Order Meta
                      </h4>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Payment Method:</span>
                          <span className="font-bold text-white uppercase bg-slate-800 px-2 py-0.5 rounded">
                            {currentDisplayedOrder.paymentMethod || 'CASH'}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Total Paid:</span>
                          <span className="font-black text-base text-emerald-400 font-mono">
                            BDT {currentDisplayedOrder.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Service Type:</span>
                          <span className="font-bold text-white uppercase">{currentDisplayedOrder.orderType}</span>
                        </div>
                        {currentDisplayedOrder.tableNumber && (
                          <div className="flex justify-between text-slate-400">
                            <span>Table Number:</span>
                            <span className="font-bold text-white">Table {currentDisplayedOrder.tableNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-center space-y-1">
                      <p className="text-xs font-bold text-slate-300">Please keep your token safe</p>
                      <p className="text-[10px] text-slate-500">Listen for Token #{String(currentDisplayedOrder.tokenNumber || '001').replace(/^#/, '')} or watch the queue board.</p>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-16 space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                <Clock className="h-12 w-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Order Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When an order is completed by the cashier, its live cooking progress and token status will be shown here.
                </p>
                <button
                  onClick={() => setActiveView('queue')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  View Live Queue Board
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LIVE LOBBY QUEUE BOARD */}
        {activeView === 'queue' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <ChefHat className="h-6 w-6 text-indigo-400" />
                  <span>Live Token Ready Board</span>
                </h3>
                <p className="text-xs text-slate-400">Order pickup & preparation queue for lobby counter</p>
              </div>

              {/* Order lookup */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  placeholder="Enter Token # (e.g. 001)"
                  className="bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {searchToken && (
                  <button
                    onClick={() => {
                      const match = ordersHistory.find(o => String(o.tokenNumber).includes(searchToken) || o.orderNumber.includes(searchToken));
                      if (match) {
                        setSelectedOrderForStatus(match);
                        setActiveView('status');
                      } else {
                        alert(`Token #${searchToken} not found in recent orders.`);
                      }
                    }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Track
                  </button>
                )}
              </div>
            </div>

            {/* Split Ready & Preparing Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* NOW PREPARING */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-amber-400 animate-ping"></span>
                    <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                      Now Cooking / In Kitchen
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {preparingOrders.length} In Prep
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {preparingOrders.length > 0 ? (
                    preparingOrders.map((ord) => (
                      <div 
                        key={ord.id}
                        onClick={() => {
                          setSelectedOrderForStatus(ord);
                          setActiveView('status');
                        }}
                        className="bg-slate-950 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl text-center cursor-pointer transition-all hover:scale-105"
                      >
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Token</span>
                        <div className="text-2xl font-black text-white font-mono my-0.5">
                          #{String(ord.tokenNumber || '001').replace(/^#/, '')}
                        </div>
                        <span className="text-[9px] text-amber-400 font-bold uppercase">
                          {ord.orderType === 'dine-in' ? `T${ord.tableNumber || '1'}` : ord.orderType}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-slate-500 text-xs">
                      All orders are served! No pending cooking queue.
                    </div>
                  )}
                </div>
              </div>

              {/* READY FOR PICKUP */}
              <div className="bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-800/40 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
                      Ready For Pickup / Collect Here
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    {readyOrders.length} Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {readyOrders.length > 0 ? (
                    readyOrders.map((ord) => (
                      <div 
                        key={ord.id}
                        onClick={() => {
                          setSelectedOrderForStatus(ord);
                          setActiveView('status');
                        }}
                        className="bg-emerald-950/60 border-2 border-emerald-500 p-4 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 shadow-lg shadow-emerald-500/10"
                      >
                        <span className="text-[10px] text-emerald-300 uppercase font-extrabold block">CALLING</span>
                        <div className="text-3xl font-black text-white font-mono my-0.5">
                          #{String(ord.tokenNumber || '001').replace(/^#/, '')}
                        </div>
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full inline-block mt-1">
                          READY NOW
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-slate-500 text-xs">
                      Newly finished orders will be announced here.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 4: FEATURED MENU & SPECIALS */}
        {activeView === 'menu' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Flame className="h-6 w-6 text-amber-500" />
                  <span>Vibrant Chef's Featured Specials</span>
                </h3>
                <p className="text-xs text-slate-400">Freshly prepared gourmet dishes & refreshing beverages</p>
              </div>
              <span className="text-xs text-indigo-400 font-bold">Dhulipara, Cumilla</span>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map((prod) => (
                <div 
                  key={prod.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 p-4 rounded-2xl flex flex-col justify-between space-y-3 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="h-28 w-full bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-indigo-400 group-hover:scale-102 transition-transform">
                      <FoodIcon category={prod.category} className="h-12 w-12" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      {prod.category}
                    </span>
                    <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                    <span className="text-base font-black text-white font-mono">
                      BDT {prod.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Customer Screen Footer Information */}
      <footer className="bg-slate-900/90 border-t border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-indigo-400" />
          <span>Vibrant Restaurant • Dhulipara, Cumilla</span>
          <span className="text-slate-600">•</span>
          <span>Hotline: 01795711270</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span>Powered by BildovaTech</span>
        </div>
      </footer>

    </div>
  );
}
