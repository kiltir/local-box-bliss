import React from 'react';
import { Button } from "@/components/ui/button";
const Hero = () => {
  return <section className="hero-section py-16 md:py-24">
      <div className="container-section py-[30px]">
        <div className="max-w-3xl mx-auto text-center slide-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 mx-[16px]">La Réunion sur place ou à emporter</h1>
          <p className="text-xl text-gray-600 mb-8">Découvrez nos box de produits typiques, de saison et issus de partenaires locaux disponibles avant/après votre voyage ou livrés directement chez vous en Métropole.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-leaf-green hover:bg-dark-green text-white px-8 py-6 text-lg">
              Découvrir nos box
            </Button>
            <Button variant="outline" className="border-leaf-green text-leaf-green hover:bg-leaf-green/10 px-8 py-6 text-lg">
              Comment ça marche
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-leaf-green text-2xl font-bold mb-2">100%</div>
              <h3 className="text-lg font-medium mb-2">Produits locaux</h3>
              <p className="text-gray-600">Tous nos produits viennent de producteurs/artisans locaux engagés et passionnés.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-leaf-green text-2xl font-bold mb-2">Choix</div>
              <h3 className="text-lg font-medium mb-2">Thématique</h3>
              <p className="text-gray-600">Nos box sont élaborées selon des thématiques vous garantissant originalité et qualité.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-leaf-green text-2xl font-bold mb-2">Livraison</div>
              <h3 className="text-lg font-medium mb-2">Sur-mesure</h3>
              <p className="text-gray-600">Recevez votre box à l'aéroport ou directement sur votre lieu de résidence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;