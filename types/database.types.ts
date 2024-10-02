export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "(deprecated) agent_tool": {
        Row: {
          agent_id: number
          created_at: string
          id: number
          tool_id: number
        }
        Insert: {
          agent_id: number
          created_at?: string
          id?: number
          tool_id: number
        }
        Update: {
          agent_id?: number
          created_at?: string
          id?: number
          tool_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_tool_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tool_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tool"
            referencedColumns: ["id"]
          },
        ]
      }
      "(deprecated) llm_api_key": {
        Row: {
          agent_id: number | null
          api_key_id: number
          created_at: string
          crew_id: number | null
          id: number
          llm_id: number
        }
        Insert: {
          agent_id?: number | null
          api_key_id: number
          created_at?: string
          crew_id?: number | null
          id?: number
          llm_id: number
        }
        Update: {
          agent_id?: number | null
          api_key_id?: number
          created_at?: string
          crew_id?: number | null
          id?: number
          llm_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "llm_api_key_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_api_key_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_api_key_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_api_key_llm_id_fkey"
            columns: ["llm_id"]
            isOneToOne: false
            referencedRelation: "llm"
            referencedColumns: ["id"]
          },
        ]
      }
      agent: {
        Row: {
          backstory: string | null
          created_at: string
          crew_id: number | null
          goal: string | null
          id: number
          is_deleted: boolean
          llm_id: number | null
          name: string | null
          role: string | null
          tool_ids: number[] | null
        }
        Insert: {
          backstory?: string | null
          created_at?: string
          crew_id?: number | null
          goal?: string | null
          id?: number
          is_deleted?: boolean
          llm_id?: number | null
          name?: string | null
          role?: string | null
          tool_ids?: number[] | null
        }
        Update: {
          backstory?: string | null
          created_at?: string
          crew_id?: number | null
          goal?: string | null
          id?: number
          is_deleted?: boolean
          llm_id?: number | null
          name?: string | null
          role?: string | null
          tool_ids?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_llm_id_fkey"
            columns: ["llm_id"]
            isOneToOne: false
            referencedRelation: "llm"
            referencedColumns: ["id"]
          },
        ]
      }
      api_key: {
        Row: {
          created_at: string
          id: number
          llm_provider_id: number
          name: string | null
          updated_at: string
          user_id: number | null
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          llm_provider_id: number
          name?: string | null
          updated_at?: string
          user_id?: number | null
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          llm_provider_id?: number
          name?: string | null
          updated_at?: string
          user_id?: number | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_key_llm_provider_id_fkey"
            columns: ["llm_provider_id"]
            isOneToOne: false
            referencedRelation: "llm_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_key_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      chat: {
        Row: {
          created_at: string
          employed_crew_id: number
          id: number
          is_deleted: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employed_crew_id: number
          id?: number
          is_deleted?: boolean | null
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employed_crew_id?: number
          id?: number
          is_deleted?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_employed_crew_id_fkey"
            columns: ["employed_crew_id"]
            isOneToOne: false
            referencedRelation: "employed_crew"
            referencedColumns: ["id"]
          },
        ]
      }
      country: {
        Row: {
          code: string | null
          continent_name: string | null
          id: number
          name: string | null
        }
        Insert: {
          code?: string | null
          continent_name?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          code?: string | null
          continent_name?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      crew: {
        Row: {
          average_token_usage: number | null
          created_at: string
          description: string | null
          detail: string | null
          image: string | null
          greeting: string | null
          id: number
          input_price: number | null
          is_deleted: boolean
          is_sequential: boolean | null
          llm_id: number | null
          name: string
          output_price: number | null
          pre_questions: string[] | null
          status: string
          tags: string[] | null
          task_ids: number[] | null
          updated_at: string
          usage: number | null
          use_history: boolean | null
          user_id: number | null
        }
        Insert: {
          average_token_usage?: number | null
          created_at?: string
          description?: string | null
          detail?: string | null
          image?: string | null
          greeting?: string | null
          id?: number
          input_price?: number | null
          is_deleted?: boolean
          is_sequential?: boolean | null
          llm_id?: number | null
          name?: string
          output_price?: number | null
          pre_questions?: string[] | null
          status?: string
          tags?: string[] | null
          task_ids?: number[] | null
          updated_at?: string
          usage?: number | null
          use_history?: boolean | null
          user_id?: number | null
        }
        Update: {
          average_token_usage?: number | null
          created_at?: string
          description?: string | null
          detail?: string | null
          image?: string | null
          greeting?: string | null
          id?: number
          input_price?: number | null
          is_deleted?: boolean
          is_sequential?: boolean | null
          llm_id?: number | null
          name?: string
          output_price?: number | null
          pre_questions?: string[] | null
          status?: string
          tags?: string[] | null
          task_ids?: number[] | null
          updated_at?: string
          usage?: number | null
          use_history?: boolean | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_llm_id_fkey"
            columns: ["llm_id"]
            isOneToOne: false
            referencedRelation: "llm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      cycle: {
        Row: {
          chat_id: number | null
          cost: number | null
          created_at: string
          execution_id: string | null
          id: number
          price: number | null
          status: string
          thread_id: string | null
          total_token: number | null
        }
        Insert: {
          chat_id?: number | null
          cost?: number | null
          created_at?: string
          execution_id?: string | null
          id?: number
          price?: number | null
          status?: string
          thread_id?: string | null
          total_token?: number | null
        }
        Update: {
          chat_id?: number | null
          cost?: number | null
          created_at?: string
          execution_id?: string | null
          id?: number
          price?: number | null
          status?: string
          thread_id?: string | null
          total_token?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cycle_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
        ]
      }
      employed_crew: {
        Row: {
          created_at: string
          crew_id: number
          id: number
          is_deleted: boolean
          is_favorite: boolean
          is_owner: boolean
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          crew_id: number
          id?: number
          is_deleted?: boolean
          is_favorite?: boolean
          is_owner?: boolean
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          crew_id?: number
          id?: number
          is_deleted?: boolean
          is_favorite?: boolean
          is_owner?: boolean
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "employed_crew_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employed_crew_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      llm: {
        Row: {
          created_at: string
          description: string | null
          detail: string | null
          id: number
          input_price: number | null
          is_popular: boolean
          llm_provider_id: number
          name: string
          output_price: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          detail?: string | null
          id?: number
          input_price?: number | null
          is_popular?: boolean
          llm_provider_id: number
          name: string
          output_price?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          detail?: string | null
          id?: number
          input_price?: number | null
          is_popular?: boolean
          llm_provider_id?: number
          name?: string
          output_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "llm_llm_provider_id_fkey"
            columns: ["llm_provider_id"]
            isOneToOne: false
            referencedRelation: "llm_provider"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_provider: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      message: {
        Row: {
          agent_id: number | null
          chat_id: number
          content: string | null
          cost: number | null
          created_at: string
          cycle_id: number | null
          id: number
          input_token: number | null
          output_token: number | null
          role: string | null
          task_id: number | null
          type: string | null
        }
        Insert: {
          agent_id?: number | null
          chat_id: number
          content?: string | null
          cost?: number | null
          created_at?: string
          cycle_id?: number | null
          id?: number
          input_token?: number | null
          output_token?: number | null
          role?: string | null
          task_id?: number | null
          type?: string | null
        }
        Update: {
          agent_id?: number | null
          chat_id?: number
          content?: string | null
          cost?: number | null
          created_at?: string
          cycle_id?: number | null
          id?: number
          input_token?: number | null
          output_token?: number | null
          role?: string | null
          task_id?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "published_agent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "published_task"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          coin: number | null
          country_id: number | null
          created_at: string
          email: string | null
          id: number
          image: string | null
          is_deleted: boolean
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coin?: number | null
          country_id?: number | null
          created_at?: string
          email?: string | null
          id?: number
          image?: string | null
          is_deleted?: boolean
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coin?: number | null
          country_id?: number | null
          created_at?: string
          email?: string | null
          id?: number
          image?: string | null
          is_deleted?: boolean
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      published_agent: {
        Row: {
          backstory: string | null
          created_at: string
          goal: string | null
          id: number
          is_deleted: boolean
          llm_id: number | null
          name: string | null
          published_crew_id: number | null
          role: string | null
          tool_ids: number[] | null
        }
        Insert: {
          backstory?: string | null
          created_at?: string
          goal?: string | null
          id?: number
          is_deleted?: boolean
          llm_id?: number | null
          name?: string | null
          published_crew_id?: number | null
          role?: string | null
          tool_ids?: number[] | null
        }
        Update: {
          backstory?: string | null
          created_at?: string
          goal?: string | null
          id?: number
          is_deleted?: boolean
          llm_id?: number | null
          name?: string | null
          published_crew_id?: number | null
          role?: string | null
          tool_ids?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "published_agent_llm_id_fkey"
            columns: ["llm_id"]
            isOneToOne: false
            referencedRelation: "llm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_agent_published_crew_id_fkey"
            columns: ["published_crew_id"]
            isOneToOne: false
            referencedRelation: "published_crew"
            referencedColumns: ["id"]
          },
        ]
      }
      published_crew: {
        Row: {
          average_token_usage: number | null
          created_at: string
          crew_id: number | null
          description: string | null
          greeting: string | null
          id: number
          input_price: number | null
          is_deleted: boolean
          is_sequential: boolean | null
          llm_id: number | null
          name: string
          output_price: number | null
          pre_questions: string[] | null
          published_task_ids: number[] | null
          status: string
          tags: string[] | null
          updated_at: string
          usage: number | null
          use_history: boolean | null
          user_id: number | null
        }
        Insert: {
          average_token_usage?: number | null
          created_at?: string
          crew_id?: number | null
          description?: string | null
          greeting?: string | null
          id?: number
          input_price?: number | null
          is_deleted?: boolean
          is_sequential?: boolean | null
          llm_id?: number | null
          name?: string
          output_price?: number | null
          pre_questions?: string[] | null
          published_task_ids?: number[] | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          usage?: number | null
          use_history?: boolean | null
          user_id?: number | null
        }
        Update: {
          average_token_usage?: number | null
          created_at?: string
          crew_id?: number | null
          description?: string | null
          greeting?: string | null
          id?: number
          input_price?: number | null
          is_deleted?: boolean
          is_sequential?: boolean | null
          llm_id?: number | null
          name?: string
          output_price?: number | null
          pre_questions?: string[] | null
          published_task_ids?: number[] | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          usage?: number | null
          use_history?: boolean | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "published_crew_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_crew_llm_id_fkey"
            columns: ["llm_id"]
            isOneToOne: false
            referencedRelation: "llm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_crew_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      published_task: {
        Row: {
          context_published_task_ids: number[] | null
          created_at: string
          description: string | null
          expected_output: string | null
          id: number
          is_deleted: boolean
          name: string
          published_agent_id: number | null
          published_crew_id: number | null
        }
        Insert: {
          context_published_task_ids?: number[] | null
          created_at?: string
          description?: string | null
          expected_output?: string | null
          id?: number
          is_deleted?: boolean
          name: string
          published_agent_id?: number | null
          published_crew_id?: number | null
        }
        Update: {
          context_published_task_ids?: number[] | null
          created_at?: string
          description?: string | null
          expected_output?: string | null
          id?: number
          is_deleted?: boolean
          name?: string
          published_agent_id?: number | null
          published_crew_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "published_task_published_agent_id_fkey"
            columns: ["published_agent_id"]
            isOneToOne: false
            referencedRelation: "published_agent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_task_published_crew_id_fkey"
            columns: ["published_crew_id"]
            isOneToOne: false
            referencedRelation: "published_crew"
            referencedColumns: ["id"]
          },
        ]
      }
      published_task_context: {
        Row: {
          child_task_id: number | null
          created_at: string
          id: number
          parent_task_id: number | null
        }
        Insert: {
          child_task_id?: number | null
          created_at?: string
          id?: number
          parent_task_id?: number | null
        }
        Update: {
          child_task_id?: number | null
          created_at?: string
          id?: number
          parent_task_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "published_task_context_child_task_id_fkey"
            columns: ["child_task_id"]
            isOneToOne: false
            referencedRelation: "published_task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_task_context_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "published_task"
            referencedColumns: ["id"]
          },
        ]
      }
      task: {
        Row: {
          agent_id: number | null
          context_task_ids: number[] | null
          created_at: string
          crew_id: number
          description: string | null
          expected_output: string | null
          id: number
          is_deleted: boolean
          name: string
        }
        Insert: {
          agent_id?: number | null
          context_task_ids?: number[] | null
          created_at?: string
          crew_id: number
          description?: string | null
          expected_output?: string | null
          id?: number
          is_deleted?: boolean
          name: string
        }
        Update: {
          agent_id?: number | null
          context_task_ids?: number[] | null
          created_at?: string
          crew_id?: number
          description?: string | null
          expected_output?: string | null
          id?: number
          is_deleted?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["id"]
          },
        ]
      }
      task_context: {
        Row: {
          child_task_id: number | null
          created_at: string
          id: number
          parent_task_id: number | null
        }
        Insert: {
          child_task_id?: number | null
          created_at?: string
          id?: number
          parent_task_id?: number | null
        }
        Update: {
          child_task_id?: number | null
          created_at?: string
          id?: number
          parent_task_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_context_child_task_id_fkey"
            columns: ["child_task_id"]
            isOneToOne: false
            referencedRelation: "task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_context_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "task"
            referencedColumns: ["id"]
          },
        ]
      }
      test_item: {
        Row: {
          created_at: string
          id: number
          test_data: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          test_data?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          test_data?: string | null
        }
        Relationships: []
      }
      tool: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_deleted: boolean
          key: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_deleted?: boolean
          key: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_deleted?: boolean
          key?: string
          name?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          coin: number | null
          country_id: number | null
          created_at: string
          email: string | null
          id: number
          image: string | null
          is_deleted: boolean
          name: string | null
          updated_at: string
        }
        Insert: {
          coin?: number | null
          country_id?: number | null
          created_at?: string
          email?: string | null
          id?: number
          image?: string | null
          is_deleted?: boolean
          name?: string | null
          updated_at?: string
        }
        Update: {
          coin?: number | null
          country_id?: number | null
          created_at?: string
          email?: string | null
          id?: number
          image?: string | null
          is_deleted?: boolean
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
