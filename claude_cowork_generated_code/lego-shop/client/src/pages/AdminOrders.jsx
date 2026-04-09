import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')

  const { t } = useLanguage()

  const statuses = [
    { value: 'pending', label: t('admin.status_pending') },
    { value: 'confirmed', label: t('admin.status_confirmed') },
    { value: 'shipped', label: t('admin.status_shipped') },
    { value: 'delivered', label: t('admin.status_delivered') },
    { value: 'canceled', label: t('admin.status_canceled') },
    { value: 'awaiting_return', label: t('admin.status_awaiting_return') },
    { value: 'returned', label: t('admin.status_returned') }
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [selectedStatus, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/orders')
      setOrders(response.data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus))
    }
  }

  const getStatusBadgeClass = (status) => {
    const classMap = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      shipped: 'badge-shipped',
      delivered: 'badge-delivered',
      canceled: 'badge-canceled',
      awaiting_return: 'badge-awaiting-return',
      returned: 'badge-returned'
    }
    return classMap[status] || 'badge-pending'
  }

  const getStatusLabel = (status) => {
    const statusObj = statuses.find(s => s.value === status)
    return statusObj ? statusObj.label : status
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{t('admin.manage_orders')}</h1>
      </div>

      <div className="form-section" style={{ marginBottom: '2rem' }}>
        <label htmlFor="statusFilter">{t('admin.order_status')}</label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ marginTop: '0.5rem' }}
        >
          <option value="all">All Statuses</option>
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('admin.order_id')}</th>
              <th>{t('admin.customer')}</th>
              <th>Email</th>
              <th>{t('admin.items')}</th>
              <th>Total</th>
              <th>{t('admin.order_status')}</th>
              <th>{t('common.add')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>—</td>
                  <td>{order.total_amount?.toLocaleString('nb-NO') || '0'} kr</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="btn btn-sm btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      {t('admin.view_order')}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
