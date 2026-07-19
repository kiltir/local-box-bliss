## Objectif

Quand une **date de récupération à l'aéroport** est sélectionnée dans la 1ʳᵉ section (`delivery_preference = airport_pickup_arrival` ou `airport_pickup_departure`), le tarif aéroport (15€) doit s'appliquer **uniquement à la 1ʳᵉ livraison** de chaque abonnement. Les mois suivants (2 → 6 ou 2 → 12) basculent automatiquement sur le tarif **Métropole**. Les achats uniques présents dans le panier bénéficient aussi du tarif aéroport (une seule livraison, donc identique au comportement actuel).

Cette règle **ne s'applique QUE** si l'option aéroport est choisie. Métropole et Réunion conservent leur logique actuelle (tarif unique appliqué à toutes les livraisons).

## Changements

### 1. `src/pages/Checkout.tsx` — récapitulatif panier

Modifier `calculateTotalShippingCost` pour, lorsque la préférence courante est `airport` :

- Achat unique : `airport × qty` (inchangé)
- Abonnement 6 mois : `airport × qty` (1er mois) + `metropole × 5 × qty`
- Abonnement 12 mois : `airport × qty` (1er mois) + `metropole × 11 × qty`

Ajouter une ligne d'explication sous "Frais de livraison" quand le tarif aéroport est appliqué à un panier contenant au moins un abonnement : *« Tarif aéroport appliqué au 1er mois, tarif Métropole pour les mois suivants. »*

### 2. `supabase/functions/create-payment/index.ts` — checkout Stripe

Actuellement, chaque item d'abonnement génère une ligne de livraison récurrente unique au tarif aéroport. Il faut :

- Récupérer **deux** tarifs depuis `shipping_costs` : `airport` et `metropole`.
- Détecter le mode aéroport via `travelInfo.delivery_preference`.

Si mode **aéroport** :

- **Ligne récurrente de livraison** de chaque abonnement → créée au tarif **Métropole** (au lieu d'aéroport). Label conservé « Livraison — {titre} ».
- **Supplément 1er mois** ajouté via `subscription_data.add_invoice_items` (facturés uniquement sur la 1ʳᵉ facture Stripe) : un item par abonnement, montant = `(airport - metropole)` cents, quantité = `item.quantity`, description = *« Supplément livraison aéroport (1er mois) — {titre} »*.
- **Achats uniques** dans un panier mixte : ligne de livraison au tarif aéroport (inchangé).

Si mode **Métropole ou Réunion** : comportement actuel inchangé.

Mettre à jour `metadata.shipping_cost` (utilisé pour l'affichage dans MesCommandes) pour refléter le montant réellement facturé au 1er paiement :
- Abonnements : `airport × subQty + metropole × (months-1) × subQty` — mais comme `shipping_cost` représente historiquement le montant du 1er paiement, on stocke `airport × subQty + airport × oneTimeQty` (montant payé initialement, hors récurrent futur). À valider selon l'usage aval ; par défaut = somme des livraisons de la 1ʳᵉ facture.

### 3. Aucune migration base de données

Les tarifs `airport` et `metropole` existent déjà dans la table `shipping_costs`. Aucun schéma à modifier.

## Points techniques

- `add_invoice_items` sur `subscription_data` est la mécanique Stripe standard pour surfacturer uniquement la 1ʳᵉ facture d'un abonnement — pas de coupon ni de logique custom nécessaire.
- Le supplément apparaîtra comme ligne distincte sur le checkout Stripe et la 1ʳᵉ facture, ce qui reste lisible pour le client.
- Les commandes existantes ne sont pas rétroactivement modifiées.

## Hors périmètre

- Emails de confirmation : la structure actuelle affichera automatiquement le bon montant payé si `amountPaidNow` est calculé à partir de la session Stripe. À vérifier après implémentation, correction en suivant si besoin.
- Admin `OrdersManagement` : lecture seule, pas de changement requis.
