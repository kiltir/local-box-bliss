## Objectif

Améliorer l'email de confirmation de commande envoyé après paiement (fichier `supabase/functions/handle-stripe-webhook/index.ts`) :

1. Ajouter les **frais de livraison** dans la section « Récapitulatif de commande ».
2. Remplacer le paragraphe d'explication de la section « 1ère mensualité » par une **liste détaillée** (produit, quantité, prix) au même format que le récapitulatif, avec ligne de livraison et total.

## Changements

### 1. Section « Récapitulatif de commande »
Sous le tableau des produits, avant la ligne « Total engagement », ajouter une ligne :
- **Frais de livraison** — montant total des frais sur toute la durée d'engagement (somme de `shippingUnitCost × quantité × mois` pour chaque article, soit `subsShippingEngagement + oneTimeShippingEngagement`, déjà calculé).

Le « Total engagement » reste inchangé (il inclut déjà les frais).

### 2. Section « 1ère mensualité » / « Paiement »
- Supprimer le paragraphe explicatif actuel.
- Afficher un tableau identique à celui du récapitulatif listant, pour chaque article :
  - Titre (avec libellé d'abonnement si applicable)
  - Quantité
  - Prix payé **ce mois-ci** :
    - Abonnement : `monthlyPrice × quantité` (prix mensuel de la 1ère mensualité)
    - Achat unique : `unitPrice × quantité` (payé intégralement)
- Ajouter une ligne **Frais de livraison** = frais réellement facturés aujourd'hui (tarif aéroport pour le 1er mois si applicable, sinon tarif standard).
- Conserver la ligne « Total payé » = `amountPaidNow` (inchangé).

### 3. Données à passer à `sendOrderConfirmationEmail`
La fonction reçoit déjà `items` avec `unitPrice`, `quantity`, `durationMonths`. Pour la 1ère mensualité il faut le **prix mensuel** de chaque abonnement. Deux options :
- Ajouter un champ `monthlyPrice` optionnel dans le type `items` de `sendOrderConfirmationEmail` et le passer depuis chaque appelant (`handleSubscriptionCreated`, `handleOneTimePayment`). Pour les achats uniques, `monthlyPrice = unitPrice`. Pour les abonnements, récupérer le prix mensuel depuis les items du `pending_order` (déjà présent côté panier) ou depuis Stripe.
- Ajouter aussi `firstMonthShippingCost` (montant réel facturé pour la livraison aujourd'hui) au lieu de le recalculer, afin que la somme corresponde exactement à `amountPaidNow`.

## Aspects techniques

- Fichier modifié : `supabase/functions/handle-stripe-webhook/index.ts` uniquement.
- Aucune migration DB, aucun changement d'UI côté frontend.
- Réutiliser les mêmes styles inline (couleurs `brandYellow`, `brandBlue`, `brandOrange`, helper `fmtEur`).
- Déploiement automatique de l'edge function après édition.
- Test conseillé : déclencher un paiement test (panier mixte : 1 abonnement 6 mois + 1 achat unique + livraison aéroport) et vérifier visuellement l'email reçu à `contact@kiltirbox.com`.

## Questions ouvertes

- Pour récupérer `monthlyPrice` d'un abonnement côté webhook, préférez-vous que je le lise depuis `pending_orders.items` (champ déjà stocké au moment de la création du panier) ou depuis les `line_items` Stripe ? Le plus fiable est `pending_orders.items` — je pars sur cette option sauf indication contraire.
