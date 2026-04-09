import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [orderLogs, setOrderLogs] = useState([])
  const [technicalLogs, setTechnicalLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showTechnicalLogs, setShowTechnicalLogs] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusError, setStatusError] = useState(null)

  const { t } = useLanguage()

  // DB uses snake_case status values — these must match exactly
  const statusLabels = {
    pending:         t('admin.status_pending'),
    confirmed:       t('admin.status_confirmed'),
    shipped:         t('admin.status_shipped'),
    delivered:       t('admin.status_delivered'),
    canceled:        t('admin.status_canceled'),
    awaiting_return: t('admin.status_awaiting_return'),
    returned:        t('admin.status_returned'),
  }

  const statusTransitions = {
    pending:         ['confirmed', 'canceled'],
    confirmed:       ['shipped', 'canceled'],
    shipped:         ['delivered'],
    delivered:       ['awaiting_return'],
    awaiting_return: ['returned'],
    returned:        [],
    canceled:        [],
  }

  const statusBadgeClass = {
    pending:         'badge-pending',
    confirmed:       'badge-confirmed',
    shipped:         'badge-shipped',
    delivered:       'badge-delivered',
    canceled:        'badge-canceled',
    awaiting_return: 'badge-awaiting-return',
    returned:        'badge-returned',
  }

  useEffect(() => { fetchOrder() }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/orders/${id}`)
      setOrder(res.data)
      setNewStatus(res.data.status)
      fetchOrderLogs()
    } catch (err) {
      console.error('Failed to fetch order:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderLogs = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}/logs`)
      setOrderLogs(res.data.logs || [])
    } catch (err) {
      console.error('Failed to fetch order logs:', err)
    }
  }

  const fetchTechnicalLogs = async () => {
    try {
      const res = await axios.get(`/api/logs/technical?lines=100`)
      setTechnicalLogs(res.data.logs || [])
    } catch (err) {
      console.error('Failed to fetch technical logs:', err)
    }
  }

  const handleToggleTechnical = (e) => {
    const checked = e.target.checked
    setShowTechnicalLogs(checked)
    if (checked && technicalLogs.length === 0) fetchTechnicalLogs()
  }

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) return
    setStatusError(null)
    try {
      setUpdating(true)
      // Backend route: PUT /api/orders/:id/status  { status }
      await axios.put(`/api/orders/${id}/status`, { status: newStatus })
      fetchOrder()
    } catch (err) {
      setStatusError(err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleRefund = async () => {
    if (!window.confirm(t('admin.refund_confirm') || 'Process refund for this order?')) return
    try {
      setUpdating(true)
      await axios.post(`/api/orders/${id}/refund`)
      fetchOrder()
    } catch (err) {
      setStatusError(err.response?.data?.error || 'Failed to process refund')
    } finally {
      setUpdating(false)
    }
  }

  const openLogsDirectory = async () => {
    try {
      await axios.post('/api/logs/open-directory')
    } catch (err) {
      console.error('Failed to open logs directory:', err)
    }
  }

  const formatLogLine = (log) => {
    const ts = log.timestamp ? new Date(log.timestamp).toLocaleString() : ''
    const level = (log.level || 'info').toUpperCase()
    return `${ts}  [${level}]  ${log.message}`
  }

  if (loading) return <div className="spinner"></div>

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="form-section" style={{ textAlign: 'center' }}>
          <p>Order not found.</p>
          <button onClick={() => navigate('/admin/orders')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const canRefund = ['canceled', 'returned'].includes(order.status)
  const allowedTransitions = statusTransitions[order.status] || []
  const combinedLogs = showTechnicalLogs
    ? [...orderLogs, ...technicalLogs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : orderLogs

  return (
    <div className="order-detail-container">
      <button onClick={() => navigate('/admin/orders')} className="btn btn-outline" style={{ marginBottom: '1rem' }}>
        ← {t('common.back') || 'Back'}
      </button>

      <h1>{t('admin.order_detail') || 'Order Detail'} #{order.id}</h1>

      {/* ── Customer + Shipping ─────────────────────────────────────── */}
      <div className="order-info-grid">
        <div className="order-info-box">
          <h3>{t('admin.customer_info') || 'Customer'}</h3>
          <InfoRow label={t('checkout.name') || 'Name'}      value={order.customer_name} />
          <InfoRow label={t('checkout.email') || 'Email'}    value={order.customer_email} />
          <InfoRow label={t('admin.created_at') || 'Placed'} value={new Date(order.created_at).toLocaleString()} />
          <InfoRow label="Payment ID"                         value={order.payment_id || '—'} />
        </div>

        <div className="order-info-box">
          <h3>{t('admin.shipping_info') || 'Shipping Address'}</h3>
          <InfoRow label={t('checkout.address_line_1') || 'Address'} value={order.shipping_address_line1} />
          {order.shipping_address_line2 && <InfoRow label="" value={order.shipping_address_line2} />}
          <InfoRow label={t('checkout.city') || 'City'}       value={order.shipping_city} />
          <InfoRow label={t('checkout.zip_code') || 'ZIP'}    value={order.shipping_zip} />
          <InfoRow label={t('checkout.country') || 'Country'} value={order.shipping_country} />
        </div>

        <div className="order-info-box">
          <h3>{t('admin.invoice_info') || 'Invoice Address'}</h3>
          <InfoRow label={t('checkout.address_line_1') || 'Address'} value={order.invoice_address_line1} />
          {order.invoice_address_line2 && <InfoRow label="" value={order.invoice_address_line2} />}
          <InfoRow label={t('checkout.city') || 'City'}       value={order.invoice_city} />
          <InfoRow label={t('checkout.zip_code') || 'ZIP'}    value={order.invoice_zip} />
          <InfoRow label={t('checkout.country') || 'Country'} value={order.invoice_country} />
        </div>
      </div>

      {/* ── Order Items ──────────────────────────────────────────────── */}
      <div className="form-section">
        <h3>{t('admin.order_items') || 'Items'}</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product_name || `Product #${item.product_id}`}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit_price?.toLocaleString('nb-NO')} kr</td>
                  <td>{(item.quantity * item.unit_price)?.toLocaleString('nb-NO')} kr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Total: {order.total_amount?.toLocaleString('nb-NO')} kr
        </div>
      </div>

      {/* ── Status Management ────────────────────────────────────────── */}
      <div className="status-update-section">
        <h3>{t('admin.current_status') || 'Status'}</h3>
        <div style={{ marginBottom: '1.5rem' }}>
          <span className={`badge ${statusBadgeClass[order.status] || 'badge-pending'}`}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>

        {statusError && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem 1rem', borderRadius: 4, marginBottom: '1rem' }}>
            {statusError}
          </div>
        )}

        {allowedTransitions.length > 0 && (
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>{t('admin.update_status') || 'Move to'}</label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value={order.status}>{statusLabels[order.status] || order.status} (current)</option>
              {allowedTransitions.map(s => (
                <option key={s} value={s}>{statusLabels[s] || s}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {newStatus !== order.status && (
            <button className="btn btn-primary" onClick={handleStatusUpdate} disabled={updating}>
              {updating ? (t('checkout.processing') || 'Saving…') : (t('common.confirm') || 'Update Status')}
            </button>
          )}
          {canRefund && (
            <button className="btn btn-secondary" onClick={handleRefund} disabled={updating}>
              {t('admin.refund') || 'Process Refund'}
            </button>
          )}
        </div>
      </div>

      {/* ── Order Logs ───────────────────────────────────────────────── */}
      <div className="logs-container">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>{t('admin.log_viewer') || 'Order Logs'}</h3>
            <button className="btn btn-sm btn-outline" onClick={openLogsDirectory}>
              {t('admin.open_logs_directory') || 'Open Logs Folder'}
            </button>
          </div>
          <div className="checkbox-group" style={{ marginTop: '1rem' }}>
            <input
              type="checkbox"
              id="technicalLogs"
              checked={showTechnicalLogs}
              onChange={handleToggleTechnical}
            />
            <label htmlFor="technicalLogs" style={{ margin: 0 }}>
              {t('admin.include_technical') || 'Include technical logs'}
            </label>
          </div>
        </div>

        <div className="log-viewer">
          {combinedLogs.length === 0 ? (
            <div className="log-line">No logs yet for this order.</div>
          ) : (
            combinedLogs.map((log, idx) => (
              <div key={idx} className={`log-line ${(log.level || 'info').toLowerCase()}`}>
                {formatLogLine(log)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="order-info-item">
      {label && <span className="order-info-label">{label}</span>}
      <span className="order-info-value">{value || '—'}</span>
    </div>
  )
}
