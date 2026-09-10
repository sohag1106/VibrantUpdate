import React, { useState, useEffect } from 'react';
import { 
  Store, ShieldAlert, Clock, ChefHat, Database, Loader2, LogOut, UserCheck, Maximize2, Minimize2, Monitor
} from 'lucide-react';
import { Product, Order, Category } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data/initialData';
import POSInterface from './components/POSInterface';
import AdminPanel from './components/AdminPanel';
import CustomerScreen from './components/CustomerScreen';
import ReceiptModal from './components/ReceiptModal';
import Login from './components/Login';
import {
  fetchCategories, upsertCategory, deleteCategory,
  fetchProducts, upsertProduct, deleteProduct,
  fetchOrders, saveOrder as apiSaveOrder, deleteOrder as apiDeleteOrder, resetOrders,
  OperationType, handleApiError,
} from './api';

// Pre-seeded historic orders so the Sales Dashboard looks beautiful on initial load
const SEEDED_ORDERS: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'TX-4821-4402',
    tableNumber: '4',
    orderType: 'dine-in',
    items: [],
    subtotal: 19.98,
    tax: 0,
    discount: 2.00,
    discountType: 'percentage',
    discountValue: 10,
    total: 17.98,
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString() // 2 days ago
  },
  {
    id: 'order-2',
    orderNumber: 'TX-7731-8931',
    tableNumber: '1',
    orderType: 'dine-in',
    items: [],
    subtotal: 35.98,
    tax: 0,
    discount: 5.00,
    discountType: 'flat',
    discountValue: 5,
    total: 30.98,
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
  },
  {
    id: 'order-3',
    orderNumber: 'TX-1052-1982',
    customerName: 'Arafat Hossain',
    customerMobile: '01795711270',
    orderType: 'pickup',
    items: [],
    subtotal: 15.49,
    tax: 0,
    discount: 0,
    discountType: 'percentage',
    discountValue: 0,
    total: 15.49,
    status: 'completed',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hrs ago
  }
];

export default function App() {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('vibrant_user'));
  const [activeTab, setActiveTab] = useState<'pos' | 'admin' | 'customer'>('pos');
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('vibrant_products_backup');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load products from localStorage", e);
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const cached = localStorage.getItem('vibrant_categories_backup');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load categories from localStorage", e);
    }
    return INITIAL_CATEGORIES;
  });

  const [ordersHistory, setOrdersHistory] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem('vibrant_orders_backup');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);

  // Keep references to latest state to avoid stale closure issues during async operations
  const productsRef = React.useRef(products);
  productsRef.current = products;
  const categoriesRef = React.useRef(categories);
  categoriesRef.current = categories;
  
  // Receipt overlay states
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState('');
  const [receiptSplitDetails, setReceiptSplitDetails] = useState<any[] | undefined>(undefined);

  // Digital clock ticks
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  // Sync state with Neon on launch
  useEffect(() => {
    const loadAndSyncData = async () => {
      try {
        // 1. Fetch & Sync Categories
        const categoriesFromDb = await fetchCategories();
        let dbCategories: Category[] = [];
        if (categoriesFromDb.length === 0) {
          // Pre-seed categories to Neon using current/initial
          const toSeed = categoriesRef.current.length > 0 ? categoriesRef.current : INITIAL_CATEGORIES;
          for (const cat of toSeed) {
            await upsertCategory(cat);
          }
          dbCategories = [...toSeed];
          console.log("Seeded categories in Neon.");
        } else {
          dbCategories = [...categoriesFromDb];

          // Separate 'all' and others to sort only the active categories
          const allCategory = dbCategories.find(c => c.id === 'all') || { id: 'all', name: 'All Categories', icon: 'Utensils' };
          const otherCategories = dbCategories.filter(c => c.id !== 'all');
          
          // Sort other categories by orderIndex ascending
          otherCategories.sort((a, b) => {
            const indexA = a.orderIndex !== undefined ? a.orderIndex : 999;
            const indexB = b.orderIndex !== undefined ? b.orderIndex : 999;
            return indexA - indexB;
          });
          
          dbCategories = [allCategory, ...otherCategories];
        }
        setCategories(dbCategories);
        try {
          localStorage.setItem('vibrant_categories_backup', JSON.stringify(dbCategories));
        } catch (e) {}

        // 2. Fetch & Sync Products
        const productsFromDb = await fetchProducts();
        let dbProducts: Product[] = [];
        if (productsFromDb.length === 0) {
          // Pre-seed products to Neon from current/initial
          const toSeed = productsRef.current.length > 0 ? productsRef.current : INITIAL_PRODUCTS;
          for (const prod of toSeed) {
            await upsertProduct(prod);
          }
          dbProducts = [...toSeed];
          console.log("Seeded products in Neon.");
        } else {
          dbProducts = [...productsFromDb];
        }
        setProducts(dbProducts);
        try {
          localStorage.setItem('vibrant_products_backup', JSON.stringify(dbProducts));
        } catch (e) {}

        // 3. Fetch & Sync Orders
        // API already sorts by created_at descending
        const dbOrders: Order[] = await fetchOrders();
        setOrdersHistory(dbOrders);
        try {
          localStorage.setItem('vibrant_orders_backup', JSON.stringify(dbOrders));
        } catch (e) {}

        setIsLoading(false);
      } catch (error) {
        console.warn("Neon sync notice (running in local offline mode):", error);
        // Do NOT overwrite existing user-added products on connection errors!
        setIsLoading(false);
      }
    };

    loadAndSyncData();
  }, []);

  // Custom sync handlers for Admin Panel
  const setProductsAndSync = async (action: React.SetStateAction<Product[]>) => {
    // 1. Resolve next state value using latest ref value for 100% accuracy
    const prevProducts = productsRef.current;
    const nextProducts = typeof action === 'function' ? action(prevProducts) : action;
    
    // Update React state
    setProducts(nextProducts);

    // Save to localStorage immediately so data is never lost across reloads
    try {
      localStorage.setItem('vibrant_products_backup', JSON.stringify(nextProducts));
    } catch (e) {
      console.error("Failed to save products to localStorage:", e);
    }

    // 2. Diff changes and sync to Neon safely in background
    try {
      // Find deleted products
      const deleted = prevProducts.filter(p1 => !nextProducts.some(p2 => p2.id === p1.id));
      for (const p of deleted) {
        await deleteProduct(p.id).catch(err => console.warn("Neon delete err:", err));
      }

      // Find new or updated products
      for (const p of nextProducts) {
        const existing = prevProducts.find(ex => ex.id === p.id);
        if (!existing || JSON.stringify(existing) !== JSON.stringify(p)) {
          await upsertProduct(p).catch(err => console.warn("Neon upsert err:", err));
        }
      }
    } catch (error) {
      console.warn("Background Neon product sync issue:", error);
    }
  };

  const setCategoriesAndSync = async (action: React.SetStateAction<Category[]>) => {
    const prevCategories = categoriesRef.current;
    const nextCategories = typeof action === 'function' ? action(prevCategories) : action;
    
    setCategories(nextCategories);

    try {
      localStorage.setItem('vibrant_categories_backup', JSON.stringify(nextCategories));
    } catch (e) {
      console.error("Failed to save categories to localStorage:", e);
    }

    try {
      // Find deleted categories
      const deleted = prevCategories.filter(c1 => !nextCategories.some(c2 => c2.id === c1.id));
      for (const c of deleted) {
        await deleteCategory(c.id).catch(err => console.warn("Neon delete err:", err));
      }

      // Find new or updated categories
      for (const c of nextCategories) {
        const existing = prevCategories.find(ex => ex.id === c.id);
        if (!existing || JSON.stringify(existing) !== JSON.stringify(c)) {
          await upsertCategory(c).catch(err => console.warn("Neon upsert err:", err));
        }
      }
    } catch (error) {
      console.warn("Background Neon category sync issue:", error);
    }
  };

  const handleResetDatabase = async () => {
    setIsLoading(true);
    try {
      // 1. Delete all current orders from Neon
      await resetOrders();

      // 2. Clear local React state for order history so it starts completely fresh
      setOrdersHistory([]);
      try {
        localStorage.removeItem('vibrant_orders_backup');
      } catch (e) {}

      setIsLoading(false);
      console.log("Sales dashboard orders reset successfully!");
    } catch (error) {
      console.error("Failed to reset sales history:", error);
      setOrdersHistory([]);
      try {
        localStorage.removeItem('vibrant_orders_backup');
      } catch (e) {}
      setIsLoading(false);
      throw error;
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await apiDeleteOrder(orderId);
      setOrdersHistory(prev => {
        const next = prev.filter(o => o.id !== orderId);
        try {
          localStorage.setItem('vibrant_orders_backup', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      console.log("Deleted order successfully:", orderId);
    } catch (error) {
      console.error("Failed to delete order from Neon:", error);
      setOrdersHistory(prev => {
        const next = prev.filter(o => o.id !== orderId);
        try {
          localStorage.setItem('vibrant_orders_backup', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }
  };

  const handleOrderCompleted = async (completedOrder: Order, paymentMethod: string, splitDetails?: any[]) => {
    // Append to live session sales database log locally immediately
    setOrdersHistory(prev => {
      const next = [completedOrder, ...prev];
      try {
        localStorage.setItem('vibrant_orders_backup', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    
    // Mount to thermal print queue triggers
    setReceiptPaymentMethod(paymentMethod);
    setReceiptSplitDetails(splitDetails);
    setActiveReceiptOrder(completedOrder);

    // Persist completed order directly to Neon
    try {
      await apiSaveOrder(completedOrder);
      console.log("Order saved to Neon successfully:", completedOrder.id);
    } catch (error) {
      handleApiError(error, OperationType.WRITE, `orders/${completedOrder.id}`);
    }
  };

  // 1. Authentication Gate
  if (!user) {
    return (
      <Login 
        onLoginSuccess={(username) => {
          localStorage.setItem('vibrant_user', username);
          setUser(username);
        }} 
      />
    );
  }

  // 2. Loading State Gate
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="space-y-6 max-w-md">
          <div className="relative mx-auto h-16 w-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse">
            <Database className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-black tracking-wider uppercase text-slate-100">Vibrant POS</h1>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Syncing Cloud database</p>
          </div>

          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center gap-3 justify-center text-slate-400 text-xs font-mono">
            <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
            <span>Connecting to Neon Postgres...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
        
        {/* Brand details */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/15">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wider uppercase text-slate-800">Vibrant POS</h1>
              <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-1.5 py-0.5 rounded font-bold font-mono">
                CLOUD SYNCED
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Restaurant Management Panel</p>
          </div>
        </div>

        {/* Tab Controls Selector */}
        <nav className="flex items-center bg-slate-50 border border-slate-200 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pos' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
            id="tab-cashier-pos"
          >
            <ChefHat className="h-3.5 w-3.5" />
            <span>Cashier Register</span>
          </button>
          
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'customer' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
            id="tab-customer-screen"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Customer Screen</span>
            <span className={`h-2 w-2 rounded-full ${activeTab === 'customer' ? 'bg-emerald-400' : 'bg-emerald-500'} animate-pulse`} title="Live Dual Display" />
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'admin' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
            id="tab-admin-reports"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Admin Control</span>
          </button>
        </nav>

        {/* Date / Live Clock & User Controls */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <div className="hidden md:flex items-center gap-2 text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono">
            <Clock className="h-3.5 w-3.5 text-indigo-600" />
            <span>{currentTime.toLocaleDateString()}</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-slate-700">{currentTime.toLocaleTimeString()}</span>
          </div>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 text-slate-500 rounded-xl transition-all cursor-pointer font-bold shadow-sm"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 text-indigo-500" /> : <Maximize2 className="h-3.5 w-3.5 text-indigo-600" />}
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-700 font-sans">
                {user || 'Cashier'}
              </span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('vibrant_user');
                setUser(null);
              }}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

      </header>

      {/* Main Container Stage */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        {activeTab === 'pos' && (
          <POSInterface 
            products={products} 
            categories={categories}
            ordersHistory={ordersHistory}
            onOrderCompleted={handleOrderCompleted} 
          />
        )}

        {activeTab === 'customer' && (
          <CustomerScreen 
            ordersHistory={ordersHistory}
            products={products}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            products={products} 
            setProducts={setProductsAndSync} 
            categories={categories}
            setCategories={setCategoriesAndSync}
            ordersHistory={ordersHistory} 
            onResetDatabase={handleResetDatabase}
            onDeleteOrder={handleDeleteOrder}
          />
        )}
      </main>

      {/* SUCCESS CHECOUT THERMAL PRINT QUEUE OVERLAY */}
      {activeReceiptOrder && (
        <ReceiptModal 
          order={activeReceiptOrder} 
          paymentMethod={receiptPaymentMethod} 
          splitDetails={receiptSplitDetails} 
          onClose={() => setActiveReceiptOrder(null)} 
        />
      )}

    </div>
  );
}
