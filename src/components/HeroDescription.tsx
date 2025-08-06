import React from 'react';
import { Button } from "@/components/ui/button";
const HeroDescription = () => {
  return <section className="bg-white my-0 py-0">
      <div className="container-section py-[30px]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Un concept péi</h2>
          
          <p className="text-xl text-gray-600 mb-8">Découvrez nos box de produits typiques issus du savoir-faire local, disponibles avant/après votre voyage à la Réunion ou livrées directement en Métropole.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button className="bg-leaf-green hover:bg-dark-green text-white px-8 py-6 text-lg">
              Découvrir nos box
            </Button>
            <Button variant="outline" className="border-leaf-green text-leaf-green hover:bg-leaf-green/10 px-8 py-6 text-lg">
              Comment ça marche
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-transparent">
            <div className="p-6 shadow-md rounded-lg bg-amber-100">
              <div className="text-leaf-green text-2xl font-bold mb-2">100%</div>
              <h3 className="text-lg font-medium mb-2">Produits locaux</h3>
              <p className="text-gray-600">Tous nos produits viennent de producteurs/artisans locaux engagés et passionnés.</p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-amber-100">
              <div className="text-leaf-green text-2xl font-bold mb-2">Choix</div>
              <h3 className="text-lg font-medium mb-2">Thématique</h3>
              <p className="text-gray-600">Nos box sont élaborées selon des thématiques vous garantissant originalité et qualité.</p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-amber-100">
              <div className="text-leaf-green text-2xl font-bold mb-2">Livraison</div>
              <h3 className="text-lg font-medium mb-2">Sur-mesure</h3>
              <p className="text-gray-600">Recevez votre box à l'aéroport ou directement en Métropole.</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroDescription;