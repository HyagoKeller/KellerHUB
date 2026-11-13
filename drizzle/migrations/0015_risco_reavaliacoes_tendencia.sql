CREATE OR REPLACE FUNCTION public.ppm_reavaliar_risco() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE r public.riscos;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT * INTO r FROM public.riscos WHERE id = NEW.risco_id;
    NEW.prob_anterior := r.probabilidade; NEW.impacto_anterior := r.impacto;
    NEW.created_by := auth.uid(); NEW.created_at := now();
    NEW.autor := coalesce((SELECT display_name FROM public.profiles WHERE id = auth.uid()), '');
    UPDATE public.riscos SET probabilidade = NEW.probabilidade, impacto = NEW.impacto,
      tendencia = CASE WHEN NEW.probabilidade*NEW.impacto > r.probabilidade*r.impacto THEN 'alta'
                       WHEN NEW.probabilidade*NEW.impacto < r.probabilidade*r.impacto THEN 'queda' ELSE 'estável' END
      WHERE id = NEW.risco_id;
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Reavaliações são imutáveis';
END $$;