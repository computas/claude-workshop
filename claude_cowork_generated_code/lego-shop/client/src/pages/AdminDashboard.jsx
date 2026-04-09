import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Derive dashboard stats from existing endpoints — no dedicated route needed
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders'),
      ])
      const products = productsRes.data
      const orders   = ordersRes.data

      const byStatus = {}
      for (const o of orders) {
        byStatus[o.status] = (byStatus[o.status] || 0) + 1
      }

      setStats({
        totalProducts:    products.length,
        totalOrders:      orders.length,
        pendingOrders:    byStatus.pending   || 0,
        confirmedOrders:  byStatus.confirmed || 0,
        shippedOrders:    byStatus.shipped   || 0,
        deliveredOrders:  byStatus.delivered || 0,
        canceledOrders:   byStatus.canceled  || 0,
        returnedOrders:  (byStatus.awaiting_return || 0) + (byStatus.returned || 0),
      })
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="spinner"></div>

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{t('admin.dashboard')}</h1>
      </div>

      {/* ── Overview cards ─────────────────────────────────────────── */}
      <div className="dashboard-grid">
        <div className="dashboard-card primary">
          <h3>{t('admin.total_products')}</h3>
          <div className="value">{stats?.totalProducts ?? 0}</div>
        </div>
        <div className="dashboard-card secondary">
          <h3>{t('admin.total_orders')}</h3>
          <div className="value">{stats?.totalOrders ?? 0}</div>
        </div>
        <div className="dashboard-card info">
          <h3>{t('admin.pending_orders')}</h3>
          <div className="value">{stats?.pendingOrders ?? 0}</div>
        </div>
        <div className="dashboard-card success">
          <h3>{t('admin.completed_orders') || 'Delivered'}</h3>
          <div className="value">{stats?.deliveredOrders ?? 0}</div>
        </div>
      </div>

      {/* ── Orders by status breakdown ─────────────────────────────── */}
      {stats?.totalOrders > 0 && (
        <div className="form-section">
          <h3>{t('admin.order_status') || 'Orders by Status'}</h3>
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {[
              { key: 'confirmedOrders',  label: t('admin.status_confirmed') || 'Confirmed',       cls: 'badge-confirmed'     },
              { key: 'shippedOrders',    label: t('admin.status_shipped')   || 'Shipped',         cls: 'badge-shipped'       },
              { key: 'deliveredOrders',  label: t('admin.status_delivered') || 'Delivered',       cls: 'badge-delivered'     },
              { key: 'canceledOrders',   label: t('admin.status_canceled')  || 'Canceled',        cls: 'badge-canceled'      },
              { key: 'returnedOrders',   label: t('admin.status_returned')  || 'Returned',        cls: 'badge-returned'      },
            ].filter(item => stats[item.key] > 0).map(item => (
              <div key={item.key} className="dashboard-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <span className={`badge ${item.cls}`}>{item.label}</span>
                <div className="value" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{stats[item.key]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick links ────────────────────────────────────────────── */}
      <div className="form-section">
        <h2>{t('admin.quick_links') || 'Quick Links'}</h2>
        <div className="quick-links">
          <Link to="/admin/products" className="quick-link-btn">
            📦 {t('admin.manage_products')}
          </Link>
          <Link to="/admin/orders" className="quick-link-btn">
            📋 {t('admin.manage_orders')}
          </Link>
          <Link to="/admin/logs" className="quick-link-btn">
            📜 {t('admin.view_logs')}
          </Link>
        </div>
      </div>
    </div>
  )
}
