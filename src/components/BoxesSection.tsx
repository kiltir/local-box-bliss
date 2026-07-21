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
import { FadeInSection, StaggerContainer, StaggerItem } from '@/components/animations';
import { motion, AnimatePresence } from 'framer-motion';
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

  const { purchaseType, handlePurchaseTypeChange, isSubscriptionDisabled } = usePurchaseType();
  const { getBoxStats } = useBoxesReviews();
  const { subscriptions } = useSubscriptions();

  const filteredBoxes = boxes.filter(box => box.theme === selectedTheme);
  const filteredSubscriptions = subscriptions.filter(sub => sub.theme === selectedTheme);

  const themeBackgrounds: Record<BoxTheme, string> = {
    'Découverte': decouverteBg,
    'Bourbon': bourbonBg,
    'Racine': racineBg,
    'Saison': saisonBg
  };

  return (
    <section id="boxes" className="py-[15px] scroll-mt-[88px] md:scroll-mt-[80px] relative overflow-hidden">
      {/* Fond dynamique avec transition */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        key={selectedTheme}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ 
          backgroundImage: `url(${themeBackgrounds[selectedTheme]})`,
        }}
      />
      
      <div className="container-section py-[15px] relative z-10">
        <FadeInSection className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-50" style={{ fontFamily: "'Chewy', cursive" }}>Découvrez nos box</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-slate-50">
            Choisissez parmi nos 4 thématiques pensées et confectionnées avec soin pour une meilleure expérience.
          </p>
          
          <div className="flex justify-center mb-8">
            <BoxThemeSelector selectedTheme={selectedTheme} onThemeChange={handleThemeChange} />
          </div>

          {/* Sélecteur de type d'achat */}
          <PurchaseTypeSelector selectedType={purchaseType} onTypeChange={handlePurchaseTypeChange} subscriptionDisabled={isSubscriptionDisabled} />
        </FadeInSection>
          
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {purchaseType === 'one-time' 
              ? filteredBoxes.map((box, index) => {
                  const boxStats = getBoxStats(box.id);
                  return (
                    <motion.div
                      key={box.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <BoxCard 
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
                    </motion.div>
                  );
                })
              : filteredSubscriptions.map((subscription, index) => (
                  <motion.div
                    key={subscription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <SubscriptionCard
                      subscription={subscription}
                      onClick={() => handleBoxClick(subscription.id)}
                    />
                  </motion.div>
                ))
            }
          </AnimatePresence>
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
