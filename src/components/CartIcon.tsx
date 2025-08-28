
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CartIcon = () => {
  const { items, getTotalItems, getTotalPrice, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const getItemDisplayName = (item: any) => {
    if (item.subscriptionType) {
      const subscriptionLabel = item.subscriptionType === '6months' ? '6 mois' : '1 an';
      return `${item.box.baseTitle.replace(/ - Abonnement.*/, '')} - Abonnement ${subscriptionLabel}`;
    }
    return item.box.baseTitle;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-leaf-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {items.length === 0 ? (
          <DropdownMenuItem disabled>
            Votre panier est vide
          </DropdownMenuItem>
        ) : (
          <>
            <div className="p-2">
              <h3 className="font-semibold mb-2">Mon Panier ({totalItems} article{totalItems > 1 ? 's' : ''})</h3>
              {items.map((item, index) => (
                <div key={`${item.box.id}-${item.subscriptionType || 'single'}`} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{getItemDisplayName(item)}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x {item.box.price.toFixed(2)}€
                    </p>
                    {item.subscriptionType && (
                      <p className="text-xs text-amber-600 font-medium">
                        Abonnement {item.subscriptionType === '6months' ? '6 mois' : '1 an'}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.box.id, item.subscriptionType)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="flex justify-between items-center font-semibold mb-2">
                <span>Total:</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-leaf-green hover:bg-dark-green text-white"
                  onClick={handleCheckout}
                >
                  Finaliser la commande
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartIcon;
