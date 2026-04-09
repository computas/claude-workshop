import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    pieces: '',
    category: '',
    ageMin: '',
    ageMax: '',
    description: '',
    stock: ''
  })

  const { t } = useLanguage()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      pieces: '',
      category: '',
      ageMin: '',
      ageMax: '',
      description: '',
      stock: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
        pieces: parseInt(formData.pieces),
        category: formData.category,
        ageMin: parseInt(formData.ageMin),
        ageMax: parseInt(formData.ageMax),
        description: formData.description,
        stock: parseInt(formData.stock)
      }

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, data)
      } else {
        await axios.post('/api/products', data)
      }

      fetchProducts()
      resetForm()
    } catch (err) {
      console.error('Failed to save product:', err)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      pieces: product.pieces,
      category: product.category,
      ageMin: product.ageMin,
      ageMax: product.ageMax,
      description: product.description,
      stock: product.stock
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm(t('admin.delete_confirm'))) {
      try {
        await axios.delete(`/api/products/${id}`)
        fetchProducts()
      } catch (err) {
        console.error('Failed to delete product:', err)
      }
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{t('admin.manage_products')}</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? t('common.cancel') : t('admin.add_product')}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>{editingId ? t('admin.edit_product') : t('admin.add_product')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('admin.product_name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.product_price')}</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('admin.product_pieces')}</label>
                <input
                  type="number"
                  name="pieces"
                  value={formData.pieces}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.product_category')}</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('admin.product_age_min')}</label>
                <input
                  type="number"
                  name="ageMin"
                  value={formData.ageMin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.product_age_max')}</label>
                <input
                  type="number"
                  name="ageMax"
                  value={formData.ageMax}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('admin.product_stock')}</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('admin.product_description')}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {t('admin.save_product')}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('admin.product_name')}</th>
              <th>{t('admin.product_category')}</th>
              <th>{t('admin.product_price')}</th>
              <th>{t('admin.product_stock')}</th>
              <th>{t('admin.product_pieces')}</th>
              <th>{t('common.add')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.pieces}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(product)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    {t('common.edit')}
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleDelete(product.id)}
                  >
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
