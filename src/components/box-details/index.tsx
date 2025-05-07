
import React from 'react';
import BoxDetailsModal from './BoxDetailsModal';
import { BoxProduct } from '@/types/boxes';
import { Button } from "@/components/ui/button";
import { Box } from 'lucide-react';

interface BoxDetailsProps {
  title: string;
  price: number;
  description: string;
  image: string;
  products: BoxProduct[];
  onClose: () => void;
  boxSize: 'small' | 'medium' | 'large';
  boxId: number;
  onBoxChange?: (boxId: number) => void;
}

const BoxDetails = (props: BoxDetailsProps) => {
  return <BoxDetailsModal {...props} />;
};

export default BoxDetails;
