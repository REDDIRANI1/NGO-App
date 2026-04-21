export interface Report {
  id: number
  ngo_id: string
  month: string
  people_helped: number
  events_conducted: number
  funds_utilized: number
  created_at: string
  updated_at: string
}

export interface ReportCreate {
  ngo_id: string
  month: string
  people_helped: number
  events_conducted: number
  funds_utilized: number
}

export interface JobStatus {
  job_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  total: number
  processed: number
  failed: number
  errors: Array<{ row: number; message: string }>
  created_at: string
}

export interface DashboardData {
  month: string
  total_ngos_reporting: number
  total_people_helped: number
  total_events_conducted: number
  total_funds_utilized: number
}