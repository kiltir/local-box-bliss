## Objectif
Désactiver l'onglet "Abonnement" dans la section "Découvrez nos box" lorsqu'une date de récupération à l'aéroport a été sélectionnée dans la section touristes.

## Détection
Lire `localStorage.travelInfo` : si `delivery_preference` vaut `airport_pickup_arrival` ou `airport_pickup_departure`, considérer l'abonnement comme indisponible (incompatible avec un abonnement mensuel récurrent).

## Modifications

**1. `src/hooks/usePurchaseType.ts`**
- Lire `travelInfo` depuis localStorage au montage.
- Exposer `isSubscriptionDisabled` (bool).
- Écouter les événements `storage` + un event custom `travelInfoChanged` pour se mettre à jour en direct.
- Si l'abonnement est désactivé et que le type courant est `subscription`, forcer le retour à `one-time`.

**2. `src/components/TouristDatesSection.tsx`**
- Après `localStorage.setItem/removeItem('travelInfo', …)` dans `saveTravelInfoToLocalStorage` et `handleAnnuler`, dispatcher `window.dispatchEvent(new Event('travelInfoChanged'))` pour notifier le hook dans le même onglet.

**3. `src/components/PurchaseTypeSelector.tsx`**
- Nouvelle prop optionnelle `subscriptionDisabled?: boolean`.
- Sur le `TabsTrigger` "subscription" : ajouter `disabled={subscriptionDisabled}` + classes `opacity-50 cursor-not-allowed` quand désactivé.
- Envelopper l'onglet dans un `Tooltip` (shadcn) affichant "Indisponible avec une récupération à l'aéroport — choisissez une adresse de livraison pour souscrire un abonnement." au survol.

**4. `src/components/BoxesSection.tsx`**
- Récupérer `isSubscriptionDisabled` depuis `usePurchaseType()` et le passer à `<PurchaseTypeSelector subscriptionDisabled={…} />`.

## Hors périmètre
Aucune modification des edge functions, du panier ou du checkout — la restriction est purement UI en amont de la sélection.
