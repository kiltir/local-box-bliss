# Corriger les images des modes de livraison sur Stripe Checkout

## Constat vérifié
Le dernier test charge bien 103 produits du catalogue Stripe en mode test, mais la fonction ne trouve aucun produit illustré correspondant au libellé « Livraison métropole ». La création de la session réussit, mais la ligne de livraison est donc envoyée à Stripe sans image.

## Correctif
- Renforcer la recherche dans le catalogue Stripe en comparant le libellé de livraison avec le nom, la description et les métadonnées des produits illustrés.
- Ajouter des alias explicites pour les trois modes : métropole/France, Réunion et aéroport/récupération.
- Éviter les associations ambiguës : donner la priorité à une correspondance exacte, puis aux alias propres au mode demandé.
- Charger l’image une seule fois par mode et la réutiliser sur toutes les lignes de livraison de la session.
- Ajouter un journal de diagnostic limité aux noms des produits Stripe illustrés candidats, sans donnée sensible, afin qu’une éventuelle différence de nom soit immédiatement visible.

## Validation
- Tester la fonction Edge et la redéployer.
- Créer une session Stripe de test pour chacun des trois modes de livraison.
- Vérifier dans les journaux que chaque mode résout un produit et une image avant la création de la session Checkout.
- Vérifier que les lignes « Livraison métropole », « Livraison Réunion » et « Récupération à l’aéroport » affichent leur image sur Stripe Checkout.

## Portée technique
Modification limitée à `supabase/functions/create-payment/index.ts`. Aucun changement de prix, de calcul des frais, de base de données ou d’interface du site.
