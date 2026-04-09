import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCart()
  const { t } = useLanguage()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      zipCode: '',
      country: ''
    },
    invoiceAddress: {
      line1: '',
      line2: '',
      city: '',
      zipCode: '',
      country: ''
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value
      }
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t('validation.required_field'))
      return false
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t('validation.invalid_email'))
      return false
    }
    if (!formData.shippingAddress.line1.trim()) {
      setError(t('validation.required_field'))
      return false
    }
    if (!formData.shippingAddress.city.trim()) {
      setError(t('validation.required_field'))
      return false
    }
    if (!formData.shippingAddress.zipCode.trim()) {
      setError(t('validation.required_field'))
      return false
    }
    if (!sameAsShipping) {
      if (!formData.invoiceAddress.line1.trim() || !formData.invoiceAddress.city.trim()) {
        setError(t('validation.required_field'))
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const invoiceAddress = sameAsShipping ? formData.shippingAddress : formData.invoiceAddress

      const paymentData = {
        amount: getTotal() * 1.25,
        currency: 'NOK'
      }

      const paymentResponse = await axios.post('/api/payments/process', paymentData)

      if (!paymentResponse.data.success) {
        throw new Error('Payment processing failed')
      }

      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address_line1: formData.shippingAddress.line1,
        shipping_address_line2: formData.shippingAddress.line2,
        shipping_city: formData.shippingAddress.city,
        shipping_zip: formData.shippingAddress.zipCode,
        shipping_country: formData.shippingAddress.country,
        invoice_address_line1: invoiceAddress.line1,
        invoice_address_line2: invoiceAddress.line2,
        invoice_city: invoiceAddress.city,
        invoice_zip: invoiceAddress.zipCode,
        invoice_country: invoiceAddress.country,
        payment_id: paymentResponse.data.payment_id,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price
        }))
      }

      const orderResponse = await axios.post('/api/orders', orderData)
      const orderId = orderResponse.data.id

      clearCart()
      navigate(`/order-confirmation/${orderId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process order')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const total = getTotal()
  const tax = total * 0.25
  const finalTotal = total + tax

  if (items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="form-section text-center">
          <h2>{t('checkout.checkout_title')}</h2>
          <p className="mt-3">{t('cart.empty_cart')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>{t('checkout.checkout_title')}</h1>

      <div className="order-summary">
        <h3>{t('checkout.order_summary')}</h3>
        {items.map(item => (
          <div key={item.product.id} className="order-item">
            <div>
              <strong>{item.product.name}</strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                x{item.quantity} @ {item.product.price.toLocaleString('nb-NO')} kr
              </div>
            </div>
            <div>{(item.product.price * item.quantity).toLocaleString('nb-NO')} kr</div>
          </div>
        ))}
        <div className="order-total">
          <span>{t('checkout.order_summary')}</span>
          <span>{finalTotal.toLocaleString('nb-NO')} kr</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>{error}</div>}

        <div className="form-section">
          <h2>{t('checkout.customer_info')}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>{t('checkout.name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('checkout.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('checkout.phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>{t('checkout.shipping_address')}</h2>
          <div className="form-group">
            <label>{t('checkout.address_line_1')}</label>
            <input
              type="text"
              name="line1"
              value={formData.shippingAddress.line1}
              onChange={(e) => handleAddressChange(e, 'shippingAddress')}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('checkout.address_line_2')}</label>
            <input
              type="text"
              name="line2"
              value={formData.shippingAddress.line2}
              onChange={(e) => handleAddressChange(e, 'shippingAddress')}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('checkout.city')}</label>
              <input
                type="text"
                name="city"
                value={formData.shippingAddress.city}
                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('checkout.zip_code')}</label>
              <input
                type="text"
                name="zipCode"
                value={formData.shippingAddress.zipCode}
                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('checkout.country')}</label>
            <input
              type="text"
              name="country"
              value={formData.shippingAddress.country}
              onChange={(e) => handleAddressChange(e, 'shippingAddress')}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
            />
            <label htmlFor="sameAsShipping">{t('checkout.same_as_shipping')}</label>
          </div>

          {!sameAsShipping && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>{t('checkout.invoice_address')}</h3>
              <div className="form-group">
                <label>{t('checkout.address_line_1')}</label>
                <input
                  type="text"
                  name="line1"
                  value={formData.invoiceAddress.line1}
                  onChange={(e) => handleAddressChange(e, 'invoiceAddress')}
                />
              </div>
              <div className="form-group">
                <label>{t('checkout.address_line_2')}</label>
                <input
                  type="text"
                  name="line2"
                  value={formData.invoiceAddress.line2}
                  onChange={(e) => handleAddressChange(e, 'invoiceAddress')}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('checkout.city')}</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.invoiceAddress.city}
                    onChange={(e) => handleAddressChange(e, 'invoiceAddress')}
                  />
                </div>
                <div className="form-group">
                  <label>{t('checkout.zip_code')}</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.invoiceAddress.zipCode}
                    onChange={(e) => handleAddressChange(e, 'invoiceAddress')}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('checkout.country')}</label>
                <input
                  type="text"
                  name="country"
                  value={formData.invoiceAddress.country}
                  onChange={(e) => handleAddressChange(e, 'invoiceAddress')}
                />
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>{t('checkout.payment')}</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            {t('checkout.order_summary')}: <strong>{finalTotal.toLocaleString('nb-NO')} kr</strong>
          </p>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? t('checkout.processing') : t('checkout.pay_now')}
          </button>
        </div>
      </form>
    </div>
  )
}
