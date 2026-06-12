/**
 * Proxy API Client
 * Menggunakan /api/proxy/ endpoint untuk semua API calls
 * Token akan divalidasi di server sebelum forward ke backend
 */

export class ProxyClient {
  private baseUrl: string = '/api/proxy';

  /**
   * GET request melalui proxy
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request melalui proxy
   */
  async post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST dengan FormData melalui proxy
   */
  async postFormData<T>(endpoint: string, formData: FormData, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'POST',
      // Jangan set Content-Type untuk FormData
      // Browser akan set boundary secara otomatis
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request melalui proxy
   */
  async put<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request melalui proxy
   */
  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Build URL dengan endpoint dan query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = `${this.baseUrl}/${endpoint}`;

    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryString.append(key, String(value));
        }
      });
      url += `?${queryString.toString()}`;
    }

    return url;
  }

  /**
   * Handle response dari proxy
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Token tidak valid atau expired
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/';
      throw new Error('Session expired - redirecting to login');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  }
}

// Export singleton instance
export const proxyClient = new ProxyClient();
