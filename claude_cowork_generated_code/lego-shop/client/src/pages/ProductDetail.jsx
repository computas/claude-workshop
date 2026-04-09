import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { addToCart } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/products/${id}`)
      setProduct(response.data)
    } catch (err) {
      setError('Failed to load product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      navigate('/cart')
    }
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1
    setQuantity(Math.max(1, Math.min(product?.stock || 1, value)))
  }

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product?.stock || 1))
  }

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="card">
          <div className="card-body text-center">
            <p className="text-error">{error || 'Product not found'}</p>
            <Link to="/" className="btn btn-primary mt-3">{t('common.back')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <Link to="/" className="btn btn-outline mb-3">{t('product.back_to_catalog')}</Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img
            src={`http://localhost:3001${product.image_url}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
          <div style={{ display:'none', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'5rem' }}>🧱</div>
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <span className="product-detail-category">{product.category}</span>

          <div className="product-detail-price">{product.price.toLocaleString('nb-NO')} kr</div>

          <div className="product-detail-meta">
            <div className="product-detail-meta-item">
              <div className="product-detail-meta-label">{t('product.pieces')}</div>
              <div className="product-detail-meta-value">{product.piece_count}</div>
            </div>
            <div className="product-detail-meta-item">
              <div className="product-detail-meta-label">{t('product.ages')}</div>
              <div className="product-detail-meta-value">{product.age_range}</div>
            </div>
            <div className="product-detail-meta-item">
              <div className="product-detail-meta-label">Stock</div>
              <div className="product-detail-meta-value">{product.in_stock}</div>
            </div>
            <div className="product-detail-meta-item">
              <div className="product-detail-meta-label">Status</div>
              <div className="product-detail-meta-value">
                {product.in_stock > 0 ? (
                  <span className="badge badge-stock-in">{t('product.in_stock')}</span>
                ) : (
                  <span className="badge badge-stock-out">{t('product.out_of_stock')}</span>
                )}
              </div>
            </div>
          </div>

          <div className="product-detail-description">
            <h3>{t('product.description')}</h3>
            <p>{product.description}</p>
          </div>

          <div className="form-group">
            <label>{t('product.quantity')}</label>
            <div className="quantity-selector" style={{ width: '150px' }}>
              <button onClick={decreaseQuantity}>−</button>
              <input
                type="number"
                min="1"
                max={product.in_stock}
                value={quantity}
                onChange={handleQuantityChange}
                style={{ border: 'none', textAlign: 'center', flex: 1 }}
              />
              <button onClick={increaseQuantity}>+</button>
            </div>
          </div>

          <div className="product-detail-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.in_stock === 0}
            >
              {t('product.add_to_cart')}
            </button>
            <Link to="/" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
              {t('product.back_to_catalog')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
