import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '@workshop/shared';
import { getAdminOrders } from '../../api/orders.js';
import { useAppContext } from '../../context/AppContext.js';

const ALL_STATUSES: OrderStatus[] = ['received', 'confirmed', 'canceled', 'shipped', 'delivered', 'awaiting_return', 'returned'];

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: '#3182ce',
  confirmed: '#38a169',
  canceled: '#e53e3e',
  shipped: '#805ad5',
  delivered: '#2f855a',
  awaiting_return: '#dd6b20',
  returned: '#718096',
};

export function OrderList() {
  const { t } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminOrders(filterStatus || undefined)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterStatus]);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label style={{ fontWeight: '500' }}>{t('admin_filter_status')}:</label>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as OrderStatus | '')}
          style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white' }}
        >
          <option value="">{t('admin_all_statuses')}</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{t(`status_${s}` as Parameters<typeof t>[0])}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#718096' }}>{t('loading')}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin_order_id')}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin_date')}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin_total')}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin_status')}</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>#{order.id}</td>
                <td style={{ padding: '12px', color: '#718096', fontSize: '0.9rem' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>{order.total.toLocaleString('nb-NO')} {t('nok')}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600',
                    background: `${STATUS_COLORS[order.status]}20`,
                    color: STATUS_COLORS[order.status],
                  }}>
                    {t(`status_${order.status}` as Parameters<typeof t>[0])}
                  </span>
                  {order.refunded && <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#38a169' }}>✓ {t('admin_refunded')}</span>}
                </td>
                <td style={{ padding: '12px' }}>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    style={{ color: '#0070f3', textDecoration: 'none', fontSize: '0.9rem' }}
                  >
                    {t('admin_actions')} →
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#718096' }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
