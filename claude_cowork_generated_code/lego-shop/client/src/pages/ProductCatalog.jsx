import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3000)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { addToCart } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/products')
      const productsData = response.data
      setProducts(productsData)

      const uniqueCategories = [...new Set(productsData.map(p => p.category))]
      setCategories(uniqueCategories)

      applyFilters(productsData, searchTerm, selectedCategory, minPrice, maxPrice)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (productsToFilter, search, category, min, max) => {
    let filtered = productsToFilter

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category)
    }

    filtered = filtered.filter(p => p.price >= min && p.price <= max)

    setFilteredProducts(filtered)
  }

  const handleSearchChange = (e) => {
    const search = e.target.value
    setSearchTerm(search)
    applyFilters(products, search, selectedCategory, minPrice, maxPrice)
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    applyFilters(products, searchTerm, category, minPrice, maxPrice)
  }

  const handlePriceChange = (e, type) => {
    const value = parseFloat(e.target.value)
    if (type === 'min') {
      setMinPrice(value)
      applyFilters(products, searchTerm, selectedCategory, value, maxPrice)
    } else {
      setMaxPrice(value)
      applyFilters(products, searchTerm, selectedCategory, minPrice, value)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  const getStockEmoji = (stock) => {
    return stock > 0 ? '✓' : '✗'
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{t('product.catalog')}</h1>
      </div>

      <div className="filters-container">
        <div>
          <label htmlFor="search">{t('product.search_placeholder')}</label>
          <input
            id="search"
            type="text"
            className="search-bar"
            placeholder={t('product.search_placeholder')}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">{t('product.filter_category')}</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t('product.min_price')}</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => handlePriceChange(e, 'min')}
          />
        </div>

        <div className="form-group">
          <label>{t('product.max_price')}</label>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => handlePriceChange(e, 'max')}
          />
        </div>
      </div>

      {error && <p className="text-error">{error}</p>}

      {filteredProducts.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <p>{t('product.no_products')}</p>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="card product-card">
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                <div className="product-card-image">
                  <img
                    src={`http://localhost:3001${product.image_url}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                  <div style={{ display:'none', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'3rem' }}>🧱</div>
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-title">{product.name}</h3>
                  <span className="product-card-category">{product.category}</span>
                  <div className="product-card-price">{product.price.toLocaleString('nb-NO')} kr</div>
                  <div className="product-card-meta">
                    <span>🔷 {product.piece_count} {t('product.pieces')}</span>
                    <span>👧 {product.age_range}</span>
                    <span>{getStockEmoji(product.in_stock)} {product.in_stock > 0 ? t('product.in_stock') : t('product.out_of_stock')}</span>
                  </div>
                </div>
              </Link>
              <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.in_stock === 0}
                >
                  {t('product.add_to_cart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
