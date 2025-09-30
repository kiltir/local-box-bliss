
import { createContext, useContext, useState, ReactNode } from 'react';
import { BoxData } from '@/types/boxes';

interface CartItem {
  box: BoxData;
  quantity: number;
  subscriptionType?: '6months' | '1year'; // Nouveau champ pour identifier le type d'abonnement
}

interface CartContextType {
  items: CartItem[];
  addToCart: (box: BoxData, quantity?: number, subscriptionType?: '6months' | '1year') => void;
  removeFromCart: (boxId: number, subscriptionType?: '6months' | '1year') => void;
  updateQuantity: (boxId: number, quantity: number, subscriptionType?: '6months' | '1year') => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (box: BoxData, quantity = 1, subscriptionType?: '6months' | '1year') => {
    setItems(prevItems => {
      // Créer un identifiant unique combinant l'ID de la box et le type d'abonnement
      const existingItem = prevItems.find(item => 
        item.box.id === box.id && item.subscriptionType === subscriptionType
      );
      
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map(item =>
          item.box.id === box.id && item.subscriptionType === subscriptionType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...prevItems, { box, quantity, subscriptionType }];
      }
      
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const removeFromCart = (boxId: number, subscriptionType?: '6months' | '1year') => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => 
        !(item.box.id === boxId && item.subscriptionType === subscriptionType)
      );
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const updateQuantity = (boxId: number, quantity: number, subscriptionType?: '6months' | '1year') => {
    if (quantity <= 0) {
      removeFromCart(boxId, subscriptionType);
      return;
    }
    
    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.box.id === boxId && item.subscriptionType === subscriptionType
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.box.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
