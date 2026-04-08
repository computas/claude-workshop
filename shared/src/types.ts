export type ProductCategory =
  | 'Festninger og borger'
  | 'Romfart og galakser'
  | 'Hav og undervannsverdener'
  | 'Skog og naturmagi'
  | 'Fabeldyr og drager';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Festninger og borger',
  'Romfart og galakser',
  'Hav og undervannsverdener',
  'Skog og naturmagi',
  'Fabeldyr og drager',
];

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  image_url: string | null;
  stock: number;
  piece_count: number | null;
  age_min: number | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  status: 'pending' | 'confirmed' | 'shipped';
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_zip: string;
  email: string;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
  }>;
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_zip: string;
  email: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaymentSimulateRequest {
  order_id: number;
  amount: number;
}

export interface PaymentSimulateResponse {
  success: boolean;
  transaction_id: string;
  message: string;
}

export interface ApiError {
  error: string;
  statusCode?: number;
}
