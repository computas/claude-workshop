import type { TranslationKey } from './en.js';

export const no: Record<TranslationKey, string> = {
  // Nav
  nav_home: 'Hjem',
  nav_cart: 'Handlekurv',
  nav_admin: 'Admin',

  // Products
  products_title: 'Lego-butikk',
  products_search: 'Søk etter produkter...',
  products_filter_theme: 'Filtrer etter tema',
  products_all_themes: 'Alle temaer',
  products_pieces: 'brikker',
  products_add_to_cart: 'Legg i handlekurv',
  products_out_of_stock: 'Ikke på lager',
  products_age: 'Alder',
  products_no_results: 'Ingen produkter funnet',

  // Cart
  cart_title: 'Handlekurv',
  cart_empty: 'Handlekurven din er tom',
  cart_total: 'Totalt',
  cart_checkout: 'Gå til kassen',
  cart_remove: 'Fjern',
  cart_quantity: 'Antall',
  cart_continue_shopping: 'Fortsett å handle',
  cart_items: 'varer i handlekurv',

  // Checkout
  checkout_title: 'Kasse',
  checkout_shipping: 'Leveringsadresse',
  checkout_billing: 'Faktureringsadresse',
  checkout_same_as_billing: 'Samme som leveringsadresse',
  checkout_first_name: 'Fornavn',
  checkout_last_name: 'Etternavn',
  checkout_street: 'Gateadresse',
  checkout_city: 'By',
  checkout_postal_code: 'Postnummer',
  checkout_country: 'Land',
  checkout_payment: 'Betaling',
  checkout_card_number: 'Kortnummer',
  checkout_place_order: 'Legg inn bestilling',
  checkout_processing: 'Behandler...',
  checkout_success: 'Bestilling lagt inn!',
  checkout_order_number: 'Ordrenummer',
  checkout_error: 'Kunne ikke legge inn bestilling. Prøv igjen.',

  // Admin
  admin_title: 'Adminpanel',
  admin_orders: 'Bestillinger',
  admin_dashboard: 'Dashbord',
  admin_filter_status: 'Filtrer etter status',
  admin_all_statuses: 'Alle statuser',
  admin_order_id: 'Ordre-ID',
  admin_date: 'Dato',
  admin_total: 'Totalt',
  admin_status: 'Status',
  admin_actions: 'Handlinger',
  admin_refund: 'Refunder',
  admin_refunded: 'Refundert',
  admin_view_logs: 'Vis logger',
  admin_open_logs_dir: 'Åpne loggmappe',
  admin_logs_title: 'Ordrelogger',
  admin_include_technical: 'Inkluder tekniske logger',
  admin_no_logs: 'Ingen logger funnet for denne ordren',
  admin_confirm_refund: 'Er du sikker på at du vil refundere denne ordren?',

  // Order statuses
  status_received: 'Mottatt',
  status_confirmed: 'Bekreftet',
  status_canceled: 'Kansellert',
  status_shipped: 'Sendt',
  status_delivered: 'Levert',
  status_awaiting_return: 'Venter på retur',
  status_returned: 'Returnert',

  // Status transitions
  action_confirm: 'Bekreft',
  action_cancel: 'Kanseller',
  action_ship: 'Merk som sendt',
  action_deliver: 'Merk som levert',
  action_request_return: 'Be om retur',
  action_return: 'Merk som returnert',

  // General
  loading: 'Laster...',
  error: 'En feil oppstod',
  back: 'Tilbake',
  nok: 'kr',
};
