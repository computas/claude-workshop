import { useState, useEffect } from 'react';
import type { Product, ProductCategory } from '@workshop/shared';
import { PRODUCT_CATEGORIES } from '@workshop/shared';

interface Props {
  product?: Product;
  onSave: (data: Omit<Product, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  image_url: string;
  stock: string;
  piece_count: string;
  age_min: string;
};

export function ProductForm({ product, onSave, onCancel }: Props) {
  const [form, setForm] = useState<FormData>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price != null ? String(product.price) : '',
    category: product?.category ?? PRODUCT_CATEGORIES[0],
    image_url: product?.image_url ?? '',
    stock: product?.stock != null ? String(product.stock) : '0',
    piece_count: product?.piece_count != null ? String(product.piece_count) : '',
    age_min: product?.age_min != null ? String(product.age_min) : '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? '',
        price: String(product.price),
        category: product.category,
        image_url: product.image_url ?? '',
        stock: String(product.stock),
        piece_count: product.piece_count != null ? String(product.piece_count) : '',
        age_min: product.age_min != null ? String(product.age_min) : '',
      });
    }
  }, [product]);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      category: form.category,
      image_url: form.image_url || null,
      stock: Number(form.stock),
      piece_count: form.piece_count ? Number(form.piece_count) : null,
      age_min: form.age_min ? Number(form.age_min) : null,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="pf-name">Navn *</label>
        <input id="pf-name" className="form-control" required value={form.name} onChange={(e) => set('name', e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="pf-description">Beskrivelse</label>
        <textarea
          id="pf-description"
          className="form-control"
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="pf-price">Pris (NOK) *</label>
          <input id="pf-price" className="form-control" type="number" min={0} required value={form.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="pf-stock">Lager *</label>
          <input id="pf-stock" className="form-control" type="number" min={0} required value={form.stock} onChange={(e) => set('stock', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="pf-category">Kategori *</label>
        <select
          id="pf-category"
          className="form-control"
          required
          value={form.category}
          onChange={(e) => set('category', e.target.value as ProductCategory)}
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="pf-image">Bilde-URL</label>
        <input id="pf-image" className="form-control" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="pf-pieces">Antall brikker</label>
          <input id="pf-pieces" className="form-control" type="number" min={0} value={form.piece_count} onChange={(e) => set('piece_count', e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="pf-age">Minimumsalder</label>
          <input id="pf-age" className="form-control" type="number" min={0} value={form.age_min} onChange={(e) => set('age_min', e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary">{product ? 'Oppdater' : 'Opprett'}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Avbryt</button>
      </div>
    </form>
  );
}
