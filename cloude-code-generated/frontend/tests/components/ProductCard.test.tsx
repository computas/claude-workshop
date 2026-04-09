import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../../src/components/products/ProductCard.js';
import type { Product } from '@workshop/shared';

// Mock the AppContext
const mockAddToCart = vi.fn().mockResolvedValue(undefined);
vi.mock('../../src/context/AppContext.js', () => ({
  useAppContext: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        products_pieces: 'pieces',
        products_age: 'Age',
        products_add_to_cart: 'Add to cart',
        products_out_of_stock: 'Out of stock',
        nok: 'NOK',
      };
      return translations[key] ?? key;
    },
    addToCart: mockAddToCart,
  }),
}));

const mockProduct: Product = {
  id: 1,
  setNumber: '75192',
  name: 'Millennium Falcon',
  nameNo: 'Millennium Falcon',
  theme: 'Star Wars',
  pieces: 7541,
  price: 3000,
  description: 'The most famous ship in the galaxy.',
  descriptionNo: 'Det mest berømte romskipet.',
  imageUrl: 'https://example.com/image.jpg',
  stock: 5,
  ageMin: 16,
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Millennium Falcon')).toBeInTheDocument();
  });

  it('renders product theme', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Star Wars')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/NOK/)).toBeInTheDocument();
  });

  it('renders piece count', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/7541/)).toBeInTheDocument();
    expect(screen.getByText(/pieces/)).toBeInTheDocument();
  });

  it('renders add to cart button when in stock', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('shows out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls addToCart when button is clicked', async () => {
    render(<ProductCard product={mockProduct} />);
    const button = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(button);
    expect(mockAddToCart).toHaveBeenCalledWith(1, 1);
  });

  it('renders product image', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole('img', { name: 'Millennium Falcon' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
});
