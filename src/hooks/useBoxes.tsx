import { useState, useMemo } from 'react';
import { boxes as staticBoxes } from '@/data/boxes';
import { useBoxTheme } from './useBoxTheme';
import { useBoxPrices } from './useBoxPrices';
import { useBoxProducts } from './useBoxProducts';
import { BoxData } from '@/types/boxes';

export const useBoxes = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const { selectedTheme, handleThemeChange } = useBoxTheme();
  const { prices, loading: pricesLoading } = useBoxPrices();
  const { getProductsForBox, isLoading: productsLoading } = useBoxProducts();

  // Fusionner les prix dynamiques et produits Supabase avec les données statiques des boxes
  const boxes: BoxData[] = useMemo(() => {
    return staticBoxes.map(box => {
      const priceData = prices.find(p => p.box_id === box.id);
      // Récupérer les produits depuis Supabase, fallback sur statique si vide
      const supabaseProducts = getProductsForBox(box.id, box.theme);
      
      return {
        ...box,
        price: priceData?.unit_price || box.price,
        products: supabaseProducts || box.products, // Priorité Supabase
      };
    });
  }, [prices, getProductsForBox]);

  const handleBoxClick = (id: number) => {
    setSelectedBox(id);
  };

  const handleCloseDetails = () => {
    setSelectedBox(null);
  };

  const handleBoxChange = (boxId: number) => {
    setSelectedBox(boxId);
  };

  const getSelectedBoxDetails = (boxId?: number) => {
    const id = boxId !== undefined ? boxId : selectedBox;
    if (id === null) return null;
    const box = boxes.find(box => box.id === id);
    return box || null;
  };

  return {
    boxes,
    selectedBox,
    selectedTheme,
    handleBoxClick,
    handleCloseDetails,
    handleThemeChange,
    handleBoxChange,
    getSelectedBoxDetails,
    pricesLoading,
  };
};
