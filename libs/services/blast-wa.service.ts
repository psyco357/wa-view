import { BaseService } from "./base.service";

// /send-mass

class BlastWAService extends BaseService {
  constructor() {
    super("/v1");
  }

  public async sendMassBlast(data: any): Promise<any> {
    const response = await this.request("/send-mass", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send mass blast");
    }
    return response.json();
  }
}

export const blastWAService = new BlastWAService();
