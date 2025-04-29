
import React from 'react';
import { Button } from "@/components/ui/button";

interface BoxActionsProps {
  weightExceeded: boolean;
  weightLimit: number;
  volumeExceeded?: boolean;
  volumeLimit?: number;
}

const BoxActions: React.FC<BoxActionsProps> = ({ 
  weightExceeded, 
  weightLimit,
  volumeExceeded = false,
  volumeLimit
}) => {
  const isLimitExceeded = weightExceeded || volumeExceeded;
  
  return (
    <>
      <Button 
        className={`w-full ${isLimitExceeded ? 'bg-gray-400 cursor-not-allowed' : 'bg-leaf-green hover:bg-dark-green'} text-white`}
        disabled={isLimitExceeded}
      >
        {isLimitExceeded ? 'Limite dépassée' : 'Ajouter au panier'}
      </Button>
      
      {weightExceeded && (
        <p className="text-sm text-red-600 mt-2">
          Le poids total dépasse la limite de {weightLimit}kg pour cette box.
        </p>
      )}

      {volumeExceeded && volumeLimit && (
        <p className="text-sm text-red-600 mt-2">
          Le volume total dépasse la limite de {volumeLimit}cm³ pour cette box.
        </p>
      )}
    </>
  );
};

export default BoxActions;
