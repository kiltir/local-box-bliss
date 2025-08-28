import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const NotreHistoire = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#FEF7CD]/50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Notre histoire</h1>
              
              <div className="space-y-12">
                <section>
                  <h2 className="text-3xl font-semibold text-leaf-green mb-6">Un partage universel</h2>
                  <div className="text-gray-700 space-y-4 leading-relaxed">
                    <p>Bonjour, je m'appelle Yannick GENCE et je suis le fondateur de KiltirBox.</p>
                    
                    <p>Comme la plupart des réunionnais, pour poursuivre mon parcours professionnel en Métropole, j'ai dû laisser famille, amis et proches. Se fût une expérience aussi enrichissante que déstabilisante, avec des hauts et surtout des bas avec toutes les difficultés que cela représente.</p>
                    
                    <p>Néanmoins, j'ai appris une chose très importante : le voyage est surtout une affaire de partage. Je pensais en apprendre beaucoup des autres mais je n'imaginais pas autant leurs apprendre de moi et de l'île.</p>
                    
                    <p>Quelques années plus tard, à mon retour sur l'île, plongé dans la réalité économique et sociale du territoire, le constat restait amer mais l'envie et la possibilité de changer les choses devenaient réelles.</p>
                    
                    <p>Et c'est pourquoi j'ai crée KiltirBox.</p>
                    
                    <p className="font-semibold text-leaf-green">Partager notre culture, notre richesse et notre savoir-faire, au-delà des frontières, de l'autre côté de la mer.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-semibold text-leaf-green mb-6">Un concept original</h2>
                  <div className="text-gray-700 space-y-4 leading-relaxed">
                    <p>KiltirBox ce sont des box de produits locaux selon des thématiques originales et culturelles à récupérer sur place à l'aéroport ou livré en Métropole.</p>
                    
                    <p className="font-semibold">Plus qu'un colis c'est une vraie expérience que nous vous proposons.</p>
                    
                    <p>Découvrez ou redécouvrez la culture réunionnaise à travers notre sélection de bons produits issus du savoir-faire local de nos partenaires passionnés et engagés.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-semibold text-leaf-green mb-6">3 cultures en 1 box</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-700 text-center">La culture au sens de l'agriculture</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-700 text-center">La culture au sens des savoirs et des connaissances</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-700 text-center">La culture comme culture d'entreprise</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-semibold text-leaf-green mb-6">Mission</h2>
                  <div className="text-gray-700 space-y-4 leading-relaxed">
                    <p>De la prospection à la réalisation, chaque box est élaborée avec soin, cohérence et compassion.</p>
                    
                    <p>Chaque élément, chaque thématique est pensé pour vous offrir une expérience immersive et unique dans l'environnement local.</p>
                    
                    <p>Vous y retrouverez des saveurs, des parfums et des émotions et des histoires faisant partie de notre héritage culturel.</p>
                    
                    <p>Ne perdons pas cette richesse et partageons la ! qu'elle voyage, qu'elle réconforte, qu'elle soigne la solitude et qu'elle apporte la solidarité.</p>
                    
                    <p>Sincèrement, je vous remercie pour votre soutien dans ce projet.</p>
                    
                    <div className="bg-leaf-green/10 p-6 rounded-lg mt-8 text-center">
                      <h3 className="text-2xl font-bold text-leaf-green italic">"Oubli pa nou, oubli pa ou !"</h3>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default NotreHistoire;