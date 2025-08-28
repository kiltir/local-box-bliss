
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, RotateCcw } from "lucide-react";

type PurchaseType = 'one-time' | 'subscription';

interface PurchaseTypeSelectorProps {
  selectedType: PurchaseType;
  onTypeChange: (type: PurchaseType) => void;
}

const PurchaseTypeSelector: React.FC<PurchaseTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Tabs value={selectedType} onValueChange={(value) => onTypeChange(value as PurchaseType)} className="w-full">
        <TabsList className="grid grid-cols-2 w-full h-14 bg-white/80 border border-border shadow-md rounded-xl p-1">
          <TabsTrigger 
            value="one-time" 
            className="flex items-center justify-center gap-2 h-12 font-semibold text-sm transition-all duration-300 rounded-lg data-[state=active]:bg-leaf-green data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-accent/50"
          >
            <Package className="h-4 w-4" />
            <span>Achat unique</span>
          </TabsTrigger>
          <TabsTrigger 
            value="subscription" 
            className="flex items-center justify-center gap-2 h-12 font-semibold text-sm transition-all duration-300 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-accent/50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Abonnement</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PurchaseTypeSelector;
