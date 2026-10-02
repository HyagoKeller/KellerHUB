REVOKE SELECT ON public.portal_settings FROM anon;

CREATE OR REPLACE FUNCTION public.get_public_portal_settings()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN config IS NULL THEN NULL
    ELSE jsonb_build_object(
      'organizacao', config -> 'organizacao',
      'logo', config -> 'logo',
      'mensagemInicioSessao', config -> 'mensagemInicioSessao',
      'logoInicioSessao', config -> 'logoInicioSessao',
      'metodoAcesso', config -> 'metodoAcesso',
      'textoBotaoMicrosoft365', config -> 'textoBotaoMicrosoft365',
      'paleta', config -> 'paleta',
      'modo', config -> 'modo'
    )
  END
  FROM public.portal_settings
  WHERE id = 'portal'
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_public_portal_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_portal_settings() TO anon, authenticated, service_role;