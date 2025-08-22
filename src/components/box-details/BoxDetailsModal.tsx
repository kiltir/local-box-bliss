import React from 'react';
import { X, Lightbulb } from 'lucide-react';
import { BoxProduct } from '@/types/boxes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoxDetailsContent from './BoxDetailsContent';
import BoxDetailsAdvice from './BoxDetailsAdvice';
interface BoxDetailsModalProps {
  title: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  products: BoxProduct[];
  onClose: () => void;
  boxSize: 'unique';
  boxId: number;
  onBoxChange?: (boxId: number) => void;
  boxTheme: 'Découverte' | 'Bourbon' | 'Tradition' | 'Saison';
}
const BoxDetailsModal = ({
  title,
  price,
  description,
  image,
  images,
  products,
  onClose,
  boxSize,
  boxId,
  onBoxChange,
  boxTheme
}: BoxDetailsModalProps) => {
  const [activeTab, setActiveTab] = React.useState<"details" | "advice">("details");
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-sm">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <Tabs value={activeTab} onValueChange={val => setActiveTab(val as "details" | "advice")} className="w-full">
            <div className="border-b">
              <div className="px-3 sm:px-6 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3 sm:mb-4 pr-8 sm:pr-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <h2 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h2>
                    <div className="text-xl sm:text-2xl font-bold text-leaf-green mt-1 sm:mt-0">
                      {price.toFixed(2)}€
                    </div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{description}</p>
                <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4">
                  <TabsTrigger value="details" className="text-sm">Détails</TabsTrigger>
                  <TabsTrigger value="advice" className="flex items-center gap-1 sm:gap-2 text-sm">
                    
                    <span className="hidden sm:inline">Conseils</span>
                    <span className="sm:hidden">Conseils</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <BoxDetailsContent isActive={activeTab === "details"} products={products} image={image} images={images} boxTheme={boxTheme} boxId={boxId} onBoxChange={onBoxChange} title={title} />
            
            <BoxDetailsAdvice products={products} boxTheme={boxTheme} />
          </Tabs>
        </div>
      </div>
    </div>;
};
export default BoxDetailsModal;