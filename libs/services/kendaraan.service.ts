import {
  ApiResponse,
  Kendaraan,
  PaginationResponse,
} from "../types/kendaraan.type";
import { BaseService } from "./base.service";

export interface KendaraanParams {
  page?: number;
  per_page?: number;
  search?: string;
  status_broadcast?: string;
  jenis_roda?: string;
  start_date?: string;
  end_date?: string;
}

class KendaraanService extends BaseService {
  constructor() {
    super("/v1");
  }

  private async parseResult<T>(response: Response): Promise<ApiResponse<T>> {
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Request failed");
    }

    return result;
  }

  async getKendaraan(
    params: KendaraanParams = {},
  ): Promise<PaginationResponse<Kendaraan>> {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, String(value));
      }
    });

    const endpoint = `/kendaraans${query.toString() ? `?${query.toString()}` : ""}`;
    const response = await this.request(endpoint, {
      method: "GET",
    });
    const result =
      await this.parseResult<PaginationResponse<Kendaraan>>(response);

    return result.data;
  }

  async saveKendaraan(data: Partial<Kendaraan>): Promise<Kendaraan> {
    const response = await this.request("/kendaraans", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await this.parseResult<Kendaraan>(response);
    return result.data;
  }
}

export const kendaraanService = new KendaraanService();
