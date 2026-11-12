import {useState} from "react";
import {useDadosCompartilhados,gravar,gravarAcesso,snapshotAtual} from "./ppm-store";
export type PerfilAcesso = "Técnico" | "Gestor" | "Alta Administração" | "Administrador/PMO" | "Auditor";
export type VisibilidadeArea = "Aberta" | "Restrita";
export type VisibilidadeObjeto = "publica" | "compartilhada" | "privada";
export type NivelPermissao = "Editar tudo" | "Editar conteúdo" | "Editar só itens atribuídos a mim" | "Somente leitura";
export type PapelArea = "Dono da área" | "Membro";
export type TipoObjeto = "portfolio" | "programa" | "projeto";

export const niveis: NivelPermissao[] = ["Editar tudo", "Editar conteúdo", "Editar só itens atribuídos a mim", "Somente leitura"];
export const rotuloVisibilidade: Record<VisibilidadeObjeto, string> = {
  publica: "Pública na área",
  compartilhada: "Compartilhada",
  privada: "Privada",
};
const peso: Record<VisibilidadeObjeto, number> = { publica: 0, compartilhada: 1, privada: 2 };

export type Usuario = { id: string; nome: string; perfil: PerfilAcesso; iniciais: string; email?: string; cargo?: string; origem?: string };
export type Area = {
  id: string;
  nome: string;
  sigla: string;
  responsavel: string;
  visibilidade: VisibilidadeArea;
  membros: { usuarioId: string; papel: PapelArea }[];
};
export type AcessoObjeto = {
  areaId?: string; // apenas portfólios definem a área; filhos herdam
  visibilidade: VisibilidadeObjeto;
  convidados: { usuarioId: string; nivel: NivelPermissao }[];
  compartilhadoCom: string[];
};
export type EventoAcesso = {
  id: string;
  quando: string;
  usuario: string;
  perfil: string;
  acao: string;
  entidade: string;
  detalhe: string;
};

export const usuarios:Usuario[]=[];
const padrao:AcessoObjeto={visibilidade:"publica",convidados:[],compartilhadoCom:[]};
let filtro:string[]=[];const ouvintes=new Set<()=>void>();
export function useAcessoEstado(){const d=useDadosCompartilhados();const [,redraw]=useState(0);return {...d,simuladoId:d.usuario.id,filtroAreas:filtro,importados:d.usuarios};}
export const usuarioPorId=(id:string)=>snapshotAtual?.usuarios.find(u=>u.id===id) ?? snapshotAtual?.usuario;
export const todosUsuarios=(e:{usuarios?:Usuario[];importados?:Usuario[]})=>e.usuarios??e.importados??[];
export const acessoDe=(e:{objetos:Record<string,AcessoObjeto>},id:string)=>e.objetos[id]??padrao;
export const areasConhecidas=(e:{areas:Area[]},_u?:Usuario)=>e.areas;
export const areasDoUsuario=(e:{areas:Area[]},u:Usuario)=>e.areas.filter(a=>a.membros.some(m=>m.usuarioId===u.id));
export const visibilidadeEfetiva=(e:{objetos:Record<string,AcessoObjeto>},ids:string[])=>ids.reduce<VisibilidadeObjeto>((v,id)=>peso[acessoDe(e,id).visibilidade]>peso[v]?acessoDe(e,id).visibilidade:v,"publica");
export const maisRestritaQue=(v:VisibilidadeObjeto,p:VisibilidadeObjeto)=>peso[v]>=peso[p];
export const podeEditarNivel=(n:NivelPermissao)=>n!=="Somente leitura";
export const acesso={
 simular:(_id:string)=>{},
 filtrar:(areas:string[])=>{filtro=areas;ouvintes.forEach(f=>f());},
 salvarArea:(a:Omit<Area,"id"> & {id?:string})=>gravar("areas",a),
 atualizarObjeto:(id:string,_nome:string,parcial:Partial<AcessoObjeto>)=>gravarAcesso(id,parcial),
 importarUsuario:(_u:Usuario)=>{throw new Error("Diretório não conectado.");},
};
export function useCarteiraVisivel(){
 const d=useDadosCompartilhados();const estado={...d,simuladoId:d.usuario.id,filtroAreas:[],importados:d.usuarios};
 const cadeia=(tipo:TipoObjeto,id:string):{ids:string[];areaId:string}=>{const o=d.objetos[id]; const pg=tipo==="projeto"?d.programas.find(g=>g.id===d.projetos.find(p=>p.id===id)?.programaId):d.programas.find(g=>g.id===id);return {ids:tipo==="portfolio"?[id]:tipo==="programa"?[pg?.portfolioId??"",id]:[pg?.portfolioId??"",pg?.id??"",id],areaId:o?.areaId??""};};
 const nivel=(_tipo:TipoObjeto,id:string):NivelPermissao=>d.permissoes[id]?(d.usuario.perfil==="Técnico"?"Editar só itens atribuídos a mim":"Editar tudo"):"Somente leitura";
 return {...d,estado,usuario:d.usuario,areasExibidas:d.areas,ocultarValores:false,podeCriar:d.capacidades.includes("administrador_pmo")||d.capacidades.includes("gestor"),podeAdministrar:d.capacidades.includes("administrador_pmo"),nivel,podeEditar:(_tipo:TipoObjeto,id:string)=>Boolean(d.permissoes[id]),cadeia,areaDe:(tipo:TipoObjeto,id:string)=>d.areas.find(a=>a.id===cadeia(tipo,id).areaId)};
}
