
import React from 'react';
import { useBoxes } from '@/hooks/useBoxes';
import BoxDetailsModal from './BoxDetailsModal';

interface BoxDetailsProps {
  onClose: () => void;
  boxId: number;
  onBoxChange?: (boxId: number) => void;
}

export const BoxDetails = ({ onClose, boxId, onBoxChange }: BoxDetailsProps) => {
  const { getSelectedBoxDetails } = useBoxes();
  const selectedBox = getSelectedBoxDetails(boxId);

  if (!selectedBox) return null;
  
  return (
    <BoxDetailsModal
      title={selectedBox.baseTitle}
      price={selectedBox.price}
      description={selectedBox.description}
      image={selectedBox.image}
      products={selectedBox.products}
      onClose={onClose}
      boxSize={selectedBox.size}
      boxId={boxId}
      onBoxChange={onBoxChange}
    />
  );
};

export default BoxDetails;
