import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AtualizacoesProjeto, type ContextoAtualizacao } from "@/components/AtualizacoesProjeto";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Barra, Panel, PanelTitle, Tag } from "@/components/ui-kit";
import {
  statusElementos,
  trabalhoProjetos,
  useTrabalhoProjetos,
  type ElementoProjeto,
  type StatusElemento,
  type SubelementoProjeto,
} from "@/lib/trabalho-projetos";
import { cn } from "@/lib/utils";

type ItemEditavel = {
  nome: string;
  responsavel: string;
  status: StatusElemento;
  prazo: string;
  progresso: number;
};

const vazio = (): ItemEditavel => ({ nome: "", responsavel: "", status: "Planejamento", prazo: new Date().toISOString().slice(0, 10), progresso: 0 });
const input = "h-9 w-full rounded-md border border-border bg-transparent px-3 text-sm";

export function ElementosProjeto({ projetoId, podeEditar, autor, onAtualizacoes }: { projetoId: string; podeEditar: boolean; autor: string; onAtualizacoes: (contexto: ContextoAtualizacao) => void }) {
  const { elementos } = useTrabalhoProjetos();
  const itens = elementos.filter((e) => e.projetoId === projetoId);
  const [expandidos, setExpandidos] = useState<string[]>(itens.map((e) => e.id));
  const [editor, setEditor] = useState<{ tipo: "elemento" | "subelemento"; elementoId?: string; item?: ElementoProjeto | SubelementoProjeto }>();
  const grupos = useMemo(() => statusElementos.map((status) => ({ status, itens: itens.filter((item) => item.status === status) })).filter((grupo) => grupo.itens.length), [itens]);

  return (
    <>
      <Panel className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <PanelTitle title="Elementos do projeto" hint={`${itens.length} elementos`} />
          {podeEditar && <Button size="sm" onClick={() => setEditor({ tipo: "elemento" })}><Plus /> Novo elemento</Button>}
        </div>
        {grupos.length === 0 ? (
          <div className="px-5 pb-8 text-sm text-muted-foreground">Nenhum elemento cadastrado neste projeto.</div>
        ) : (
          <div className="space-y-5 px-5 pb-5">
            {grupos.map((grupo) => (
              <section key={grupo.status}>
                <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
                  <Tag tom={grupo.status === "Concluído" ? "success" : grupo.status === "Em risco" || grupo.status === "Bloqueado" ? "danger" : grupo.status === "Em execução" ? "accent" : "neutro"}>{grupo.status}</Tag>
                  <span className="text-xs text-muted-foreground">{grupo.itens.length}</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[860px] text-sm">
                    <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                      <tr><th className="w-10 px-3 py-2" /><th className="px-3 py-2 font-medium">Elemento</th><th className="px-3 py-2 font-medium">Responsável</th><th className="px-3 py-2 font-medium">Status</th><th className="px-3 py-2 font-medium">Prazo</th><th className="px-3 py-2 font-medium">Progresso</th><th className="w-28 px-3 py-2 font-medium">Ações</th></tr>
                    </thead>
                    <tbody>{grupo.itens.map((elemento) => {
                      const aberto = expandidos.includes(elemento.id);
                      return [
                        <tr key={elemento.id} className="border-t border-border/70 bg-primary/5">
                          <td className="px-3 py-3"><Button variant="ghost" size="icon-sm" onClick={() => setExpandidos((lista) => lista.includes(elemento.id) ? lista.filter((id) => id !== elemento.id) : [...lista, elemento.id])} aria-label={aberto ? "Recolher subelementos" : "Expandir subelementos"}>{aberto ? <ChevronDown /> : <ChevronRight />}</Button></td>
                          <td className="px-3 py-3 font-medium">{elemento.nome}<span className="ml-2 text-[11px] font-normal text-muted-foreground">{elemento.subelementos.length} subelementos</span></td>
                          <td className="px-3 py-3 text-muted-foreground">{elemento.responsavel}</td>
                          <td className="px-3 py-3"><SeletorStatus valor={elemento.status} desabilitado={!podeEditar} onChange={(status) => trabalhoProjetos.salvarElemento({ ...elemento, status })} /></td>
                          <td className="num whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{new Date(`${elemento.prazo}T12:00:00`).toLocaleDateString("pt-BR")}</td>
                          <td className="px-3 py-3"><div className="flex w-36 items-center gap-2"><Barra valor={elemento.progresso} /><span className="num text-xs">{elemento.progresso}%</span></div></td>
                          <td className="px-3 py-3"><div className="flex items-center"><AtualizacoesProjeto projetoId={projetoId} alvoTipo="elemento" alvoId={elemento.id} titulo={elemento.nome} onClick={onAtualizacoes} />{podeEditar && <><Button variant="ghost" size="icon-sm" onClick={() => setEditor({ tipo: "subelemento", elementoId: elemento.id })} aria-label="Adicionar subelemento" title="Adicionar subelemento"><Plus /></Button><Button variant="ghost" size="icon-sm" onClick={() => setEditor({ tipo: "elemento", item: elemento })} aria-label="Editar elemento"><Pencil /></Button></>}</div></td>
                        </tr>,
                        ...(aberto ? elemento.subelementos.map((sub) => <tr key={sub.id} className="border-t border-border/50">
                          <td className="px-3 py-3" />
                          <td className="px-3 py-3"><div className="flex items-center gap-2 pl-4"><span className="h-px w-4 bg-border" /><span>{sub.nome}</span></div></td>
                          <td className="px-3 py-3 text-muted-foreground">{sub.responsavel}</td>
                          <td className="px-3 py-3"><SeletorStatus valor={sub.status} desabilitado={!podeEditar} onChange={(status) => trabalhoProjetos.salvarSubelemento(elemento.id, { ...sub, status })} /></td>
                          <td className="num whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{new Date(`${sub.prazo}T12:00:00`).toLocaleDateString("pt-BR")}</td>
                          <td className="px-3 py-3"><div className="flex w-36 items-center gap-2"><Barra valor={sub.progresso} /><span className="num text-xs">{sub.progresso}%</span></div></td>
                          <td className="px-3 py-3"><div className="flex items-center"><AtualizacoesProjeto projetoId={projetoId} alvoTipo="subelemento" alvoId={sub.id} titulo={sub.nome} onClick={onAtualizacoes} />{podeEditar && <Button variant="ghost" size="icon-sm" onClick={() => setEditor({ tipo: "subelemento", elementoId: elemento.id, item: sub })} aria-label="Editar subelemento"><Pencil /></Button>}</div></td>
                        </tr>) : []),
                      ];
                    })}</tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </Panel>
      <EditorItem projetoId={projetoId} editor={editor} onClose={() => setEditor(undefined)} />
    </>
  );
}

function SeletorStatus({ valor, onChange, desabilitado }: { valor: StatusElemento; onChange: (status: StatusElemento) => void; desabilitado: boolean }) {
  return <select className="h-8 rounded-md border border-border bg-card px-2 text-xs" value={valor} disabled={desabilitado} onChange={(e) => onChange(e.target.value as StatusElemento)}>{statusElementos.map((status) => <option key={status}>{status}</option>)}</select>;
}

function AtualizacoesProjeto(props: ContextoAtualizacao & { onClick: (contexto: ContextoAtualizacao) => void }) {
  return <ContadorAtualizacoes {...props} onClick={() => props.onClick(props)} />;
}

import { ContadorAtualizacoes } from "@/components/AtualizacoesProjeto";

function EditorItem({ projetoId, editor, onClose }: { projetoId: string; editor?: { tipo: "elemento" | "subelemento"; elementoId?: string; item?: ElementoProjeto | SubelementoProjeto }; onClose: () => void }) {
  const [dados, setDados] = useState<ItemEditavel>(vazio());
  const chave = `${editor?.tipo ?? ""}-${editor?.item?.id ?? "novo"}-${editor?.elementoId ?? ""}`;
  const [ultimaChave, setUltimaChave] = useState("");
  if (editor && chave !== ultimaChave) {
    setUltimaChave(chave);
    setDados(editor.item ? { nome: editor.item.nome, responsavel: editor.item.responsavel, status: editor.item.status, prazo: editor.item.prazo, progresso: editor.item.progresso } : vazio());
  }
  const valido = dados.nome.trim().length >= 3 && dados.responsavel.trim().length >= 2 && Boolean(dados.prazo);
  const salvar = () => {
    if (!editor || !valido) return;
    if (editor.tipo === "elemento") trabalhoProjetos.salvarElemento({ ...dados, id: editor.item?.id, projetoId });
    else if (editor.elementoId) trabalhoProjetos.salvarSubelemento(editor.elementoId, { ...dados, id: editor.item?.id });
    toast.success(editor.item ? "Item atualizado" : "Item cadastrado");
    onClose();
  };
  const remover = () => {
    if (!editor?.item) return;
    if (editor.tipo === "elemento") trabalhoProjetos.removerElemento(editor.item.id);
    else if (editor.elementoId) trabalhoProjetos.removerSubelemento(editor.elementoId, editor.item.id);
    toast.success("Item excluído");
    onClose();
  };
  return <Dialog open={Boolean(editor)} onOpenChange={(aberto) => !aberto && onClose()}><DialogContent className="panel max-w-lg"><DialogHeader><DialogTitle>{editor?.item ? "Editar" : "Novo"} {editor?.tipo}</DialogTitle><DialogDescription>Detalhamento da execução do projeto.</DialogDescription></DialogHeader><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 sm:col-span-2"><span className="text-xs text-muted-foreground">Nome</span><input className={input} value={dados.nome} onChange={(e) => setDados((d) => ({ ...d, nome: e.target.value }))} /></label><label className="space-y-1.5"><span className="text-xs text-muted-foreground">Responsável</span><input className={input} value={dados.responsavel} onChange={(e) => setDados((d) => ({ ...d, responsavel: e.target.value }))} /></label><label className="space-y-1.5"><span className="text-xs text-muted-foreground">Status</span><select className={input} value={dados.status} onChange={(e) => setDados((d) => ({ ...d, status: e.target.value as StatusElemento }))}>{statusElementos.map((status) => <option key={status}>{status}</option>)}</select></label><label className="space-y-1.5"><span className="text-xs text-muted-foreground">Prazo</span><input type="date" className={input} value={dados.prazo} onChange={(e) => setDados((d) => ({ ...d, prazo: e.target.value }))} /></label><label className="space-y-1.5"><span className="text-xs text-muted-foreground">Progresso: {dados.progresso}%</span><input type="range" min={0} max={100} className="w-full" value={dados.progresso} onChange={(e) => setDados((d) => ({ ...d, progresso: Number(e.target.value) }))} /></label></div><div className="flex items-center justify-between gap-3">{editor?.item ? <Button variant="ghost" className="text-destructive" onClick={remover}><Trash2 /> Excluir</Button> : <span />}<div className="flex gap-2"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={salvar} disabled={!valido}>Salvar</Button></div></div></DialogContent></Dialog>;
}