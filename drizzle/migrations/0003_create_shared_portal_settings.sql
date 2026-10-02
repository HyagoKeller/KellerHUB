CREATE TABLE public.portal_settings (
  id text PRIMARY KEY,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT portal_settings_singleton_id CHECK (id = 'portal')
);

GRANT SELECT ON public.portal_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.portal_settings TO authenticated;
GRANT ALL ON public.portal_settings TO service_role;

ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portal presentation settings"
ON public.portal_settings
FOR SELECT
TO anon, authenticated
USING (id = 'portal');

CREATE POLICY "Superadmins can create portal settings"
ON public.portal_settings
FOR INSERT
TO authenticated
WITH CHECK (
  id = 'portal'
  AND updated_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'
  )
);

CREATE POLICY "Superadmins can update portal settings"
ON public.portal_settings
FOR UPDATE
TO authenticated
USING (
  id = 'portal'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'
  )
)
WITH CHECK (
  id = 'portal'
  AND updated_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'
  )
);

CREATE TRIGGER set_portal_settings_updated_at
BEFORE UPDATE ON public.portal_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();