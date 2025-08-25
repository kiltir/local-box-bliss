
import React from 'react';
import BoxCard from './BoxCard';
import BoxDetails from './BoxDetails';
import { useBoxes } from '@/hooks/useBoxes';
import BoxThemeSelector from './BoxThemeSelector';

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

  // Filtrer les boxes selon le thème sélectionné
  const filteredBoxes = boxes.filter(box => box.theme === selectedTheme);

  return (
    <section id="boxes" className="py-[15px] scroll-mt-[88px] md:scroll-mt-[80px]">
      <div className="container-section py-[15px]">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Découvrez nos box</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choisissez parmi nos 4 thématiques pensées et confectionnées avec soin pour une meilleure expérience.
          </p>
          
          <div className="flex justify-center mb-8">
            <BoxThemeSelector selectedTheme={selectedTheme} onThemeChange={handleThemeChange} />
          </div>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 fade-in max-w-md mx-auto">
          {filteredBoxes.map(box => (
            <BoxCard 
              key={box.id} 
              title={box.baseTitle} 
              price={box.price} 
              description={box.description} 
              image={box.image} 
              items={box.items} 
              theme={box.theme}
              rating={box.rating}
              reviewCount={box.reviewCount}
              onClick={() => handleBoxClick(box.id)} 
            />
          ))}
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
