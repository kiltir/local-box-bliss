import React from 'react';
const FeaturesSection = () => {
  return <section id="concept" className="bg-soft-beige/30 my-0 py-0 scroll-mt-[88px] md:scroll-mt-[80px]">
      <div className="container-section my-0 py-[30px]">
        <div className="text-center mb-12 fade-in">
          <h2 id="features-title" className="text-3xl font-bold mb-4 py-[15px]">Comment ça marche ?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto py-0 my-0">Choisissez, commandez, recevez.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 fade-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Choisissez votre box</h3>
            <p className="text-gray-600">Sélectionnez la thématique de box et le type de commande selon vos goûts et vos envies.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Nous préparons votre commande</h3>
            <p className="text-gray-600">Toutes nos box sont élaborées et préparées avec soin pour vous offrir la meilleure expérience possible.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Recevez vos produits</h3>
            <p className="text-gray-600">Récupérez votre box à l'aéroport de Roland Garros avant/après votre vol ou directement en Métropole.</p>
          </div>
        </div>
        
        <div className="mt-20 bg-white rounded-xl p-8 shadow-lg max-w-3xl mx-auto fade-in">
          <h3 className="text-2xl font-bold mb-4 text-center">Pourquoi choisir nos box ?</h3>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-leaf-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-900">Produits 100% locaux</strong> - Toutes nos box sont le résultat du savoir-faire de nos partenaires locaux engagés et passionnés.</span>
            </li>
            
            <li className="flex items-start">
              <svg className="h-6 w-6 text-leaf-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-900">Soutien aux professionnels</strong> - Nous rémunérons justement nos producteurs partenaires.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-leaf-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-900">Nos valeurs</strong> - Nous partageons des valeurs humaines et culturelles propres à notre ancrage historique.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>;
};
export default FeaturesSection;