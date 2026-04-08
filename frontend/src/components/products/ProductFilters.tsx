import type { ProductFilters } from '@workshop/shared';
import { PRODUCT_CATEGORIES } from '@workshop/shared';

interface Props {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export function ProductFilters({ filters, onFiltersChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <div className="form-group" style={{ flex: '1 1 200px' }}>
        <label htmlFor="search">Søk</label>
        <input
          id="search"
          className="form-control"
          type="text"
          placeholder="Søk etter produkter..."
          value={filters.search ?? ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
        />
      </div>

      <div className="form-group" style={{ flex: '1 1 200px' }}>
        <label htmlFor="category">Kategori</label>
        <select
          id="category"
          className="form-control"
          value={filters.category ?? ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, category: e.target.value || undefined })
          }
        >
          <option value="">Alle kategorier</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ flex: '0 1 120px' }}>
        <label htmlFor="minPrice">Min pris</label>
        <input
          id="minPrice"
          className="form-control"
          type="number"
          min={0}
          placeholder="0"
          value={filters.minPrice ?? ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              minPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="form-group" style={{ flex: '0 1 120px' }}>
        <label htmlFor="maxPrice">Maks pris</label>
        <input
          id="maxPrice"
          className="form-control"
          type="number"
          min={0}
          placeholder="3000"
          value={filters.maxPrice ?? ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              maxPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
    </div>
  );
}
