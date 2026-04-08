import { useState } from 'react';
import type { Product } from '@workshop/shared';
import { useProducts } from '../../hooks/useProducts';
import { createProduct, updateProduct, deleteProduct } from '../../api/products';
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductForm } from '../../components/admin/ProductForm';

export function AdminProductsPage() {
  const { products, loading, error, refetch } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function openCreate() {
    setEditingProduct(undefined);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(undefined);
  }

  async function handleSave(data: Omit<Product, 'id' | 'created_at'>) {
    setActionError(null);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      closeForm();
      refetch();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Lagring feilet');
    }
  }

  async function handleDelete(id: number) {
    setActionError(null);
    try {
      await deleteProduct(id);
      refetch();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Sletting feilet');
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Produkter</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + Nytt produkt
        </button>
      </div>

      {actionError && <p className="error-message">{actionError}</p>}

      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>{editingProduct ? 'Rediger produkt' : 'Nytt produkt'}</h2>
            <ProductForm product={editingProduct} onSave={handleSave} onCancel={closeForm} />
          </div>
        </div>
      )}

      {loading && <p className="loading">Laster produkter...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <ProductTable products={products} onEdit={openEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
