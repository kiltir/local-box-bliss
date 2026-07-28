## Objectif

1. Envoyer un email de confirmation à chaque prélèvement mensuel d'abonnement (client + BCC `contact@kiltirbox.com`).
2. Afficher explicitement la progression « Mois X / Y » de chaque abonnement dans l'espace client (`/mes-commandes`) et dans l'admin (onglet Commandes).

## 1. Email à chaque mensualité prélevée

Fichier : `supabase/functions/handle-stripe-webhook/index.ts`, fonction `handleInvoicePaid`.

- Après création de la commande mensuelle, appeler `sendOrderConfirmationEmail` avec :
  - `items` = un seul item abonnement `{ title: "Box <theme>", quantity: 1, unitPrice: monthly_price, durationMonths: duration_months, subscriptionLabel: "Mensualité X/Y" }`
  - `amountPaidNow = invoice.amount_paid / 100`
  - `shippingUnitCost` calculé à partir de `invoice.amount_paid - subscription.monthly_price` (frais standards du mois en cours)
  - Adresses de livraison depuis la table `subscriptions`
  - Adresse de facturation : récupérer depuis `invoice.customer_address` (fourni par Stripe) ou fallback profile
- Récupérer l'email client depuis `invoice.customer_email` (ou depuis `auth.users` via `subscription.user_id` si manquant).
- Adapter légèrement le template : dans l'en-tête, pour les mensualités > 1, l'intitulé « Merci pour votre commande » devient « Prélèvement mensuel confirmé » (via un nouveau flag optionnel `isRecurring`). Le titre du bloc « 1ère mensualité » devient « Mensualité X/Y ».

Aucune migration DB. Déploiement automatique de l'edge function.

## 2. Progression « Mois X / Y » dans les UIs

La donnée fiable est dans la table `subscriptions` (`total_paid_months` / `duration_months`). Les commandes mensuelles (`ABO-...`) sont créées côté webhook et n'ont pas de lien direct avec la subscription, mais le champ `order_items.box_type` contient déjà `Mois X/Y`.

### 2.a Espace client — `src/pages/MesCommandes.tsx`

- Nouveau bloc « Mes abonnements » en haut de la page, au-dessus de la liste des commandes.
- Fetch de `subscriptions` où `user_id = current user`.
- Pour chaque abonnement actif/terminé, afficher une carte compacte :
  - Titre `Box <theme> — Abonnement <duration_months> mois`
  - Badge de statut (`active`, `completed`, `past_due`, `canceled`)
  - Ligne « Mensualité **X / Y** » + barre de progression (`Progress` shadcn)
  - Prochain prélèvement : `current_period_end` (si `active` et `X < Y`)
- L'affichage « Mois X/Y » dans le libellé de chaque item de commande reste inchangé (déjà présent).

### 2.b Admin — `src/components/admin/OrdersManagement.tsx`

- Ajouter une deuxième vue (Tabs interne : « Commandes » / « Abonnements ») OU un tableau supplémentaire sous les commandes.
- Choix retenu : sous-onglets internes pour ne pas surcharger.
- Onglet « Abonnements » : tableau listant chaque subscription avec colonnes :
  - Client (via jointure profile)
  - Box (theme)
  - Durée
  - Progression `X / Y` + mini barre
  - Statut
  - Prochain prélèvement
  - Prix mensuel
- Read-only (aligné avec la règle « admin orders = read-only »).

## Aspects techniques

- Un seul fichier edge modifié (`handle-stripe-webhook/index.ts`) — ajouter un champ optionnel `isRecurring?: boolean` et `paymentTitleOverride?: string` au paramètre de `sendOrderConfirmationEmail`.
- Pas de nouvelle migration.
- Nouvelle utilisation du composant `Progress` (`@/components/ui/progress`, déjà installé via shadcn).
- Types Supabase : `subscriptions` déjà présent dans `src/integrations/supabase/types.ts`.
- Test : déclencher un `invoice.paid` via Stripe CLI ou attendre le prochain cycle mensuel ; vérifier réception email + BCC.

## Hors périmètre

- Pas de modification du flux de création initial d'abonnement (déjà envoie email).
- Pas de refonte du template ; ajustements minimes du header/section title uniquement.
- Pas de gestion d'annulation d'abonnement côté UI client (non demandé).
