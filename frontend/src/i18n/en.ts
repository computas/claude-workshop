export const en = {
  // Nav
  nav_home: 'Home',
  nav_cart: 'Cart',
  nav_admin: 'Admin',

  // Products
  products_title: 'Lego Shop',
  products_search: 'Search products...',
  products_filter_theme: 'Filter by theme',
  products_all_themes: 'All themes',
  products_pieces: 'pieces',
  products_add_to_cart: 'Add to cart',
  products_out_of_stock: 'Out of stock',
  products_age: 'Age',
  products_no_results: 'No products found',

  // Cart
  cart_title: 'Shopping Cart',
  cart_empty: 'Your cart is empty',
  cart_total: 'Total',
  cart_checkout: 'Proceed to checkout',
  cart_remove: 'Remove',
  cart_quantity: 'Quantity',
  cart_continue_shopping: 'Continue shopping',
  cart_items: 'items in cart',

  // Checkout
  checkout_title: 'Checkout',
  checkout_shipping: 'Shipping Address',
  checkout_billing: 'Billing Address',
  checkout_same_as_billing: 'Same as shipping address',
  checkout_first_name: 'First name',
  checkout_last_name: 'Last name',
  checkout_street: 'Street address',
  checkout_city: 'City',
  checkout_postal_code: 'Postal code',
  checkout_country: 'Country',
  checkout_payment: 'Payment',
  checkout_card_number: 'Card number',
  checkout_place_order: 'Place order',
  checkout_processing: 'Processing...',
  checkout_success: 'Order placed successfully!',
  checkout_order_number: 'Order number',
  checkout_error: 'Failed to place order. Please try again.',

  // Admin
  admin_title: 'Admin Panel',
  admin_orders: 'Orders',
  admin_dashboard: 'Dashboard',
  admin_filter_status: 'Filter by status',
  admin_all_statuses: 'All statuses',
  admin_order_id: 'Order ID',
  admin_date: 'Date',
  admin_total: 'Total',
  admin_status: 'Status',
  admin_actions: 'Actions',
  admin_refund: 'Refund',
  admin_refunded: 'Refunded',
  admin_view_logs: 'View logs',
  admin_open_logs_dir: 'Open logs folder',
  admin_logs_title: 'Order logs',
  admin_include_technical: 'Include technical logs',
  admin_no_logs: 'No logs found for this order',
  admin_confirm_refund: 'Are you sure you want to refund this order?',

  // Order statuses
  status_received: 'Received',
  status_confirmed: 'Confirmed',
  status_canceled: 'Canceled',
  status_shipped: 'Shipped',
  status_delivered: 'Delivered',
  status_awaiting_return: 'Awaiting return',
  status_returned: 'Returned',

  // Status transitions
  action_confirm: 'Confirm',
  action_cancel: 'Cancel',
  action_ship: 'Mark as shipped',
  action_deliver: 'Mark as delivered',
  action_request_return: 'Request return',
  action_return: 'Mark as returned',

  // General
  loading: 'Loading...',
  error: 'An error occurred',
  back: 'Back',
  nok: 'NOK',
};

export type TranslationKey = keyof typeof en;
