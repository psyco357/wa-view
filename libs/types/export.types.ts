
export interface ReportItem {
  status_broadcast: string;
  total: number;
}

export interface ReportResponse {
  success: boolean;
  data: ReportItem[];
}