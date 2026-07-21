## Objectif
S'assurer que l'onglet **Abonnement** n'est grisé que lorsqu'une date de récupération à l'aéroport (arrivée ou départ) est sélectionnée. S'il n'y a aucune date de récupération, l'abonnement doit rester actif.

## État actuel constaté
La logique dans `src/hooks/usePurchaseType.ts` semble déjà correspondre au besoin :
- `isSubscriptionDisabled` vaut `false` si `travelInfo` est absent de `localStorage`.
- `isSubscriptionDisabled` vaut `true` uniquement si `delivery_preference` vaut `airport_pickup_arrival` ou `airport_pickup_departure`.

## Vérifications à effectuer
1. **Relecture du hook** : confirmer que la condition de grisage n'est pas trop large.
2. **Test du parcours** :
   - Aucune date saisie → onglet Abonnement cliquable.
   - Dates + récupération aéroport sélectionnées → onglet Abonnement grisé + tooltip.
   - Bouton "Annuler" → onglet Abonnement redevient cliquable.
3. **Vérification des événements** : s'assurer que `travelInfoChanged` est bien déclenché à l'annulation et à la sauvegarde.

## Correction si nécessaire
Si le test montre un grisage résiduel, ajuster :
- `usePurchaseType.ts` : forcer `isSubscriptionDisabled = false` quand `travelInfo` est absent ou `delivery_preference` n'est pas aéroport.
- `TouristDatesSection.tsx` : s'assurer que l'event `travelInfoChanged` est dispatché après chaque annulation/reset.

## Hors périmètre
Aucune modification du panier, du checkout ou des edge functions.