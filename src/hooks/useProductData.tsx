
import { useState, useEffect } from 'react';
import { Product } from '@/types/box';

// Données d'exemple pour l'affichage
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Boîte de chocolats',
    width: 10,
    height: 3,
    depth: 15,
    color: '#8B4513'
  },
  {
    id: 2,
    name: 'Bouteille de vin',
    width: 8,
    height: 30,
    depth: 8,
    color: '#722F37'
  },
  {
    id: 3,
    name: 'Sachet de café',
    width: 10,
    height: 15,
    depth: 5,
    color: '#5D4037'
  },
  {
    id: 4,
    name: 'Pot de confiture',
    width: 7,
    height: 10,
    depth: 7,
    color: '#C41E3A'
  },
  {
    id: 5,
    name: 'Barre de nougat',
    width: 15,
    height: 2,
    depth: 5,
    color: '#F5F5DC'
  },
  {
    id: 6,
    name: 'Boîte de biscuits',
    width: 20,
    height: 5,
    depth: 15,
    color: '#D2B48C'
  }
];

export const useProductData = () => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>(sampleProducts);

  // Ici, vous pourriez charger des produits depuis une API
  useEffect(() => {
    // Simulation d'un chargement asynchrone
    const loadProducts = async () => {
      // Dans un cas réel, on ferait un appel API ici
      // const response = await fetch('/api/products');
      // const data = await response.json();
      // setAvailableProducts(data);
      
      // Pour le moment, on utilise simplement les données d'exemple
      setAvailableProducts(sampleProducts);
    };
    
    loadProducts();
  }, []);
  
  return {
    availableProducts
  };
};
