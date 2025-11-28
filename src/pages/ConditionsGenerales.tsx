import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const ConditionsGenerales = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#FEF7CD]/50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">CONDITIONS GÉNÉRALES DE VENTE</h1>
            <p className="text-center text-gray-600 mb-8">En date du 01/09/2025</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Préambule</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à la vente en ligne des produits ponctuelle ou par abonnement des box contenant des produits alimentaires, boissons alcoolisées ou non et des autres produits en lien avec la culture réunionnaise proposés par l'exploitant sur le site internet.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le site est géré par KiltirBox, situé, 14 rue du domaine Indigo, 97438 SAINTE-MARIE immatriculée sous le numéro 914 484 902 au Greffe du Tribunal de Commerce de SAINT-DENIS.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Avant d'exprimer votre intérêt pour un produit sur le site, vous devez lire les présentes CGV, les accepter et vous engager à les respecter.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Elles sont accessibles sur le site lors de toute finalisation de commande et/ou de toute souscription à un abonnement.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Elles forment un contrat ayant force obligatoire entre vous (ci-après dénommé « l'utilisateur » et désigné par les pronoms « vous », « votre » ou « vos ») et KiltirBox.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes Conditions Générales de Vente établissent les conditions contractuelles applicables à tout achat de produits et/ou toute souscription d'abonnements par un Utilisateur connecté à son Compte Personnel, depuis le Site Internet et les Applications.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Tout achat de produits et/ou souscription d'abonnements par un Utilisateur vaut acceptation pleine et entière des CGV en vigueur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Capacité juridique</h2>
                <p className="text-gray-700 leading-relaxed">
                  La vente d'alcool est interdite aux mineurs. Les clients déclarent être majeurs et pleinement capables de contracter un abonnement ou passer une commande d'une ou plusieurs box avec des boissons alcoolisées.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Zone géographique</h2>
                <p className="text-gray-700 leading-relaxed">
                  Les produits et services de KiltirBox sont proposés uniquement à la Réunion et en France métropolitaine.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Accès au service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les services du site sont normalement accessibles aux clients 7 jours sur 7, 24 heures sur 24 toute l'année sauf en cas d'interruption volontaire ou non, notamment pour des besoins de maintenance ou de force majeure.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  La responsabilité de KiltirBox ne peut être engagée en cas de préjudice quel qu'en soit la nature, résultant d'une indisponibilité du site lié au cas précités.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Contenu des box</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox propose une gamme de box alimentaires et culturelles composées de produits réunionnais, tels que des pots de confiture, de miel, de piment, des sachets de tisane, de gâteaux, de friandises, du chocolat, des bouteilles de sirop, de bière, de boissons alcoolisées ou non-alcoolisées et autres articles annexes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Vous trouverez dans chaque box un livret d'informations sur les produits et sur le territoire.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Condition d'abonnement</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  L'abonnement KiltirBox consiste en l'expédition chaque mois calendaire d'une « box » comprenant notamment des produits alimentaires et boissons de la Réunion en lien avec la culture réunionnaise.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La souscription à l'abonnement mensuel proposé par l'entreprise KiltirBox s'effectue par le biais du Site.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En souscrivant à l'une des formules d'abonnement, le Client reconnaît avoir pris connaissance des présentes CGV et les accepter sans réserve.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Afin de permettre le traitement de la demande de souscription à un abonnement, le Client devra remplir un formulaire comprenant des données personnelles. Ces renseignements doivent impérativement être exacts et le Client doit veiller à leur justesse et à leur conformité lors de la souscription.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En cas d'erreur de la part du Client lors de la transmission de ces données, KiltirBox ne pourra voir sa responsabilité engagée.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox propose 2 modalités d'abonnement pour ses 4 box thématiques (Découverte, Bourbon, Tradition et Saison) :
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>un abonnement d'une durée de six mois ;</li>
                  <li>un abonnement d'une durée d'un an.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">Chaque formule d'abonnement peut être offerte à un tiers. Il suffit de renseigner une adresse de livraison (destinataire) différente de l'adresse de facturation (émetteur).</p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le Client accepte d'acheter des produits dont la description précise n'est pas mentionnée sur le Site au moment de la commande.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  En cas de retour, les frais d'expédition du colis sont à la charge du Client.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Commande</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Une confirmation et un numéro de commande sont communiqués au Client par e-mail dès que la commande est enregistrée.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les données enregistrées par KiltirBox constituent la preuve de la nature, du contenu et de la date de la commande. La vente ne sera conclue qu'à compter de la confirmation de la commande.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox se réserve le droit d'annuler toute commande d'un Client avec lequel existerait un litige relatif au paiement d'une commande antérieure qui n'aurait pas été résolu.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Modalités de paiement</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Toutes les commandes sont payables en euros (€) et leurs tarifs sont précisés et exprimés en Toutes Taxes Comprises (TTC)
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le paiement est exigible immédiatement suite à la commande.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le paiement des achats et des abonnements s'effectue en une seule fois au moyen d'une carte de paiement bancaire (Bleue, Visa, Mastercard ou American express).
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le client garantit à KiltirBox qu'il est pleinement autorisé à utiliser la carte de paiement pour le paiement de sa commande et que ces moyens de paiement donnent légalement accès à des fonds suffisant pour couvrir tous les coûts résultants de sa commande sur le site.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En finalisant une commande sur le Site, le Client accepte de recevoir les factures uniquement par e-mail.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les paiements effectués par le Client ne seront considérés comme définitifs qu'après paiement complet et les produits ne pourront être expédiés qu'après encaissement effectif par KiltirBox des sommes dues.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox se réserve le droit de suspendre ou annuler tout achat et/ou toute livraison, quelque soit leur nature et quel que soit leur niveau d'exécution, en cas de non-paiement total ou partiel de toute somme qui serait due par le client ou en cas d'incident de paiement. Le paiement en ligne par carte bancaire est réalisé par notre prestataire de paiement STRIPE et est donc sécurisé.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox se réserve le droit de modifier ses prix à tout moment. Les modifications tarifaires ne seront valables que pour les futures commandes, celles déjà payées n'étant pas affectées par ces modifications.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox ne saurait être tenue responsable en cas d'usage frauduleux des moyens de paiement utilisés.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Livraison</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le service d'envoi de box couvre uniquement la zone géographique déterminée à l'Article « zone géographique ».
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les tarifs de livraison sont inclus dans le prix des box.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En cas de gratuité annoncée d'un ou plusieurs modes de livraison à partir d'un certain montant d'achat, ce montant comprend réductions et promotions comprises et correspond au montant final du panier.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dans le cas d'un achat unique, 2 modes de livraisons sont disponibles :
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>à l'aéroport de Roland Garros à l'arrivée ou au départ de votre vol directement auprès des équipes KiltirBox ;</li>
                  <li>directement à une adresse réunionnaise ou métropolitaine comme pour les abonnements.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dans le cas des abonnements, les livraisons sont effectuées par Colissimo La Poste. Par ailleurs, KiltirBox informe ses clients que les délais de livraison ne comprennent ni dimanches, ni les jours fériés. Vous pouvez, à tout moment, consulter l'état de votre commande dans votre espace « Mon Compte ».
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le colis est pris en charge par la Poste et remis à l'adresse de livraison indiqué par le client. Si vous êtes absent lors de la livraison et si les dimensions de votre colis le permettent, le facteur laissera votre colis dans votre boîte aux lettres. Dans le cas contraire, vous trouverez un avis de passage vous invitant à retirer votre colis dans votre bureau de Poste dans les 15 jours ouvrés suivant la réception du récépissé.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les premières box de chaque abonnement sont expédiées sous dix jours ouvrés. À compter du deuxième mois d'abonnement, toutes les box sont expédiées entre le 5 et le 10 du mois.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les délais moyens de livraison changent selon le prestataire.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Chaque livraison est réputée effectuée dès la mise à disposition du colis auprès du Client, matérialisée par le système de contrôle utilisé par la Poste ou le transporteur.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En cas de non-réception du colis par le Client, le Colis sera renvoyé à l'entreprise KiltirBox. Les frais de gestion et de réexpédition éventuelle seraient à la charge du Client. Le client se doit d'avoir communiqué l'adresse exacte et les renseignements complémentaires nécessaires.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En cas de changement d'adresse ou de Point Relais en cours d'abonnement, le Client doit le notifier à l'entreprise KiltirBox au plus tard le premier jour du mois concerné en envoyant un e-mail à contact@kiltirbox.com
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En cours d'abonnement, il est impossible de modifier le mode de livraison.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox se réserve le droit de transmettre à Mondial Relay et à La Poste les données personnelles fournies par le Client sur le site de KiltirBox lors de son inscription ou de sa commande. Mondial Relay et La Poste sont susceptibles d'utiliser ces coordonnées pour contacter le Client afin de faciliter la réception du colis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Remboursement</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En cas de retard, le Client doit contacter le service Clients contact@kiltirbox.com qui lui communiquera le numéro de suivi pour enquête auprès de la Poste ou du transporteur.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox n'est pas responsable des colis perdus.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le Client doit vérifier les expéditions à l'arrivée, voire refuser le colis, si celui-ci semble avoir été ouvert ou s'il porte des traces manifestes de détérioration. En cas d'anomalies, Il doit en aviser le service Clients dans les trois (3) jours ouvrés suivant la livraison des produits en joignant à sa demande les photographies faisant état des dégradations. Passé ce délai, aucune réclamation ne sera prise en compte.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Si la demande est justifiée, le Client pourra obtenir un remplacement des produits non-conformes par les mêmes produits si le stock le permet ou par d'autres produits équivalents.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Le Client reconnaît la validité et la force probante des échanges et enregistrements électroniques conservés par KiltirBox et admet que ces éléments reçoivent la même force probante qu'un écrit signé de manière manuscrite en vertu des articles 1174, 1176 et 1366 du code civil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Abonnement à la Newsletter</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En acceptant les présentes CGV lors de la souscription d'une des formules d'abonnement ou d'une commande sur le Site, le Client autorise KiltirBox à lui envoyer des e-mails à l'adresse qu'il aura renseignée lors de son abonnement ou de sa commande.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Le désabonnement à la newsletter est possible à tout moment via l'espace « mon compte » ou en suivant le lien de désinscription à la fin de chaque e-mail.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Publicité</h2>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox peut en toute liberté insérer de la publicité sur son site internet et dispose d'une liberté totale de choix quant à la disposition de ces publicités, des annonceurs ainsi que de la visualisation de ces publicités.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Données personnelles</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox œuvre à protéger les informations personnelles de ses clients. Néanmoins, le Client a également un rôle à jouer dans la protection de ses données à caractère personnel. Il doit maintenir la sécurité de ses transactions en ligne en ne communiquant à personne son identifiant (adresse de messagerie électronique du Client) et/ou son mot de passe et en changeant régulièrement son mot de passe.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  À ce titre, KiltirBox ne peut pas être responsable de la divulgation des informations concernant le Client à tout individu ayant utilisé son identifiant (adresse de messagerie électronique du Client) et/ou son mot de passe.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox ne pourra donc en aucun cas être tenu pour responsable de l'utilisation frauduleuse de ces informations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Responsabilités</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation des produits vendus.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox ne peut garantir les résultats spécifiques de l'utilisation des produits, car leur qualité, leur goût peuvent varier d'une personne à l'autre en fonction de divers facteurs individuels.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  KiltirBox fournit des informations sur les produits à titre informatif mais le client est responsable de l'utilisation appropriée et à la consultation d'un professionnel de la santé si nécessaire.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Droit de rétractation</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le client dispose d'un délai de 14 jours à compter de la réception des produits pour exercer son droit de rétractation. Pour exercer ce droit le client doit notifier cette décision de rétractation à KiltirBox par tout moyen écrit, y compris par courrier électronique ou courrier postal, en précisant clairement sa volonté de se rétracter.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les produits retournés doivent être en parfait état et dans leur emballage d'origine, non utilisés et complets.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le client est responsable des frais de retour des produits.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  En cas d'exercice du droit de rétractation conforme aux présentes CGV, KiltirBox s'engage à rembourser le client dans un délai de 14 jours à compter de la réception des produits retournés.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Garantie</h2>
                <p className="text-gray-700 leading-relaxed">
                  Les produits vendus sont couverts par la garantie légale de conformité et la garantie contre les vices cachés conformément à la législation en vigueur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Litiges</h2>
                <p className="text-gray-700 leading-relaxed">
                  Toute Commande est soumise à la loi française. En cas de litige, seuls les tribunaux français du ressort de son siège social seront compétents.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Modification des données personnelles</h2>
                <p className="text-gray-700 leading-relaxed">
                  Conformément à la loi française Informatique et libertés n°78-17 du 6 janvier 1978, le Client dispose d'un droit d'accès et de rectification aux données le concernant qu'il peut exercer en envoyant un courrier ou un mail au service Clients.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Modification des CGV</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes CGV sont applicables à partir du 1 septembre 2025.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox se réserve la possibilité, à tout moment, de modifier en tout ou partie les CGV.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Les utilisateurs sont invités à consulter régulièrement les CGV afin de prendre connaissance des changements apportés.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Dispositions diverses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tout traitement de données personnelles dans le cadre des présentes est soumis aux dispositions de notre politique de confidentialité, qui fait partie intégrante des présentes CGV.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Si une partie des CGV devait s'avérer illégale, invalide ou inapplicable, pour quelque raison que ce soit, les dispositions en question seraient réputées non écrites, sans remettre en cause la validité des autres dispositions qui continueront de s'appliquer entre les utilisateurs et KiltirBox, sauf s'il s'agissait d'une clause impulsive et déterminante.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Toute réclamation doit être adressée au Service Client de KiltirBox.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Les CGV sont soumises au droit français.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-leaf-green mb-4">Désactivation du compte client</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KiltirBox se réserve le droit de suspendre l'accès aux services proposés sur le Site, de résilier un abonnement, de désactiver un compte client ou de refuser de contracter avec un Client pour les motifs suivants, sans que des dommages et intérêts puissent être réclamés :
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>non-respect des obligations découlant des présentes CGV ;</li>
                  <li>Communication d'informations erronées lors de la commande ou de la création d'un compte client ;</li>
                  <li>actes susceptibles de nuire aux intérêts de l'entreprise.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default ConditionsGenerales;