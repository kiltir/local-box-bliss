# Images des modes de livraison sur Stripe Checkout

## Constat
Les produits de livraison existent uniquement dans le catalogue Stripe **en mode production**, alors que le site tourne actuellement avec la clé Stripe **en mode test** (sessions `cs_test_...`). La fonction ne peut donc trouver aucune image de livraison, quel que soit l'algorithme de correspondance.

## Solution retenue
Ne plus dépendre du catalogue Stripe pour les images de livraison : héberger les visuels côté site et les envoyer directement dans les lignes de livraison de la session Checkout. Cela fonctionne immédiatement en test comme en production.

## Ce qui sera fait
- Publier l'image fournie (camion + carte de France, cercle bleu) comme visuel officiel de « Livraison métropole ».
- Associer cette image à toutes les lignes de livraison métropole de la session Stripe (achat unique, abonnement 1re mensualité et mensualités suivantes).
- Conserver la recherche dans le catalogue Stripe en secours : si un produit illustré correspond au mode de livraison, son image reste prioritaire ; sinon on utilise l'image du site.
- Laisser « Livraison Réunion » et « Récupération à l'aéroport » sans image du site pour l'instant, en attendant leurs visuels.

## Validation
- Redéployer la fonction Edge et créer une session de test pour le mode métropole.
- Vérifier dans les journaux que l'image est bien résolue, puis contrôler l'affichage sur la page Stripe Checkout.

## Portée technique
Ajout de l'image via Lovable Assets et modification de `supabase/functions/create-payment/index.ts` (résolution d'image des lignes de livraison uniquement). Aucun changement de tarif, de calcul de frais, de base de données ou d'interface du site.

## À prévoir
Envoyez les deux visuels manquants (Réunion et aéroport) et je les intégrerai de la même façon.
