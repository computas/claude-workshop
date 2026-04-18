import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutPage } from '../../src/pages/CheckoutPage.js';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../../src/api/orders.js', () => ({
  createOrder: vi.fn(),
}));

vi.mock('../../src/context/AppContext.js', () => ({
  useAppContext: () => ({
    t: (key: string) => key,
    cart: { items: [], total: 0 },
    sessionId: 'test-session',
    refreshCart: vi.fn(),
  }),
}));

describe('CheckoutPage', () => {
  it('retains focus in address field after typing', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);

    const inputs = screen.getAllByRole('textbox');
    const firstNameInput = inputs[0];

    await user.click(firstNameInput);
    await user.keyboard('A');

    expect(firstNameInput).toHaveFocus();
  });

  it('updates field value as the user types', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);

    const inputs = screen.getAllByRole('textbox');
    const firstNameInput = inputs[0];

    await user.click(firstNameInput);
    await user.type(firstNameInput, 'Jane');

    expect(firstNameInput).toHaveValue('Jane');
  });
});
