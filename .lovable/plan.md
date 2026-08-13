# Factures Stripe pour les achats uniques

## Objectif
Aujourd'hui seules les commandes de type abonnement génèrent une facture Stripe (via `invoice.paid`). Les achats uniques (`mode: "payment"`) n'en génèrent aucune. On active la création automatique de facture Stripe pour ces commandes.

## Ce qui change pour le client
- À la fin du paiement d'un achat unique, Stripe crée une facture officielle (numérotée) associée à la commande.
- La facture est téléchargeable en PDF par le client depuis le reçu Stripe et visible dans le Dashboard Stripe côté KiltirBox.
- La facture reprend le détail des lignes déjà affichées au checkout (box + frais de livraison par box), ainsi que l'adresse de facturation collectée.

## Détail technique
Dans `supabase/functions/create-payment/index.ts`, sur le `sessionConfig` du mode `payment` :

- Ajouter `invoice_creation: { enabled: true }`.
- Renseigner `invoice_creation.invoice_data` avec :
  - `description` : référence lisible de la commande (ex. « Commande KiltirBox — achat unique »).
  - `metadata` : reprise de `user_id`, `pending_order_id` et `shipping_cost` déjà présents dans les métadonnées de session, pour permettre le rapprochement facture/commande.
  - `footer` : mention légale courte KiltirBox (contact@kiltirbox.com).
- Aucun changement de prix, de livraison, ni de webhook : le flux de création de commande reste piloté par `checkout.session.completed`.

## Points de vigilance
- `billing_address_collection: 'required'` est déjà actif, la facture aura donc bien une adresse de facturation.
- Aucune modification du flux abonnement (les factures y sont déjà natives).
- À tester en mode test Stripe : passer une commande achat unique et vérifier la présence de la facture dans le Dashboard.
