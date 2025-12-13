import React from 'react';
const HeroDescription = () => {
  return <section className="bg-white my-0 py-0 relative" style={{
    backgroundImage: 'url(/lovable-uploads/02cf73f6-d1b8-4605-b6a2-2a03a6f42de1.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
    {/* Overlay pour améliorer la lisibilité */}
    <div className="absolute inset-0 bg-white/80 py-0 my-0"></div>
    
    <div className="container-section py-[30px] relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Un concept péi</h2>
        
        <p className="text-xl text-gray-600 mb-16">Découvrez nos box de produits typiques issus du savoir-faire local, disponibles avant/après votre voyage à la Réunion ou livrées directement en Métropole.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-transparent">
          <div className="p-6 shadow-md rounded-lg bg-white">
            <div className="text-leaf-green text-2xl font-bold mb-2">100%</div>
            <h3 className="text-lg font-medium mb-2">Produits locaux</h3>
            <p className="text-gray-600">Tous nos produits viennent de producteurs/artisans locaux engagés et passionnés.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-white">
            <div className="text-leaf-green text-2xl font-bold mb-2">Choix</div>
            <h3 className="text-lg font-medium mb-2">Thématique</h3>
            <p className="text-gray-600">Nos box sont élaborées selon des thématiques vous garantissant originalité et qualité.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-white">
            <div className="text-leaf-green text-2xl font-bold mb-2">Livraison</div>
            <h3 className="text-lg font-medium mb-2">Sur-mesure</h3>
            <p className="text-gray-600">Recevez votre box en Métropole ou récupérez-la directement à l'aéroport de Roland Garros de la Réunion.</p>
          </div>
        </div>
      </div>
    </div>
  </section>;
};
export default HeroDescription;