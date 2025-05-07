
import { toast } from "@/hooks/use-toast";
import { createElement } from 'react';
import ToastActionButton from '@/components/box-details/ToastActionButton';

export function useToastNotification() {
  const showWeightExceededToast = (
    totalWeight: number,
    currentLimit: number,
    suggestedBoxTitle: string,
    onButtonClick: () => void
  ) => {
    toast({
      title: "Limite de poids dépassée!",
      description: `Le poids total (${totalWeight.toFixed(2)}kg) dépasse la limite de ${currentLimit}kg. Nous vous recommandons la ${suggestedBoxTitle}.`,
      action: createElement(ToastActionButton, { onClick: onButtonClick })
    });
  };

  const showBoxUpdatedToast = (boxTitle: string) => {
    toast({
      title: "Box mise à jour",
      description: `Vous avez changé pour ${boxTitle}.`
    });
  };

  return {
    showWeightExceededToast,
    showBoxUpdatedToast
  };
}
