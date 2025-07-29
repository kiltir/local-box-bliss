import React from 'react';
const ProducerSection = () => {
  const producers = [{
    name: "Ferme des Trois Chênes",
    specialty: "Légumes bio",
    image: "https://source.unsplash.com/1472396961693-142e6e269027",
    description: "Marie cultive des légumes bio depuis plus de 15 ans sur ses terres familiales."
  }, {
    name: "Fromagerie du Vallon",
    specialty: "Fromages artisanaux",
    image: "https://source.unsplash.com/1582562124811-c09040d0a901",
    description: "Pierre élabore des fromages traditionnels avec le lait de ses chèvres élevées en plein air."
  }, {
    name: "Les Vergers d'Émilie",
    specialty: "Fruits de saison",
    image: "https://source.unsplash.com/1465146344425-f00d5f5c8f07",
    description: "Émilie cultive des fruits de saison en privilégiant les variétés anciennes et goûteuses."
  }];
  return <section id="producers" className="bg-gradient-to-b from-white to-soft-beige/20 py-[15px]">
      <div className="container-section py-[15px]">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rencontrez les artisans et agriculteurs passionnés qui travaillent chaque jour pour vous offrir le meilleur de leur production.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
          {producers.map((producer, index) => <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-48">
                <img src={producer.image} alt={producer.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-leaf-green/10 text-leaf-green rounded-full text-sm font-medium mb-3">
                  {producer.specialty}
                </div>
                <h3 className="text-xl font-bold mb-2">{producer.name}</h3>
                <p className="text-gray-600">{producer.description}</p>
              </div>
            </div>)}
        </div>
        
        <div className="mt-16 text-center">
          <button className="text-leaf-green font-medium hover:underline inline-flex items-center">
            Découvrir tous nos producteurs
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>;
};
export default ProducerSection;