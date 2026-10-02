CREATE TABLE public.app_settings (
  id text PRIMARY KEY,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT app_settings_known_id CHECK (id IN ('ai'))
);

GRANT SELECT, INSERT, UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmins can read application settings"
ON public.app_settings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'
  )
);

CREATE POLICY "Superadmins can create application settings"
ON public.app_settings
FOR INSERT
TO authenticated
WITH CHECK (
  updated_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'
  )
);

CREATE POLICY "Superadmins can update application settings"
ON public.app_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'
  )
)
WITH CHECK (
  updated_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'superadmin'
  )
);

CREATE TRIGGER set_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();