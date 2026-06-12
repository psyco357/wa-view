export abstract class BaseService {
  protected apiUrl: string;
  protected apiPrefix: string;

  constructor(prefix: string = "/v1") {
    this.apiUrl = process.env.NEXT_PUBLIC_BASE_API || "";
    this.apiPrefix = prefix;
  }

  /**
   * Get bearer token from localStorage
   */
  protected getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || null;
    }
    return null;
  }

  /**
   * Make authenticated request with prefix and bearer token
   */
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getToken();
    const url = `${this.apiUrl}${this.apiPrefix}${endpoint}`;

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    // Only set Content-Type if body is not FormData (FormData needs its own boundary)
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add bearer token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  }

  /**
   * Parse response and handle errors
   */
  protected async parseResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  }
}
