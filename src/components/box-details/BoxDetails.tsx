
import React from 'react';
import { useBoxes } from '@/hooks/useBoxes';
import BoxDetailsModal from './BoxDetailsModal';

export const BoxDetails = () => {
  const { getSelectedBoxDetails, handleCloseDetails, handleBoxChange } = useBoxes();
  const selectedBox = getSelectedBoxDetails();

  if (!selectedBox) return null;
  
  return (
    <BoxDetailsModal
      title={selectedBox.title}
      price={selectedBox.price}
      description={selectedBox.description}
      image={selectedBox.image}
      products={selectedBox.products}
      onClose={handleCloseDetails}
      boxSize={selectedBox.size}
      boxId={selectedBox.id}
      onBoxChange={handleBoxChange}
    />
  );
};

export default BoxDetails;
