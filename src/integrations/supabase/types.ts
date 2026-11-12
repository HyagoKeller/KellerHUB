export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      alinhamento_estrategico: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          objetivo_id: string
          objeto_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          objetivo_id: string
          objeto_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          objetivo_id?: string
          objeto_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alinhamento_estrategico_objetivo_id_fkey"
            columns: ["objetivo_id"]
            isOneToOne: false
            referencedRelation: "objetivos_estrategicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alinhamento_estrategico_objeto_id_fkey"
            columns: ["objeto_id"]
            isOneToOne: false
            referencedRelation: "objetos_acesso"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          config: Json
          created_at: string
          id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      area_membros: {
        Row: {
          area_id: string
          created_at: string
          created_by: string | null
          id: string
          papel: string
          updated_at: string
          updated_by: string | null
          usuario_id: string
        }
        Insert: {
          area_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          papel?: string
          updated_at?: string
          updated_by?: string | null
          usuario_id: string
        }
        Update: {
          area_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          papel?: string
          updated_at?: string
          updated_by?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_membros_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_membros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      areas: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          nome: string
          responsavel: string
          responsavel_id: string | null
          sigla: string
          updated_at: string
          updated_by: string | null
          visibilidade: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          nome: string
          responsavel?: string
          responsavel_id?: string | null
          sigla: string
          updated_at?: string
          updated_by?: string | null
          visibilidade?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string
          responsavel?: string
          responsavel_id?: string | null
          sigla?: string
          updated_at?: string
          updated_by?: string | null
          visibilidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "areas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      etiquetas_carteira: {
        Row: {
          coluna: string
          created_at: string
          created_by: string | null
          id: string
          nome: string
          tom: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          coluna: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome: string
          tom?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          coluna?: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string
          tom?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      indicador_valores: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          indicador_id: string
          origem: string
          periodo: string
          updated_at: string
          updated_by: string | null
          valor: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          indicador_id: string
          origem?: string
          periodo: string
          updated_at?: string
          updated_by?: string | null
          valor: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          indicador_id?: string
          origem?: string
          periodo?: string
          updated_at?: string
          updated_by?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "indicador_valores_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores: {
        Row: {
          area_id: string
          calculo: string | null
          created_at: string
          created_by: string | null
          data: Json
          formula: string
          id: string
          meta: number
          nivel: string
          nome: string
          periodicidade: string
          polaridade: string
          responsavel: string
          responsavel_id: string | null
          unidade: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          area_id: string
          calculo?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json
          formula?: string
          id?: string
          meta?: number
          nivel?: string
          nome: string
          periodicidade?: string
          polaridade?: string
          responsavel?: string
          responsavel_id?: string | null
          unidade?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          area_id?: string
          calculo?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json
          formula?: string
          id?: string
          meta?: number
          nivel?: string
          nome?: string
          periodicidade?: string
          polaridade?: string
          responsavel?: string
          responsavel_id?: string | null
          unidade?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "indicadores_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicadores_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      iniciativas: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          nome: string
          objetivo_id: string
          prazo: string | null
          progresso: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome: string
          objetivo_id: string
          prazo?: string | null
          progresso?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome?: string
          objetivo_id?: string
          prazo?: string | null
          progresso?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iniciativas_objetivo_id_fkey"
            columns: ["objetivo_id"]
            isOneToOne: false
            referencedRelation: "objetivos_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      metas_estrategicas: {
        Row: {
          alvo: number
          atual: number
          created_at: string
          created_by: string | null
          data: Json
          id: string
          nome: string
          objetivo_id: string
          prazo: string | null
          unidade: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alvo?: number
          atual?: number
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome: string
          objetivo_id: string
          prazo?: string | null
          unidade?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alvo?: number
          atual?: number
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome?: string
          objetivo_id?: string
          prazo?: string | null
          unidade?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metas_estrategicas_objetivo_id_fkey"
            columns: ["objetivo_id"]
            isOneToOne: false
            referencedRelation: "objetivos_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      objetivos_estrategicos: {
        Row: {
          area_id: string
          codigo: string
          created_at: string
          created_by: string | null
          data: Json
          id: string
          meta: string
          nome: string
          perspectiva: string
          prazo: string | null
          responsavel: string
          responsavel_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          area_id: string
          codigo: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          meta?: string
          nome: string
          perspectiva?: string
          prazo?: string | null
          responsavel?: string
          responsavel_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          area_id?: string
          codigo?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          meta?: string
          nome?: string
          perspectiva?: string
          prazo?: string | null
          responsavel?: string
          responsavel_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objetivos_estrategicos_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objetivos_estrategicos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      objetos_acesso: {
        Row: {
          area_id: string
          compartilhado_com: string[]
          convidados: Json
          created_at: string
          created_by: string | null
          id: string
          parent_id: string | null
          responsavel_id: string | null
          tipo: string
          updated_at: string
          updated_by: string | null
          visibilidade: string
        }
        Insert: {
          area_id: string
          compartilhado_com?: string[]
          convidados?: Json
          created_at?: string
          created_by?: string | null
          id: string
          parent_id?: string | null
          responsavel_id?: string | null
          tipo: string
          updated_at?: string
          updated_by?: string | null
          visibilidade?: string
        }
        Update: {
          area_id?: string
          compartilhado_com?: string[]
          convidados?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          parent_id?: string | null
          responsavel_id?: string | null
          tipo?: string
          updated_at?: string
          updated_by?: string | null
          visibilidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "objetos_acesso_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objetos_acesso_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "objetos_acesso"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objetos_acesso_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_settings: {
        Row: {
          config: Json
          created_at: string
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          config?: Json
          created_at?: string
          id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          area_id: string
          created_at: string
          created_by: string | null
          data: Json
          id: string
          nome: string
          orcamento: number
          prioridade: number
          responsavel: string
          responsavel_id: string | null
          saude: string
          score: number
          status: string
          tipo: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          area_id: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome: string
          orcamento?: number
          prioridade?: number
          responsavel?: string
          responsavel_id?: string | null
          saude?: string
          score?: number
          status?: string
          tipo?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          area_id?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome?: string
          orcamento?: number
          prioridade?: number
          responsavel?: string
          responsavel_id?: string | null
          saude?: string
          score?: number
          status?: string
          tipo?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ppm_papeis: {
        Row: {
          created_at: string
          id: string
          papel: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          papel: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          papel?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ppm_papeis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ppm_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ppm_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          job_title: string
          preferences: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email: string
          id: string
          job_title?: string
          preferences?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          job_title?: string
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      programa_metas: {
        Row: {
          alvo: number
          atual: number
          created_at: string
          created_by: string | null
          data: Json
          id: string
          nome: string
          prazo: string | null
          programa_id: string
          unidade: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alvo?: number
          atual?: number
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome: string
          prazo?: string | null
          programa_id: string
          unidade?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alvo?: number
          atual?: number
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome?: string
          prazo?: string | null
          programa_id?: string
          unidade?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programa_metas_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programa_metas_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "totais_programa"
            referencedColumns: ["id"]
          },
        ]
      }
      programas: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          gerente: string
          gerente_id: string | null
          id: string
          nome: string
          objetivo: string
          portfolio_id: string
          saude: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          gerente?: string
          gerente_id?: string | null
          id?: string
          nome: string
          objetivo?: string
          portfolio_id: string
          saude?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          gerente?: string
          gerente_id?: string | null
          id?: string
          nome?: string
          objetivo?: string
          portfolio_id?: string
          saude?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programas_gerente_id_fkey"
            columns: ["gerente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programas_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programas_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "totais_portfolio"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_atualizacoes: {
        Row: {
          alvo_id: string
          alvo_tipo: string
          autor: string
          created_at: string
          created_by: string | null
          data: Json
          id: string
          projeto_id: string
          texto: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alvo_id: string
          alvo_tipo: string
          autor?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          projeto_id: string
          texto: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alvo_id?: string
          alvo_tipo?: string
          autor?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          projeto_id?: string
          texto?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_atualizacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_elementos: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          id: string
          nome: string
          prazo: string | null
          progresso: number
          projeto_id: string
          responsavel: string
          responsavel_id: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome: string
          prazo?: string | null
          progresso?: number
          projeto_id: string
          responsavel?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          nome?: string
          prazo?: string | null
          progresso?: number
          projeto_id?: string
          responsavel?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_elementos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_elementos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_subelementos: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          elemento_id: string
          id: string
          nome: string
          prazo: string | null
          progresso: number
          projeto_id: string
          responsavel: string
          responsavel_id: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          elemento_id: string
          id?: string
          nome: string
          prazo?: string | null
          progresso?: number
          projeto_id: string
          responsavel?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          elemento_id?: string
          id?: string
          nome?: string
          prazo?: string | null
          progresso?: number
          projeto_id?: string
          responsavel?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_subelementos_elemento_id_fkey"
            columns: ["elemento_id"]
            isOneToOne: false
            referencedRelation: "projeto_elementos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_subelementos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_subelementos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_tarefas: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json
          fim: string | null
          id: string
          inicio: string | null
          pontos: number
          progresso: number
          projeto_id: string
          responsavel: string
          responsavel_id: string | null
          status: string
          titulo: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json
          fim?: string | null
          id?: string
          inicio?: string | null
          pontos?: number
          progresso?: number
          projeto_id: string
          responsavel?: string
          responsavel_id?: string | null
          status?: string
          titulo: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json
          fim?: string | null
          id?: string
          inicio?: string | null
          pontos?: number
          progresso?: number
          projeto_id?: string
          responsavel?: string
          responsavel_id?: string | null
          status?: string
          titulo?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_tarefas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos: {
        Row: {
          created_at: string
          created_by: string | null
          criterios_aceite: string
          data: Json
          escopo: string
          executado: number
          fim: string | null
          gerente: string
          gerente_id: string | null
          id: string
          inicio: string | null
          metodologia: string
          nome: string
          orcamento: number
          programa_id: string
          progresso: number
          saude: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          criterios_aceite?: string
          data?: Json
          escopo?: string
          executado?: number
          fim?: string | null
          gerente?: string
          gerente_id?: string | null
          id?: string
          inicio?: string | null
          metodologia?: string
          nome: string
          orcamento?: number
          programa_id: string
          progresso?: number
          saude?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          criterios_aceite?: string
          data?: Json
          escopo?: string
          executado?: number
          fim?: string | null
          gerente?: string
          gerente_id?: string | null
          id?: string
          inicio?: string | null
          metodologia?: string
          nome?: string
          orcamento?: number
          programa_id?: string
          progresso?: number
          saude?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projetos_gerente_id_fkey"
            columns: ["gerente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projetos_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "totais_programa"
            referencedColumns: ["id"]
          },
        ]
      }
      risco_planos: {
        Row: {
          acao: string
          created_at: string
          created_by: string | null
          data: Json
          id: string
          prazo: string | null
          responsavel: string
          responsavel_id: string | null
          risco_id: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          prazo?: string | null
          responsavel?: string
          responsavel_id?: string | null
          risco_id: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          prazo?: string | null
          responsavel?: string
          responsavel_id?: string | null
          risco_id?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risco_planos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risco_planos_risco_id_fkey"
            columns: ["risco_id"]
            isOneToOne: false
            referencedRelation: "riscos"
            referencedColumns: ["id"]
          },
        ]
      }
      riscos: {
        Row: {
          area_id: string
          categoria: string
          created_at: string
          created_by: string | null
          data: Json
          id: string
          impacto: number
          nome: string
          origem: string
          origem_id: string | null
          prazo: string | null
          probabilidade: number
          responsavel: string
          responsavel_id: string | null
          resposta: string
          severidade: number | null
          status: string
          tendencia: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          area_id: string
          categoria?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          impacto?: number
          nome: string
          origem?: string
          origem_id?: string | null
          prazo?: string | null
          probabilidade?: number
          responsavel?: string
          responsavel_id?: string | null
          resposta?: string
          severidade?: number | null
          status?: string
          tendencia?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          area_id?: string
          categoria?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          impacto?: number
          nome?: string
          origem?: string
          origem_id?: string | null
          prazo?: string | null
          probabilidade?: number
          responsavel?: string
          responsavel_id?: string | null
          resposta?: string
          severidade?: number | null
          status?: string
          tendencia?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "riscos_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "riscos_origem_id_fkey"
            columns: ["origem_id"]
            isOneToOne: false
            referencedRelation: "objetos_acesso"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "riscos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          context: Json
          created_at: string
          entity_id: string | null
          entity_type: string
          event_type: string
          id: string
          result: string
          session_reference: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          entity_id?: string | null
          entity_type: string
          event_type: string
          id?: string
          result?: string
          session_reference?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          event_type?: string
          id?: string
          result?: string
          session_reference?: string | null
          user_id?: string
        }
        Relationships: []
      }
      status_reports: {
        Row: {
          autor: string
          created_at: string
          created_by: string | null
          data: Json
          id: string
          periodo: string
          pontos_atencao: string
          projeto_id: string
          proximos_passos: string
          realizacoes: string
          resumo: string
          saude: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          autor?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          periodo: string
          pontos_atencao?: string
          projeto_id: string
          proximos_passos?: string
          realizacoes?: string
          resumo?: string
          saude?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          autor?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          periodo?: string
          pontos_atencao?: string
          projeto_id?: string
          proximos_passos?: string
          realizacoes?: string
          resumo?: string
          saude?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_reports_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_acceptances: {
        Row: {
          accepted_at: string
          id: string
          terms_version: string
          user_agent_category: string
          user_id: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          terms_version: string
          user_agent_category?: string
          user_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          terms_version?: string
          user_agent_category?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      views_usuario: {
        Row: {
          areas: string[]
          blocos: string[]
          created_at: string
          created_by: string | null
          escopo: string
          id: string
          nome: string
          perfis: string[]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          areas?: string[]
          blocos?: string[]
          created_at?: string
          created_by?: string | null
          escopo: string
          id?: string
          nome: string
          perfis?: string[]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Update: {
          areas?: string[]
          blocos?: string[]
          created_at?: string
          created_by?: string | null
          escopo?: string
          id?: string
          nome?: string
          perfis?: string[]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "views_usuario_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      totais_institucionais: {
        Row: {
          executado: number | null
          orcamento: number | null
          portfolios: number | null
          programas: number | null
          progresso: number | null
          projetos: number | null
          riscos_criticos: number | null
        }
        Relationships: []
      }
      totais_portfolio: {
        Row: {
          executado: number | null
          id: string | null
          orcamento_projetos: number | null
          programas: number | null
          progresso: number | null
          projetos: number | null
          riscos_criticos: number | null
        }
        Relationships: []
      }
      totais_programa: {
        Row: {
          executado: number | null
          id: string | null
          orcamento: number | null
          progresso: number | null
          projetos: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_public_portal_settings: { Args: never; Returns: Json }
      ppm_alterar_acesso: {
        Args: { objeto: string; parcial: Json }
        Returns: undefined
      }
      ppm_ativo: { Args: never; Returns: boolean }
      ppm_editar_filho: { Args: { p: string; r: string }; Returns: boolean }
      ppm_membro: { Args: { a: string }; Returns: boolean }
      ppm_mutar: {
        Args: { acao: string; dados: Json; tabela: string }
        Returns: string
      }
      ppm_pode_editar: { Args: { o: string }; Returns: boolean }
      ppm_pode_ver: { Args: { o: string }; Returns: boolean }
      ppm_snapshot: { Args: never; Returns: Json }
      ppm_tem_papel: { Args: { p: string }; Returns: boolean }
      ppm_ver_area: { Args: { a: string }; Returns: boolean }
    }
    Enums: {
      app_role: "superadmin" | "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["superadmin", "admin", "moderator", "user"],
    },
  },
} as const
