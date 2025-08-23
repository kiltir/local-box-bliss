
import React from 'react';
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  weightExceeded: boolean;
  weightLimit: number;
  onClick?: () => void;
}

const AddToCartButton = ({ weightExceeded, weightLimit, onClick }: AddToCartButtonProps) => {
  return (
    <>
      <Button 
        className={`w-full ${weightExceeded ? 'bg-gray-400 cursor-not-allowed' : 'bg-leaf-green hover:bg-dark-green'} text-white`}
        disabled={weightExceeded}
        onClick={onClick}
      >
        {weightExceeded ? 'Poids maximum dépassé' : 'Ajouter au panier'}
      </Button>
      
      {weightExceeded && (
        <p className="text-sm text-red-600 mt-2">
          Le poids total dépasse la limite de {weightLimit}kg pour cette box.
        </p>
      )}
    </>
  );
};

export default AddToCartButton;
