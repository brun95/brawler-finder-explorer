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
      brawler_stats: {
        Row: {
          battle_time: string
          brawler_id: number
          brawler_name: string
          game_mode: string
          id: number
          map_name: string
          player_tag: string
          recorded_at: string | null
          result: string
          trophies_change: number | null
        }
        Insert: {
          battle_time: string
          brawler_id: number
          brawler_name: string
          game_mode: string
          id?: number
          map_name: string
          player_tag: string
          recorded_at?: string | null
          result: string
          trophies_change?: number | null
        }
        Update: {
          battle_time?: string
          brawler_id?: number
          brawler_name?: string
          game_mode?: string
          id?: number
          map_name?: string
          player_tag?: string
          recorded_at?: string | null
          result?: string
          trophies_change?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brawler_stats_player_tag_fkey"
            columns: ["player_tag"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["tag"]
          },
        ]
      }
      player_battles: {
        Row: {
          battle_data: Json
          battle_time: string
          id: number
          player_tag: string
          recorded_at: string | null
        }
        Insert: {
          battle_data: Json
          battle_time: string
          id?: number
          player_tag: string
          recorded_at?: string | null
        }
        Update: {
          battle_data?: Json
          battle_time?: string
          id?: number
          player_tag?: string
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_battles_player_tag_fkey"
            columns: ["player_tag"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["tag"]
          },
        ]
      }
      player_trophies: {
        Row: {
          highest_trophies: number
          id: number
          player_tag: string
          recorded_at: string | null
          trophies: number
        }
        Insert: {
          highest_trophies: number
          id?: number
          player_tag: string
          recorded_at?: string | null
          trophies: number
        }
        Update: {
          highest_trophies?: number
          id?: number
          player_tag?: string
          recorded_at?: string | null
          trophies?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_trophies_player_tag_fkey"
            columns: ["player_tag"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["tag"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string | null
          id: number
          name: string
          tag: string
          visited_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          tag: string
          visited_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          tag?: string
          visited_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      store_player_data: {
        Args: {
          p_tag: string
          p_name: string
          p_trophies: number
          p_highest_trophies: number
          p_battles: Json
        }
        Returns: undefined
      }
      update_player_trophies_daily: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
