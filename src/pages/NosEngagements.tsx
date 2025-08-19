
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NosEngagements = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Nos engagements</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                KiltirBox s'engage à maintenir ce site web à jour en temps et en heure. Si toutefois vous rencontriez un problème ou des données obsolètes, nous vous serions reconnaissants de nous le faire savoir. Veuillez indiquer où sur le site web vous lisez les informations incorrectes. Nous examinerons cela dès que possible. Veuillez envoyer votre réponse par e-mail à: <a href="mailto:contact@kiltirbox.com" className="text-leaf-green hover:underline">contact@kiltirbox.com</a>.
              </p>

              <p>
                Nous ne sommes pas responsables des pertes résultant d'inexactitudes ou de lacunes, ni des pertes résultant de problèmes causés par ou inhérents à la diffusion d'informations par Internet, tels que des perturbations ou des interruptions. Lors de l'utilisation de formulaires Web, nous nous efforçons de limiter le nombre de champs obligatoires au minimum. Pour toute perte subie à la suite de l'utilisation de données, de conseils ou d'idées fournis par ou au nom de KiltirBox via ce site web, KiltirBox n'assume aucune responsabilité.
              </p>

              <p>
                Les réponses et les demandes de renseignements personnelles soumises par e-mail ou à l'aide d'un formulaire web seront traitées de la même manière que les lettres. Cela signifie que vous pouvez attendre une réponse de notre part dans un délai d'un mois au plus tard. En cas de demandes complexes, nous vous informerons dans un délai d'un mois si nous avons besoin d'un délai maximum de 3 mois.
              </p>

              <p>
                Toutes les données personnelles que vous nous fournissez dans le cadre de votre réponse ou de votre demande d'informations ne seront utilisées que conformément à notre déclaration de confidentialité.
              </p>

              <p>
                KiltirBox doit faire tous les efforts possibles pour protéger ses systèmes contre toute forme d'utilisation illicite. KiltirBox doit mettre en œuvre les mesures techniques et organisationnelles appropriées à cette fin, en tenant compte, entre autres, de l'état de l'art. Toutefois, il ne saurait être tenu pour responsable de quelque préjudice que ce soit, direct et/ou indirect, subi par un utilisateur du site web, résultant de l'utilisation illégale de ses systèmes par une tierce partie.
              </p>

              <p>
                KiltirBox décline toute responsabilité quant au contenu des sites web auxquels ou à partir desquels un hyperlien ou une autre référence est faite. Les produits ou services offerts par des tierces parties sont soumis aux termes et conditions applicables de ces tierces parties.
              </p>

              <p>
                Nos employés s'efforcent de garantir l'accessibilité de notre site web et de l'améliorer continuellement. Y compris pour les personnes qui utilisent un logiciel spécial en raison d'un handicap.
              </p>

              <p>
                Tous les droits de propriété intellectuelle sur le contenu de ce site web sont détenus par KiltirBox ou par des tierces parties qui ont placé le contenu eux-mêmes ou de KiltirBox qui a obtenu une licence d'utilisation.
              </p>

              <p>
                La copie, la diffusion et toute autre utilisation de ces documents sont interdites sans l'autorisation écrite de KiltirBox, sauf si et dans la mesure où le stipule une réglementation impérative (telle que le droit de citer), sauf indication contraire du contenu.
              </p>

              <p>
                Si vous avez des questions ou des problèmes d'accessibilité au site, n'hésitez pas à nous contacter.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NosEngagements;
