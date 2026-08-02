# Verrouiller le pays de livraison sur Stripe selon le mode choisi

## Objectif
Sur la page de paiement Stripe, le client ne doit plus pouvoir choisir n'importe quel pays : le pays d'adresse de livraison est imposé par le mode de livraison sélectionné sur la page « Finaliser votre commande ».

## Règles
| Mode choisi | Pays autorisé sur Stripe |
|---|---|
| Livraison Métropole (par défaut) | France (FR) |
| Livraison La Réunion | La Réunion (RE) |
| Récupération à l'aéroport (achats uniques uniquement) | La Réunion (RE) |

L'abonnement n'est pas disponible avec la récupération à l'aéroport : ce mode ne concerne donc que les achats uniques, sans mensualités métropole.

Note : dans Stripe, La Réunion est un pays distinct (« Réunion », code RE) ; l'adresse de livraison Réunion ne sera donc plus saisissable en « France » et inversement.

## Détails techniques
Dans `supabase/functions/create-payment/index.ts`, la préférence de livraison est déjà résolue (`travelInfo.delivery_preference` → `reunion_delivery`, `airport_pickup_*`, sinon métropole) pour calculer les frais.

- Ajouter une variable `allowedCountries` calculée dans ce même bloc : `['RE']` pour `reunion_delivery` et pour les modes `airport_pickup_*` (achats uniques, remise sur place à La Réunion), `['FR']` pour la métropole.
- Remplacer la liste figée `['FR','RE','BE','CH','DE','ES','IT','NL','LU']` par cette variable dans les deux appels `shipping_address_collection.allowed_countries` (mode abonnement ~ligne 555 et mode achat unique ~ligne 658).
- Redéployer la fonction edge `create-payment`.

Aucun changement de base de données, aucun impact sur le calcul des frais de port.
