import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/src/hooks/useCart';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { toast } from 'sonner';

export default function CheckoutPage({ setPage }: { setPage: (p: string) => void }) {
  const { t } = useTranslation();
  const { cart, total, clearCart } = useCart();
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '' });
  const [invoicing, setInvoicing] = useState({ name: '', address: '', city: '', zip: '' });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleCheckout = async () => {
    const orderData = {
      items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
      shipping_address: shipping,
      invoicing_address: sameAsShipping ? shipping : invoicing,
      total_price: total
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      toast.success(t('checkout.success'));
      clearCart();
      setPage('home');
    } else {
      const data = await res.json();
      toast.error(data.error || 'Failed to place order');
    }
  };

  if (cart.length === 0) return <div className="text-center p-20">{t('cart.empty')}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>{t('checkout.shipping')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder={t('checkout.name')} value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} />
            <Input placeholder={t('checkout.address')} value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
            <div className="flex gap-2">
              <Input placeholder={t('checkout.city')} value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
              <Input placeholder={t('checkout.zip')} value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('checkout.invoicing')}</CardTitle>
              <label className="text-xs flex items-center gap-1">
                <input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)} />
                Same as shipping
              </label>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!sameAsShipping && (
              <>
                <Input placeholder={t('checkout.name')} value={invoicing.name} onChange={e => setInvoicing({...invoicing, name: e.target.value})} />
                <Input placeholder={t('checkout.address')} value={invoicing.address} onChange={e => setInvoicing({...invoicing, address: e.target.value})} />
                <div className="flex gap-2">
                  <Input placeholder={t('checkout.city')} value={invoicing.city} onChange={e => setInvoicing({...invoicing, city: e.target.value})} />
                  <Input placeholder={t('checkout.zip')} value={invoicing.zip} onChange={e => setInvoicing({...invoicing, zip: e.target.value})} />
                </div>
              </>
            )}
            {sameAsShipping && <p className="text-sm text-gray-500 italic">Using shipping address for invoicing.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <p className="text-lg text-gray-600">{t('cart.total')}</p>
          <p className="text-3xl font-bold text-primary">{total} NOK</p>
        </div>
        <Button size="lg" className="px-12" onClick={handleCheckout}>
          {t('checkout.pay')}
        </Button>
      </div>
    </div>
  );
}
