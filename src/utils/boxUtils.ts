
import { BoxData } from '@/types/boxes';
import { BoxTheme } from '@/types/box';

export const getBoxTitle = (box: BoxData, theme: BoxTheme) => {
  return `${box.baseTitle} ${theme}`;
};

export const getBoxDetails = (box: BoxData | undefined, theme: BoxTheme) => {
  if (!box) return null;
  
  return {
    id: box.id,
    title: `${box.baseTitle} ${theme}`,
    price: box.price,
    description: box.description,
    image: box.image,
    items: box.items,
    size: box.size,
    products: box.products
  };
};
