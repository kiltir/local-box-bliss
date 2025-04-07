
import React from 'react';
import { Button } from "@/components/ui/button";

interface BoxCardProps {
  title: string;
  price: number;
  description: string;
  image: string;
  items: number;
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
}

const BoxCard = ({ title, price, description, image, items, size, onClick }: BoxCardProps) => {
  const getBadgeColor = () => {
    switch (size) {
      case 'small':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-green-100 text-green-800';
      case 'large':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}>
          {size === 'small' ? 'Petite' : size === 'medium' ? 'Moyenne' : 'Grande'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
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
          <Button className="flex-1 bg-leaf-green hover:bg-dark-green text-white">
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoxCard;
