import { PaginationParams, PaginatedResponse } from '@/types/config/types';

export interface Campaign {
  id: number;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  created_at: string;
  updated_at: string;
  scheduled_at?: string;
  sent_at?: string;
  stats?: {
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
  };
}

export interface CampaignListParams extends PaginationParams {
  status?: Campaign['status'];
  date_from?: string;
  date_to?: string;
}

export type CampaignListResponse = PaginatedResponse<Campaign>;
