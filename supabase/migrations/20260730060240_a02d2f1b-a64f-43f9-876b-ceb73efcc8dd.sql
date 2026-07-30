-- Renommer monthly_price en total_price : la colonne stocke le prix total de l'engagement
ALTER TABLE public.subscriptions RENAME COLUMN monthly_price TO total_price;

COMMENT ON COLUMN public.subscriptions.total_price IS 'Prix total de l engagement d abonnement (mensualité × durée)';