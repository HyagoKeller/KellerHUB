CREATE OR REPLACE FUNCTION public.ppm_autor_status_report() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF TG_OP='INSERT' THEN
    SELECT display_name INTO NEW.autor FROM public.profiles WHERE id=auth.uid();
    NEW.autor := coalesce(nullif(NEW.autor,''),'Usuário');
  ELSE
    NEW.autor := OLD.autor;
    NEW.projeto_id := OLD.projeto_id;
  END IF;
  IF NEW.saude NOT IN ('verde','amarelo','vermelho') THEN RAISE EXCEPTION 'Saúde inválida'; END IF;
  IF length(trim(NEW.periodo))=0 OR length(NEW.periodo)>80 THEN RAISE EXCEPTION 'Período inválido'; END IF;
  IF length(NEW.resumo)>4000 OR length(NEW.realizacoes)>4000 OR length(NEW.proximos_passos)>4000 OR length(NEW.pontos_atencao)>4000 THEN RAISE EXCEPTION 'Texto muito longo'; END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.ppm_autor_status_report() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER ppm_status_autor BEFORE INSERT OR UPDATE ON public.status_reports FOR EACH ROW EXECUTE FUNCTION public.ppm_autor_status_report();