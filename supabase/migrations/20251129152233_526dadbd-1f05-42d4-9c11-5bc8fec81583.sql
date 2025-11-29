-- Supprimer l'ancienne contrainte
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Recréer la contrainte avec 'interrompue' ajouté
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY[
  'en_attente'::text, 
  'confirmee'::text, 
  'preparee'::text, 
  'expediee'::text, 
  'livree'::text, 
  'annulee'::text,
  'interrompue'::text
]));