
import React from 'react';
import BoxCard from './BoxCard';
import SubscriptionCard from './SubscriptionCard';
import BoxDetails from './BoxDetails';
import { useBoxes } from '@/hooks/useBoxes';
import { usePurchaseType } from '@/hooks/usePurchaseType';
import { useBoxesReviews } from '@/hooks/useBoxesReviews';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import BoxThemeSelector from './BoxThemeSelector';
import PurchaseTypeSelector from './PurchaseTypeSelector';
import { BoxTheme } from '@/types/box';
import decouverteBg from '@/assets/backgrounds/decouverte-bg.jpg';
import bourbonBg from '@/assets/backgrounds/bourbon-bg.jpg';
import racineBg from '@/assets/backgrounds/racine-bg.jpg';
import saisonBg from '@/assets/backgrounds/saison-bg.jpg';

const BoxesSection = () => {
  const {
    boxes,
    selectedTheme,
    selectedBox,
    handleThemeChange,
    handleBoxClick,
    handleCloseDetails,
    handleBoxChange
  } = useBoxes();

  const { purchaseType, handlePurchaseTypeChange } = usePurchaseType();
  const { getBoxStats } = useBoxesReviews();
  const { subscriptions } = useSubscriptions();

  // Filtrer les boxes selon le thème sélectionné
  const filteredBoxes = boxes.filter(box => box.theme === selectedTheme);
  const filteredSubscriptions = subscriptions.filter(sub => sub.theme === selectedTheme);

  // Map des fonds d'écran par thème
  const themeBackgrounds: Record<BoxTheme, string> = {
    'Découverte': decouverteBg,
    'Bourbon': bourbonBg,
    'Racine': racineBg,
    'Saison': saisonBg
  };

  return (
    <section id="boxes" className="py-[15px] scroll-mt-[88px] md:scroll-mt-[80px] relative overflow-hidden">
      {/* Fond dynamique avec transition */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ 
          backgroundImage: `url(${themeBackgrounds[selectedTheme]})`,
        }}
      />
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="container-section py-[15px] relative z-10">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Découvrez nos box</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choisissez parmi nos 4 thématiques pensées et confectionnées avec soin pour une meilleure expérience.
          </p>
          
          <div className="flex justify-center mb-8">
            <BoxThemeSelector selectedTheme={selectedTheme} onThemeChange={handleThemeChange} />
          </div>

          {/* Sélecteur de type d'achat */}
          <PurchaseTypeSelector selectedType={purchaseType} onTypeChange={handlePurchaseTypeChange} />
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 fade-in max-w-md mx-auto">
          {purchaseType === 'one-time' 
            ? filteredBoxes.map(box => {
                const boxStats = getBoxStats(box.id);
                return (
                  <BoxCard 
                    key={box.id} 
                    title={box.baseTitle} 
                    price={box.price} 
                    description={box.description} 
                    image={box.image} 
                    items={box.items} 
                    theme={box.theme}
                    rating={boxStats.averageRating}
                    reviewCount={boxStats.totalReviews}
                    onClick={() => handleBoxClick(box.id)}
                    purchaseType={purchaseType}
                  />
                );
              })
            : filteredSubscriptions.map(subscription => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onClick={() => handleBoxClick(subscription.id)}
                />
              ))
          }
        </div>
      </div>

      {selectedBox !== null && (
        <BoxDetails 
          onClose={handleCloseDetails} 
          boxId={selectedBox} 
          onBoxChange={handleBoxChange} 
        />
      )}
    </section>
  );
};

export default BoxesSection;
