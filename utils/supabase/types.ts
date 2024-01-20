export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attendance: {
        Row: {
          attendee: string
          code_used: string
          created_at: string
          metadata: Json | null
          status: number
        }
        Insert: {
          attendee: string
          code_used: string
          created_at?: string
          metadata?: Json | null
          status?: number
        }
        Update: {
          attendee?: string
          code_used?: string
          created_at?: string
          metadata?: Json | null
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_attendee_fkey"
            columns: ["attendee"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_code_used_fkey"
            columns: ["code_used"]
            isOneToOne: false
            referencedRelation: "codes"
            referencedColumns: ["code"]
          }
        ]
      }
      attendees: {
        Row: {
          attendee: string
          metadata: Json
          with_code: string
        }
        Insert: {
          attendee: string
          metadata?: Json
          with_code: string
        }
        Update: {
          attendee?: string
          metadata?: Json
          with_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendees_attendee_fkey"
            columns: ["attendee"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendees_with_code_fkey"
            columns: ["with_code"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["code"]
          }
        ]
      }
      codes: {
        Row: {
          code: string
          created_at: string
          group: number
          metadata: Json
        }
        Insert: {
          code?: string
          created_at?: string
          group: number
          metadata?: Json
        }
        Update: {
          code?: string
          created_at?: string
          group?: number
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "codes_group_fkey"
            columns: ["group"]
            isOneToOne: true
            referencedRelation: "groups"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          admin: string
          code: string
          config: Json
          created_at: string
          id: number
          joinable: boolean
          metadata: Json
          name: string
          order: Json
        }
        Insert: {
          admin: string
          code?: string
          config?: Json
          created_at?: string
          id?: number
          joinable?: boolean
          metadata?: Json
          name: string
          order?: Json
        }
        Update: {
          admin?: string
          code?: string
          config?: Json
          created_at?: string
          id?: number
          joinable?: boolean
          metadata?: Json
          name?: string
          order?: Json
        }
        Relationships: [
          {
            foreignKeyName: "groups_admin_fkey"
            columns: ["admin"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          account_type: number
          email: string
          id: string
          username: string
        }
        Insert: {
          account_type: number
          email: string
          id: string
          username: string
        }
        Update: {
          account_type?: number
          email?: string
          id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      attendees_with_group: {
        Row: {
          attendee: string | null
          group: number | null
          metadata: Json | null
          with_code: string | null
        }
        Insert: {
          attendee?: string | null
          group?: never
          metadata?: Json | null
          with_code?: string | null
        }
        Update: {
          attendee?: string | null
          group?: never
          metadata?: Json | null
          with_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendees_attendee_fkey"
            columns: ["attendee"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendees_with_code_fkey"
            columns: ["with_code"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["code"]
          }
        ]
      }
    }
    Functions: {
      bool2str: {
        Args: {
          input_bool: boolean
        }
        Returns: string
      }
      delete_expired_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      end_session: {
        Args: {
          attendance_code: string
        }
        Returns: undefined
      }
      is_joinable: {
        Args: {
          join_code: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

