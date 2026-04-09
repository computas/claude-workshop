import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/src/hooks/useCart';
import { Button } from '@/src/components/ui/button';
import { ShoppingCart, LayoutDashboard, Home, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

export default function Navbar({ setPage }: { setPage: (p: string) => void }) {
  const { t, i18n } = useTranslation();
  const { cart } = useCart();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div 
            className="text-2xl font-black text-primary cursor-pointer flex items-center gap-2"
            onClick={() => setPage('home')}
          >
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs">LEGO</div>
            BRICKSTORE
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => setPage('home')}>
              <Home className="mr-2 h-4 w-4" /> {t('nav.home')}
            </Button>
            <Button variant="ghost" onClick={() => setPage('admin')}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> {t('nav.admin')}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <Select onValueChange={(v) => i18n.changeLanguage(v)} value={i18n.language}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="no">Norsk</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="relative" onClick={() => setPage('checkout')}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
