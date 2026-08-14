# Afficher tous les critères de mot de passe sur le formulaire d'inscription

## Contexte

Actuellement, le formulaire d'inscription (`src/pages/Auth.tsx`, onglet "S'inscrire") n'affiche que « Minimum 6 caractères » sous le champ mot de passe. Supabase exige en réalité 4 critères, mais les 3 autres ne sont révélés qu'après une erreur de soumission. Il en va de même pour la page `src/pages/ResetPassword.tsx` qui affiche « Minimum 6 caractères ».

Politique réelle (confirmée dans `mem://auth/localization-french-errors` et dans les traductions d'erreur lignes 38–39) :
1. Minimum 6 caractères
2. Au moins une lettre
3. Au moins un chiffre
4. Au moins un caractère spécial (ex : @, #, !)

## Changements

### 1. `src/pages/Auth.tsx` — onglet "S'inscrire"
Remplacer le texte statique `<p>Minimum 6 caractères</p>` (ligne 342) par une liste claire des 4 critères, dans un bloc visuellement discret (icône + texte) :
- Minimum 6 caractères
- Au moins une lettre
- Au moins un chiffre
- Au moins un caractère spécial (@, #, !)

### 2. `src/pages/ResetPassword.tsx`
Remplacer le texte statique « Minimum 6 caractères » (ligne ~190) par la même liste des 4 critères.

## Critères d'acceptation
- Les 4 critères s'affichent en français sous le champ mot de passe, à la fois sur la page d'inscription et sur la page de réinitialisation.
- Aucune modification de la politique de mot de passe elle-même (gérée côté Supabase).
- Pas de changement de comportement de validation : le `minLength={6}` reste, les messages d'erreur traduits restent inchangés.
