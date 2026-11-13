CREATE OR REPLACE FUNCTION public.ppm_proteger_parent() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
  IF TG_OP='UPDATE' AND auth.uid() IS NOT NULL AND NOT public.ppm_tem_papel('administrador_pmo') THEN
    IF TG_TABLE_NAME IN ('projeto_elementos','projeto_subelementos','projeto_tarefas') THEN
      IF NEW.projeto_id IS DISTINCT FROM OLD.projeto_id OR NEW.responsavel_id IS DISTINCT FROM OLD.responsavel_id THEN
        RAISE EXCEPTION 'Somente Administrador/PMO pode mover ou reatribuir itens' USING ERRCODE='42501';
      END IF;
      IF TG_TABLE_NAME='projeto_subelementos' THEN
        IF NEW.elemento_id IS DISTINCT FROM OLD.elemento_id THEN
          RAISE EXCEPTION 'Somente Administrador/PMO pode mover subelementos entre elementos' USING ERRCODE='42501';
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.ppm_proteger_parent() FROM PUBLIC;
COMMENT ON FUNCTION public.ppm_proteger_parent() IS 'Preserves project, element and assignee bindings for non-administrative content edits, including direct Data API writes.';