export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Small (8\")", "Medium (12\")", "Large (16\")"
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isAvailable: boolean;
  modifiers: Modifier[];
  sku?: string;
  variants?: ProductVariant[];
}

export type OrderType = 'dine-in' | 'takeaway' | 'pickup';

export interface CartItem {
  id: string; // unique item id in cart (for handling same product with different modifiers)
  product: Product;
  quantity: number;
  selectedModifiers: Modifier[];
  notes?: string;
  selectedVariant?: ProductVariant;
}

export interface SplitPayment {
  id: string;
  personName: string;
  amount: number;
  method: 'cash' | 'card' | 'mobile_pay' | '';
  isPaid: boolean;
}

export interface Transaction {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  method: 'cash' | 'card' | 'mobile_pay' | 'split';
  splitDetails?: { personName: string; amount: number; method: string }[];
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tokenNumber?: string;
  customerName?: string;
  customerMobile?: string;
  customerLocation?: string;
  tableNumber?: string;
  cashierName?: string;
  paymentMethod?: string;
  items: CartItem[];
  orderType: OrderType;
  subtotal: number;
  tax: number;
  discount: number;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  packagingCharge?: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  orderIndex?: number;
}

export interface SalesKPIs {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
}
