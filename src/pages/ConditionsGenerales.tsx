
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ConditionsGenerales = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#FEF7CD]/50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Conditions générales de vente</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 1 - Objet</h2>
                <p className="text-gray-700 leading-relaxed">
                  Les présentes conditions générales de vente régissent les relations contractuelles entre KiltirBox 
                  et ses clients dans le cadre de la vente de box de produits locaux réunionnais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 2 - Commandes</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les commandes peuvent être passées sur notre site internet. Toute commande implique l'acceptation 
                  pleine et entière des présentes conditions générales de vente.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox se réserve le droit d'annuler toute commande en cas d'indisponibilité des produits 
                  ou de problème concernant le règlement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 3 - Prix</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les prix sont exprimés en euros toutes taxes comprises. KiltirBox se réserve le droit de modifier 
                  ses prix à tout moment, étant entendu que le prix figurant au catalogue le jour de la commande sera 
                  le seul applicable à l'acheteur.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Les frais de livraison sont à la charge du client et sont précisés avant la validation de la commande.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 4 - Livraison</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les livraisons sont effectuées à l'adresse indiquée par l'acheteur lors de sa commande. 
                  Les délais de livraison sont donnés à titre indicatif.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Pour les retraits à l'aéroport, les modalités spécifiques seront communiquées par email 
                  après confirmation de la commande.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 5 - Garanties</h2>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox s'engage à livrer des produits conformes à la commande et en parfait état. 
                  En cas de défaut ou de non-conformité, le client dispose d'un délai de 48h après réception 
                  pour signaler tout problème.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 6 - Droit de rétractation</h2>
                <p className="text-gray-700 leading-relaxed">
                  Conformément à la législation en vigueur, et compte tenu de la nature périssable des produits, 
                  le droit de rétractation ne peut s'appliquer aux commandes de produits alimentaires frais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 7 - Données personnelles</h2>
                <p className="text-gray-700 leading-relaxed">
                  Les données personnelles collectées sont utilisées uniquement dans le cadre du traitement 
                  des commandes et ne sont en aucun cas transmises à des tiers. Conformément à la loi Informatique 
                  et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Article 8 - Litiges</h2>
                <p className="text-gray-700 leading-relaxed">
                  En cas de litige, nous privilégions la recherche d'une solution amiable. À défaut, 
                  les tribunaux français seront seuls compétents.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConditionsGenerales;
