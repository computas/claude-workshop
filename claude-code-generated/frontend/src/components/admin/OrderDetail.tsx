import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Order, OrderStatus } from '@workshop/shared';
import { getOrder, updateOrderStatus, refundOrder } from '../../api/orders.js';
import { useAppContext } from '../../context/AppContext.js';
import { LogViewer } from './LogViewer.js';
import { cat } from '../../theme.js';

const TRANSITIONS: Record<OrderStatus, { status: OrderStatus; actionKey: string }[]> = {
  received: [
    { status: 'confirmed', actionKey: 'action_confirm' },
    { status: 'canceled', actionKey: 'action_cancel' },
  ],
  confirmed: [
    { status: 'shipped', actionKey: 'action_ship' },
    { status: 'canceled', actionKey: 'action_cancel' },
  ],
  canceled: [],
  shipped: [
    { status: 'delivered', actionKey: 'action_deliver' },
    { status: 'awaiting_return', actionKey: 'action_request_return' },
  ],
  delivered: [{ status: 'awaiting_return', actionKey: 'action_request_return' }],
  awaiting_return: [{ status: 'returned', actionKey: 'action_return' }],
  returned: [],
};

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useAppContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrder(parseInt(id, 10))
      .then(setOrder)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function handleRefund() {
    if (!order) return;
    if (!confirm(t('admin_confirm_refund'))) return;
    try {
      const updated = await refundOrder(order.id);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refund');
    }
  }

  if (loading) return <div style={{ padding: '24px', color: cat.subtext0 }}>{t('loading')}</div>;
  if (error) return <div style={{ padding: '24px', color: cat.red }}>{error}</div>;
  if (!order) return <div style={{ padding: '24px', color: cat.text }}>Order not found</div>;

  const transitions = TRANSITIONS[order.status];
  const canRefund = (order.status === 'canceled' || order.status === 'returned') && !order.refunded && order.transactionId;

  const addr = order.shippingAddress;

  const cardStyle: React.CSSProperties = {
    background: cat.surface0, border: `1px solid ${cat.surface1}`, borderRadius: '8px', padding: '16px',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/admin" style={{ color: cat.blue, textDecoration: 'none', fontSize: '0.9rem' }}>← {t('back')}</Link>

      <h1 style={{ margin: '16px 0', color: cat.text }}>Order #{order.id}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, color: cat.text }}>{t('admin_status')}</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', color: cat.text }}>
            {t(`status_${order.status}` as Parameters<typeof t>[0])}
            {order.refunded && <span style={{ marginLeft: '8px', color: cat.green, fontSize: '0.9rem' }}>✓ {t('admin_refunded')}</span>}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {transitions.map(({ status, actionKey }) => (
              <button
                key={status}
                onClick={() => void handleStatusChange(status)}
                style={{
                  padding: '8px 14px',
                  background: status === 'canceled' ? `${cat.red}1a` : `${cat.blue}1a`,
                  color: status === 'canceled' ? cat.red : cat.blue,
                  border: `1px solid ${status === 'canceled' ? cat.maroon : cat.sapphire}`,
                  borderRadius: '6px', cursor: 'pointer', fontWeight: '500',
                }}
              >
                {t(actionKey as Parameters<typeof t>[0])}
              </button>
            ))}
            {canRefund && (
              <button
                onClick={() => void handleRefund()}
                style={{
                  padding: '8px 14px', background: `${cat.peach}1a`, color: cat.peach,
                  border: `1px solid ${cat.yellow}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '500',
                }}
              >
                💸 {t('admin_refund')}
              </button>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, color: cat.text }}>{t('checkout_shipping')}</h3>
          <p style={{ margin: 0, lineHeight: 1.6, color: cat.subtext1 }}>
            {addr.firstName} {addr.lastName}<br />
            {addr.street}<br />
            {addr.postalCode} {addr.city}<br />
            {addr.country}
          </p>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0, color: cat.text }}>Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${cat.surface1}` }}>
                <td style={{ padding: '8px 0', color: cat.text }}>{item.productName}</td>
                <td style={{ padding: '8px', textAlign: 'center', color: cat.subtext1 }}>×{item.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right', color: cat.text }}>{(item.unitPrice * item.quantity).toLocaleString('nb-NO')} {t('nok')}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ padding: '12px 0', fontWeight: 'bold', color: cat.text }}>{t('cart_total')}</td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: cat.text }}>
                {order.total.toLocaleString('nb-NO')} {t('nok')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: cat.text }}>{t('admin_view_logs')}</h3>
          <button
            onClick={() => setShowLogs(!showLogs)}
            style={{ padding: '6px 14px', border: `1px solid ${cat.surface2}`, borderRadius: '6px', background: cat.surface1, color: cat.text, cursor: 'pointer' }}
          >
            {showLogs ? '▲ Hide' : '▼ Show'}
          </button>
        </div>
        {showLogs && <LogViewer orderId={order.id} />}
      </div>
    </div>
  );
}
