import React, { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit, Trash2, Calendar, FileSpreadsheet, Percent, Tag, 
  TrendingUp, ShoppingCart, DollarSign, Clock, HelpCircle, Save, CheckCircle, ToggleLeft, ToggleRight, Info, RotateCcw,
  ArrowLeft, Printer, ChefHat, Download, GripVertical
} from 'lucide-react';
import { Product, Order, Category, SalesKPIs, Modifier, ProductVariant } from '../types';
import { downloadInvoicePdf, downloadKitchenKotPdf } from '../utils/pdfGenerator';
import { generate58mmThermalReceiptHtml, generate58mmThermalKotHtml } from '../utils/receiptGenerator';
import { PHP_EXCEL_EXPORT_CODE } from '../data/initialData';
import FoodIcon from './FoodIcon';

interface AdminPanelProps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  ordersHistory: Order[];
  onResetDatabase: () => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
}

export default function AdminPanel({ 
  products, 
  setProducts, 
  categories, 
  setCategories, 
  ordersHistory, 
  onResetDatabase,
  onDeleteOrder
}: AdminPanelProps) {
  // Tabs within Admin panel
  const [adminTab, setAdminTab] = useState<'crud' | 'categories' | 'reports' | 'orders'>('crud');
  
  // Date filter for Reports
  const [dateFilter, setDateFilter] = useState<'today' | 'weekly' | 'monthly'>('weekly');

  // CRUD Product Modals States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Custom non-blocking interactive states
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [customAlertMessage, setCustomAlertMessage] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);
  
  // New Category form state
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Category drag and drop reordering states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Product Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('shingara');
  const [formPrice, setFormPrice] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formModifiers, setFormModifiers] = useState<Modifier[]>([]);
  const [newModName, setNewModName] = useState('');
  const [newModPrice, setNewModPrice] = useState('');

  // Pizza Size Price states
  const [pizzaSmallPrice, setPizzaSmallPrice] = useState('9.99');
  const [pizzaMediumPrice, setPizzaMediumPrice] = useState('13.99');
  const [pizzaLargePrice, setPizzaLargePrice] = useState('18.99');

  // Product Variants / Sizes states
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');

  // Category-Wise Modifiers management states
  const [catModSelectedCat, setCatModSelectedCat] = useState<string>(() => {
    return categories.find(c => c.id !== 'all')?.id || 'shingara';
  });
  const [catModName, setCatModName] = useState('');
  const [catModPrice, setCatModPrice] = useState('');
  const [targetModCategory, setTargetModCategory] = useState<string>('shingara');

  // Helper: Get aggregated list of unique modifiers for a specific category
  const getCategoryModifiersList = (catId: string) => {
    const catProducts = products.filter(p => p.category === catId);
    const map = new Map<string, { name: string; price: number; count: number }>();
    
    catProducts.forEach(p => {
      (p.modifiers || []).forEach(m => {
        const key = `${m.name.trim().toLowerCase()}_${m.price}`;
        if (!map.has(key)) {
          map.set(key, { name: m.name, price: m.price, count: 1 });
        } else {
          const existing = map.get(key)!;
          map.set(key, { ...existing, count: existing.count + 1 });
        }
      });
    });
    
    return Array.from(map.values());
  };

  // Helper: Add modifier category-wise
  const handleAddModifierToCategory = (catId: string, name: string, price: number) => {
    const nameTrimmed = name.trim();
    if (!nameTrimmed) return;

    const targetCatObj = categories.find(c => c.id === catId);
    const catName = targetCatObj ? targetCatObj.name : catId;

    const newMod: Modifier = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: nameTrimmed,
      price: price
    };

    // Update products belonging to this category
    setProducts(prev => prev.map(p => {
      if (p.category === catId) {
        const exists = (p.modifiers || []).some(m => m.name.toLowerCase() === nameTrimmed.toLowerCase());
        if (!exists) {
          return {
            ...p,
            modifiers: [...(p.modifiers || []), newMod]
          };
        }
      }
      return p;
    }));

    // If modal is open and current product category matches catId, update formModifiers
    if (isProductModalOpen && formCategory === catId) {
      setFormModifiers(prev => {
        const exists = prev.some(m => m.name.toLowerCase() === nameTrimmed.toLowerCase());
        return exists ? prev : [...prev, newMod];
      });
    }

    triggerAdminToast(`Added modifier "${nameTrimmed}" (+৳${price.toFixed(2)}) to Category: "${catName}"`);
  };

  // Helper: Remove modifier category-wise
  const handleRemoveModifierFromCategory = (catId: string, modifierName: string) => {
    const targetCatObj = categories.find(c => c.id === catId);
    const catName = targetCatObj ? targetCatObj.name : catId;
    const lowerName = modifierName.toLowerCase();

    setProducts(prev => prev.map(p => {
      if (p.category === catId && p.modifiers) {
        return {
          ...p,
          modifiers: p.modifiers.filter(m => m.name.toLowerCase() !== lowerName)
        };
      }
      return p;
    }));

    if (isProductModalOpen && formCategory === catId) {
      setFormModifiers(prev => prev.filter(m => m.name.toLowerCase() !== lowerName));
    }

    triggerAdminToast(`Removed modifier "${modifierName}" from Category: "${catName}"`);
  };

  const isPizzaCategory = (cat: string) => {
    if (!cat) return false;
    const lower = cat.toLowerCase();
    return lower === 'pizza' || lower.includes('pizza');
  };

  const handleAddCustomVariant = () => {
    if (!newVarName.trim()) {
      setCustomAlertMessage('Please enter a size name (e.g. Small (8"), Medium (10"), Large (12")).');
      return;
    }
    const price = parseFloat(newVarPrice) || 0;
    if (price <= 0) {
      setCustomAlertMessage('Please enter a valid price (> 0).');
      return;
    }

    const newVar: ProductVariant = {
      id: `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newVarName.trim(),
      price: price
    };

    setFormVariants(prev => [...prev, newVar]);
    setNewVarName('');
    setNewVarPrice('');
  };

  const handleUpdateVariant = (id: string, name: string, price: number) => {
    setFormVariants(prev => prev.map(v => v.id === id ? { ...v, name, price } : v));
  };

  const handleRemoveVariant = (id: string) => {
    setFormVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleAddPresetSize = (sizeName: string, defaultPrice: number) => {
    const exists = formVariants.some(v => v.name.toLowerCase().includes(sizeName.toLowerCase().split(' ')[0]));
    if (exists) {
      triggerAdminToast(`Size "${sizeName}" is already added.`);
      return;
    }
    const newVar: ProductVariant = {
      id: `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: sizeName,
      price: defaultPrice
    };
    setFormVariants(prev => [...prev, newVar]);
  };

  // Compute live KPIs based on actual order history
  const calculatedKPIs = useMemo(() => {
    let revenue = 0;
    let ordersCount = ordersHistory.length;
    let pendingCount = 0;
    let completedCount = 0;

    ordersHistory.forEach(o => {
      if (o.status !== 'cancelled') {
        revenue += o.total;
      }
      if (o.status === 'pending') {
        pendingCount++;
      } else if (o.status === 'completed') {
        completedCount++;
      }
    });

    const aov = ordersCount > 0 ? revenue / ordersCount : 0;

    return {
      totalRevenue: revenue,
      totalOrders: ordersCount,
      averageOrderValue: aov,
      pendingOrders: pendingCount,
      completedOrders: completedCount
    };
  }, [ordersHistory]);

  // Dynamic Weekly Sales Trend starting from beginning
  const weeklySalesTrend = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(d => ({ d, r: 0, o: 0 }));
    
    ordersHistory.forEach(o => {
      if (o.status !== 'cancelled') {
        try {
          const date = new Date(o.createdAt);
          let dayIdx = date.getDay() - 1; 
          if (dayIdx === -1) dayIdx = 6; // Sunday
          
          if (dayIdx >= 0 && dayIdx < 7) {
            data[dayIdx].r += o.total;
            data[dayIdx].o += 1;
          }
        } catch (e) {
          // ignore invalid date parsing
        }
      }
    });
    return data;
  }, [ordersHistory]);

  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...weeklySalesTrend.map(item => item.r));
    return maxVal > 0 ? maxVal * 1.15 : 100; // 15% padding, fallback to 100
  }, [weeklySalesTrend]);

  // Dynamic Category Volume Share starting from beginning
  const categoryVolumeShare = useMemo(() => {
    const counts: { [categoryKey: string]: number } = {};
    let totalItemsCount = 0;

    ordersHistory.forEach(o => {
      if (o.status !== 'cancelled') {
        o.items.forEach(item => {
          const catId = item.product.category || 'other';
          counts[catId] = (counts[catId] || 0) + item.quantity;
          totalItemsCount += item.quantity;
        });
      }
    });

    const colors = [
      'bg-indigo-600',
      'bg-indigo-500',
      'bg-indigo-400',
      'bg-slate-500',
      'bg-slate-400',
      'bg-slate-300',
      'bg-violet-500',
      'bg-pink-500',
    ];

    const activeCategories = categories.filter(c => c.id !== 'all');

    const result = activeCategories.map((cat, index) => {
      const count = counts[cat.id] || 0;
      const value = totalItemsCount > 0 ? Math.round((count / totalItemsCount) * 100) : 0;
      return {
        name: cat.name,
        value,
        count,
        color: colors[index % colors.length]
      };
    });

    const registeredCatIds = new Set(activeCategories.map(c => c.id));
    let otherCount = 0;
    Object.keys(counts).forEach(catId => {
      if (!registeredCatIds.has(catId)) {
        otherCount += counts[catId];
      }
    });

    if (otherCount > 0) {
      const value = totalItemsCount > 0 ? Math.round((otherCount / totalItemsCount) * 100) : 0;
      result.push({
        name: 'Other',
        value,
        count: otherCount,
        color: 'bg-slate-300'
      });
    }

    // Sort by count descending so top-selling are shown first
    result.sort((a, b) => b.count - a.count);

    return {
      items: result,
      totalItemsCount
    };
  }, [ordersHistory, categories]);

  const filteredOrders = useMemo(() => {
    return ordersHistory.filter(o => {
      const q = orderSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerMobile && o.customerMobile.toLowerCase().includes(q)) ||
        (o.customerLocation && o.customerLocation.toLowerCase().includes(q)) ||
        (o.tableNumber && o.tableNumber.toLowerCase().includes(q)) ||
        o.orderType.toLowerCase().includes(q)
      );
    });
  }, [ordersHistory, orderSearchQuery]);

  // Product CRUD Handlers
  const handleToggleAvailability = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextState = !p.isAvailable;
        // Trigger alert toast
        triggerAdminToast(`${p.name} stock availability set to ${nextState ? 'IN STOCK' : 'OUT OF STOCK'}`);
        return { ...p, isAvailable: nextState };
      }
      return p;
    }));
  };

  const triggerAdminToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-slate-900 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 text-xs font-semibold animate-bounce';
    toast.innerHTML = `
      <span class="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    const initialCat = categories.find(c => c.id !== 'all')?.id || 'shingara';
    setFormCategory(initialCat);
    setTargetModCategory(initialCat);
    setFormPrice('');
    setFormSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormAvailable(true);
    setFormModifiers([]);
    setNewModName('');
    setNewModPrice('');
    setPizzaSmallPrice('');
    setPizzaMediumPrice('');
    setPizzaLargePrice('');
    setFormVariants([]);
    setNewVarName('');
    setNewVarPrice('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setTargetModCategory(product.category);
    setFormPrice(product.price !== undefined ? product.price.toString() : '');
    setFormSku(product.sku || product.id.toUpperCase());
    setFormAvailable(product.isAvailable);
    setFormModifiers(product.modifiers || []);
    setNewModName('');
    setNewModPrice('');

    if (product.variants && product.variants.length > 0) {
      setFormVariants(product.variants.map(v => ({ ...v })));
    } else {
      setFormVariants([]);
    }

    setNewVarName('');
    setNewVarPrice('');
    setIsProductModalOpen(true);
  };

  const handleCreateCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;
    
    const catId = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!catId) {
      setCustomAlertMessage("Invalid category name.");
      return;
    }
    
    // Check if category already exists
    if (categories.some(c => c.id === catId)) {
      setCustomAlertMessage("A category with this name already exists!");
      return;
    }
    
    const newCategory: Category = {
      id: catId,
      name: trimmedName,
      icon: 'Utensils',
      orderIndex: categories.length
    };
    
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    triggerAdminToast(`Category "${trimmedName}" created successfully!`);
  };

  const handleDeleteCategory = (catId: string) => {
    // Check if there are active products
    const relatedProductsCount = products.filter(p => p.category === catId).length;
    if (relatedProductsCount > 0) {
      setCustomAlertMessage(`Cannot delete category! There are ${relatedProductsCount} active dishes assigned to this category. Re-assign or delete those dishes first.`);
      return;
    }
    
    const catToDelete = categories.find(c => c.id === catId);
    setCategories(prev => prev.filter(c => c.id !== catId));
    triggerAdminToast(`Category "${catToDelete?.name}" removed successfully!`);
  };

  // Category Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const activeCategories = categories.filter(c => c.id !== 'all');
    const draggedCategory = activeCategories[draggedIndex];
    const remainingCategories = activeCategories.filter((_, idx) => idx !== draggedIndex);
    
    // Insert dragged category at target index
    const reorderedActive = [
      ...remainingCategories.slice(0, targetIndex),
      draggedCategory,
      ...remainingCategories.slice(targetIndex)
    ];

    // Re-assign order indices starting from 1
    const updatedActive = reorderedActive.map((cat, i) => ({
      ...cat,
      orderIndex: i + 1
    }));

    const allCategory = categories.find(c => c.id === 'all') || { id: 'all', name: 'All Categories', icon: 'Utensils' };
    const finalCategories = [allCategory, ...updatedActive];

    setCategories(finalCategories);
    triggerAdminToast("Categories rearranged successfully!");
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDeleteId(productId);
  };

  const confirmDeleteProduct = () => {
    if (productToDeleteId) {
      const pToDelete = products.find(p => p.id === productToDeleteId);
      setProducts(prev => prev.filter(p => p.id !== productToDeleteId));
      triggerAdminToast(pToDelete ? `Deleted: ${pToDelete.name}` : "Product deleted successfully");
      setProductToDeleteId(null);
    }
  };

  const confirmDeleteOrder = async () => {
    if (orderToDeleteId) {
      await onDeleteOrder(orderToDeleteId);
      triggerAdminToast("Order cancelled & deleted successfully");
      if (selectedOrderId === orderToDeleteId) {
        setSelectedOrderId(null);
      }
      setOrderToDeleteId(null);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim()) {
      setCustomAlertMessage("Please provide a valid product name.");
      return;
    }

    let priceNum = parseFloat(formPrice) || 0;
    let finalVariants: ProductVariant[] | undefined = undefined;

    if (formVariants.length > 0) {
      for (const v of formVariants) {
        if (!v.name.trim() || v.price <= 0) {
          setCustomAlertMessage(`Please provide a valid size label and price (> 0) for "${v.name || 'unnamed size'}".`);
          return;
        }
      }
      finalVariants = formVariants;
      if (priceNum <= 0) {
        priceNum = finalVariants[0].price;
      }
    } else {
      if (priceNum <= 0) {
        setCustomAlertMessage("Please provide a valid sale price (> 0) for this item.");
        return;
      }
    }

    if (editingProduct) {
      // Edit mode
      const updatedProduct: Product = {
        id: editingProduct.id,
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        image: editingProduct.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        isAvailable: formAvailable,
        modifiers: formModifiers.length > 0 ? formModifiers : undefined,
        sku: formSku.trim() || undefined,
        variants: finalVariants && finalVariants.length > 0 ? finalVariants : undefined
      };

      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      triggerAdminToast(`Updated: ${formName.trim()} (৳${priceNum.toFixed(2)})`);
    } else {
      // Add mode
      const newId = `p-${Date.now()}`;
      const newProduct: Product = {
        id: newId,
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', // default food photo
        isAvailable: formAvailable,
        modifiers: formModifiers.length > 0 ? formModifiers : undefined,
        sku: formSku.trim() || undefined,
        variants: finalVariants && finalVariants.length > 0 ? finalVariants : undefined
      };
      setProducts(prev => [newProduct, ...prev]);
      triggerAdminToast(`Added: ${formName.trim()} (৳${priceNum.toFixed(2)})`);
    }

    setIsProductModalOpen(false);
  };

  // Generate Excel Statement CSV Stream simulator
  const handleExportCSV = () => {
    // Generate real CSV dataset matching ordersHistory
    const headers = ['Order Number', 'Date', 'Type', 'Table #', 'Customer Name', 'Customer Mobile', 'Delivery Location', 'Subtotal (৳)', 'Tax (৳)', 'Discount (৳)', 'Total (৳)', 'Status'];
    const rows = ordersHistory.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleString(),
      o.orderType.toUpperCase(),
      o.tableNumber || 'N/A',
      `"${o.customerName || 'Walk-in'}"`,
      `"${o.customerMobile || 'N/A'}"`,
      `"${o.customerLocation || 'N/A'}"`,
      o.subtotal.toFixed(2),
      o.tax.toFixed(2),
      o.discount.toFixed(2),
      o.total.toFixed(2),
      o.status.toUpperCase()
    ]);

    const csvContent = [
      ['PAY-FIRST RESTAURANT POS SYSTEM - SALES TRANSACTION AUDIT'],
      ['Export Timestamp: ' + new Date().toLocaleString()],
      [],
      headers,
      ...rows
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `POS_Sales_Report_${dateFilter.toUpperCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger visual print feedback
    triggerAdminToast("Excel Report generated and downloaded successfully!");
  };

  const handlePrintReceipt = (order: Order, type: 'invoice' | 'kot' = 'invoice') => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (!frameDoc) {
      alert("Printing is currently unavailable. Please verify browser permissions.");
      return;
    }

    let htmlContent = '';

    if (type === 'invoice') {
      htmlContent = generate58mmThermalReceiptHtml(order, undefined, order.paymentMethod);
    } else {
      // Kitchen KOT print
      htmlContent = generate58mmThermalKotHtml(order);
    }

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
  };

  const handlePrintAllOrders = () => {
    const filteredOrders = ordersHistory.filter(o => {
      const q = orderSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerMobile && o.customerMobile.toLowerCase().includes(q)) ||
        (o.customerLocation && o.customerLocation.toLowerCase().includes(q)) ||
        (o.tableNumber && o.tableNumber.toLowerCase().includes(q)) ||
        o.orderType.toLowerCase().includes(q)
      );
    });

    if (filteredOrders.length === 0) {
      alert("No orders match the current search filter to print.");
      return;
    }

    const orderRowsHtml = filteredOrders.map((order, idx) => {
      const itemsList = order.items.map(item => {
        const mods = item.selectedModifiers.map(m => `+${m.name}`).join(', ');
        return `${item.product.name} (x${item.quantity})${mods ? ` [${mods}]` : ''}`;
      }).join(', ');

      return `
        <tr style="border-bottom: 1px solid #ddd; font-size: 11px;">
          <td style="padding: 8px; text-align: center;">${idx + 1}</td>
          <td style="padding: 8px; font-weight: bold;">${order.orderNumber}</td>
          <td style="padding: 8px;">${order.customerName || 'Walk-in Guest'}${order.customerMobile ? `<br><small style="color:#666; font-family:monospace;">📱 ${order.customerMobile}</small>` : ''}${order.customerLocation ? `<br><small style="color:#059669; font-weight:bold;">📍 ${order.customerLocation}</small>` : ''}</td>
          <td style="padding: 8px;">${new Date(order.createdAt).toLocaleString()}</td>
          <td style="padding: 8px; text-transform: uppercase;">${order.orderType === 'pickup' ? 'ONLINE ORDER' : order.orderType} ${order.tableNumber ? `(T${order.tableNumber})` : ''}</td>
          <td style="padding: 8px; max-width: 250px; word-wrap: break-word; font-size: 10px;">${itemsList || 'No Items Details'}</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">৳${order.total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const totalSum = filteredOrders.reduce((sum, o) => sum + o.total, 0);

    const htmlContent = `
      <html>
        <head>
          <title>Order List Report - VibrantPOS</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
            h2 { margin-bottom: 5px; color: #1e293b; }
            .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; font-size: 11px; text-align: left; }
            td { padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; }
            .summary { margin-top: 20px; text-align: right; font-size: 14px; font-weight: bold; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <h2>Vibrant Food - Sales Order List Report</h2>
          <div class="meta">
            Generated: ${new Date().toLocaleString()} | 
            Filtered Matches: ${filteredOrders.length} Orders
          </div>
          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 30px;">#</th>
                <th style="width: 100px;">Order Number</th>
                <th style="width: 120px;">Customer Name</th>
                <th style="width: 140px;">Date & Time</th>
                <th style="width: 100px;">Type</th>
                <th>Dish Details</th>
                <th style="text-align: right; width: 80px;">Total ($)</th>
              </tr>
            </thead>
            <tbody>
              ${orderRowsHtml}
            </tbody>
          </table>
          <div class="summary">
            Total Aggregate Sales: <span style="color: #059669;">$${totalSum.toFixed(2)}</span>
          </div>
        </body>
      </html>
    `;

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

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-115px)] min-h-0 space-y-6">
      
      {/* Admin Panel Header tabs control */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAdminTab('crud')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'crud' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
            }`}
          >
            Manage Products CRUD
          </button>
          <button
            onClick={() => setAdminTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'categories' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
            }`}
          >
            Manage Categories
          </button>
          <button
            onClick={() => setAdminTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'reports' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
            }`}
          >
            Sales Reports Dashboard
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'orders' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
            }`}
          >
            Order List
          </button>
        </div>

        {/* Dynamic actions & Reset Sales Dashboard */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Reset transaction history & sales records"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Sales
          </button>

          {adminTab === 'crud' && (
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-1.5 self-start sm:self-auto transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add New Dish
            </button>
          )}
          
          {adminTab === 'reports' && (
            <div className="flex items-center gap-2">
              <select
                value={dateFilter}
                onChange={(e: any) => setDateFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="today">Today's Transactions</option>
                <option value="weekly">Weekly Statements</option>
                <option value="monthly">Monthly Audits</option>
              </select>
              
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-100" />
                Export Excel report
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {adminTab === 'crud' && (
          /* ================== PRODUCT CRUD LIST ================== */
          <div className="bg-white border border-slate-200 rounded-2xl h-full flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Menu Catalog Database</h3>
                <p className="text-xs text-slate-500">Edit prices, categories, modifiers and control stock-out states instantly.</p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                ACTIVE TOTAL: {products.length} Items
              </span>
            </div>

            {/* Catalog Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 bg-slate-50 text-xs font-bold text-slate-500 select-none">
                    <th className="p-4 pl-6">Dish / SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Available Modifiers</th>
                    <th className="p-4 text-center">In Stock Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0">
                            <FoodIcon 
                              category={p.category} 
                              name={p.name} 
                              className="h-5 w-5" 
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{p.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{p.sku || p.id.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 uppercase font-bold text-[10px] text-indigo-600">
                        {p.category}
                      </td>
                      <td className="p-4 text-slate-800">
                        {p.variants && p.variants.length > 0 ? (
                          <div className="flex flex-col gap-0.5 font-mono text-[10px]">
                            {p.variants.map(v => (
                              <div key={v.id} className="flex justify-between gap-1.5 items-center">
                                <span className="font-bold text-slate-500 text-[9px]">{v.name}:</span>
                                <span className="font-black text-indigo-600">৳{v.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-800">৳{p.price.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {p.modifiers && p.modifiers.length > 0 ? (
                            p.modifiers.map(m => (
                              <span key={m.id} className="text-[9px] bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                                {m.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">None bound</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleAvailability(p.id)}
                          className="mx-auto block focus:outline-none cursor-pointer"
                          title="Click to toggle Stock availability"
                        >
                          {p.isAvailable ? (
                            <div className="flex items-center gap-1.5 justify-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 justify-center text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              Stock Out
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'categories' && (
          /* ================== CATEGORIES MANAGEMENT ================== */
          <div className="space-y-6 h-full overflow-y-auto pb-6">
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row overflow-hidden">
              {/* Left side: List of Categories */}
              <div className="flex-1 flex flex-col border-r border-slate-150 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Menu Categories</h3>
                    <p className="text-xs text-slate-500 font-medium">Add, remove, and drag to rearrange the category filters on the cashier grid.</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                    TOTAL: {categories.filter(c => c.id !== 'all').length} Active
                  </span>
                </div>
                
                {/* Informative Drag & Drop Instruction Badge */}
                <div className="px-5 py-2.5 bg-indigo-50/40 border-b border-indigo-100/50 flex items-center gap-2 text-indigo-700">
                  <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold uppercase tracking-wider">Drag & Drop Tip: Hold any category and drag it up/down to customize grid tabs.</p>
                </div>
                
                <div className="p-4 space-y-2.5 max-h-80 overflow-y-auto">
                  {categories.filter(c => c.id !== 'all').map((cat, index) => {
                    const itemsCount = products.filter(p => p.category === cat.id).length;
                    const isDragging = draggedIndex === index;
                    const isDragOver = dragOverIndex === index;
                    
                    return (
                      <div 
                        key={cat.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`flex items-center justify-between p-3.5 bg-white border rounded-xl transition-all cursor-grab active:cursor-grabbing select-none ${
                          isDragging 
                            ? 'opacity-40 border-dashed border-indigo-400 bg-slate-50 scale-95 shadow-inner' 
                            : isDragOver
                              ? 'border-indigo-500 ring-2 ring-indigo-500/15 bg-indigo-50/30 -translate-y-0.5 scale-[1.01]'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Drag Handle Icon Indicator */}
                          <div className="text-slate-400 hover:text-indigo-600 transition-colors cursor-grab">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          
                          <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center font-black text-indigo-600 text-xs uppercase shadow-sm">
                            {cat.name.slice(0, 2)}
                          </div>
                          
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{cat.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                              {cat.id} • <span className="text-slate-500 font-semibold">{itemsCount} active dishes</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Current Category Order Badge */}
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            Order: {index + 1}
                          </span>
                          
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right side: Add New Category Form */}
              <div className="w-full md:w-80 p-5 bg-slate-50/50 flex flex-col justify-between border-t md:border-t-0 border-slate-150">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Create Category</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Register a new food category tab on the POS system.</p>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold uppercase tracking-wider">Category Name</label>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Desserts, Pasta"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    
                    <div className="p-3 bg-white border border-slate-150 rounded-xl text-[10px] text-slate-500 leading-relaxed">
                      <span className="font-bold text-slate-600 block mb-0.5 font-sans">Automatic ID binding:</span>
                      A unique system ID will be automatically generated from the name (lowercase-dashed format) to bind products correctly.
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim()}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-4 md:mt-0 ${
                    newCategoryName.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md shadow-indigo-100'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>

            {/* Category-Wise Modifiers Control Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-3.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-600" />
                    Category-Wise Modifiers Manager
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Add or remove modifiers for an entire category of food dishes (e.g., Pizza, Beverages, Shingara) at once.
                  </p>
                </div>

                {/* Category Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 whitespace-nowrap">Category:</label>
                  <select
                    value={catModSelectedCat}
                    onChange={(e) => setCatModSelectedCat(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Current Modifiers in Selected Category */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Active Modifiers in "{categories.find(c => c.id === catModSelectedCat)?.name || catModSelectedCat}"
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">
                      {products.filter(p => p.category === catModSelectedCat).length} Dishes in Category
                    </span>
                  </div>

                  {getCategoryModifiersList(catModSelectedCat).length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {getCategoryModifiersList(catModSelectedCat).map((mod, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{mod.name}</span>
                            <span className="text-[10px] font-mono font-bold text-indigo-600">
                              +৳{mod.price.toFixed(2)} • Applied on {mod.count}/{products.filter(p => p.category === catModSelectedCat).length} items
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveModifierFromCategory(catModSelectedCat, mod.name)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                            title={`Remove ${mod.name} from all items in this category`}
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 italic">
                      No modifiers configured for dishes in this category yet.
                    </div>
                  )}
                </div>

                {/* Right: Add New Modifier to Category Form */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-3">
                  <span className="text-xs font-extrabold text-indigo-900 block">
                    Add New Modifier to Category: "{categories.find(c => c.id === catModSelectedCat)?.name || catModSelectedCat}"
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Modifier Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Extra Cheese, Cold Ice"
                        value={catModName}
                        onChange={(e) => setCatModName(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (৳)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 1.50"
                        value={catModPrice}
                        onChange={(e) => setCatModPrice(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!catModName.trim()}
                    onClick={() => {
                      const nameTrimmed = catModName.trim();
                      const priceNum = parseFloat(catModPrice) || 0;
                      if (!nameTrimmed) return;
                      handleAddModifierToCategory(catModSelectedCat, nameTrimmed, priceNum);
                      setCatModName('');
                      setCatModPrice('');
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      catModName.trim()
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Modifier to Category ({categories.find(c => c.id === catModSelectedCat)?.name || catModSelectedCat})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'reports' && (
          /* ================== SALES REPORTS & DASHBOARD ================== */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full overflow-y-auto pb-6">
            
            {/* KPI Cards (Left & Top span) */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Sales KPIs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</span>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold font-mono text-slate-800">৳{calculatedKPIs.totalRevenue.toFixed(2)}</h4>
                  <span className="text-[9px] text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    +12.4% vs Yesterday
                  </span>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                    <ShoppingCart className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h4 className="text-xl font-bold font-mono text-slate-800">{calculatedKPIs.totalOrders}</h4>
                  <p className="text-[9px] text-slate-500 mt-1">Dine-in dominant (72%)</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Order Value</span>
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                  </div>
                  <h4 className="text-xl font-bold font-mono text-slate-800">৳{calculatedKPIs.averageOrderValue.toFixed(2)}</h4>
                  <p className="text-[9px] text-amber-600 font-semibold mt-1">+৳1.55 since modifiers added</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">K Kitchen Queue</span>
                    <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold font-mono text-slate-800">{calculatedKPIs.pendingOrders} Orders</h4>
                  <p className="text-[9px] text-slate-500 mt-1">First-paid pipeline</p>
                </div>

              </div>

              {/* Weekly Sales SVG Chart */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Aggregate Sales Trends</h3>
                    <p className="text-[10px] text-slate-500">Hourly aggregates over current cycle (7 days)</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600">REVENUE AXIS (BDT)</span>
                </div>

                {/* Customized SVG Line & Area Chart for robust React 19 execution */}
                <div className="h-56 w-full bg-slate-50 rounded-xl border border-slate-200 p-4 relative flex items-end">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 inset-y-8 flex flex-col justify-between pointer-events-none opacity-50 px-4">
                    <div className="border-t border-slate-200 w-full"></div>
                    <div className="border-t border-slate-200 w-full"></div>
                    <div className="border-t border-slate-200 w-full"></div>
                    <div className="border-t border-slate-200 w-full"></div>
                  </div>

                  {/* SVG drawing bars for Weekly Trend */}
                  <div className="w-full h-full flex justify-between items-end gap-2.5 pt-6 relative z-10">
                    {weeklySalesTrend.map((item, idx) => {
                      const heightPercent = Math.min(100, (item.r / maxRevenue) * 100);
                      return (
                        <div key={item.d} className="flex-1 flex flex-col items-center group h-full justify-end">
                          {/* Tooltip Hover card */}
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg shadow-xl text-center pointer-events-none transition-all z-20 text-[10px]">
                            <p className="font-bold">{item.d} Revenue</p>
                            <p className="text-indigo-400 font-mono font-bold text-xs">৳{item.r.toFixed(2)}</p>
                            <p className="text-slate-400">{item.o} orders</p>
                          </div>

                          {/* Bar block */}
                          <div className="w-full bg-white border border-slate-200 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercent}%` }}
                              transition={{ duration: 0.6, delay: idx * 0.05 }}
                              className="w-full bg-gradient-to-t from-indigo-700 via-indigo-500 to-indigo-300 rounded-t-md relative"
                            >
                              {/* Overlay glare */}
                              <div className="absolute inset-0 bg-white/5"></div>
                            </motion.div>
                          </div>

                          {/* X label */}
                          <span className="text-[10px] font-bold text-slate-500 mt-2">{item.d}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Category distribution donut visual (Right bar) */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl h-full flex flex-col">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Category Volume Share</h3>
                
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  {categoryVolumeShare.items.length > 0 ? (
                    categoryVolumeShare.items.map((cat) => (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700">{cat.name}</span>
                          <span className="font-mono text-slate-500 font-medium">
                            {cat.count} Sold ({cat.value}%)
                          </span>
                        </div>
                        
                        {/* Bar indicator */}
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.value}%` }}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                      No dishes sold yet
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-500 flex gap-2.5">
                  <Info className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <p>Product sales aggregate directly on payment success, matching categories assigned in Product CRUD database.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {adminTab === 'orders' && (
          /* ================== ORDER LIST MANAGEMENT ================== */
          <div className="bg-white border border-slate-200 rounded-2xl h-full flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Orders List & Search */}
            <div className={`flex-1 flex flex-col border-r border-slate-150 overflow-hidden ${selectedOrderId ? 'hidden lg:flex' : 'flex'}`}>
              <div className="p-5 border-b border-slate-150 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sales Order Directory</h3>
                  <p className="text-xs text-slate-500">Track cashier receipts, print copies, and manage cancellations.</p>
                </div>
                
                {/* Action buttons inside header */}
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-mono font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    MATCHES: {filteredOrders.length}
                  </span>
                  {filteredOrders.length > 0 && (
                    <button
                      onClick={handlePrintAllOrders}
                      className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl text-[10px] font-extrabold text-indigo-700 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Print All Report (PDF)
                    </button>
                  )}
                </div>
              </div>

              {/* Search filter input bar */}
              <div className="p-4 border-b border-slate-150 bg-white">
                <input
                  type="text"
                  placeholder="Search orders by name, mobile number, order #, table..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder-slate-400 font-semibold"
                />
              </div>

              {/* Scrollable Order List Rows */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-150">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => {
                    const isSelected = selectedOrderId === order.id;
                    const itemsSummary = order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
                    
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`p-4 transition-all flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/85 ${
                          isSelected ? 'bg-indigo-50/40 border-l-4 border-l-indigo-600' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono font-black text-slate-800 bg-slate-100 border border-slate-250 px-1.5 py-0.5 rounded">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 font-mono">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              order.orderType === 'dine-in' 
                                ? 'bg-indigo-500/10 text-indigo-700' 
                                : 'bg-emerald-500/10 text-emerald-700'
                            }`}>
                              {order.orderType === 'pickup' ? 'online order' : order.orderType} {order.tableNumber ? `• T${order.tableNumber}` : ''}
                            </span>
                          </div>

                          {/* Customer Name, Mobile, Location and Food details preview */}
                          <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5 flex-wrap">
                            <span>{order.customerName || 'Walk-in Guest'}</span>
                            {order.customerMobile && (
                              <span className="font-mono text-[10px] text-slate-600 font-extrabold bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                                📱 {order.customerMobile}
                              </span>
                            )}
                            {order.customerLocation && (
                              <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded truncate max-w-[200px]" title={order.customerLocation}>
                                📍 {order.customerLocation}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate font-medium mt-0.5 max-w-sm sm:max-w-md">
                            {itemsSummary || 'No food items added'}
                          </div>
                        </div>

                        {/* Right side pricing and cancel button */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="block text-xs font-black font-mono text-slate-800">
                              ৳{order.total.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                              Success
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrderToDeleteId(order.id);
                            }}
                            className="p-1.5 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-250 text-slate-400 rounded-lg cursor-pointer transition-colors"
                            title="Delete / Cancel Order"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-48">
                    <Clock className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-xs font-bold">No matching orders found</p>
                    <p className="text-[10px] text-slate-400 mt-1">Ready to sync live POS tickets instantly.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Ticket Preview & Actions */}
            <div className={`w-full lg:w-[420px] bg-slate-50/50 p-5 flex flex-col overflow-hidden justify-between border-t lg:border-t-0 border-slate-150 ${selectedOrderId ? 'flex' : 'hidden lg:flex'}`}>
              {(() => {
                const order = ordersHistory.find(o => o.id === selectedOrderId);
                if (!order) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-250 rounded-xl bg-white">
                      <FileSpreadsheet className="h-10 w-10 text-slate-300 mb-2 animate-pulse" />
                      <h4 className="text-xs font-bold text-slate-700">Receipt Invoice Terminal</h4>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                        Select any transaction ticket from the directory to view ingredients, custom notes, print receipts, or delete.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    
                    {/* Ticket Header */}
                    <div className="space-y-4">
                      {/* Back Button for Mobile */}
                      <button
                        onClick={() => setSelectedOrderId(null)}
                        className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl cursor-pointer shadow-sm mb-4 transition-colors w-fit"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Orders</span>
                      </button>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">ACTIVE INVOICE TICKET</span>
                        <span className="text-[9px] font-mono text-slate-400">ID: {order.id.slice(-6)}</span>
                      </div>

                      {/* Mockup Paper Receipt Card */}
                      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-md space-y-4 relative overflow-hidden flex-1 flex flex-col justify-between">
                        {/* Decorative top jagged paper border mockup */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle_at_bottom,#e2e8f0_2px,transparent_3px)] bg-[length:8px_8px] bg-repeat-x"></div>
                        
                        <div className="space-y-3 flex-1 flex flex-col justify-start">
                          <div className="text-center pt-2">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Vibrant POS Receipt</h4>
                            <span className="text-[10px] sm:text-xs text-slate-400 block font-mono mt-0.5">#{order.orderNumber}</span>
                          </div>

                          <div className="border-t border-b border-dashed border-slate-200 py-3 my-2 space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Date/Time:</span>
                              <span className="font-semibold text-slate-700">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Order Type:</span>
                              <span className="font-semibold text-slate-700 uppercase">{order.orderType === 'pickup' ? 'ONLINE ORDER' : order.orderType} {order.tableNumber ? `(Table ${order.tableNumber})` : ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Customer:</span>
                              <span className="font-bold text-slate-800">{order.customerName || 'Walk-in Guest'}</span>
                            </div>
                            {order.customerMobile && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Mobile Number:</span>
                                <span className="font-bold text-slate-800 font-mono">📱 {order.customerMobile}</span>
                              </div>
                            )}
                            {order.customerLocation && (
                              <div className="flex justify-between text-left">
                                <span className="text-slate-400 shrink-0">Delivery Address:</span>
                                <span className="font-bold text-slate-800 text-right pl-2 break-words">📍 {order.customerLocation}</span>
                              </div>
                            )}
                          </div>

                          {/* List of food items with pricing */}
                          <div className="space-y-3 max-h-[350px] lg:max-h-[460px] overflow-y-auto pr-1 flex-1">
                            {order.items.map(item => {
                              const modifierSum = item.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
                              const basePrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                              const singleItemTotal = basePrice + modifierSum;
                              return (
                                <div key={item.id} className="text-xs sm:text-sm space-y-1 pb-1.5 border-b border-slate-100 last:border-0">
                                  <div className="flex justify-between font-bold text-slate-800">
                                    <span>
                                      {item.product.name}{' '}
                                      {item.selectedVariant ? (
                                        <span className="text-[10px] font-bold text-indigo-600 font-sans">
                                          ({item.selectedVariant.name})
                                        </span>
                                      ) : null}{' '}
                                      <span className="text-indigo-600 font-mono">x{item.quantity}</span>
                                    </span>
                                    <span className="font-mono">৳{(singleItemTotal * item.quantity).toFixed(2)}</span>
                                  </div>
                                  {item.selectedModifiers.length > 0 && (
                                    <div className="text-[10px] sm:text-xs text-slate-400 italic pl-2">
                                      Modifiers: {item.selectedModifiers.map(m => `+${m.name}`).join(', ')}
                                    </div>
                                  )}
                                  {item.notes && (
                                    <div className="text-[10px] sm:text-xs text-amber-600 italic pl-2">
                                      Note: "{item.notes}"
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Totals Block */}
                        <div className="border-t border-dashed border-slate-200 pt-3 text-xs sm:text-sm space-y-1.5 mt-auto">
                          <div className="flex justify-between text-slate-400">
                            <span>Subtotal:</span>
                            <span className="font-mono">৳{order.subtotal.toFixed(2)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-rose-500 font-semibold">
                              <span>Discount:</span>
                              <span className="font-mono">-৳{order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          {order.tax > 0 && (
                            <div className="flex justify-between text-amber-600 font-semibold">
                              <span>Tax:</span>
                              <span className="font-mono">+৳{order.tax.toFixed(2)}</span>
                            </div>
                          )}
                          {order.packagingCharge !== undefined && order.packagingCharge > 0 && (
                            <div className="flex justify-between text-indigo-600 font-semibold">
                              <span>Packaging Charge:</span>
                              <span className="font-mono">+৳{order.packagingCharge.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-800 font-bold border-t border-slate-100 pt-2 text-sm sm:text-base">
                            <span>TOTAL PAID:</span>
                            <span className="font-mono text-indigo-600 font-black">৳{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Receipt Action Buttons */}
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handlePrintReceipt(order, 'invoice')}
                          className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Printer className="h-4 w-4 text-indigo-200" />
                          <span>Print Invoice</span>
                        </button>
                        <button
                          onClick={() => downloadInvoicePdf(order)}
                          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Download className="h-4 w-4 text-indigo-400" />
                          <span>Save PDF</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handlePrintReceipt(order, 'kot')}
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ChefHat className="h-4 w-4 text-emerald-200" />
                          <span>Print KOT</span>
                        </button>
                        <button
                          onClick={() => downloadKitchenKotPdf(order)}
                          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Download className="h-4 w-4 text-emerald-400" />
                          <span>Save KOT PDF</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setOrderToDeleteId(order.id)}
                        className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Cancel & Delete Order</span>
                      </button>
                    </div>

                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* CRUD DISH MODAL (ADD / EDIT) */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.form 
              onSubmit={handleSaveProduct}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800">
                  {editingProduct ? 'Edit Catalog Dish' : 'Add New Dish to Catalog'}
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Sizzling Sirloin Steak"
                  />
                </div>

                {/* SKU / ID & Category row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold uppercase tracking-wider">SKU Code</label>
                    <input
                      type="text"
                      required
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="e.g. SKU-1001"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold uppercase tracking-wider">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setFormCategory(newCat);
                        setTargetModCategory(newCat);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Stock Status */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold uppercase tracking-wider">
                      {formVariants.length > 0 ? 'Base / Single Price (৳)' : 'Sale Price (৳)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Stock availability */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-2">Initial Stock Status</label>
                    <button
                      type="button"
                      onClick={() => setFormAvailable(!formAvailable)}
                      className="flex items-center gap-2 text-slate-600 cursor-pointer"
                    >
                      {formAvailable ? (
                        <>
                          <ToggleRight className="h-8 w-8 text-indigo-600" />
                          <span className="font-semibold text-emerald-600">Available (In Stock)</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-8 w-8 text-slate-400" />
                          <span className="font-semibold text-red-500">Unavailable (Stock Out)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sizes & Variants Manager */}
                <div className="space-y-3 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                        Sizes / Portions / Variants (Optional)
                      </label>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Add size options (e.g. Small, Medium, Large, Half, Full) with specific prices.
                      </span>
                    </div>
                    {formVariants.length > 0 && (
                      <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded">
                        {formVariants.length} Sizes Configured
                      </span>
                    )}
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Quick Presets:</span>
                    <button
                      type="button"
                      onClick={() => handleAddPresetSize('Small (8")', parseFloat(formPrice) || 120)}
                      className="px-2 py-1 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      + Small (8")
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetSize('Medium (10")', (parseFloat(formPrice) || 120) * 1.35)}
                      className="px-2 py-1 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      + Medium (10")
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetSize('Large (12")', (parseFloat(formPrice) || 120) * 1.8)}
                      className="px-2 py-1 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      + Large (12")
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetSize('Half Portion', (parseFloat(formPrice) || 100) * 0.6)}
                      className="px-2 py-1 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      + Half Portion
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetSize('Full Portion', parseFloat(formPrice) || 100)}
                      className="px-2 py-1 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      + Full Portion
                    </button>
                  </div>

                    {/* Active Configured Sizes List */}
                    {formVariants.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
                        {formVariants.map((v) => (
                          <div key={v.id} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                            <div className="flex-1 space-y-0.5">
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Size Name</span>
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => handleUpdateVariant(v.id, e.target.value, v.price)}
                                className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder='e.g. Small (8")'
                              />
                            </div>
                            <div className="w-28 space-y-0.5">
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Price (৳)</span>
                              <input
                                type="number"
                                step="0.01"
                                value={v.price}
                                onChange={(e) => handleUpdateVariant(v.id, v.name, parseFloat(e.target.value) || 0)}
                                className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs font-mono font-bold text-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="0.00"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(v.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer self-end mb-0.5"
                              title="Delete Size"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 bg-amber-50 rounded-xl border border-dashed border-amber-200 text-amber-700 italic font-medium">
                        No sizes added yet. Click a preset above or add a custom size below.
                      </div>
                    )}

                    {/* Form to manually add a size */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 space-y-2">
                      <span className="font-bold text-indigo-900 block text-[11px]">Add Custom Size:</span>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder='Size Name (e.g. Personal 6", Family 14")'
                            value={newVarName}
                            onChange={(e) => setNewVarName(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price (৳)"
                            value={newVarPrice}
                            onChange={(e) => setNewVarPrice(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
                          />
                        </div>
                        <div className="col-span-2">
                          <button
                            type="button"
                            onClick={handleAddCustomVariant}
                            className="w-full h-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Modifiers Editor */}
                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider">Product Modifiers (Add-ons)</label>
                  
                  {formModifiers.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
                      {formModifiers.map((mod) => (
                        <div key={mod.id} className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-800">{mod.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono ml-2">(+৳{mod.price.toFixed(2)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormModifiers(prev => prev.filter(m => m.id !== mod.id))}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 italic">
                      No modifiers defined for this dish.
                    </div>
                  )}

                  {/* Form to add a modifier to this product */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <span className="font-bold text-slate-700 block text-[11px]">Add Modifier Option:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Modifier Name (e.g. Extra Cheese)"
                        value={newModName}
                        onChange={(e) => setNewModName(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price (৳) (e.g. 1.50)"
                        value={newModPrice}
                        onChange={(e) => setNewModPrice(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
                      />
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const nameTrimmed = newModName.trim();
                          const priceNum = parseFloat(newModPrice) || 0;
                          if (!nameTrimmed) return;
                          
                          const newMod: Modifier = {
                            id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                            name: nameTrimmed,
                            price: priceNum
                          };
                          
                          setFormModifiers(prev => [...prev, newMod]);
                          setNewModName('');
                          setNewModPrice('');
                          triggerAdminToast(`Added modifier: ${nameTrimmed}`);
                        }}
                        disabled={!newModName.trim()}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors ${
                          newModName.trim()
                            ? 'bg-indigo-600 hover:bg-indigo-750 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="h-3 w-3" /> Add to this item only
                      </button>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={targetModCategory}
                          onChange={(e) => setTargetModCategory(e.target.value)}
                          className="p-1 bg-white border border-slate-250 rounded-lg text-[10px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          {categories.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>Cat: {cat.name}</option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            const nameTrimmed = newModName.trim();
                            const priceNum = parseFloat(newModPrice) || 0;
                            if (!nameTrimmed) return;

                            handleAddModifierToCategory(targetModCategory, nameTrimmed, priceNum);
                            setNewModName('');
                            setNewModPrice('');
                          }}
                          disabled={!newModName.trim()}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors ${
                            newModName.trim()
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                          title={`Add this modifier to all items in category "${categories.find(c => c.id === targetModCategory)?.name || targetModCategory}"`}
                        >
                          <Tag className="h-3 w-3" /> Apply to Selected Category
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 font-semibold hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{editingProduct ? 'Save Dish' : 'Insert Dish'}</span>
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {productToDeleteId !== null && (() => {
          const product = products.find(p => p.id === productToDeleteId);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden"
              >
                <div className="p-6 text-center space-y-4">
                  <div className="h-12 w-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Delete Food Item?</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Are you sure you want to permanently delete <span className="font-bold text-slate-700">"{product?.name}"</span>? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 flex gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProductToDeleteId(null)}
                    className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteProduct}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-100 cursor-pointer transition-colors"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>      {/* Custom Alert Modal */}
      <AnimatePresence>
        {customAlertMessage !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="h-12 w-12 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  <Info className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Notification</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {customAlertMessage}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCustomAlertMessage(null)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 cursor-pointer transition-colors"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="h-12 w-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                  <RotateCcw className="h-6 w-6 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Reset Sales History?</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Are you sure you want to clear the sales history? This will delete all order transactions from the dashboard and database to start a fresh day, but your <span className="font-semibold text-slate-700">food dishes and categories will remain intact</span>.
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 flex gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsResetConfirmOpen(false);
                    try {
                      await onResetDatabase();
                      triggerAdminToast("Sales dashboard successfully reset!");
                    } catch (e) {
                      setCustomAlertMessage("Error resetting sales history. Please check connection.");
                    }
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-100 cursor-pointer transition-colors"
                >
                  Yes, Reset Sales
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Delete Confirmation Modal */}
      <AnimatePresence>
        {orderToDeleteId !== null && (() => {
          const order = ordersHistory.find(o => o.id === orderToDeleteId);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden"
              >
                <div className="p-6 text-center space-y-4">
                  <div className="h-12 w-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Cancel & Delete Order?</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Are you sure you want to permanently delete order <span className="font-bold text-slate-700">#{order?.orderNumber}</span>{order?.customerName ? ` for "${order.customerName}"` : ''}? This will erase it from the sales database.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 flex gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOrderToDeleteId(null)}
                    className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteOrder}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-100 cursor-pointer transition-colors"
                  >
                    Delete Order
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
