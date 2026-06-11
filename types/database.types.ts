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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          assessment_score: number
          assessment_type: string
          benchmark_position: string | null
          budget_range: string
          created_at: string
          finish_level: string | null
          id: string
          is_current: boolean
          land_type: string | null
          lead_id: string
          location: string | null
          postcode: string | null
          potential_savings_max: number | null
          potential_savings_min: number | null
          project_stage: string
          project_subtype: string | null
          project_type: string
          recommended_actions_count: number | null
          risk_count: number | null
          state: string | null
          suburb: string | null
          updated_at: string
          uploaded_quote_url: string | null
          user_id: string | null
        }
        Insert: {
          assessment_score?: number
          assessment_type?: string
          benchmark_position?: string | null
          budget_range: string
          created_at?: string
          finish_level?: string | null
          id?: string
          is_current?: boolean
          land_type?: string | null
          lead_id: string
          location?: string | null
          postcode?: string | null
          potential_savings_max?: number | null
          potential_savings_min?: number | null
          project_stage: string
          project_subtype?: string | null
          project_type: string
          recommended_actions_count?: number | null
          risk_count?: number | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
          uploaded_quote_url?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_score?: number
          assessment_type?: string
          benchmark_position?: string | null
          budget_range?: string
          created_at?: string
          finish_level?: string | null
          id?: string
          is_current?: boolean
          land_type?: string | null
          lead_id?: string
          location?: string | null
          postcode?: string | null
          potential_savings_max?: number | null
          potential_savings_min?: number | null
          project_stage?: string
          project_subtype?: string | null
          project_type?: string
          recommended_actions_count?: number | null
          risk_count?: number | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
          uploaded_quote_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      buildcheck_findings: {
        Row: {
          buildcheck_id: string
          created_at: string
          description: string | null
          finding_type: string
          id: string
          order_index: number | null
          recommendation: string | null
          severity: string
          title: string
        }
        Insert: {
          buildcheck_id: string
          created_at?: string
          description?: string | null
          finding_type: string
          id?: string
          order_index?: number | null
          recommendation?: string | null
          severity?: string
          title: string
        }
        Update: {
          buildcheck_id?: string
          created_at?: string
          description?: string | null
          finding_type?: string
          id?: string
          order_index?: number | null
          recommendation?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "buildcheck_findings_buildcheck_id_fkey"
            columns: ["buildcheck_id"]
            isOneToOne: false
            referencedRelation: "buildchecks"
            referencedColumns: ["id"]
          },
        ]
      }
      buildchecks: {
        Row: {
          buildcheck_status: Database["public"]["Enums"]["buildcheck_status"]
          builder_name: string | null
          completed_at: string | null
          created_at: string
          id: string
          lead_id: string | null
          notes: string | null
          project_id: string | null
          quote_amount: number | null
          risk_level: string | null
          savings_max: number | null
          savings_min: number | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          buildcheck_status?: Database["public"]["Enums"]["buildcheck_status"]
          builder_name?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          project_id?: string | null
          quote_amount?: number | null
          risk_level?: string | null
          savings_max?: number | null
          savings_min?: number | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          buildcheck_status?: Database["public"]["Enums"]["buildcheck_status"]
          builder_name?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          project_id?: string | null
          quote_amount?: number | null
          risk_level?: string | null
          savings_max?: number | null
          savings_min?: number | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buildchecks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buildchecks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          activated_at: string
          client_status: string
          company_name: string | null
          created_at: string
          id: string
          lead_id: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string
          client_status?: string
          company_name?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string
          client_status?: string
          company_name?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          client_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          lead_id: string | null
          project_id: string | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          client_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          lead_id?: string | null
          project_id?: string | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          client_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          lead_id?: string | null
          project_id?: string | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string | null
          id: string
          is_active: boolean | null
          subject: string
          template_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          subject: string
          template_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string
          template_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget_range: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          lead_status: Database["public"]["Enums"]["lead_status"]
          location: string | null
          notes: string | null
          phone: string | null
          project_stage: string | null
          project_type: string | null
          source: string | null
          state: string | null
          suburb: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          lead_status?: Database["public"]["Enums"]["lead_status"]
          location?: string | null
          notes?: string | null
          phone?: string | null
          project_stage?: string | null
          project_type?: string | null
          source?: string | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          lead_status?: Database["public"]["Enums"]["lead_status"]
          location?: string | null
          notes?: string | null
          phone?: string | null
          project_stage?: string | null
          project_type?: string | null
          source?: string | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          meeting_id: string
          next_action: string | null
          notes: string | null
          outcome: string | null
          project_potential_rating: number | null
          recommended_services: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_id: string
          next_action?: string | null
          notes?: string | null
          outcome?: string | null
          project_potential_rating?: number | null
          recommended_services?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_id?: string
          next_action?: string | null
          notes?: string | null
          outcome?: string | null
          project_potential_rating?: number | null
          recommended_services?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_notes_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          calendly_event_id: string | null
          calendly_event_url: string | null
          client_id: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          lead_id: string | null
          meeting_type: string
          meeting_url: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          calendly_event_id?: string | null
          calendly_event_url?: string | null
          client_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          lead_id?: string | null
          meeting_type?: string
          meeting_url?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          calendly_event_id?: string | null
          calendly_event_url?: string | null
          client_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          lead_id?: string | null
          meeting_type?: string
          meeting_url?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          message_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          message_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          message_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          client_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          project_id: string | null
          sender_id: string
          subject: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          project_id?: string | null
          sender_id: string
          subject?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          project_id?: string | null
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_type?: Database["public"]["Enums"]["notification_type"]
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          proposal_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          proposal_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          proposal_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      project_timeline: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          milestone_description: string | null
          milestone_name: string
          order_index: number
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          milestone_description?: string | null
          milestone_name: string
          order_index?: number
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          milestone_description?: string | null
          milestone_name?: string
          order_index?: number
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_timeline_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assessment_id: string | null
          budget_range: string | null
          client_id: string
          completed_at: string | null
          confidence_score: number | null
          created_at: string
          finish_level: string | null
          id: string
          lead_id: string | null
          location: string | null
          notes: string | null
          postcode: string | null
          project_name: string
          project_stage: string | null
          project_status: Database["public"]["Enums"]["project_status"]
          project_type: string | null
          service_id: string | null
          started_at: string | null
          state: string | null
          suburb: string | null
          updated_at: string
        }
        Insert: {
          assessment_id?: string | null
          budget_range?: string | null
          client_id: string
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          finish_level?: string | null
          id?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          postcode?: string | null
          project_name: string
          project_stage?: string | null
          project_status?: Database["public"]["Enums"]["project_status"]
          project_type?: string | null
          service_id?: string | null
          started_at?: string | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
        }
        Update: {
          assessment_id?: string | null
          budget_range?: string | null
          client_id?: string
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          finish_level?: string | null
          id?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          postcode?: string | null
          project_name?: string
          project_stage?: string | null
          project_status?: Database["public"]["Enums"]["project_status"]
          project_type?: string | null
          service_id?: string | null
          started_at?: string | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_name: string
          order_index: number | null
          proposal_id: string
          quantity: number
          service_catalog_id: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_name: string
          order_index?: number | null
          proposal_id: string
          quantity?: number
          service_catalog_id?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_name?: string
          order_index?: number | null
          proposal_id?: string
          quantity?: number
          service_catalog_id?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_items_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_items_service_catalog_id_fkey"
            columns: ["service_catalog_id"]
            isOneToOne: false
            referencedRelation: "service_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          approved_at: string | null
          client_id: string | null
          created_at: string
          declined_at: string | null
          expired_at: string | null
          id: string
          is_archived: boolean
          lead_id: string | null
          notes: string | null
          paid_at: string | null
          payment_instructions: string | null
          project_id: string | null
          recipient_email: string | null
          recipient_name: string | null
          sent_at: string | null
          service_slug: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          terms: string | null
          title: string
          total_amount: number
          updated_at: string
          valid_until: string | null
          viewed_at: string | null
        }
        Insert: {
          approved_at?: string | null
          client_id?: string | null
          created_at?: string
          declined_at?: string | null
          expired_at?: string | null
          id?: string
          is_archived?: boolean
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_instructions?: string | null
          project_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          sent_at?: string | null
          service_slug?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          terms?: string | null
          title: string
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Update: {
          approved_at?: string | null
          client_id?: string | null
          created_at?: string
          declined_at?: string | null
          expired_at?: string | null
          id?: string
          is_archived?: boolean
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_instructions?: string | null
          project_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          sent_at?: string | null
          service_slug?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          terms?: string | null
          title?: string
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_user_id: string | null
          referrer_client_id: string | null
          reward_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_user_id?: string | null
          referrer_client_id?: string | null
          reward_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_user_id?: string | null
          referrer_client_id?: string | null
          reward_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_client_id_fkey"
            columns: ["referrer_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          buildcheck_id: string | null
          created_at: string
          generated_at: string | null
          id: string
          project_id: string
          report_type: string
          storage_path: string | null
          title: string
        }
        Insert: {
          buildcheck_id?: string | null
          created_at?: string
          generated_at?: string | null
          id?: string
          project_id: string
          report_type: string
          storage_path?: string | null
          title: string
        }
        Update: {
          buildcheck_id?: string | null
          created_at?: string
          generated_at?: string | null
          id?: string
          project_id?: string
          report_type?: string
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_buildcheck_id_fkey"
            columns: ["buildcheck_id"]
            isOneToOne: false
            referencedRelation: "buildchecks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      service_catalog: {
        Row: {
          created_at: string
          default_price: number
          description: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          service_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_price?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          service_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_price?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_recommendations: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          payment_status: string
          recommendation_note: string | null
          recommended_by: string | null
          service_id: string
          stripe_checkout_url: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          payment_status?: string
          recommendation_note?: string | null
          recommended_by?: string | null
          service_id: string
          stripe_checkout_url?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          payment_status?: string
          recommendation_note?: string | null
          recommended_by?: string | null
          service_id?: string
          stripe_checkout_url?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_recommendations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_recommendations_recommended_by_fkey"
            columns: ["recommended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_recommendations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          inclusions: Json
          is_active: boolean
          name: string
          price: number | null
          slug: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          inclusions?: Json
          is_active?: boolean
          name: string
          price?: number | null
          slug: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          inclusions?: Json
          is_active?: boolean
          name?: string
          price?: number | null
          slug?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          project_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          notification_email: boolean | null
          notification_sms: boolean | null
          phone: string | null
          postcode: string | null
          state: string | null
          suburb: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          notification_email?: boolean | null
          notification_sms?: boolean | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          notification_email?: boolean | null
          notification_sms?: boolean | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          suburb?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      buildcheck_status: "pending" | "reviewing" | "completed"
      document_category:
        | "builder_quotes"
        | "contracts"
        | "plans"
        | "photos"
        | "reports"
        | "council_documents"
        | "other"
      lead_status:
        | "new"
        | "assessment_completed"
        | "call_booked"
        | "call_completed"
        | "qualified"
        | "not_qualified"
        | "client_approved"
        | "closed"
        | "assessment_started"
        | "preliminary_assessment_completed"
        | "converted"
        | "lost"
      notification_type:
        | "lead_created"
        | "assessment_completed"
        | "call_booked"
        | "proposal_sent"
        | "proposal_approved"
        | "payment_received"
        | "document_uploaded"
        | "message_received"
        | "meeting_booked"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      project_status:
        | "planning"
        | "pre_construction"
        | "in_construction"
        | "on_hold"
        | "completed"
        | "cancelled"
        | "paid"
        | "onboarding_started"
        | "information_submitted"
        | "eduardo_reviewing"
        | "report_in_progress"
      proposal_status:
        | "draft"
        | "sent"
        | "viewed"
        | "approved"
        | "declined"
        | "expired"
        | "paid"
      user_role: "lead" | "client" | "admin"
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
      buildcheck_status: ["pending", "reviewing", "completed"],
      document_category: [
        "builder_quotes",
        "contracts",
        "plans",
        "photos",
        "reports",
        "council_documents",
        "other",
      ],
      lead_status: [
        "new",
        "assessment_completed",
        "call_booked",
        "call_completed",
        "qualified",
        "not_qualified",
        "client_approved",
        "closed",
        "assessment_started",
        "preliminary_assessment_completed",
        "converted",
        "lost",
      ],
      notification_type: [
        "lead_created",
        "assessment_completed",
        "call_booked",
        "proposal_sent",
        "proposal_approved",
        "payment_received",
        "document_uploaded",
        "message_received",
        "meeting_booked",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      project_status: [
        "planning",
        "pre_construction",
        "in_construction",
        "on_hold",
        "completed",
        "cancelled",
        "paid",
        "onboarding_started",
        "information_submitted",
        "eduardo_reviewing",
        "report_in_progress",
      ],
      proposal_status: [
        "draft",
        "sent",
        "viewed",
        "approved",
        "declined",
        "expired",
        "paid",
      ],
      user_role: ["lead", "client", "admin"],
    },
  },
} as const
