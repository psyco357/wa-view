import { BaseService } from "./base.service";
import { ReportResponse } from "../types/export.types";

class ExportService extends BaseService {
  constructor() {
    super("/v1");
  }

  async getReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();

    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const endpoint = `/reports${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.request(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    return response.json();
  }

  async exportReport(startDate?: string, endDate?: string, status?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (status) params.append("status", status);

    const endpoint = `/reports/excel${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.request(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to export report");
    }

    return response.blob();
  }
}

export const exportService = new ExportService();
