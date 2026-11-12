import {useCallback} from "react";
import {useSuspenseQuery,useQueryClient} from "@tanstack/react-query";
import type {UIMessage} from "ai";
import {supabase} from "@/integrations/supabase/client";
export type Conversa={id:string;titulo:string;atualizadoEm:number;mensagens:UIMessage[]};
export const conversaNova=():Conversa=>({id:crypto.randomUUID(),titulo:"Nova consulta",atualizadoEm:Date.now(),mensagens:[]});
export async function garantirConversa(){const {data,error}=await supabase.from("assistente_conversas").select("id").order("updated_at",{ascending:false}).limit(1);if(error)throw error;if(data?.[0])return data[0].id;const nova=conversaNova();const {error:erro}=await supabase.from("assistente_conversas").insert({id:nova.id});if(erro)throw erro;return nova.id;}
export function useConversas(){const client=useQueryClient();const {data:conversas}=useSuspenseQuery({queryKey:["conversas"],queryFn:async()=>{const {data,error}=await supabase.from("assistente_conversas").select("id,titulo,mensagens,updated_at").order("updated_at",{ascending:false}).limit(100);if(error)throw error;return (data??[]).map(c=>({id:c.id,titulo:c.titulo,mensagens:c.mensagens as unknown as UIMessage[],atualizadoEm:Date.parse(c.updated_at)}));}});
const criar=useCallback(()=>{const nova=conversaNova();void supabase.from("assistente_conversas").insert({id:nova.id}).then(({error})=>{if(!error)void client.invalidateQueries({queryKey:["conversas"]});});return nova.id;},[client]);
const remover=useCallback((id:string)=>{void supabase.from("assistente_conversas").delete().eq("id",id).then(()=>client.invalidateQueries({queryKey:["conversas"]}));},[client]);
const salvarMensagens=useCallback((id:string,mensagens:UIMessage[])=>{const titulo=mensagens.find(m=>m.role==="user")?.parts.filter(p=>p.type==="text").map(p=>p.type==="text"?p.text:"").join(" ").slice(0,60)??"Nova consulta";void supabase.from("assistente_conversas").upsert({id,titulo,mensagens:mensagens as never,updated_at:new Date().toISOString()}).then(()=>client.invalidateQueries({queryKey:["conversas"]}));},[client]);return {conversas,criar,remover,salvarMensagens};}
