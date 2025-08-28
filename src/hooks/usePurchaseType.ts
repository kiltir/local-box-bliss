
import { useState } from 'react';

type PurchaseType = 'one-time' | 'subscription';

export const usePurchaseType = () => {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('one-time');

  const handlePurchaseTypeChange = (type: PurchaseType) => {
    setPurchaseType(type);
  };

  return {
    purchaseType,
    handlePurchaseTypeChange,
  };
};
