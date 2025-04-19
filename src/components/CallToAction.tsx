
import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-16 bg-leaf-yellow text-white">
      <div className="container-section">
        <div className="max-w-3xl mx-auto text-center fade-in">
          <h2 className="text-3xl font-bold mb-4">Prêt à goûter nos produits locaux ?</h2>
          <p className="text-xl mb-8">
            Commandez dès maintenant votre première box et découvrez la fraîcheur et la qualité des produits de nos producteurs locaux.
          </p>
          <button className="bg-white text-leaf-yellow hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg">
            Commander ma box
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
