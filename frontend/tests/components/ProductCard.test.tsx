import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../../src/components/products/ProductCard';
import type { Product } from '@workshop/shared';

const mockProduct: Product = {
  id: 1,
  name: 'Drageborgen',
  description: 'En episk drage og borg',
  price: 1299,
  category: 'Fabeldyr og drager',
  image_url: null,
  stock: 10,
  piece_count: 847,
  age_min: 9,
  created_at: '2024-01-01T00:00:00.000Z',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('Drageborgen')).toBeInTheDocument();
  });

  it('renders price as "X NOK"', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('1299 NOK')).toBeInTheDocument();
  });

  it('has "Legg i handlekurv" button', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(
      screen.getByTestId('add-to-cart-button'),
    ).toHaveTextContent('Legg i handlekurv');
  });

  it('calls onAddToCart with the product when button is clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByTestId('add-to-cart-button'));
    expect(onAddToCart).toHaveBeenCalledOnce();
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('renders piece_count when present', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('847 brikker')).toBeInTheDocument();
  });

  it('does not render piece_count when absent', () => {
    const noCount = { ...mockProduct, piece_count: null };
    render(<ProductCard product={noCount} onAddToCart={vi.fn()} />);
    expect(screen.queryByText(/brikker/)).not.toBeInTheDocument();
  });
});
