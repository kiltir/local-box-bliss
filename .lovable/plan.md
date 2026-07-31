## Objectif

Simuler le prélèvement de la 2ème mensualité d'un abonnement existant (mode test Stripe) et observer l'ensemble des effets : mise à jour de la table `subscriptions`, création de la commande mensuelle `ABO-...`, envoi de l'email récurrent, affichage « Mois X / Y » dans `/mes-commandes` et dans l'admin.

## Méthode retenue : événement `invoice.paid` signé

Le webhook `handle-stripe-webhook` vérifie la signature Stripe. La simulation consiste donc à :

1. Sélectionner un abonnement de test existant dans `subscriptions` (celui créé récemment : Box Découverte, 12 mois, `total_paid_months = 1`) et relever son `stripe_subscription_id` + `stripe_customer_id`.
2. Récupérer depuis Stripe (API test, via la clé `STRIPE_SECRET_KEY`) la vraie subscription pour construire un payload d'`invoice.paid` réaliste : `subscription`, `customer_email`, `customer_name`, `customer_address`, `amount_paid`, `period_start`, `period_end`, `billing_reason: "subscription_cycle"`.
3. Construire l'événement `invoice.paid` complet, calculer l'en-tête `Stripe-Signature` (HMAC SHA-256 `t=<ts>,v1=<sig>` avec `STRIPE_WEBHOOK_SECRET`) et l'envoyer en POST à l'URL de la fonction edge.
4. Observer les résultats :
   - logs de la fonction `handle-stripe-webhook`
   - requête SQL sur `subscriptions` (`total_paid_months` doit passer à 2, `current_period_*` mis à jour)
   - requête SQL sur `orders` / `order_items` (nouvelle commande `ABO-...` avec libellé `Mois 2/12`)
   - confirmation d'envoi de l'email récurrent (log Resend) — l'email part sur l'adresse client de test + BCC `contact@kiltirbox.com`
   - capture d'écran de `/mes-commandes` et de l'onglet Admin « Abonnements » pour vérifier la progression 2/12

## Points d'attention

- La simulation crée une **vraie ligne de commande** en base et **envoie un vrai email** (adresse de test `getacek851@kingcq.com` + BCC pro). Si tu préfères éviter le BCC, je peux d'abord faire un dry-run en lisant seulement le code, ou supprimer la commande de test après observation.
- Aucun paiement réel n'est déclenché : l'événement est synthétique, Stripe n'est pas débité.
- Aucune modification du code applicatif n'est prévue. Si l'observation révèle un bug (montant de livraison, libellé du mois, email manquant), je le signalerai et proposerai un correctif dans un second temps.

## Aspects techniques

- Script Python jetable sous `/tmp/` (hors dépôt) pour la signature HMAC et l'envoi.
- Secrets `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` lus via l'outil secrets, jamais affichés ni journalisés.
- Nettoyage optionnel en fin de test : suppression de la commande `ABO-...` générée et remise de `total_paid_months` à sa valeur initiale.

## Question ouverte

Souhaites-tu que je **conserve** ou que je **nettoie** les données générées (commande de test + compteur d'abonnement) après observation ? Par défaut je nettoie.
