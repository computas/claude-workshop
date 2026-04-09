import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart()
  const { t } = useLanguage()

  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>{t('cart.your_cart')}</h2>
        <p className="cart-empty-text">{t('cart.empty_cart')}</p>
        <Link to="/" className="btn btn-primary">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    )
  }

  const handleQuantityChange = (productId, newQuantity) => {
    const value = parseInt(newQuantity) || 1
    updateQuantity(productId, Math.max(1, value))
  }

  const handleIncrement = (productId) => {
    const item = items.find(i => i.product.id === productId)
    if (item) {
      updateQuantity(productId, item.quantity + 1)
    }
  }

  const handleDecrement = (productId) => {
    const item = items.find(i => i.product.id === productId)
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1)
    }
  }

  return (
    <div className="checkout-container">
      <h1>{t('cart.your_cart')}</h1>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.product.id} className="cart-item">
            <div className="cart-item-image" style={{ overflow: 'hidden' }}>
              <img
                src={`http://localhost:3001${item.product.image_url}`}
                alt={item.product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display='none'; e.target.parentElement.textContent='🧱'; }}
              />
            </div>
            <div className="cart-item-info">
              <div className="cart-item-title">{item.product.name}</div>
              <div className="cart-item-price">
                {(item.product.price * item.quantity).toLocaleString('nb-NO')} kr
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {t('product.category')}: {item.product.category}
              </div>
            </div>
            <div className="cart-item-controls">
              <div className="quantity-selector">
                <button onClick={() => handleDecrement(item.product.id)}>−</button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                  style={{ border: 'none', textAlign: 'center' }}
                />
                <button onClick={() => handleIncrement(item.product.id)}>+</button>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => removeFromCart(item.product.id)}
              >
                {t('cart.remove')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>{t('cart.subtotal')}:</span>
          <span>{total.toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="cart-summary-row">
          <span>{t('cart.shipping')}:</span>
          <span>Free</span>
        </div>
        <div className="cart-summary-row">
          <span>{t('cart.tax')} (25% MVA):</span>
          <span>{(total * 0.25).toLocaleString('nb-NO')} kr</span>
        </div>
        <div className="cart-summary-row total">
          <span>{t('cart.total')}:</span>
          <span>{(total * 1.25).toLocaleString('nb-NO')} kr</span>
        </div>

        <div className="cart-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>
            {t('cart.continue_shopping')}
          </Link>
          <Link to="/checkout" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            {t('cart.proceed_checkout')}
          </Link>
        </div>
      </div>
    </div>
  )
}
