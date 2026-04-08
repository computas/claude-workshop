import type { Product } from '@workshop/shared';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Kategori</th>
            <th>Pris (NOK)</th>
            <th>Brikker</th>
            <th>Lager</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <span className="badge">{product.category}</span>
              </td>
              <td>{product.price}</td>
              <td>{product.piece_count ?? '—'}</td>
              <td>{product.stock}</td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(product)}
                >
                  Rediger
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (window.confirm(`Slett "${product.name}"?`)) {
                      onDelete(product.id);
                    }
                  }}
                >
                  Slett
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
