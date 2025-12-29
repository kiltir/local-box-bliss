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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      box_banners: {
        Row: {
          box_id: number
          created_at: string
          id: string
          is_active: boolean
          message: string
          message_2: string
          updated_at: string
        }
        Insert: {
          box_id: number
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string
          message_2?: string
          updated_at?: string
        }
        Update: {
          box_id?: number
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string
          message_2?: string
          updated_at?: string
        }
        Relationships: []
      }
      box_images: {
        Row: {
          box_id: number
          created_at: string
          display_order: number
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          box_id: number
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          box_id?: number
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      box_prices: {
        Row: {
          box_id: number
          created_at: string
          id: string
          subscription_12_months_price: number
          subscription_6_months_price: number
          theme: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          box_id: number
          created_at?: string
          id?: string
          subscription_12_months_price?: number
          subscription_6_months_price?: number
          theme: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          box_id?: number
          created_at?: string
          id?: string
          subscription_12_months_price?: number
          subscription_6_months_price?: number
          theme?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      box_products: {
        Row: {
          box_id: number
          created_at: string
          description: string | null
          dimension_depth: number | null
          dimension_height: number | null
          dimension_width: number | null
          display_order: number | null
          id: string
          image_url: string | null
          name: string
          producer: string
          quantity: string
          theme: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          box_id: number
          created_at?: string
          description?: string | null
          dimension_depth?: number | null
          dimension_height?: number | null
          dimension_width?: number | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name: string
          producer: string
          quantity: string
          theme: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          box_id?: number
          created_at?: string
          description?: string | null
          dimension_depth?: number | null
          dimension_height?: number | null
          dimension_width?: number | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name?: string
          producer?: string
          quantity?: string
          theme?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      box_reviews: {
        Row: {
          box_id: number
          comment: string | null
          created_at: string
          id: string
          is_featured: boolean
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          box_id: number
          comment?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          box_id?: number
          comment?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      box_stock: {
        Row: {
          available_stock: number
          box_id: number
          created_at: string
          id: string
          safety_stock: number
          theme: string
          updated_at: string
        }
        Insert: {
          available_stock?: number
          box_id: number
          created_at?: string
          id?: string
          safety_stock?: number
          theme: string
          updated_at?: string
        }
        Update: {
          available_stock?: number
          box_id?: number
          created_at?: string
          id?: string
          safety_stock?: number
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_rate_limits: {
        Row: {
          id: string
          identifier: string
          last_submission: string | null
          submission_count: number | null
          window_start: string | null
        }
        Insert: {
          id?: string
          identifier: string
          last_submission?: string | null
          submission_count?: number | null
          window_start?: string | null
        }
        Update: {
          id?: string
          identifier?: string
          last_submission?: string | null
          submission_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          status: string | null
          subject: string
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          status?: string | null
          subject: string
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          status?: string | null
          subject?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          box_type: string
          created_at: string
          id: string
          order_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          box_type: string
          created_at?: string
          id?: string
          order_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          box_type?: string
          created_at?: string
          id?: string
          order_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          arrival_date_reunion: string | null
          arrival_time_reunion: string | null
          billing_address_city: string | null
          billing_address_country: string | null
          billing_address_postal_code: string | null
          billing_address_street: string | null
          created_at: string
          date_preference: string | null
          delivery_preference: string | null
          departure_date_reunion: string | null
          departure_time_reunion: string | null
          id: string
          order_number: string
          shipping_address_city: string | null
          shipping_address_country: string | null
          shipping_address_postal_code: string | null
          shipping_address_street: string | null
          status: string
          time_preference: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          arrival_date_reunion?: string | null
          arrival_time_reunion?: string | null
          billing_address_city?: string | null
          billing_address_country?: string | null
          billing_address_postal_code?: string | null
          billing_address_street?: string | null
          created_at?: string
          date_preference?: string | null
          delivery_preference?: string | null
          departure_date_reunion?: string | null
          departure_time_reunion?: string | null
          id?: string
          order_number: string
          shipping_address_city?: string | null
          shipping_address_country?: string | null
          shipping_address_postal_code?: string | null
          shipping_address_street?: string | null
          status?: string
          time_preference?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          arrival_date_reunion?: string | null
          arrival_time_reunion?: string | null
          billing_address_city?: string | null
          billing_address_country?: string | null
          billing_address_postal_code?: string | null
          billing_address_street?: string | null
          created_at?: string
          date_preference?: string | null
          delivery_preference?: string | null
          departure_date_reunion?: string | null
          departure_time_reunion?: string | null
          id?: string
          order_number?: string
          shipping_address_city?: string | null
          shipping_address_country?: string | null
          shipping_address_postal_code?: string | null
          shipping_address_street?: string | null
          status?: string
          time_preference?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          raison_sociale: string
          secteur_activite: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          raison_sociale: string
          secteur_activite: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          raison_sociale?: string
          secteur_activite?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          billing_address_city: string | null
          billing_address_country: string | null
          billing_address_postal_code: string | null
          billing_address_street: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address_city?: string | null
          billing_address_country?: string | null
          billing_address_postal_code?: string | null
          billing_address_street?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address_city?: string | null
          billing_address_country?: string | null
          billing_address_postal_code?: string | null
          billing_address_street?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      supplier_application_photos: {
        Row: {
          application_id: string
          created_at: string
          id: string
          photo_url: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          photo_url: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_application_photos_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "supplier_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_applications: {
        Row: {
          activite: string
          admin_notes: string | null
          adresse: string
          code_postal: string
          created_at: string
          email: string
          id: string
          motivation: string
          nom: string
          produits: string
          raison_sociale: string
          siret: string
          source: string | null
          status: string
          telephone: string
          updated_at: string
          ville: string
        }
        Insert: {
          activite: string
          admin_notes?: string | null
          adresse: string
          code_postal: string
          created_at?: string
          email: string
          id?: string
          motivation: string
          nom: string
          produits: string
          raison_sociale: string
          siret: string
          source?: string | null
          status?: string
          telephone: string
          updated_at?: string
          ville: string
        }
        Update: {
          activite?: string
          admin_notes?: string | null
          adresse?: string
          code_postal?: string
          created_at?: string
          email?: string
          id?: string
          motivation?: string
          nom?: string
          produits?: string
          raison_sociale?: string
          siret?: string
          source?: string | null
          status?: string
          telephone?: string
          updated_at?: string
          ville?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_box_reviews: {
        Row: {
          box_id: number | null
          comment: string | null
          created_at: string | null
          id: string | null
          is_featured: boolean | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          box_id?: number | null
          comment?: string | null
          created_at?: string | null
          id?: string | null
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          box_id?: number | null
          comment?: string | null
          created_at?: string | null
          id?: string | null
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
