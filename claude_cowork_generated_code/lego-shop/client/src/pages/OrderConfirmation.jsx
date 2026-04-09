import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/orders/${id}`)
      setOrder(response.data)
    } catch (err) {
      console.error('Failed to fetch order:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-icon">✅</div>
        <h1 className="confirmation-title">{t('order_confirmation.title')}</h1>
        <p className="confirmation-subtitle">{t('order_confirmation.subtitle')}</p>

        {order && (
          <div className="confirmation-details">
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">{t('order_confirmation.order_number')}:</span>
              <span className="confirmation-detail-value">#{order.id}</span>
            </div>
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">{t('order_confirmation.order_date')}:</span>
              <span className="confirmation-detail-value">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">Customer:</span>
              <span className="confirmation-detail-value">{order.customer_name}</span>
            </div>
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">Email:</span>
              <span className="confirmation-detail-value">{order.customer_email}</span>
            </div>
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">Items:</span>
              <span className="confirmation-detail-value">{order.items?.length || 0}</span>
            </div>
            <div className="confirmation-detail-row">
              <span className="confirmation-detail-label">Total:</span>
              <span className="confirmation-detail-value">{order.total_amount?.toLocaleString('nb-NO') || '0'} kr</span>
            </div>
          </div>
        )}

        <div className="confirmation-actions">
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            {t('order_confirmation.continue_shopping')}
          </Link>
        </div>
      </div>
    </div>
  )
}
