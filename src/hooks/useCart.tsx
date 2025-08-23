
import { createContext, useContext, useState, ReactNode } from 'react';
import { BoxData } from '@/types/boxes';

interface CartItem {
  box: BoxData;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (box: BoxData, quantity?: number) => void;
  removeFromCart: (boxId: number) => void;
  updateQuantity: (boxId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (box: BoxData, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.box.id === box.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.box.id === box.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { box, quantity }];
    });
  };

  const removeFromCart = (boxId: number) => {
    setItems(prevItems => prevItems.filter(item => item.box.id !== boxId));
  };

  const updateQuantity = (boxId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(boxId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.box.id === boxId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
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
