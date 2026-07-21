
import { useState, useEffect, useCallback } from 'react';

type PurchaseType = 'one-time' | 'subscription';

const checkSubscriptionDisabled = (): boolean => {
  try {
    const raw = localStorage.getItem('travelInfo');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return (
      parsed?.delivery_preference === 'airport_pickup_arrival' ||
      parsed?.delivery_preference === 'airport_pickup_departure'
    );
  } catch {
    return false;
  }
};

export const usePurchaseType = () => {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('one-time');
  const [isSubscriptionDisabled, setIsSubscriptionDisabled] = useState<boolean>(
    () => checkSubscriptionDisabled()
  );

  const refresh = useCallback(() => {
    setIsSubscriptionDisabled(checkSubscriptionDisabled());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('travelInfoChanged', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('travelInfoChanged', refresh);
    };
  }, [refresh]);

  useEffect(() => {
    if (isSubscriptionDisabled && purchaseType === 'subscription') {
      setPurchaseType('one-time');
    }
  }, [isSubscriptionDisabled, purchaseType]);

  const handlePurchaseTypeChange = (type: PurchaseType) => {
    if (type === 'subscription' && isSubscriptionDisabled) return;
    setPurchaseType(type);
  };

  return {
    purchaseType,
    handlePurchaseTypeChange,
    isSubscriptionDisabled,
  };
};
