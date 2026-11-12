import {supabase} from "@/integrations/supabase/client";
import type {User} from "@supabase/supabase-js";
export async function garantirSuperadmin(usuarioConfirmado?:User){
 const user=usuarioConfirmado??(await supabase.auth.getUser()).data.user;
 if(!user)return {autorizado:false,user:null};
 const {data,error}=await supabase.rpc("ppm_ativo");
 if(error)throw error;
 return {autorizado:Boolean(data),user};
}
export const authenticatedFetch:typeof fetch=async(input,init)=>{const {data}=await supabase.auth.getSession();const headers=new Headers(init?.headers);if(data.session?.access_token)headers.set("Authorization",`Bearer ${data.session.access_token}`);return fetch(input,{...init,headers});};
