import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { OrderWithItems } from '@workshop/shared';
import { fetchOrderById } from '../api/orders';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchOrderById(Number(id))
      .then((data) => {
        if (!cancelled) {
          setOrder(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ukjent feil');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="loading" style={{ padding: '2rem' }}>Laster bestilling...</p>;
  if (error) return <p className="error-message" style={{ padding: '2rem' }}>{error}</p>;
  if (!order) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <div className="card">
        <h1 style={{ color: 'var(--primary)' }}>Bestilling bekreftet!</h1>
        <p style={{ color: '#64748b' }}>Bestillingsnummer: <strong>#{order.id}</strong></p>
        <p>Takk, {order.shipping_name}! Vi sender til {order.shipping_address}, {order.shipping_zip} {order.shipping_city}.</p>

        <div style={{ textAlign: 'left', margin: '1.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <h3>Bestilte varer</h3>
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}
            >
              <span>Produkt #{item.product_id} × {item.quantity}</span>
              <span>{item.unit_price * item.quantity} NOK</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          <span>Totalt</span>
          <span>{order.total} NOK</span>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Fortsett å handle
        </button>
      </div>
    </div>
  );
}
