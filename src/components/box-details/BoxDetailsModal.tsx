
import React from 'react';
import { X, Box } from 'lucide-react';
import { BoxProduct } from '@/types/boxes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoxDetailsContent from './BoxDetailsContent';
import BoxDetails3DView from './BoxDetails3DView';

interface BoxDetailsModalProps {
  title: string;
  price: number;
  description: string;
  image: string;
  products: BoxProduct[];
  onClose: () => void;
  boxSize: 'unique';
  boxId: number;
  onBoxChange?: (boxId: number) => void;
}

const BoxDetailsModal = ({ 
  title, 
  price, 
  description, 
  image, 
  products, 
  onClose, 
  boxSize, 
  boxId,
  onBoxChange 
}: BoxDetailsModalProps) => {
  const [activeTab, setActiveTab] = React.useState<"details" | "3d">("details");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "details" | "3d")} className="w-full">
            <div className="border-b">
              <div className="px-6 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <div className="text-2xl font-bold text-leaf-green">
                    {price.toFixed(2)}€
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{description}</p>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="3d" className="flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    <span>Visualisation 3D</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <BoxDetailsContent 
              isActive={activeTab === "details"}
              products={products}
              image={image}
              boxTheme={products.length > 0 ? 'Découverte' : 'Découverte'}
              boxId={boxId}
              onBoxChange={onBoxChange}
            />
            
            <BoxDetails3DView 
              isActive={activeTab === "3d"}
              products={products}
              boxTheme={products.length > 0 ? 'Découverte' : 'Découverte'}
              boxId={boxId}
              onBoxChange={onBoxChange}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BoxDetailsModal;
