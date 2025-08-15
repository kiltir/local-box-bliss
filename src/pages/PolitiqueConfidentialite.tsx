
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#FEF7CD]/50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Politique de confidentialité</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox s'engage à protéger la confidentialité et la sécurité des données personnelles 
                  de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, 
                  utilisons et protégeons vos informations personnelles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">2. Données collectées</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous collectons les types de données suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Informations d'identification (nom, prénom, email, téléphone)</li>
                  <li>Adresse de livraison et de facturation</li>
                  <li>Informations de paiement (traitées de manière sécurisée par nos prestataires)</li>
                  <li>Historique des commandes et préférences</li>
                  <li>Données de navigation sur notre site web</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">3. Utilisation des données</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vos données personnelles sont utilisées pour :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Traiter et livrer vos commandes</li>
                  <li>Vous contacter concernant vos commandes</li>
                  <li>Améliorer nos services et personnaliser votre expérience</li>
                  <li>Vous envoyer des informations marketing (avec votre consentement)</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">4. Partage des données</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous ne vendons, n'échangeons ni ne louons vos données personnelles à des tiers. 
                  Nous pouvons partager vos données uniquement avec :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Nos partenaires de livraison pour assurer la livraison de vos commandes</li>
                  <li>Nos prestataires de paiement pour traiter les transactions</li>
                  <li>Les autorités compétentes si requis par la loi</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">5. Sécurité des données</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous mettons en place des mesures techniques et organisationnelles appropriées 
                  pour protéger vos données personnelles contre tout accès non autorisé, altération, 
                  divulgation ou destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">6. Vos droits</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification en cas d'inexactitude</li>
                  <li>Droit à l'effacement dans certaines conditions</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Pour exercer ces droits, contactez-nous à : contact@kiltirbox.re
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">7. Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                  Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines 
                  fonctionnalités du site pourraient ne pas fonctionner correctement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">8. Conservation des données</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous conservons vos données personnelles uniquement pendant la durée nécessaire 
                  aux finalités pour lesquelles elles ont été collectées, en conformité avec la 
                  législation applicable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">9. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité ou le traitement 
                  de vos données personnelles, vous pouvez nous contacter à : contact@kiltirbox.re
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">10. Modifications</h2>
                <p className="text-gray-700 leading-relaxed">
                  Cette politique de confidentialité peut être mise à jour occasionnellement. 
                  Nous vous informerons de tout changement significatif en publiant la nouvelle 
                  politique sur cette page.
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

export default PolitiqueConfidentialite;
