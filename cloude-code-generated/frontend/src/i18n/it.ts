import type { TranslationKey } from './en.js';

export const it: Record<TranslationKey, string> = {
  // Nav
  nav_home: 'Home',
  nav_cart: 'Carrello',
  nav_admin: 'Admin',

  // Products
  products_title: 'Negozio Lego',
  products_search: 'Cerca prodotti...',
  products_filter_theme: 'Filtra per tema',
  products_all_themes: 'Tutti i temi',
  products_pieces: 'pezzi',
  products_add_to_cart: 'Aggiungi al carrello',
  products_out_of_stock: 'Esaurito',
  products_age: 'Età',
  products_no_results: 'Nessun prodotto trovato',

  // Cart
  cart_title: 'Carrello',
  cart_empty: 'Il tuo carrello è vuoto',
  cart_total: 'Totale',
  cart_checkout: 'Procedi al pagamento',
  cart_remove: 'Rimuovi',
  cart_quantity: 'Quantità',
  cart_continue_shopping: 'Continua lo shopping',
  cart_items: 'articoli nel carrello',

  // Checkout
  checkout_title: 'Pagamento',
  checkout_shipping: 'Indirizzo di spedizione',
  checkout_billing: 'Indirizzo di fatturazione',
  checkout_same_as_billing: 'Stesso indirizzo di spedizione',
  checkout_first_name: 'Nome',
  checkout_last_name: 'Cognome',
  checkout_street: 'Indirizzo',
  checkout_city: 'Città',
  checkout_postal_code: 'Codice postale',
  checkout_country: 'Paese',
  checkout_payment: 'Pagamento',
  checkout_card_number: 'Numero carta',
  checkout_place_order: 'Effettua ordine',
  checkout_processing: 'Elaborazione...',
  checkout_success: 'Ordine effettuato con successo!',
  checkout_order_number: 'Numero ordine',
  checkout_error: 'Impossibile effettuare l\'ordine. Riprova.',

  // Admin
  admin_title: 'Pannello Admin',
  admin_orders: 'Ordini',
  admin_dashboard: 'Dashboard',
  admin_filter_status: 'Filtra per stato',
  admin_all_statuses: 'Tutti gli stati',
  admin_order_id: 'ID Ordine',
  admin_date: 'Data',
  admin_total: 'Totale',
  admin_status: 'Stato',
  admin_actions: 'Azioni',
  admin_refund: 'Rimborsa',
  admin_refunded: 'Rimborsato',
  admin_view_logs: 'Visualizza log',
  admin_open_logs_dir: 'Apri cartella log',
  admin_logs_title: 'Log ordine',
  admin_include_technical: 'Includi log tecnici',
  admin_no_logs: 'Nessun log trovato per questo ordine',
  admin_confirm_refund: 'Sei sicuro di voler rimborsare questo ordine?',

  // Order statuses
  status_received: 'Ricevuto',
  status_confirmed: 'Confermato',
  status_canceled: 'Annullato',
  status_shipped: 'Spedito',
  status_delivered: 'Consegnato',
  status_awaiting_return: 'In attesa di reso',
  status_returned: 'Restituito',

  // Status transitions
  action_confirm: 'Conferma',
  action_cancel: 'Annulla',
  action_ship: 'Segna come spedito',
  action_deliver: 'Segna come consegnato',
  action_request_return: 'Richiedi reso',
  action_return: 'Segna come restituito',

  // General
  loading: 'Caricamento...',
  error: 'Si è verificato un errore',
  back: 'Indietro',
  nok: 'NOK',
};
