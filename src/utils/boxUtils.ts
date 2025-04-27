
import { BoxData } from '@/types/boxes';
import { BoxTheme } from '@/types/box';

export const getBoxTitle = (box: BoxData, theme: BoxTheme) => {
  return `${box.baseTitle} ${theme}`;
};

export const getBoxDetails = (box: BoxData | undefined, theme: BoxTheme) => {
  if (!box) return null;
  
  const themeData = box.themes[theme];
  return {
    id: box.id,
    title: `${box.baseTitle} ${theme}`,
    price: box.price,
    description: themeData.description || box.description,
    image: themeData.image || box.image,
    items: themeData.products?.length || box.items,
    size: box.size,
    products: themeData.products || box.products
  };
};
