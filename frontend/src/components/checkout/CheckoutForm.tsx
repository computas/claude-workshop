import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { createOrder } from '../../api/orders';
import { simulatePayment } from '../../api/payments';

interface AddressFields {
  name: string;
  address: string;
  city: string;
  zip: string;
}

interface FormState {
  shipping: AddressFields;
  email: string;
  billing: AddressFields;
  sameAddress: boolean;
}

const emptyAddress = (): AddressFields => ({ name: '', address: '', city: '', zip: '' });

export function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    shipping: emptyAddress(),
    email: '',
    billing: emptyAddress(),
    sameAddress: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateShipping(field: keyof AddressFields, value: string) {
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
      billing: prev.sameAddress
        ? { ...prev.shipping, [field]: value }
        : prev.billing,
    }));
  }

  function updateBilling(field: keyof AddressFields, value: string) {
    setForm((prev) => ({ ...prev, billing: { ...prev.billing, [field]: value } }));
  }

  function toggleSameAddress(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      sameAddress: checked,
      billing: checked ? { ...prev.shipping } : emptyAddress(),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const billing = form.sameAddress ? form.shipping : form.billing;

    try {
      const order = await createOrder({
        items: items.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity,
          unit_price: product.price,
        })),
        total,
        shipping_name: form.shipping.name,
        shipping_address: form.shipping.address,
        shipping_city: form.shipping.city,
        shipping_zip: form.shipping.zip,
        billing_name: billing.name,
        billing_address: billing.address,
        billing_city: billing.city,
        billing_zip: billing.zip,
        email: form.email,
      });

      await simulatePayment(order.id, order.total);

      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Kassen</h2>

      {error && <p className="error-message">{error}</p>}

      <fieldset style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>
        <legend style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
          Leveringsadresse
        </legend>

        <div className="form-group">
          <label htmlFor="s-name">Navn *</label>
          <input
            id="s-name"
            name="shipping_name"
            className="form-control"
            required
            value={form.shipping.name}
            onChange={(e) => updateShipping('name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="s-email">E-post *</label>
          <input
            id="s-email"
            name="email"
            className="form-control"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="s-address">Adresse *</label>
          <input
            id="s-address"
            name="shipping_address"
            className="form-control"
            required
            value={form.shipping.address}
            onChange={(e) => updateShipping('address', e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="s-city">By *</label>
            <input
              id="s-city"
              name="shipping_city"
              className="form-control"
              required
              value={form.shipping.city}
              onChange={(e) => updateShipping('city', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: '0 0 120px' }}>
            <label htmlFor="s-zip">Postnummer *</label>
            <input
              id="s-zip"
              name="shipping_zip"
              className="form-control"
              required
              value={form.shipping.zip}
              onChange={(e) => updateShipping('zip', e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.sameAddress}
            onChange={(e) => toggleSameAddress(e.target.checked)}
          />
          Fakturadresse er samme som leveringsadresse
        </label>
      </div>

      {!form.sameAddress && (
        <fieldset style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>
          <legend style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
            Fakturadresse
          </legend>
          <div className="form-group">
            <label htmlFor="b-name">Navn *</label>
            <input
              id="b-name"
              className="form-control"
              required
              value={form.billing.name}
              onChange={(e) => updateBilling('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="b-address">Adresse *</label>
            <input
              id="b-address"
              className="form-control"
              required
              value={form.billing.address}
              onChange={(e) => updateBilling('address', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="b-city">By *</label>
              <input
                id="b-city"
                className="form-control"
                required
                value={form.billing.city}
                onChange={(e) => updateBilling('city', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: '0 0 120px' }}>
              <label htmlFor="b-zip">Postnummer *</label>
              <input
                id="b-zip"
                className="form-control"
                required
                value={form.billing.zip}
                onChange={(e) => updateBilling('zip', e.target.value)}
              />
            </div>
          </div>
        </fieldset>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '2px solid var(--border)',
          paddingTop: '1rem',
        }}
      >
        <strong>Totalt: {total} NOK</strong>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Behandler...' : 'Betal nå'}
        </button>
      </div>
    </form>
  );
}
