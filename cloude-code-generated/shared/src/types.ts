export type Language = 'en' | 'no' | 'it';

export interface Product {
  id: number;
  setNumber: string;
  name: string;
  nameNo: string;
  theme: string;
  pieces: number;
  price: number; // NOK
  description: string;
  descriptionNo: string;
  imageUrl: string;
  stock: number;
  ageMin: number;
}

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
  total: number;
}

export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'canceled'
  | 'shipped'
  | 'delivered'
  | 'awaiting_return'
  | 'returned';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  sessionId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  total: number;
  transactionId: string | null;
  refunded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  sessionId: string;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  sameAsBilling: boolean;
  paymentToken: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
