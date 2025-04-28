
import React from 'react';
import BoxCard from './BoxCard';
import BoxDetails from './BoxDetails';
import { useBoxes } from '@/hooks/useBoxes';
import BoxThemeSelector from './BoxThemeSelector';

const BoxesSection = () => {
  const {
    boxes,
    selectedTheme,
    handleThemeChange,
    handleBoxClick,
    handleCloseDetails,
    getSelectedBoxDetails,
    getBoxTitle,
    handleBoxChange
  } = useBoxes();

  return (
    <section id="boxes" className="py-16">
      <div className="container-section">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Découvrez nos box</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choisissez la formule qui correspond le mieux à vos besoins. Toutes nos box sont composées de produits frais et locaux, sélectionnés avec soin.
          </p>
          
          <div className="flex justify-center mb-8">
            <BoxThemeSelector selectedTheme={selectedTheme} onThemeChange={handleThemeChange} />
          </div>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
          {boxes.map(box => (
            <BoxCard 
              key={box.id} 
              title={getBoxTitle(box)} 
              price={box.price} 
              description={box.themes[selectedTheme].description || box.description} 
              image={box.themes[selectedTheme].image || box.image} 
              items={box.themes[selectedTheme].products?.length || box.items} 
              size={box.size} 
              onClick={() => handleBoxClick(box.id)} 
            />
          ))}
        </div>
      </div>

      {getSelectedBoxDetails() && (
        <BoxDetails 
          title={getSelectedBoxDetails()!.title} 
          price={getSelectedBoxDetails()!.price} 
          description={getSelectedBoxDetails()!.description} 
          image={getSelectedBoxDetails()!.image} 
          products={getSelectedBoxDetails()!.products} 
          onClose={handleCloseDetails} 
          boxSize={getSelectedBoxDetails()!.size}
          boxId={getSelectedBoxDetails()!.id}
          onBoxChange={handleBoxChange}
        />
      )}
    </section>
  );
};

export default BoxesSection;
