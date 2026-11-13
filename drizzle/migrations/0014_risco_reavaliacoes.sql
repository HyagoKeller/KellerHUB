CREATE TABLE public.risco_reavaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risco_id uuid NOT NULL REFERENCES public.riscos(id),
  probabilidade integer NOT NULL CHECK (probabilidade BETWEEN 1 AND 5),
  impacto integer NOT NULL CHECK (impacto BETWEEN 1 AND 5),
  prob_anterior integer, impacto_anterior integer,
  justificativa text NOT NULL DEFAULT '' CHECK (length(justificativa) <= 2000),
  autor text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);
GRANT SELECT, INSERT ON public.risco_reavaliacoes TO authenticated;
GRANT ALL ON public.risco_reavaliacoes TO service_role;
ALTER TABLE public.risco_reavaliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY ppm_read ON public.risco_reavaliacoes FOR SELECT TO authenticated USING (public.ppm_pode_ver(risco_id));
CREATE POLICY ppm_insert ON public.risco_reavaliacoes FOR INSERT TO authenticated WITH CHECK (public.ppm_pode_editar(risco_id));
CREATE INDEX ON public.risco_reavaliacoes(risco_id, created_at DESC);

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
                       WHEN NEW.probabilidade*NEW.impacto < r.probabilidade*r.impacto THEN 'queda' ELSE 'estavel' END
      WHERE id = NEW.risco_id;
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Reavaliações são imutáveis';
END $$;
CREATE TRIGGER ppm_reavaliar BEFORE INSERT ON public.risco_reavaliacoes FOR EACH ROW EXECUTE FUNCTION public.ppm_reavaliar_risco();
CREATE TRIGGER ppm_imutavel BEFORE UPDATE OR DELETE ON public.risco_reavaliacoes FOR EACH ROW EXECUTE FUNCTION public.ppm_reavaliar_risco();
CREATE TRIGGER ppm_audit AFTER INSERT ON public.risco_reavaliacoes FOR EACH ROW EXECUTE FUNCTION public.ppm_auditar();