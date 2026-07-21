
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PurchaseType = 'one-time' | 'subscription';

interface PurchaseTypeSelectorProps {
  selectedType: PurchaseType;
  onTypeChange: (type: PurchaseType) => void;
  subscriptionDisabled?: boolean;
}

const PurchaseTypeSelector: React.FC<PurchaseTypeSelectorProps> = ({ selectedType, onTypeChange, subscriptionDisabled = false }) => {
  const subTrigger = (
    <TabsTrigger
      value="subscription"
      disabled={subscriptionDisabled}
      className={`flex items-center justify-center gap-2 h-12 font-semibold text-sm transition-all duration-300 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-accent/50 ${subscriptionDisabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}
    >
      <RotateCcw className="h-4 w-4" />
      <span>Abonnement</span>
    </TabsTrigger>
  );

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
          {subscriptionDisabled ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="contents">{subTrigger}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Indisponible avec une récupération à l'aéroport — choisissez une adresse de livraison pour souscrire un abonnement.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            subTrigger
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PurchaseTypeSelector;
