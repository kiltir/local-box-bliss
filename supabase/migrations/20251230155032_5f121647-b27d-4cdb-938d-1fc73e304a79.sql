-- Change handle_updated_at() from SECURITY DEFINER to SECURITY INVOKER
-- This function only modifies the NEW record in a trigger, so it doesn't need elevated privileges

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;