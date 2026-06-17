import {
  DashboardData,
  DashboardSumary,
  ResponseApi,
} from "../types/dashboard.types";
import { BaseService } from "./base.service";

class DashboardService extends BaseService {
  constructor() {
    super("/v1");
  }

  private transformResponse(
    apiResponse: ResponseApi<DashboardData>,
  ): DashboardSumary {
    return {
      totalData: apiResponse.data.total_data,
      dataTerkirim: apiResponse.data.data_terkirim,
      dataGagal: apiResponse.data.data_gagal,
      dataBerhasil: apiResponse.data.data_berhasil ?? 0,
      dataBelumDikirim: apiResponse.data.data_belum_dikirim,
      persentaseTerkirim: apiResponse.data.persentase_terkirim,
      totalTagihan: Number(apiResponse.data.total_tagihan),
    };
  }

  private async parseResult<T>(response: Response): Promise<ResponseApi<T>> {
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Request failed");
    }

    return result;
  }

  async getDashboardData(): Promise<DashboardSumary> {
    const response = await this.request("/dashboard/stats", {
      method: "GET",
    });
    const data: ResponseApi<DashboardData> = await this.parseResult(response);
    console.log("Raw Dashboard Data:", data);
    return this.transformResponse(data);
  }
}

export const dashboardService = new DashboardService();
