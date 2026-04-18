import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';
import { createOrder } from '../api/orders.js';
import type { ShippingAddress } from '@workshop/shared';
import { cat } from '../theme.js';

const emptyAddress: ShippingAddress = {
  firstName: '', lastName: '', street: '', city: '', postalCode: '', country: '',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px',
  border: `1px solid ${cat.surface2}`, borderRadius: '6px',
  fontSize: '0.95rem', boxSizing: 'border-box',
  background: cat.surface0, color: cat.text,
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '0.9rem', color: cat.subtext1 };

function AddressFields({ values, onChange, t }: { values: ShippingAddress; onChange: (field: keyof ShippingAddress, value: string) => void; t: (key: string) => string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {(['firstName', 'lastName', 'street', 'city', 'postalCode', 'country'] as (keyof ShippingAddress)[]).map(field => (
        <div key={field} style={field === 'street' ? { gridColumn: '1 / -1' } : {}}>
          <label style={labelStyle}>{t(`checkout_${field === 'firstName' ? 'first_name' : field === 'lastName' ? 'last_name' : field === 'postalCode' ? 'postal_code' : field}` as Parameters<typeof t>[0])}</label>
          <input style={inputStyle} value={values[field]} onChange={e => onChange(field, e.target.value)} required />
        </div>
      ))}
    </div>
  );
}

export function CheckoutPage() {
  const { t, cart, sessionId, refreshCart } = useAppContext();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState<ShippingAddress>({ ...emptyAddress });
  const [billing, setBilling] = useState<ShippingAddress>({ ...emptyAddress });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  function updateShipping(field: keyof ShippingAddress, value: string) {
    setShipping(prev => ({ ...prev, [field]: value }));
  }

  function updateBilling(field: keyof ShippingAddress, value: string) {
    setBilling(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const order = await createOrder({
        sessionId,
        shippingAddress: shipping,
        billingAddress: sameAsBilling ? shipping : billing,
        sameAsBilling,
        paymentToken: `card_${cardNumber.replace(/\s/g, '')}`,
      });
      await refreshCart();
      setOrderId(order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('checkout_error'));
    } finally {
      setLoading(false);
    }
  }

  if (orderId !== null) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
        <h1 style={{ color: cat.green }}>{t('checkout_success')}</h1>
        <p style={{ color: cat.subtext0, margin: '16px 0' }}>{t('checkout_order_number')}: <strong style={{ color: cat.text }}>#{orderId}</strong></p>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '12px 24px', background: cat.blue, color: cat.crust, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          {t('cart_continue_shopping')}
        </button>
      </div>
    );
  }

  const sectionStyle: React.CSSProperties = { marginBottom: '24px' };
  const fieldStyle: React.CSSProperties = { marginBottom: '12px' };

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', color: cat.text }}>{t('checkout_title')}</h1>

      <div style={{ background: cat.surface0, borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <strong style={{ color: cat.text }}>{t('cart_total')}: {cart.total.toLocaleString('nb-NO')} {t('nok')}</strong>
        <span style={{ color: cat.subtext0, marginLeft: '12px' }}>({cart.items.length} {t('cart_items')})</span>
      </div>

      <form onSubmit={e => void handleSubmit(e)}>
        <div style={sectionStyle}>
          <h2 style={{ marginBottom: '16px', color: cat.text }}>{t('checkout_shipping')}</h2>
          <AddressFields values={shipping} onChange={updateShipping} t={t} />
        </div>

        <div style={{ ...fieldStyle, marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: cat.subtext1 }}>
            <input type="checkbox" checked={sameAsBilling} onChange={e => setSameAsBilling(e.target.checked)} />
            {t('checkout_same_as_billing')}
          </label>
        </div>

        {!sameAsBilling && (
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: '16px', color: cat.text }}>{t('checkout_billing')}</h2>
            <AddressFields values={billing} onChange={updateBilling} t={t} />
          </div>
        )}

        <div style={sectionStyle}>
          <h2 style={{ marginBottom: '16px', color: cat.text }}>{t('checkout_payment')}</h2>
          <div style={fieldStyle}>
            <label style={labelStyle}>{t('checkout_card_number')}</label>
            <input
              style={inputStyle}
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              required
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px', background: `${cat.red}1a`, border: `1px solid ${cat.maroon}`, borderRadius: '6px', color: cat.red, marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? cat.overlay2 : cat.blue,
            color: cat.crust, border: 'none', borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '1.1rem',
          }}
        >
          {loading ? t('checkout_processing') : t('checkout_place_order')}
        </button>
      </form>
    </div>
  );
}
