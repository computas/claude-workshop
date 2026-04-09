import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Order, OrderStatus } from '@workshop/shared';
import { getOrder, updateOrderStatus, refundOrder } from '../../api/orders.js';
import { useAppContext } from '../../context/AppContext.js';
import { LogViewer } from './LogViewer.js';

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

  if (loading) return <div style={{ padding: '24px', color: '#718096' }}>{t('loading')}</div>;
  if (error) return <div style={{ padding: '24px', color: '#e53e3e' }}>{error}</div>;
  if (!order) return <div style={{ padding: '24px' }}>Order not found</div>;

  const transitions = TRANSITIONS[order.status];
  const canRefund = (order.status === 'canceled' || order.status === 'returned') && !order.refunded && order.transactionId;

  const addr = order.shippingAddress;

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/admin" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '0.9rem' }}>← {t('back')}</Link>

      <h1 style={{ margin: '16px 0' }}>Order #{order.id}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ marginTop: 0 }}>{t('admin_status')}</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>
            {t(`status_${order.status}` as Parameters<typeof t>[0])}
            {order.refunded && <span style={{ marginLeft: '8px', color: '#38a169', fontSize: '0.9rem' }}>✓ {t('admin_refunded')}</span>}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {transitions.map(({ status, actionKey }) => (
              <button
                key={status}
                onClick={() => void handleStatusChange(status)}
                style={{
                  padding: '8px 14px',
                  background: status === 'canceled' ? '#fff5f5' : '#ebf8ff',
                  color: status === 'canceled' ? '#c53030' : '#2b6cb0',
                  border: `1px solid ${status === 'canceled' ? '#feb2b2' : '#bee3f8'}`,
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
                  padding: '8px 14px', background: '#fffaf0', color: '#c05621',
                  border: '1px solid #fbd38d', borderRadius: '6px', cursor: 'pointer', fontWeight: '500',
                }}
              >
                💸 {t('admin_refund')}
              </button>
            )}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ marginTop: 0 }}>{t('checkout_shipping')}</h3>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            {addr.firstName} {addr.lastName}<br />
            {addr.street}<br />
            {addr.postalCode} {addr.city}<br />
            {addr.country}
          </p>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0 }}>Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 0' }}>{item.productName}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>×{item.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{(item.unitPrice * item.quantity).toLocaleString('nb-NO')} {t('nok')}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ padding: '12px 0', fontWeight: 'bold' }}>{t('cart_total')}</td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {order.total.toLocaleString('nb-NO')} {t('nok')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>{t('admin_view_logs')}</h3>
          <button
            onClick={() => setShowLogs(!showLogs)}
            style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
          >
            {showLogs ? '▲ Hide' : '▼ Show'}
          </button>
        </div>
        {showLogs && <LogViewer orderId={order.id} />}
      </div>
    </div>
  );
}
