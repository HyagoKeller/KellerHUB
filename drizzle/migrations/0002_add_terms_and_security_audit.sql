CREATE TABLE public.terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version text NOT NULL CHECK (char_length(terms_version) BETWEEN 1 AND 40),
  accepted_at timestamptz NOT NULL DEFAULT now(),
  user_agent_category text NOT NULL DEFAULT 'browser' CHECK (char_length(user_agent_category) <= 40),
  UNIQUE (user_id, terms_version)
);

GRANT SELECT, INSERT ON public.terms_acceptances TO authenticated;
GRANT ALL ON public.terms_acceptances TO service_role;

ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own terms acceptance"
ON public.terms_acceptances FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can accept current terms for themselves"
ON public.terms_acceptances FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  event_type text NOT NULL CHECK (char_length(event_type) BETWEEN 1 AND 80),
  entity_type text NOT NULL CHECK (char_length(entity_type) BETWEEN 1 AND 80),
  entity_id text CHECK (entity_id IS NULL OR char_length(entity_id) <= 160),
  result text NOT NULL DEFAULT 'success' CHECK (result IN ('success', 'denied', 'error')),
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  session_reference text CHECK (session_reference IS NULL OR char_length(session_reference) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.security_audit_log TO authenticated;
GRANT ALL ON public.security_audit_log TO service_role;

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can append their own audit events"
ON public.security_audit_log FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own audit events"
ON public.security_audit_log FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Designated security owner can read all audit events"
ON public.security_audit_log FOR SELECT TO authenticated
USING (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'hyagokeller@outlook.com.br'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'::public.app_role
  )
);

CREATE INDEX security_audit_log_user_created_idx
ON public.security_audit_log (user_id, created_at DESC);

CREATE INDEX security_audit_log_event_created_idx
ON public.security_audit_log (event_type, created_at DESC);

CREATE OR REPLACE FUNCTION public.prevent_security_record_mutation()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Security records are immutable';
END;
$$;

CREATE TRIGGER prevent_terms_acceptance_mutation
BEFORE UPDATE OR DELETE ON public.terms_acceptances
FOR EACH ROW EXECUTE FUNCTION public.prevent_security_record_mutation();

CREATE TRIGGER prevent_security_audit_mutation
BEFORE UPDATE OR DELETE ON public.security_audit_log
FOR EACH ROW EXECUTE FUNCTION public.prevent_security_record_mutation();