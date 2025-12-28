import { useState, useMemo } from 'react';
import { boxes as staticBoxes } from '@/data/boxes';
import { useBoxTheme } from './useBoxTheme';
import { useBoxPrices } from './useBoxPrices';
import { useBoxProducts } from './useBoxProducts';
import { useBoxImages } from './useBoxImages';
import { BoxData } from '@/types/boxes';

export const useBoxes = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const { selectedTheme, handleThemeChange } = useBoxTheme();
  const { prices, loading: pricesLoading } = useBoxPrices();
  const { getProductsForBox, isLoading: productsLoading } = useBoxProducts();
  const { getImagesForBox, isLoading: imagesLoading } = useBoxImages();

  // Fusionner les prix dynamiques, produits et images Supabase avec les données statiques des boxes
  const boxes: BoxData[] = useMemo(() => {
    return staticBoxes.map(box => {
      const priceData = prices.find(p => p.box_id === box.id);
      const supabaseProducts = getProductsForBox(box.id, box.theme);
      const dynamicImages = getImagesForBox(box.id);
      
      return {
        ...box,
        price: priceData?.unit_price || box.price,
        products: supabaseProducts || box.products,
        images: dynamicImages.length > 0 ? dynamicImages : box.images,
      };
    });
  }, [prices, getProductsForBox, getImagesForBox]);

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
