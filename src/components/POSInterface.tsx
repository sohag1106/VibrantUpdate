import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, Minus, Trash2, Tag, CreditCard, Banknote, 
  Smartphone, Users, Armchair, ShoppingBag, Truck, Info, Check, ChevronRight, ChefHat, Percent, Phone, MapPin, User, Edit3,
  LayoutList, LayoutGrid
} from 'lucide-react';
import { Product, CartItem, OrderType, Modifier, Order, Category, ProductVariant } from '../types';
import FoodIcon from './FoodIcon';

interface POSInterfaceProps {
  products: Product[];
  categories: Category[];
  ordersHistory: Order[];
  onOrderCompleted: (order: Order, paymentMethod: string, splitDetails?: any[]) => void;
}

export default function POSInterface({ products, categories, ordersHistory, onOrderCompleted }: POSInterfaceProps) {
  // POS States
  const [mobileView, setMobileView] = useState<'menu' | 'cart'>('menu');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vibrant_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [orderType, setOrderType] = useState<OrderType>(() => {
    try {
      const saved = localStorage.getItem('vibrant_order_type');
      return (saved as OrderType) || 'dine-in';
    } catch (e) {
      return 'dine-in';
    }
  });

  const [tableNumber, setTableNumber] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vibrant_table_number');
      return saved || '1';
    } catch (e) {
      return '1';
    }
  });

  const [customerName, setCustomerName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vibrant_customer_name');
      return saved || '';
    } catch (e) {
      return '';
    }
  });

  const [customerMobile, setCustomerMobile] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vibrant_customer_mobile');
      return saved || '';
    } catch (e) {
      return '';
    }
  });

  const [customerLocation, setCustomerLocation] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vibrant_customer_location');
      return saved || '';
    } catch (e) {
      return '';
    }
  });
  
  // Modifiers Selection Modal States
  const [modifierModalProduct, setModifierModalProduct] = useState<Product | null>(null);
  const [tempSelectedModifiers, setTempSelectedModifiers] = useState<Modifier[]>([]);
  const [tempSelectedVariant, setTempSelectedVariant] = useState<ProductVariant | null>(null);
  const [tempSelectedCrust, setTempSelectedCrust] = useState<string>('Thin Crust');
  const [tempNotes, setTempNotes] = useState('');

  // Discount States
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>(() => {
    try {
      const saved = localStorage.getItem('vibrant_discount_type');
      return (saved as 'flat' | 'percentage') || 'percentage';
    } catch (e) {
      return 'percentage';
    }
  });

  const [discountValue, setDiscountValue] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vibrant_discount_value');
      return saved ? parseFloat(saved) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vibrant_applied_coupon');
      return saved || '';
    } catch (e) {
      return '';
    }
  });

  // Tax States
  const [taxType, setTaxType] = useState<'flat' | 'percentage'>(() => {
    try {
      const saved = localStorage.getItem('vibrant_tax_type');
      return (saved as 'flat' | 'percentage') || 'percentage';
    } catch (e) {
      return 'percentage';
    }
  });

  const [taxValue, setTaxValue] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vibrant_tax_value');
      return saved ? parseFloat(saved) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [packagingCharge, setPackagingCharge] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vibrant_packaging_charge');
      return saved ? parseFloat(saved) : 15;
    } catch (e) {
      return 15;
    }
  });

  const [cashierName, setCashierName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vibrant_cashier_name');
      return saved || 'Ratul';
    } catch (e) {
      return 'Ratul';
    }
  });

  const [applyPackagingCharge, setApplyPackagingCharge] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vibrant_apply_packaging_charge');
      return saved ? saved === 'true' : false;
    } catch (e) {
      return false;
    }
  });

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('vibrant_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vibrant_packaging_charge', packagingCharge.toString());
  }, [packagingCharge]);

  useEffect(() => {
    localStorage.setItem('vibrant_apply_packaging_charge', applyPackagingCharge.toString());
  }, [applyPackagingCharge]);

  // Automatically toggle packaging charge when order type changes
  useEffect(() => {
    if (orderType === 'takeaway') {
      setApplyPackagingCharge(true);
    } else {
      setApplyPackagingCharge(false);
    }
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem('vibrant_order_type', orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem('vibrant_table_number', tableNumber);
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem('vibrant_customer_name', customerName);
  }, [customerName]);

  useEffect(() => {
    localStorage.setItem('vibrant_customer_mobile', customerMobile);
  }, [customerMobile]);

  useEffect(() => {
    localStorage.setItem('vibrant_customer_location', customerLocation);
  }, [customerLocation]);

  useEffect(() => {
    localStorage.setItem('vibrant_cashier_name', cashierName);
  }, [cashierName]);

  useEffect(() => {
    localStorage.setItem('vibrant_discount_type', discountType);
  }, [discountType]);

  useEffect(() => {
    localStorage.setItem('vibrant_discount_value', discountValue.toString());
  }, [discountValue]);

  useEffect(() => {
    localStorage.setItem('vibrant_applied_coupon', appliedCoupon);
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('vibrant_tax_type', taxType);
  }, [taxType]);

  useEffect(() => {
    localStorage.setItem('vibrant_tax_value', taxValue.toString());
  }, [taxValue]);

  // Menu View Mode (Grid vs. List)
  const [menuViewMode, setMenuViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = localStorage.getItem('vibrant_menu_view_mode');
      return (saved as 'grid' | 'list') || 'grid';
    } catch {
      return 'grid';
    }
  });

  useEffect(() => {
    localStorage.setItem('vibrant_menu_view_mode', menuViewMode);
  }, [menuViewMode]);

  // Cart View Mode (List vs. Grid)
  const [cartViewMode, setCartViewMode] = useState<'list' | 'grid'>(() => {
    try {
      const saved = localStorage.getItem('vibrant_cart_view_mode');
      return (saved as 'list' | 'grid') || 'list';
    } catch {
      return 'list';
    }
  });

  useEffect(() => {
    localStorage.setItem('vibrant_cart_view_mode', cartViewMode);
  }, [cartViewMode]);

  // Checkout Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [numSplits, setNumSplits] = useState(2);
  const [splitDetails, setSplitDetails] = useState<any[]>([]);
  const [selectedSinglePayment, setSelectedSinglePayment] = useState<'cash' | 'card' | 'mobile_pay'>('cash');
  const [amountPaid, setAmountPaid] = useState<string>('');

  // Coupons data for interactive playing
  const COUPONS = [
    { code: 'WELCOME10', type: 'percentage', value: 10, label: '10% New Customer Discount' },
    { code: 'VIP15', type: 'percentage', value: 15, label: '15% Loyalty Discount' },
    { code: 'BISTRO5', type: 'flat', value: 5.00, label: '৳5.00 Lunch Saver' },
    { code: 'STAFF50', type: 'percentage', value: 50, label: '50% Authorized Employee Discount' }
  ];

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Quick category items counting for visual metadata
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Helper to check pizza category
  const isPizzaCategory = (cat: string) => {
    if (!cat) return false;
    const lower = cat.toLowerCase();
    return lower === 'pizza' || lower.includes('pizza');
  };

  const getEffectiveVariants = (product: Product): ProductVariant[] => {
    if (product.variants && product.variants.length > 0) {
      return product.variants;
    }
    return [];
  };

  // Cart operations
  const handleProductClick = (product: Product, targetVariant?: ProductVariant) => {
    if (!product.isAvailable) return;
    
    const effectiveVariants = getEffectiveVariants(product);
    const hasVariants = effectiveVariants.length > 0;
    const hasModifiers = product.modifiers && product.modifiers.length > 0;
    const isPizza = isPizzaCategory(product.category) || product.name.toLowerCase().includes('pizza');

    // If product has modifiers, explicit variants, or is a pizza with customizable options, open the Customization Modal
    if (hasVariants || hasModifiers || isPizza) {
      const prodWithVariants = {
        ...product,
        variants: effectiveVariants.length > 0 ? effectiveVariants : undefined
      };
      setModifierModalProduct(prodWithVariants);
      setTempSelectedModifiers([]);
      setTempSelectedVariant(targetVariant || (hasVariants ? effectiveVariants[0] : null));
      setTempSelectedCrust('Thin Crust');
      setTempNotes('');
    } else {
      // Add immediately to cart with the exact single price
      addCartItemWithModifiers(product, [], '', null);
    }
  };

  const handleConfirmAddProduct = () => {
    if (!modifierModalProduct) return;
    const isPizza = isPizzaCategory(modifierModalProduct.category) || modifierModalProduct.name.toLowerCase().includes('pizza');
    let finalModifiers = [...tempSelectedModifiers];

    if (isPizza && tempSelectedCrust) {
      const crustMod: Modifier = {
        id: `crust-${tempSelectedCrust.toLowerCase().replace(/\s+/g, '-')}`,
        name: tempSelectedCrust,
        price: 0
      };
      finalModifiers = finalModifiers.filter(m => !m.name.toLowerCase().includes('crust'));
      finalModifiers.unshift(crustMod);
    }

    addCartItemWithModifiers(modifierModalProduct, finalModifiers, tempNotes, tempSelectedVariant);
  };

  const addCartItemWithModifiers = (product: Product, modifiers: Modifier[], notes: string, variant: ProductVariant | null) => {
    const modifierIdsString = modifiers.map(m => m.id).sort().join(',');
    const variantId = variant ? variant.id : '';
    
    setCart(prevCart => {
      // Check if exact product with exact same modifiers, variant & notes already exists
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id && 
        item.selectedModifiers.map(m => m.id).sort().join(',') === modifierIdsString &&
        (item.selectedVariant?.id || '') === variantId &&
        (item.notes || '') === (notes || '')
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          product,
          quantity: 1,
          selectedModifiers: modifiers,
          notes: notes.trim() ? notes : undefined,
          selectedVariant: variant || undefined
        };
        return [...prevCart, newItem];
      }
    });

    setModifierModalProduct(null);
  };

  const updateQuantity = (cartItemId: string, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const deleteCartItem = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  // Math totals
  const billingCalculations = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      const modifierSum = item.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
      const basePrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      return sum + (basePrice + modifierSum) * item.quantity;
    }, 0);

    let discount = 0;
    if (discountType === 'percentage') {
      discount = subtotal * (discountValue / 100);
    } else {
      discount = Math.min(discountValue, subtotal);
    }

    const netSubtotal = Math.max(0, subtotal - discount);
    
    let tax = 0;
    if (taxType === 'percentage') {
      tax = netSubtotal * (taxValue / 100);
    } else {
      tax = taxValue;
    }
    
    const packaging = applyPackagingCharge ? packagingCharge : 0;
    const total = netSubtotal + tax + packaging;

    return { subtotal, discount, tax, packaging, total };
  }, [cart, discountType, discountValue, taxType, taxValue, applyPackagingCharge, packagingCharge]);

  // Synchronize Live Cart Payload to Customer Display in Real-Time
  useEffect(() => {
    const payload = {
      cart,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName: customerName.trim() || undefined,
      customerMobile: customerMobile.trim() || undefined,
      customerLocation: customerLocation.trim() || undefined,
      cashierName: cashierName.trim() || 'Ratul',
      subtotal: billingCalculations.subtotal,
      discount: billingCalculations.discount,
      discountType,
      discountValue,
      tax: billingCalculations.tax,
      packaging: billingCalculations.packaging,
      total: billingCalculations.total,
      itemCount: cart.reduce((sum, i) => sum + i.quantity, 0),
      updatedAt: Date.now()
    };

    try {
      localStorage.setItem('vibrant_live_cart_payload', JSON.stringify(payload));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('vibrant_customer_display');
        bc.postMessage({ type: 'CART_UPDATE', payload });
        bc.close();
      }
    } catch (e) {
      console.warn('Customer screen broadcast error:', e);
    }
  }, [cart, orderType, tableNumber, customerName, customerMobile, customerLocation, cashierName, billingCalculations, discountType, discountValue]);

  // Apply Coupon Shortcut
  const handleApplyCoupon = (couponCode: string) => {
    if (appliedCoupon === couponCode) {
      // Toggle off
      setAppliedCoupon('');
      setDiscountValue(0);
    } else {
      const found = COUPONS.find(c => c.code === couponCode);
      if (found) {
        setAppliedCoupon(couponCode);
        setDiscountType(found.type as 'flat' | 'percentage');
        setDiscountValue(found.value);
      }
    }
  };

  // Prepare checkout split tables
  const triggerCheckoutModal = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
    
    // Set up default split payment lines in case they toggle it
    generateSplits(numSplits);
    
    // Set default single payment paid input as nearest 5/10/20 bill
    const roundedPrice = Math.ceil(billingCalculations.total / 5) * 5;
    setAmountPaid(roundedPrice.toString());
  };

  const generateSplits = (count: number) => {
    const splitAmount = parseFloat((billingCalculations.total / count).toFixed(2));
    const items = Array.from({ length: count }, (_, i) => ({
      id: `p-${i + 1}`,
      personName: `Guest ${i + 1}`,
      amount: splitAmount,
      method: '',
      isPaid: false
    }));
    
    // Adjust last guest's amount for division rounding residuals
    const sumOthers = splitAmount * (count - 1);
    const lastAmount = parseFloat((billingCalculations.total - sumOthers).toFixed(2));
    if (items.length > 0) {
      items[items.length - 1].amount = lastAmount;
    }

    setSplitDetails(items);
  };

  const handleNumSplitsChange = (count: number) => {
    const sanitized = Math.max(2, Math.min(10, count));
    setNumSplits(sanitized);
    generateSplits(sanitized);
  };

  const updateSplitAmount = (index: number, val: string) => {
    const updated = [...splitDetails];
    updated[index].amount = parseFloat(val) || 0;
    setSplitDetails(updated);
  };

  const updateSplitMethod = (index: number, method: 'cash' | 'card' | 'mobile_pay') => {
    const updated = [...splitDetails];
    updated[index].method = method;
    setSplitDetails(updated);
  };

  const toggleSplitPaid = (index: number) => {
    const updated = [...splitDetails];
    // Must select a method first
    if (!updated[index].method) {
      alert(`Please assign a payment method for ${updated[index].personName} first.`);
      return;
    }
    updated[index].isPaid = !updated[index].isPaid;
    setSplitDetails(updated);
  };

  const splitSummary = useMemo(() => {
    const totalInput = splitDetails.reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = splitDetails.filter(s => s.isPaid).reduce((sum, item) => sum + item.amount, 0);
    const sumMatchesTotal = Math.abs(totalInput - billingCalculations.total) < 0.05;
    const allPaid = splitDetails.every(s => s.isPaid);
    return { totalInput, totalPaid, sumMatchesTotal, allPaid };
  }, [splitDetails, billingCalculations.total]);

  const handleCompletePayment = () => {
    // 1. Calculate Daily Token Number (resets from 001 every day)
    const todayString = new Date().toLocaleDateString();
    const todayOrdersCount = ordersHistory.filter(o => {
      try {
        return new Date(o.createdAt).toLocaleDateString() === todayString;
      } catch (e) {
        return false;
      }
    }).length;
    const tokenNumber = String(todayOrdersCount + 1).padStart(3, '0');

    // 2. Calculate Monthly Order Number (resets monthly)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthlyOrdersCount = ordersHistory.filter(o => {
      try {
        const oDate = new Date(o.createdAt);
        return oDate.getFullYear() === currentYear && oDate.getMonth() === currentMonth;
      } catch (e) {
        return false;
      }
    }).length;
    
    const yearStr = currentYear;
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const seqStr = String(monthlyOrdersCount + 1).padStart(4, '0');
    const orderNumber = `VF-${yearStr}${monthStr}-${seqStr}`;

    const finalOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      tokenNumber,
      customerName: customerName.trim() || undefined,
      customerMobile: customerMobile.trim() || undefined,
      customerLocation: customerLocation.trim() || undefined,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      cashierName: cashierName.trim() || 'Ratul',
      paymentMethod: isSplitPayment ? 'split' : selectedSinglePayment,
      items: cart,
      subtotal: billingCalculations.subtotal,
      tax: billingCalculations.tax,
      discount: billingCalculations.discount,
      discountType,
      discountValue,
      packagingCharge: billingCalculations.packaging,
      total: billingCalculations.total,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    if (isSplitPayment) {
      if (!splitSummary.sumMatchesTotal) {
        alert("Wait: Sum of all splits does not equal the order's Grand Total!");
        return;
      }
      if (!splitSummary.allPaid) {
        alert("Please collect payment for all split lines first!");
        return;
      }
      
      onOrderCompleted(finalOrder, 'split', splitDetails);
    } else {
      const paidNum = parseFloat(amountPaid) || 0;
      if (selectedSinglePayment === 'cash' && paidNum < billingCalculations.total) {
        alert(`Insufficient funds! Collected ৳${paidNum.toFixed(2)}, required ৳${billingCalculations.total.toFixed(2)}.`);
        return;
      }
      
      onOrderCompleted(finalOrder, selectedSinglePayment, undefined);
    }

    // Broadcast order completion to customer display
    try {
      localStorage.setItem('vibrant_last_completed_order', JSON.stringify(finalOrder));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('vibrant_customer_display');
        bc.postMessage({ type: 'ORDER_COMPLETED', payload: { order: finalOrder, paymentMethod: isSplitPayment ? 'split' : selectedSinglePayment } });
        bc.close();
      }
    } catch (e) {
      console.warn('Customer screen order broadcast error:', e);
    }

    // Clean states
    setCart([]);
    setCustomerName('');
    setCustomerMobile('');
    setCustomerLocation('');
    setAppliedCoupon('');
    setDiscountValue(0);
    setIsCheckoutOpen(false);
    setIsSplitPayment(false);
  };

  return (
    <div className="flex flex-col gap-4 h-full lg:h-[calc(100vh-115px)]">
      
      {/* Mobile Top Navigation Tabs */}
      <div className="flex lg:hidden bg-white border border-slate-200 p-1.5 rounded-2xl gap-1.5 shadow-sm">
        <button
          onClick={() => setMobileView('menu')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
            mobileView === 'menu' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ChefHat className="h-4 w-4" />
          <span>Dishes Menu</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${mobileView === 'menu' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {products.length}
          </span>
        </button>
        
        <button
          onClick={() => setMobileView('cart')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
            mobileView === 'cart' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Cart Register</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${mobileView === 'cart' ? 'bg-indigo-700 text-white font-bold' : 'bg-indigo-600 text-white font-bold'}`}>
            {cart.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
      
        {/* LEFT: PRODUCTS BROWSER (7 cols on large, 7 cols on super large for better balance) */}
        <div className={`lg:col-span-6 xl:col-span-7 flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden p-5 ${mobileView === 'menu' ? 'flex' : 'hidden lg:flex'}`}>
        
        {/* Filters Top Header */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center pb-4 border-b border-slate-100">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search dishes, SKU, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
              id="product-search-input"
            />
          </div>

          {/* Top Controls: Stats & Menu View Mode Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Quick Stats banner of items found */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {filteredProducts.length} Items
              </span>
            </div>

            {/* Menu View Mode Switcher (Grid vs List) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setMenuViewMode('grid')}
                title="Grid View"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  menuViewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setMenuViewMode('list')}
                title="List View"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  menuViewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-3.5 scrollbar-thin border-b border-slate-100">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-100' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Container (Grid or List View) */}
        <div className="flex-1 overflow-y-auto pr-1 py-4">
          {filteredProducts.length > 0 ? (
            menuViewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleProductClick(p)}
                    className={`group bg-white border rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all ${
                      p.isAvailable 
                        ? 'border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-600/5 hover:translate-y-[-2px]' 
                        : 'border-slate-100 opacity-50 cursor-not-allowed'
                    }`}
                    title={p.isAvailable ? "Click to add item with modifiers" : "OUT OF STOCK"}
                  >
                    <div className="relative aspect-video w-full bg-slate-50 flex items-center justify-center p-3 select-none">
                      <div className="h-14 w-14 group-hover:scale-110 transition-transform duration-300">
                        <FoodIcon 
                          category={p.category} 
                          name={p.name} 
                          className="h-7 w-7 text-white" 
                        />
                      </div>
                      
                      {/* Category Label */}
                      <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-[9px] font-bold text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                        {p.category.toUpperCase()}
                      </span>

                      {!p.isAvailable && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Out of stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h4>
                      
                      {p.variants && p.variants.length > 0 ? (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Sizes & Prices</span>
                            <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                              {p.variants.length} {p.variants.length === 1 ? 'Size' : 'Sizes'}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {p.variants.map((variant) => (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductClick(p, variant);
                                }}
                                className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all text-center cursor-pointer group/size"
                                title={`Click to choose ${variant.name}`}
                              >
                                <span className="text-[9px] font-bold text-slate-700 group-hover/size:text-white leading-tight">
                                  {variant.name.replace(/\s*\(\d+"\)/, '')}
                                </span>
                                <span className="text-[9px] font-mono font-black text-indigo-600 group-hover/size:text-indigo-100">
                                  ৳{variant.price.toFixed(2)}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-extrabold font-mono text-slate-800">
                            ৳{p.price.toFixed(2)}
                          </span>
                          {p.modifiers && p.modifiers.length > 0 && p.isAvailable && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md font-medium">
                              +{p.modifiers.length} Customizers
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-2.5">
                {filteredProducts.map(p => {
                  const minVariantPrice = p.variants && p.variants.length > 0 
                    ? Math.min(...p.variants.map(v => v.price)) 
                    : p.price;
                  const maxVariantPrice = p.variants && p.variants.length > 0 
                    ? Math.max(...p.variants.map(v => v.price)) 
                    : p.price;
                  const hasPriceRange = p.variants && p.variants.length > 1 && minVariantPrice !== maxVariantPrice;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleProductClick(p)}
                      className={`group bg-white border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer ${
                        p.isAvailable 
                          ? 'border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-600/5 hover:bg-slate-50/50' 
                          : 'border-slate-100 opacity-50 cursor-not-allowed bg-slate-50/40'
                      }`}
                      title={p.isAvailable ? "Click to add item with modifiers" : "OUT OF STOCK"}
                    >
                      {/* Left: Product Icon & Info */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="relative h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80 overflow-hidden">
                          <FoodIcon 
                            category={p.category} 
                            name={p.name} 
                            className="h-6 w-6 text-white" 
                          />
                          {!p.isAvailable && (
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                              <span className="text-[7.5px] font-black text-red-400 uppercase">
                                Out
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-850 truncate group-hover:text-indigo-600 transition-colors">
                              {p.name}
                            </h4>
                            <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                              {p.category}
                            </span>
                            {p.modifiers && p.modifiers.length > 0 && p.isAvailable && (
                              <span className="text-[9.5px] bg-indigo-50 text-indigo-600 border border-indigo-100/80 px-1.5 py-0.2 rounded font-medium">
                                +{p.modifiers.length} Customizers
                              </span>
                            )}
                          </div>

                          {/* Variants Pills in List View */}
                          {p.variants && p.variants.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sizes:</span>
                              {p.variants.map(variant => (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductClick(p, variant);
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 bg-white hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all text-xs cursor-pointer group/pill"
                                  title={`Choose ${variant.name} - ৳${variant.price.toFixed(2)}`}
                                >
                                  <span className="text-[9.5px] font-semibold text-slate-700 group-hover/pill:text-white">
                                    {variant.name.replace(/\s*\(\d+"\)/, '')}
                                  </span>
                                  <span className="text-[9.5px] font-mono font-bold text-indigo-600 group-hover/pill:text-indigo-100">
                                    ৳{variant.price.toFixed(0)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Price and Quick Add */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 font-bold block sm:hidden uppercase text-[9px]">Price</span>
                          <span className="text-sm font-extrabold font-mono text-slate-900">
                            {hasPriceRange ? `৳${minVariantPrice.toFixed(0)} - ৳${maxVariantPrice.toFixed(0)}` : `৳${minVariantPrice.toFixed(2)}`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(p);
                          }}
                          disabled={!p.isAvailable}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                            p.isAvailable
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer group-hover:shadow-indigo-600/20'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <ShoppingBag className="h-10 w-10 text-slate-300 mb-2.5 animate-pulse" />
              <p className="text-sm font-medium">No active products match selection</p>
              <p className="text-xs text-slate-400">Try modifying your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: CART AND ORDER REGISTER PANEL (Larger desktop footprint) */}
      <div className={`lg:col-span-6 xl:col-span-5 flex flex-col h-full bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden ${mobileView === 'cart' ? 'flex' : 'hidden lg:flex'}`}>
        
        {/* Cart Top Header (Order Details) */}
        <div className="p-5 border-b border-slate-150 bg-slate-50/50 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span>Cart Register</span>
                <span className="bg-indigo-600 text-white text-xs px-3 py-0.5 rounded-full font-mono font-black">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
                </span>
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {/* List / Grid View Switcher */}
              <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300">
                <button
                  type="button"
                  onClick={() => setCartViewMode('list')}
                  title="List View"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    cartViewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutList className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCartViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    cartViewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>

              {cart.length > 0 && (
                <button 
                  onClick={() => setCart([])}
                  className="text-xs text-red-600 hover:text-red-800 transition-colors font-bold flex items-center gap-1 cursor-pointer pl-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Cashier Name Bar */}
          <div className="flex items-center justify-between bg-slate-100 p-2 px-3 rounded-xl border border-slate-200">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-1.5 shrink-0">
              <User className="h-3.5 w-3.5 text-indigo-600" />
              <span>Cashier Name:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                placeholder="Cashier Name"
                className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg w-36 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right pr-7"
                title="Cashier Name printed on receipts"
              />
              <Edit3 className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Service Types Selector */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setOrderType('dine-in')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderType === 'dine-in' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Armchair className="h-4 w-4" />
              <span>Dine-In</span>
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderType === 'takeaway' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Takeaway</span>
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderType === 'pickup' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>Online order</span>
            </button>
          </div>

          {/* Table Selector (If dine-in is selected) */}
          {orderType === 'dine-in' && (
            <div className="flex flex-col gap-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Assign Active Table:</span>
              <div className="grid grid-cols-6 gap-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(tbl => (
                  <button
                    key={tbl}
                    onClick={() => setTableNumber(tbl)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-black transition-all border cursor-pointer ${
                      tableNumber === tbl 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-100' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-100'
                    }`}
                  >
                    T{tbl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Packaging helper for takeaway */}
          {orderType === 'takeaway' && (
            <div className="flex items-center justify-between bg-indigo-50/60 border border-indigo-200/80 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Packaging Charge</span>
                  <span className="text-xs font-bold text-slate-800">
                    {applyPackagingCharge ? `Enabled: ৳${packagingCharge.toFixed(2)}` : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setApplyPackagingCharge(!applyPackagingCharge)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                    applyPackagingCharge
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {applyPackagingCharge ? 'Remove' : 'Add ৳'}
                </button>
                {applyPackagingCharge && (
                  <div className="relative w-16">
                    <span className="absolute inset-y-0 left-1.5 flex items-center text-slate-400 font-mono text-[9px] pointer-events-none">৳</span>
                    <input
                      type="number"
                      min="0"
                      value={packagingCharge || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setPackagingCharge(Math.max(0, val));
                      }}
                      className="w-full pl-4 pr-1 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Online Order Customer Details (Mobile & Name) */}
          {orderType === 'pickup' && (
            <div className="bg-emerald-50/80 border border-emerald-200/90 p-3.5 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-emerald-900">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">
                    Online Order Customer Details
                  </span>
                </div>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                  Required for Dispatch
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahim Chowdhury"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-250 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5 text-emerald-600" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-250 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5 text-emerald-600" />
                  Delivery Location / Address
                </label>
                <input
                  type="text"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-250 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item Rows list / Grid - Compact, beautifully spaced, and high contrast */}
        <div className="flex-1 overflow-y-auto p-3.5 bg-slate-50">
          {cart.length > 0 ? (
            cartViewMode === 'list' ? (
              <div className="space-y-2.5">
                {cart.map(item => {
                  const modifierSum = item.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
                  const basePrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                  const singleItemTotal = basePrice + modifierSum;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-white border border-slate-200 hover:border-indigo-500 p-3 rounded-xl flex flex-col transition-all duration-150 shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 break-words leading-tight tracking-tight flex flex-wrap items-center gap-1">
                              {item.product.name}
                              {item.selectedVariant && (
                                <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-50 border border-indigo-200 text-indigo-600 rounded">
                                  {item.selectedVariant.name}
                                </span>
                              )}
                            </h4>
                            <span className="text-[10px] font-bold text-indigo-600 font-mono">
                              ৳{singleItemTotal.toFixed(2)} each
                            </span>
                          </div>
                          <button 
                            onClick={() => deleteCartItem(item.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors border border-transparent hover:border-red-100 flex-shrink-0 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Modifiers names details */}
                        {item.selectedModifiers.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {item.selectedModifiers.map(m => (
                              <span key={m.id} className="text-[9px] bg-slate-50 border border-slate-150 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                                +{m.name} (+৳{m.price.toFixed(2)})
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Note badge */}
                        {item.notes && (
                          <div className="mt-1.5 text-[9px] bg-amber-50/70 border border-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium italic w-fit flex items-center gap-1">
                            <Info className="h-3 w-3 text-amber-600 shrink-0" />
                            <span>"{item.notes}"</span>
                          </div>
                        )}

                        {/* Quantity Selector and Row total bottom */}
                        <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-slate-500 font-semibold font-mono">
                            Total: <span className="text-slate-900 font-bold text-xs">৳{(singleItemTotal * item.quantity).toFixed(2)}</span>
                          </span>
                          <div className="flex items-center gap-1.5 bg-slate-50 p-0.5 rounded-lg border border-slate-200">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition-all cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold font-mono text-slate-900 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition-all cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cart.map(item => {
                  const modifierSum = item.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
                  const basePrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                  const singleItemTotal = basePrice + modifierSum;
                  const lineTotal = singleItemTotal * item.quantity;

                  return (
                    <div 
                      key={item.id}
                      className="bg-white border border-slate-200 hover:border-indigo-500 p-3 rounded-xl flex flex-col justify-between transition-all duration-150 shadow-sm relative group"
                    >
                      <div>
                        {/* Top: Header & Delete */}
                        <div className="flex justify-between items-start gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                              <FoodIcon category={item.product.category} className="h-4 w-4" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight" title={item.product.name}>
                              {item.product.name}
                            </h4>
                          </div>
                          <button 
                            onClick={() => deleteCartItem(item.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Variant badge */}
                        {item.selectedVariant && (
                          <div className="mt-1">
                            <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold bg-indigo-50 border border-indigo-200 text-indigo-600 rounded inline-block">
                              {item.selectedVariant.name}
                            </span>
                          </div>
                        )}

                        {/* Modifiers Count / preview */}
                        {item.selectedModifiers.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-0.5">
                            {item.selectedModifiers.map(m => (
                              <span key={m.id} className="text-[8px] bg-slate-50 border border-slate-150 text-slate-600 px-1 rounded font-medium">
                                +{m.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Note badge */}
                        {item.notes && (
                          <div className="mt-1 text-[8.5px] bg-amber-50 border border-amber-100 text-amber-800 px-1 py-0.5 rounded font-medium italic line-clamp-1" title={item.notes}>
                            "{item.notes}"
                          </div>
                        )}
                      </div>

                      {/* Bottom row: Unit price, Qty +/- and Line Total */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 font-mono">৳{singleItemTotal.toFixed(2)}/ea</span>
                          <span className="font-bold text-indigo-700 font-mono text-xs">৳{lineTotal.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-1 rounded-lg border border-slate-200">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition-all cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-black font-mono text-slate-900">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition-all cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16">
              <ShoppingBag className="h-12 w-12 text-slate-300 mb-3 animate-bounce" />
              <p className="text-sm font-bold text-slate-600">Empty Register Cart</p>
              <p className="text-xs text-slate-400 mt-1">Select dishes on the left to begin filling your cart.</p>
            </div>
          )}
        </div>

        {/* Calculations and payment triggers */}
        <div className="bg-slate-50 p-5 border-t border-slate-200 space-y-4">

          {/* Pricing Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Subtotal</span>
              <span className="font-mono text-slate-700">
                ৳{billingCalculations.subtotal.toFixed(2)}
              </span>
            </div>
            
            {billingCalculations.discount > 0 && (
              <div className="flex justify-between text-xs text-indigo-600 font-semibold animate-pulse">
                <span>Discount ({appliedCoupon ? `Coupon ${appliedCoupon}` : discountType === 'percentage' ? `${discountValue}%` : 'Flat'})</span>
                <span className="font-mono">
                  -৳{billingCalculations.discount.toFixed(2)}
                </span>
              </div>
            )}

            {billingCalculations.tax > 0 && (
              <div className="flex justify-between text-xs text-amber-600 font-semibold">
                <span>Tax ({taxType === 'percentage' ? `${taxValue}%` : 'Flat'})</span>
                <span className="font-mono">
                  +৳{billingCalculations.tax.toFixed(2)}
                </span>
              </div>
            )}

            {billingCalculations.packaging > 0 && (
              <div className="flex justify-between text-xs text-indigo-600 font-semibold">
                <span>Packaging Charge</span>
                <span className="font-mono">
                  +৳{billingCalculations.packaging.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-800 pt-2 border-t border-slate-200">
              <span className="text-sm font-bold">Grand Total</span>
              <span className="text-xl font-black font-mono text-indigo-600 tracking-tight">
                ৳{billingCalculations.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={triggerCheckoutModal}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 ${
              cart.length > 0 
                ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white cursor-pointer shadow-lg shadow-indigo-100' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>Proceed to Payment</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>

      {/* MODAL 1: CHOOSE MODIFIERS & CUSTOMIZE PRODUCT */}
      <AnimatePresence>
        {modifierModalProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex-shrink-0">
                    <FoodIcon 
                      category={modifierModalProduct.category} 
                      name={modifierModalProduct.name} 
                      className="h-5 w-5" 
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{modifierModalProduct.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">Base Price: ৳{modifierModalProduct.price.toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModifierModalProduct(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                
                {/* Variant Selector (if product has variants) */}
                {modifierModalProduct.variants && modifierModalProduct.variants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Size</h4>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {modifierModalProduct.variants.length} {modifierModalProduct.variants.length === 1 ? 'Size' : 'Sizes'} Available
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {modifierModalProduct.variants.map(variant => {
                        const isSelected = tempSelectedVariant?.id === variant.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setTempSelectedVariant(variant)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-900/5'
                            }`}
                          >
                            <span className="text-xs font-bold">{variant.name}</span>
                            <span className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-indigo-100 font-bold' : 'text-indigo-600 font-black'}`}>
                              ৳{variant.price.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Crust Selector (if Pizza) */}
                {(isPizzaCategory(modifierModalProduct.category) || modifierModalProduct.name.toLowerCase().includes('pizza')) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Crust</h4>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        Crust Type
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'thin', name: 'Thin Crust' },
                        { id: 'medium', name: 'Medium Crust' },
                        { id: 'thick', name: 'Thick Crust' }
                      ].map(crust => {
                        const isSelected = tempSelectedCrust === crust.name;
                        return (
                          <button
                            key={crust.id}
                            type="button"
                            onClick={() => setTempSelectedCrust(crust.name)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-100 ring-2 ring-amber-500/20' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs font-bold">{crust.name}</span>
                            <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                              Standard
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Modifiers List */}
                {modifierModalProduct.modifiers && modifierModalProduct.modifiers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Modifiers / Add-ons</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {modifierModalProduct.modifiers.map(mod => {
                        const isSelected = tempSelectedModifiers.some(m => m.id === mod.id);
                        return (
                          <button
                            key={mod.id}
                            onClick={() => {
                              if (isSelected) {
                                setTempSelectedModifiers(prev => prev.filter(m => m.id !== mod.id));
                              } else {
                                setTempSelectedModifiers(prev => [...prev, mod]);
                              }
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                              isSelected 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                            }`}
                          >
                            <span className="text-xs font-semibold">{mod.name}</span>
                            <span className="text-xs font-mono font-bold text-indigo-600">
                              +৳{mod.price.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chef Special Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Special Chef Instructions
                  </label>
                  <textarea
                    placeholder="e.g. No onion, extra spicy, well done, sauce on side..."
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="w-full h-16 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Total item price:{' '}
                  <span className="text-sm font-extrabold font-mono text-slate-800">
                    ৳{((tempSelectedVariant ? tempSelectedVariant.price : modifierModalProduct.price) + tempSelectedModifiers.reduce((acc, m) => acc + m.price, 0)).toFixed(2)}
                  </span>
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setModifierModalProduct(null)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 font-semibold hover:text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAddProduct}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg font-bold shadow-md shadow-indigo-100"
                  >
                    Confirm & Add
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DETAILED CHECKOUT AND SPLIT PAYMENTS */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8"
            >
              
              {/* Checkout Modal Header */}
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-bold text-slate-800">Secure Payment Gateway</h3>
                  <p className="text-xs text-slate-500 font-mono">Pay-First Enforcement Protocol Active</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              {/* Checkout Main Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                
                {/* Total Balance info bar */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex justify-between items-center shadow-inner">
                  <span className="text-xs font-semibold text-slate-300">POS Billing Amount Required:</span>
                  <span className="text-2xl font-mono font-black text-emerald-400 tracking-tight">
                    ৳{billingCalculations.total.toFixed(2)}
                  </span>
                </div>

                {/* DISCOUNT & TAX ADJUSTMENT HUB */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-indigo-500" />
                      Discount & Tax Adjustment Hub
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">Live calculation update active</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    
                    {/* Discount Segment */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-indigo-500" />
                          Discount Control
                        </span>
                        {(discountValue > 0 || appliedCoupon) && (
                          <button 
                            onClick={() => { setAppliedCoupon(''); setDiscountValue(0); }}
                            className="text-[10px] text-red-500 hover:underline font-bold cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Type Switch & Preset shortcuts */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType('percentage');
                              setDiscountValue(prev => Math.min(100, prev));
                              setAppliedCoupon('');
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              discountType === 'percentage'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            %
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType('flat');
                              setAppliedCoupon('');
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              discountType === 'flat'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            ৳
                          </button>
                        </div>

                        {/* Presets */}
                        <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
                          {discountType === 'percentage' ? (
                            [0, 5, 10, 15, 20].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => {
                                  setDiscountValue(val);
                                  setAppliedCoupon('');
                                }}
                                className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                                  discountValue === val && !appliedCoupon
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                              >
                                {val}%
                              </button>
                            ))
                          ) : (
                            [0, 2, 5, 10, 20, 50].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => {
                                  setDiscountValue(val);
                                  setAppliedCoupon('');
                                }}
                                className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                                  discountValue === val && !appliedCoupon
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                              >
                                -৳{val}
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Manual input & Coupons */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400 font-bold text-[10px]">
                            {discountType === 'percentage' ? '%' : '৳'}
                          </span>
                          <input
                            type="number"
                            min="0"
                            max={discountType === 'percentage' ? 100 : undefined}
                            value={discountValue || ''}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              if (discountType === 'percentage') {
                                setDiscountValue(Math.min(100, Math.max(0, val)));
                              } else {
                                setDiscountValue(Math.max(0, val));
                              }
                              setAppliedCoupon('');
                            }}
                            placeholder="Custom"
                            className="w-full pl-5 pr-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-850 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                          />
                        </div>

                        <select
                          value={appliedCoupon}
                          onChange={(e) => handleApplyCoupon(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] px-1.5 py-1.5 text-slate-600 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="">Coupons</option>
                          {COUPONS.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Tax Segment */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Percent className="h-3.5 w-3.5 text-indigo-500" />
                          Tax Control
                        </span>
                        {taxValue > 0 && (
                          <button 
                            onClick={() => setTaxValue(0)}
                            className="text-[10px] text-red-500 hover:underline font-bold cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Tax Type & Presets */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setTaxType('percentage');
                              setTaxValue(prev => Math.min(100, prev));
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              taxType === 'percentage'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            %
                          </button>
                          <button
                            type="button"
                            onClick={() => setTaxType('flat')}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              taxType === 'flat'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            ৳
                          </button>
                        </div>

                        {/* Presets */}
                        <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
                          {taxType === 'percentage' ? (
                            [0, 5, 10, 15, 20].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setTaxValue(val)}
                                className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                                  taxValue === val
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                              >
                                {val}%
                              </button>
                            ))
                          ) : (
                            [0, 5, 10, 20, 50].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setTaxValue(val)}
                                className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                                  taxValue === val
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                              >
                                +৳{val}
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Manual input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400 font-bold text-[10px]">
                          {taxType === 'percentage' ? '%' : '৳'}
                        </span>
                        <input
                          type="number"
                          min="0"
                          max={taxType === 'percentage' ? 100 : undefined}
                          value={taxValue || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (taxType === 'percentage') {
                              setTaxValue(Math.min(100, Math.max(0, val)));
                            } else {
                              setTaxValue(Math.max(0, val));
                            }
                          }}
                          placeholder="Custom tax rate"
                          className="w-full pl-5 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-850 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                        />
                      </div>
                    </div>

                    {/* Packaging Segment */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <ShoppingBag className="h-3.5 w-3.5 text-indigo-500" />
                          Packaging Control
                        </span>
                        {applyPackagingCharge && (
                          <button 
                            type="button"
                            onClick={() => { setApplyPackagingCharge(false); }}
                            className="text-[10px] text-red-500 hover:underline font-bold cursor-pointer"
                          >
                            Disable
                          </button>
                        )}
                      </div>

                      {/* Enable/Disable Selector */}
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full">
                        <button
                          type="button"
                          onClick={() => setApplyPackagingCharge(true)}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                            applyPackagingCharge
                              ? 'bg-white text-indigo-600 shadow-sm'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setApplyPackagingCharge(false)}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                            !applyPackagingCharge
                              ? 'bg-white text-indigo-600 shadow-sm'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          No
                        </button>
                      </div>

                      {/* Presets */}
                      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
                        {[5, 10, 15, 20, 30].map(val => (
                          <button
                            key={val}
                            type="button"
                            disabled={!applyPackagingCharge}
                            onClick={() => setPackagingCharge(val)}
                            className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              applyPackagingCharge && packagingCharge === val
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                            }`}
                          >
                            ৳{val}
                          </button>
                        ))}
                      </div>

                      {/* Manual input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-450 font-bold text-[10px]">
                          ৳
                        </span>
                        <input
                          type="number"
                          min="0"
                          disabled={!applyPackagingCharge}
                          value={applyPackagingCharge ? packagingCharge : ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPackagingCharge(Math.max(0, val));
                          }}
                          placeholder="Custom charge"
                          className="w-full pl-5 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-850 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Pricing Breakdown Sheet */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Gross Subtotal</span>
                      <span className="font-mono">৳{billingCalculations.subtotal.toFixed(2)}</span>
                    </div>

                    {billingCalculations.discount > 0 && (
                      <div className="flex justify-between text-indigo-600 font-bold">
                        <span>Discount {appliedCoupon ? `(Coupon: ${appliedCoupon})` : `(${discountType === 'percentage' ? `${discountValue}%` : 'Flat'})`}</span>
                        <span className="font-mono">-৳{billingCalculations.discount.toFixed(2)}</span>
                      </div>
                    )}

                    {billingCalculations.tax > 0 && (
                      <div className="flex justify-between text-amber-600 font-bold">
                        <span>Tax ({taxType === 'percentage' ? `${taxValue}%` : 'Flat'})</span>
                        <span className="font-mono">+৳{billingCalculations.tax.toFixed(2)}</span>
                      </div>
                    )}

                    {billingCalculations.packaging > 0 && (
                      <div className="flex justify-between text-indigo-600 font-bold">
                        <span>Packaging Charge</span>
                        <span className="font-mono">+৳{billingCalculations.packaging.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-800 font-black border-t border-slate-150 pt-1.5 text-sm">
                      <span>Adjusted Net Total</span>
                      <span className="font-mono text-indigo-600">৳{billingCalculations.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Details Inputs */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-indigo-600" />
                        Customer Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value)}
                        placeholder="e.g. 01712345678"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-indigo-600" />
                      Delivery Location / Customer Address
                    </label>
                    <input
                      type="text"
                      value={customerLocation}
                      onChange={(e) => setCustomerLocation(e.target.value)}
                      placeholder="e.g. House 12, Road 5, Block B, Mirpur-10, Dhaka"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                    />
                  </div>
                </div>

                {/* Split payment toggler */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Split Payment Support</h4>
                      <p className="text-[10px] text-slate-400">Divide order among table occupants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isSplitPayment && (
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                        <button 
                          onClick={() => handleNumSplitsChange(numSplits - 1)}
                          className="p-1 hover:bg-slate-50 rounded text-slate-500"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold font-mono text-slate-700 w-6 text-center">
                          {numSplits}
                        </span>
                        <button 
                          onClick={() => handleNumSplitsChange(numSplits + 1)}
                          className="p-1 hover:bg-slate-50 rounded text-slate-500"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setIsSplitPayment(!isSplitPayment)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSplitPayment 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {isSplitPayment ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {isSplitPayment ? (
                  /* SPLIT PAYMENTS COMPONENT */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <span>Splits ledger</span>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${splitSummary.sumMatchesTotal ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'}`}>
                        LEDGER SUM: ৳{splitSummary.totalInput.toFixed(2)} / ৳{billingCalculations.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150 bg-slate-50/50">
                      {splitDetails.map((s, idx) => (
                        <div key={s.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                            <span className="font-bold text-slate-800">{s.personName}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Amount input per person */}
                            <div className="relative">
                              <span className="absolute inset-y-0 left-2 flex items-center text-slate-400 font-mono">৳</span>
                              <input
                                type="number"
                                step="0.01"
                                disabled={s.isPaid}
                                value={s.amount}
                                onChange={(e) => updateSplitAmount(idx, e.target.value)}
                                className="w-24 pl-5 pr-2 py-1 bg-white border border-slate-200 rounded text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-55"
                              />
                            </div>

                            {/* Method Selector */}
                            <select
                              disabled={s.isPaid}
                              value={s.method}
                              onChange={(e) => updateSplitMethod(idx, e.target.value as any)}
                              className="bg-white border border-slate-200 text-slate-700 py-1 px-2 rounded font-semibold text-xs focus:outline-none disabled:opacity-55"
                            >
                              <option value="">Select Mode</option>
                              <option value="cash">Cash</option>
                              <option value="card">Card</option>
                              <option value="mobile_pay">Mobile</option>
                            </select>

                            {/* Mark Paid button */}
                            <button
                              onClick={() => toggleSplitPaid(idx)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition-colors ${
                                s.isPaid 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              {s.isPaid ? <Check className="h-3.5 w-3.5" /> : null}
                              <span>{s.isPaid ? 'Paid' : 'Collect'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Split ledger status indicators */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Collected Balance</span>
                        <span className="font-mono text-sm font-bold text-emerald-600">
                          ৳{splitSummary.totalPaid.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Remaining Balance</span>
                        <span className="font-mono text-sm font-bold text-slate-600">
                          ৳{Math.max(0, billingCalculations.total - splitSummary.totalPaid).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SINGLE PAYMENT COMPONENT */
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Payment Method</h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setSelectedSinglePayment('cash')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          selectedSinglePayment === 'cash' 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md shadow-indigo-100' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        <Banknote className="h-5 w-5 text-indigo-600" />
                        <span className="text-xs font-semibold">Cash</span>
                      </button>
                      <button
                        onClick={() => setSelectedSinglePayment('card')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          selectedSinglePayment === 'card' 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md shadow-indigo-100' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                        <span className="text-xs font-semibold">Bank Card</span>
                      </button>
                      <button
                        onClick={() => setSelectedSinglePayment('mobile_pay')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          selectedSinglePayment === 'mobile_pay' 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md shadow-indigo-100' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        <Smartphone className="h-5 w-5 text-indigo-600" />
                        <span className="text-xs font-semibold">Mobile NFC / QR</span>
                      </button>
                    </div>

                    {selectedSinglePayment === 'cash' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Received from Customer</label>
                          <div className="flex gap-1">
                            {/* Bill Quick Selection */}
                            {[50, 100, 500, 1000].map(bill => (
                              <button
                                key={bill}
                                onClick={() => setAmountPaid(bill.toString())}
                                className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono font-semibold text-[10px] text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                              >
                                ৳{bill}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 font-mono text-sm">৳</span>
                            <input
                              type="number"
                              step="0.01"
                              value={amountPaid}
                              onChange={(e) => setAmountPaid(e.target.value)}
                              className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="0.00"
                            />
                          </div>

                          <div className="flex justify-between items-center px-4 py-2 bg-white rounded-xl border border-slate-200">
                            <span className="text-xs font-semibold text-slate-400">Cash Change back:</span>
                            <span className={`text-md font-mono font-black ${parseFloat(amountPaid) >= billingCalculations.total ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {parseFloat(amountPaid) >= billingCalculations.total 
                                ? `৳${(parseFloat(amountPaid) - billingCalculations.total).toFixed(2)}` 
                                : '৳0.00'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Modal Footer actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">
                  Secure checkout session • Auth Token verified
                </span>
                
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 font-semibold hover:text-slate-800 hover:bg-slate-50"
                  >
                    Modify Order
                  </button>
                  <button
                    onClick={handleCompletePayment}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-bold shadow-lg shadow-emerald-100 flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Authorize Transaction</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
