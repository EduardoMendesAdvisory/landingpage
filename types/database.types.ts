/**
 * Database types for the Eduardo Mendes Advisory Platform.
 *
 * IMPORTANT: This file is a hand-crafted placeholder.
 * After connecting Supabase, replace with generated types:
 *   npx supabase gen types typescript --project-id YOUR_ID > types/database.types.ts
 */

import type {
  UserRole,
  LeadStatus,
  ProjectStatus,
  ProposalStatus,
  PaymentStatus,
  BuildcheckStatus,
  DocumentCategory,
  NotificationType,
} from "./enums";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type WithRelationships<T extends { Row: any; Insert: any; Update: any }> = T & {
  Relationships: never[];
};

type TablesWithRelationships<
  T extends Record<string, { Row: any; Insert: any; Update: any }>
> = { [K in keyof T]: WithRelationships<T[K]> };

export interface Database {
  public: {
    Tables: TablesWithRelationships<{
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: UserRole;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          address: string | null;
          suburb: string | null;
          state: string | null;
          postcode: string | null;
          notification_email: boolean;
          notification_sms: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          address?: string | null;
          suburb?: string | null;
          state?: string | null;
          postcode?: string | null;
          notification_email?: boolean;
          notification_sms?: boolean;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          address?: string | null;
          suburb?: string | null;
          state?: string | null;
          postcode?: string | null;
          notification_email?: boolean;
          notification_sms?: boolean;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          lead_status: LeadStatus;
          project_type: string | null;
          project_stage: string | null;
          budget_range: string | null;
          location: string | null;
          source: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_status?: LeadStatus;
          project_type?: string | null;
          project_stage?: string | null;
          budget_range?: string | null;
          location?: string | null;
          source?: string | null;
          notes?: string | null;
        };
        Update: {
          lead_status?: LeadStatus;
          project_type?: string | null;
          project_stage?: string | null;
          budget_range?: string | null;
          location?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          lead_id: string;
          project_type: string;
          land_type: string | null;
          location: string | null;
          suburb: string | null;
          state: string | null;
          postcode: string | null;
          project_stage: string;
          budget_range: string;
          finish_level: string | null;
          assessment_score: number;
          is_current: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          project_type: string;
          land_type?: string | null;
          location?: string | null;
          suburb?: string | null;
          state?: string | null;
          postcode?: string | null;
          project_stage: string;
          budget_range: string;
          finish_level?: string | null;
          assessment_score?: number;
          is_current?: boolean;
        };
        Update: {
          assessment_score?: number;
          is_current?: boolean;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          client_status: string;
          company_name: string | null;
          notes: string | null;
          activated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          client_status?: string;
          company_name?: string | null;
          notes?: string | null;
          activated_at?: string;
        };
        Update: {
          client_status?: string;
          notes?: string | null;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          project_name: string;
          project_type: string | null;
          project_status: ProjectStatus;
          project_stage: string | null;
          location: string | null;
          suburb: string | null;
          state: string | null;
          postcode: string | null;
          budget_range: string | null;
          finish_level: string | null;
          confidence_score: number | null;
          notes: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_name: string;
          project_type?: string | null;
          project_status?: ProjectStatus;
          project_stage?: string | null;
          confidence_score?: number | null;
          notes?: string | null;
        };
        Update: {
          project_name?: string;
          project_status?: ProjectStatus;
          project_stage?: string | null;
          confidence_score?: number | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          title: string;
          status: ProposalStatus;
          total_amount: number;
          valid_until: string | null;
          notes: string | null;
          terms: string | null;
          sent_at: string | null;
          viewed_at: string | null;
          approved_at: string | null;
          declined_at: string | null;
          expired_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          title: string;
          status?: ProposalStatus;
          total_amount?: number;
          valid_until?: string | null;
          notes?: string | null;
          terms?: string | null;
        };
        Update: {
          title?: string;
          status?: ProposalStatus;
          total_amount?: number;
          valid_until?: string | null;
          sent_at?: string | null;
          viewed_at?: string | null;
          approved_at?: string | null;
          declined_at?: string | null;
          expired_at?: string | null;
          paid_at?: string | null;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          client_id: string;
          proposal_id: string | null;
          amount: number;
          currency: string;
          payment_status: PaymentStatus;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          proposal_id?: string | null;
          amount: number;
          currency?: string;
          payment_status?: PaymentStatus;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          paid_at?: string | null;
        };
        Update: {
          payment_status?: PaymentStatus;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          paid_at?: string | null;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          notification_type: NotificationType;
          title: string;
          message: string | null;
          is_read: boolean;
          action_url: string | null;
          entity_type: string | null;
          entity_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_type: NotificationType;
          title: string;
          message?: string | null;
          is_read?: boolean;
          action_url?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
        };
        Update: {
          is_read?: boolean;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
        };
        Update: Record<string, never>;
      };
      service_catalog: {
        Row: {
          id: string;
          service_name: string;
          description: string | null;
          default_price: number;
          is_active: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_name: string;
          description?: string | null;
          default_price?: number;
          is_active?: boolean;
          order_index?: number;
        };
        Update: {
          service_name?: string;
          description?: string | null;
          default_price?: number;
          is_active?: boolean;
          order_index?: number;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          client_id: string | null;
          lead_id: string | null;
          project_id: string | null;
          file_name: string;
          file_size: number | null;
          file_type: string | null;
          storage_path: string;
          category: DocumentCategory;
          description: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          lead_id?: string | null;
          project_id?: string | null;
          file_name: string;
          file_size?: number | null;
          file_type?: string | null;
          storage_path: string;
          category?: DocumentCategory;
          description?: string | null;
          uploaded_by?: string | null;
        };
        Update: {
          category?: DocumentCategory;
          description?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          project_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          sender_id: string;
          content: string;
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
      };
      meetings: {
        Row: {
          id: string;
          lead_id: string | null;
          client_id: string | null;
          meeting_type: string;
          scheduled_at: string | null;
          duration_minutes: number | null;
          status: string;
          calendly_event_id: string | null;
          calendly_event_url: string | null;
          meeting_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id?: string | null;
          client_id?: string | null;
          meeting_type?: string;
          scheduled_at?: string | null;
          duration_minutes?: number | null;
          status?: string;
          calendly_event_id?: string | null;
          meeting_url?: string | null;
        };
        Update: {
          status?: string;
          scheduled_at?: string | null;
          meeting_url?: string | null;
          updated_at?: string;
        };
      };
      buildchecks: {
        Row: {
          id: string;
          project_id: string | null;
          lead_id: string | null;
          buildcheck_status: BuildcheckStatus;
          title: string;
          builder_name: string | null;
          quote_amount: number | null;
          savings_min: number | null;
          savings_max: number | null;
          risk_level: string | null;
          summary: string | null;
          notes: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          lead_id?: string | null;
          buildcheck_status?: BuildcheckStatus;
          title?: string;
          builder_name?: string | null;
          quote_amount?: number | null;
          notes?: string | null;
        };
        Update: {
          buildcheck_status?: BuildcheckStatus;
          summary?: string | null;
          notes?: string | null;
          savings_min?: number | null;
          savings_max?: number | null;
          risk_level?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      project_timeline: {
        Row: {
          id: string;
          project_id: string;
          milestone_name: string;
          milestone_description: string | null;
          status: string;
          order_index: number;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_name: string;
          milestone_description?: string | null;
          status?: string;
          order_index?: number;
          due_date?: string | null;
        };
        Update: {
          status?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string | null;
          lead_id: string | null;
          assigned_to: string | null;
          title: string;
          description: string | null;
          status: string;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          lead_id?: string | null;
          assigned_to?: string | null;
          title: string;
          description?: string | null;
          status?: string;
          due_date?: string | null;
        };
        Update: {
          status?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          project_id: string;
          buildcheck_id: string | null;
          report_type: string;
          title: string;
          storage_path: string | null;
          generated_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          buildcheck_id?: string | null;
          report_type: string;
          title: string;
          storage_path?: string | null;
          generated_at?: string | null;
        };
        Update: {
          storage_path?: string | null;
          generated_at?: string | null;
        };
      };
      email_templates: {
        Row: {
          id: string;
          template_key: string;
          subject: string;
          html_content: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          template_key: string;
          subject: string;
          html_content?: string | null;
          is_active?: boolean;
        };
        Update: {
          subject?: string;
          html_content?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      meeting_notes: {
        Row: {
          id: string;
          meeting_id: string;
          notes: string | null;
          outcome: string | null;
          project_potential_rating: number | null;
          recommended_services: string[] | null;
          next_action: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          notes?: string | null;
          outcome?: string | null;
          project_potential_rating?: number | null;
          recommended_services?: string[] | null;
          next_action?: string | null;
          created_by?: string | null;
        };
        Update: {
          notes?: string | null;
          outcome?: string | null;
          project_potential_rating?: number | null;
          recommended_services?: string[] | null;
          next_action?: string | null;
          updated_at?: string;
        };
      };
      proposal_items: {
        Row: {
          id: string;
          proposal_id: string;
          service_catalog_id: string | null;
          item_name: string;
          description: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          service_catalog_id?: string | null;
          item_name: string;
          description?: string | null;
          quantity?: number;
          unit_price: number;
          total_price: number;
          order_index?: number;
        };
        Update: {
          item_name?: string;
          description?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          order_index?: number;
        };
      };
      message_attachments: {
        Row: {
          id: string;
          message_id: string;
          file_name: string;
          storage_path: string;
          file_size: number | null;
          file_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          file_name: string;
          storage_path: string;
          file_size?: number | null;
          file_type?: string | null;
        };
        Update: Record<string, never>;
      };
      buildcheck_findings: {
        Row: {
          id: string;
          buildcheck_id: string;
          finding_type: string;
          severity: string;
          title: string;
          description: string | null;
          recommendation: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          buildcheck_id: string;
          finding_type: string;
          severity?: string;
          title: string;
          description?: string | null;
          recommendation?: string | null;
          order_index?: number;
        };
        Update: {
          severity?: string;
          title?: string;
          description?: string | null;
          recommendation?: string | null;
          order_index?: number;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_client_id: string | null;
          referred_user_id: string | null;
          status: string;
          reward_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          referrer_client_id?: string | null;
          referred_user_id?: string | null;
          status?: string;
          reward_type?: string | null;
        };
        Update: {
          status?: string;
          reward_type?: string | null;
          updated_at?: string;
        };
      };
    }>;
    Views: Record<string, { Row: Record<string, unknown>; Relationships: never[] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
    Enums: Record<string, string[]>;
  };
}
