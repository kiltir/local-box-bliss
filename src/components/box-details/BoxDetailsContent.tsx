
import React, { useState, useEffect } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { BoxProduct } from '@/types/boxes';
import { useBoxCalculations } from './useBoxCalculations';
import ProductList from './ProductList';
import AddToCartButton from './AddToCartButton';
import BoxImageCarousel from './BoxImageCarousel';
import { useBoxBanner } from '@/hooks/useBoxBanner';

interface BoxDetailsContentProps {
  isActive: boolean;
  products: BoxProduct[];
  image: string;
  images?: string[];
  boxTheme: 'Découverte' | 'Bourbon' | 'Racine' | 'Saison';
  boxId: number;
  onClose?: () => void;
  onBoxChange?: (boxId: number) => void;
  title: string;
  price: number;
  description: string;
  items: number;
  rating: number;
  reviewCount?: number;
}

const BoxDetailsContent = ({
  isActive,
  products,
  image,
  images,
  boxTheme,
  boxId,
  onBoxChange,
  onClose,
  title,
  price,
  description,
  items,
  rating,
  reviewCount
}: BoxDetailsContentProps) => {
  const [bannerIndex, setBannerIndex] = useState(0);
  
  const {
    selectedProductIds,
    productQuantities,
    handleProductToggle,
    handleQuantityChange,
    totalWeight,
    weightLimit,
    weightExceeded,
    totalVolume,
    volumePercentage
  } = useBoxCalculations(products, boxTheme, boxId, onBoxChange);

  // Map theme to box_id: Découverte=1, Bourbon=2, Racine=3, Saison=4
  const themeToBoxId: Record<string, number> = { 'Découverte': 1, 'Bourbon': 2, 'Racine': 3, 'Saison': 4 };
  const { banner } = useBoxBanner(themeToBoxId[boxTheme]);

  // Messages disponibles pour le défilement
  const bannerMessages = banner ? [banner.message, banner.message_2].filter(Boolean) : [];
  
  // Défilement automatique entre les messages
  useEffect(() => {
    if (bannerMessages.length <= 1) return;
    
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % bannerMessages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [bannerMessages.length]);

  const getBannerGradient = () => {
    switch (boxTheme) {
      case 'Découverte': return 'from-blue-500 to-blue-600';
      case 'Bourbon': return 'from-amber-500 to-amber-600';
      case 'Racine': return 'from-green-600 to-green-700';
      case 'Saison': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Utilise le tableau d'images s'il existe, sinon utilise l'image principale
  const carouselImages = images && images.length > 0 ? images : [image];

  // Créer l'objet boxData pour le panier
  const boxData = {
    id: boxId,
    baseTitle: title,
    price,
    description,
    image,
    items,
    theme: boxTheme,
    rating,
    reviewCount,
    size: 'unique' as const,
    weightLimit,
    products,
  };

  return (
    <TabsContent value="details" className="p-3 sm:p-6 pt-3 sm:pt-4">
      <div className="flex flex-col">
        {/* Bandeau personnalisé avec défilement */}
        {banner && banner.is_active && bannerMessages.length > 0 && (
          <div className={`bg-gradient-to-r ${getBannerGradient()} text-white px-4 py-2 rounded-lg text-center text-sm font-medium mb-4 overflow-hidden`}>
            <div 
              key={bannerIndex}
              className="animate-fade-in"
            >
              {bannerMessages[bannerIndex]}
            </div>
          </div>
        )}
        
        {/* Carrousel d'images de la box - responsive */}
        <div className="mb-4 sm:mb-6">
          <BoxImageCarousel images={carouselImages} title={title} />
        </div>
        
        {/* Informations sur la box */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold mb-3">Contenu de la box</h3>
          
          {/* Informations de poids et volume - stack sur mobile */}
          <div className="space-y-1 mb-3">
            <div className={`text-sm ${weightExceeded ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              <span className="font-medium">Poids:</span> {totalWeight.toFixed(2)} kg / {weightLimit} kg {weightExceeded && '⚠️'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Volume:</span> {totalVolume.toFixed(2)} cm³ ({volumePercentage.toFixed(1)}%)
            </div>
          </div>
          
          <ProductList 
            products={products}
            selectedProductIds={selectedProductIds}
            productQuantities={productQuantities}
            onToggle={handleProductToggle}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </div>
      
      <AddToCartButton 
        weightExceeded={weightExceeded} 
        weightLimit={weightLimit}
        onClose={onClose}
        boxData={boxData}
      />
    </TabsContent>
  );
};

export default BoxDetailsContent;
