
import React from 'react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import StarRating from './StarRating';
import { Compass, Wine, BookOpen, Leaf, Package, AlertTriangle } from 'lucide-react';
import { useStock } from '@/hooks/useStock';
import { Badge } from '@/components/ui/badge';

interface BoxCardProps {
  title: string;
  price: number;
  description: string;
  image: string;
  items: number;
  theme: 'Découverte' | 'Bourbon' | 'Racine' | 'Saison';
  rating: number;
  reviewCount?: number;
  onClick: () => void;
  purchaseType?: 'one-time' | 'subscription';
}

const BoxCard = ({ title, price, description, image, items, theme, rating, reviewCount, onClick, purchaseType = 'one-time' }: BoxCardProps) => {
  const { addToCart } = useCart();
  const { isOutOfStockForPurchaseType } = useStock();
  const outOfStock = isOutOfStockForPurchaseType(theme, purchaseType);

  const getBadgeColor = () => {
    switch (theme) {
      case 'Découverte':
        return 'bg-blue-100 text-blue-800';
      case 'Bourbon':
        return 'bg-amber-100 text-amber-800';
      case 'Racine':
        return 'bg-green-100 text-green-800';
      case 'Saison':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'Découverte':
        return Compass;
      case 'Bourbon':
        return Wine;
      case 'Racine':
        return BookOpen;
      case 'Saison':
        return Leaf;
      default:
        return Package;
    }
  };

  const handleAddToCart = () => {
    if (outOfStock) {
      toast.error('Cette box est actuellement en rupture de stock');
      return;
    }
    
    // Créer un objet BoxData simplifié pour le panier
    const boxData = {
      id: Math.random(), // En attendant d'avoir un vrai ID
      baseTitle: title,
      price,
      description,
      image,
      items,
      theme,
      rating,
      reviewCount,
      size: 'unique' as const,
      weightLimit: 5,
      products: [],
    };
    
    addToCart(boxData);
    toast.success(`${title} ajouté au panier !`);
  };

  // Utiliser la nouvelle image téléchargée "KitirBox"
  const boxImage = "/lovable-uploads/c3069f51-0eec-4ebc-b702-b987e85233e0.png";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56 flex items-center justify-center bg-[#f5eada]">
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Badge variant="destructive" className="text-lg gap-2 px-4 py-2">
              <AlertTriangle className="h-5 w-5" />
              Rupture de stock
            </Badge>
          </div>
        )}
        <img 
          src={boxImage} 
          alt={title} 
          className="w-auto h-auto max-h-48 object-contain"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}>
          {theme}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          {React.createElement(getThemeIcon(), { className: "h-5 w-5 text-leaf-green" })}
        </div>
        
        {/* Ajout de la notation */}
        <div className="mb-3">
          <StarRating 
            rating={rating} 
            reviewCount={reviewCount}
            size={18}
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-leaf-green">{price.toFixed(2)}€</span>
          <span className="text-gray-600">{items} produits</span>
        </div>
        
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1 border-leaf-green text-leaf-green hover:bg-leaf-green/10"
            onClick={onClick}
          >
            Détails
          </Button>
          <Button 
            className="flex-1 bg-leaf-green hover:bg-dark-green text-white"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock ? 'Indisponible' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoxCard;
