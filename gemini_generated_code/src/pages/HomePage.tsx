import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/src/hooks/useCart';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { motion } from 'motion/react';

export default function HomePage() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState({ category: 'all', minPrice: '', maxPrice: '' });

  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.category !== 'all') params.append('category', filter.category);
    if (filter.minPrice) params.append('minPrice', filter.minPrice);
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(setProducts);
  }, [filter]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('products.title')}</h1>
      
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-1 block">{t('products.filter')}</label>
          <Select onValueChange={(v) => setFilter(f => ({ ...f, category: v }))} value={filter.category}>
            <SelectTrigger>
              <SelectValue placeholder={t('products.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('products.all')}</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32">
          <label className="text-sm font-medium mb-1 block">Min {t('products.price')}</label>
          <Input 
            type="number" 
            placeholder="0" 
            value={filter.minPrice} 
            onChange={e => setFilter(f => ({ ...f, minPrice: e.target.value }))} 
          />
        </div>
        <div className="w-32">
          <label className="text-sm font-medium mb-1 block">Max {t('products.price')}</label>
          <Input 
            type="number" 
            placeholder="3000" 
            value={filter.maxPrice} 
            onChange={e => setFilter(f => ({ ...f, maxPrice: e.target.value }))} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-t-lg"
                  referrerPolicy="no-referrer"
                />
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                <p className="text-xl font-bold text-primary">{product.price} NOK</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => addToCart(product)}>
                  {t('products.add_to_cart')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
