
import React from 'react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  weightExceeded: boolean;
  weightLimit: number;
  onClose?: () => void;
  boxData?: {
    id: number;
    baseTitle: string;
    price: number;
    description: string;
    image: string;
    items: number;
    theme: 'Découverte' | 'Bourbon' | 'Racine' | 'Saison';
    rating: number;
    reviewCount?: number;
    size: 'unique';
    weightLimit: number;
    products: any[];
  };
}

const AddToCartButton = ({ weightExceeded, weightLimit, onClose, boxData }: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (weightExceeded) return;
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter au panier');
      // Fermer la modale
      if (onClose) {
        onClose();
      }
      // Naviguer vers la page d'authentification après un court délai
      setTimeout(() => {
        navigate('/auth');
      }, 100);
      return;
    }
    
    if (boxData) {
      addToCart(boxData);
      toast.success(`${boxData.baseTitle} ajouté au panier !`);
    } else {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  return (
    <>
      <Button 
        className={`w-full ${weightExceeded ? 'bg-gray-400 cursor-not-allowed' : 'bg-leaf-green hover:bg-dark-green'} text-white`}
        disabled={weightExceeded || loading}
        onClick={handleAddToCart}
      >
        {loading ? 'Chargement...' : weightExceeded ? 'Poids maximum dépassé' : user ? 'Ajouter au panier' : 'Se connecter pour commander'}
      </Button>
      
      {weightExceeded && (
        <p className="text-sm text-red-600 mt-2">
          Le poids total dépasse la limite de {weightLimit}kg pour cette box.
        </p>
      )}
      
      {!user && !loading && (
        <p className="text-sm text-amber-600 mt-2 text-center">
          Vous devez être connecté pour passer commande
        </p>
      )}
    </>
  );
};

export default AddToCartButton;
