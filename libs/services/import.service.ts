import { BaseService } from "./base.service";

class ImportService extends BaseService {
  constructor() {
    super("/v1");
  }

  public async importData(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const extension = file.name.split(".").pop()?.toLowerCase();

    let endpoint = "/import";

    if (extension === "csv") {
      endpoint = "/import/csv";
    } else if (["xlsx", "xls"].includes(extension ?? "")) {
      endpoint = "/import/excel";
    } else {
      throw new Error("Format file tidak didukung");
    }

    const response = await this.request(endpoint, {
      method: "POST",
      body: formData,
      // FormData will automatically set the correct Content-Type
      headers: {},
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Import failed");
    }

    return response.json();
  }

  public async downloadTemplate(): Promise<Blob> {
    const response = await this.request("/import/template", {
      method: "GET",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to download template");
    }
    return response.blob();
  }
}

export const importService = new ImportService();
