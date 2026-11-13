import {queryOptions} from '@tanstack/react-query';
import {obterCarteiraCompartilhada} from './ppm.functions';
import type {Snapshot} from './ppm-store';

export const carteiraQueryOptions=()=>queryOptions({queryKey:['ppm'],queryFn:async()=>await obterCarteiraCompartilhada() as unknown as Snapshot,staleTime:10000,refetchInterval:20000,refetchIntervalInBackground:false,refetchOnWindowFocus:true,refetchOnReconnect:true});