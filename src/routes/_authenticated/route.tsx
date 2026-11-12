import {createFileRoute,redirect,Outlet,useRouter} from '@tanstack/react-router';
import {Suspense} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {CarteiraCompartilhadaProvider} from '@/lib/ppm-store';
import {carteiraQueryOptions} from '@/lib/ppm-query';
import {Button} from '@/components/ui/button';

export const Route=createFileRoute('/_authenticated')({
  ssr:false,
  beforeLoad:async({location})=>{
    const {data,error}=await supabase.auth.getUser();
    if(error||!data.user)throw redirect({to:'/auth',search:{next:location.href}});
    const {data:ativo,error:erro}=await supabase.rpc('ppm_ativo');
    if(erro||!ativo)throw redirect({to:'/auth',search:{next:location.href}});
  },
  loader:({context})=>context.queryClient.ensureQueryData(carteiraQueryOptions()),
  component:()=> <Suspense fallback={<div className="grid min-h-screen place-items-center bg-background text-foreground">Carregando dados compartilhados</div>}><CarteiraCompartilhadaProvider><Outlet/></CarteiraCompartilhadaProvider></Suspense>,
  errorComponent:ErroDados,
  notFoundComponent:()=> <div className="p-6">Registro não encontrado.</div>,
});
function ErroDados(){const router=useRouter();return <div className="grid min-h-screen place-items-center bg-background text-foreground"><div><h1 className="text-xl">Não foi possível carregar os dados compartilhados</h1><Button className="mt-4" onClick={()=>void router.invalidate()}>Tentar novamente</Button></div></div>;}