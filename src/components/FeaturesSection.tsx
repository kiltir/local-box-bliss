import React from 'react';
const FeaturesSection = () => {
  return <section id="concept" className="py-16 bg-soft-beige/30">
      <div className="container-section">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choisissez, commandez, recevez.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 fade-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Choisissez votre box</h3>
            <p className="text-gray-600">
              Sélectionnez la taille de box qui vous convient : petite, moyenne ou grande selon vos besoins.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Nous préparons votre commande</h3>
            <p className="text-gray-600">
              Nous sélectionnons des produits frais directement chez nos producteurs partenaires.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Recevez vos produits</h3>
            <p className="text-gray-600">
              Nous livrons votre box directement chez vous, à la date de votre choix.
            </p>
          </div>
        </div>
        
        <div className="mt-20 bg-white rounded-xl p-8 shadow-lg max-w-3xl mx-auto fade-in">
          <h3 className="text-2xl font-bold mb-4 text-center">Pourquoi choisir nos box ?</h3>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-leaf-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-900">Produits 100% locaux</strong> - Tous nos produits sont issus d'agriculteurs et artisans situés à moins de 100km.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-leaf-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-900">Fraîcheur garantie</strong> - Nos produits sont récoltés à maturité et livrés dans les 24h.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-leaf-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-900">Soutien aux producteurs</strong> - Nous rémunérons justement nos producteurs partenaires.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-leaf-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-900">Écologique</strong> - Emballages recyclables et circuits courts pour réduire l'impact environnemental.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>;
};
export default FeaturesSection;