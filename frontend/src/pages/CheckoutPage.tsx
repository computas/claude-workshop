import { Navigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CheckoutForm } from '../components/checkout/CheckoutForm';

export function CheckoutPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  return <CheckoutForm />;
}
