/**
 * Authentication Service
 * Handle login, logout, dan user session management
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token_type: string;
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

class AuthService {
  private baseApi: string;

  constructor() {
    this.baseApi = process.env.NEXT_PUBLIC_BASE_API || '';
  }

  /**
   * Login dengan credentials
   * Endpoint: POST /v1/auth/login/sanctum
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    console.log('Logging in with payload:', payload);
    const response = await fetch(`${this.baseApi}/v1/auth/login/sanctum`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Simpan token ke localStorage dan cookie
    if (data.access_token) {
      this.setToken(data.access_token);
    }

    // Simpan profil user untuk ditampilkan di header/dropdown
    if (data.user) {
      this.setUser(data.user);
    }

    return data;
  }

  /**
   * Logout - clear token
   */
  async logout(): Promise<void> {
    const token = this.getToken();

    try {
      if (token) {
        await fetch(`${this.baseApi}/v1/sanctum/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } finally {
      this.clearToken();
      this.clearUser();
    }
  }

  /**
   * Set token ke localStorage dan cookie
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      // Set cookie untuk middleware
      document.cookie = `authToken=${token}; path=/; max-age=86400`;
    }
  }

  /**
   * Clear token dari localStorage dan cookie
   */
  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      // Clear cookie
      document.cookie = 'authToken=; path=/; max-age=0';
    }
  }

  private setUser(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
  }

  private clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser');
    }
  }

  /**
   * Get token dari localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  getUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem('authUser');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem('authUser');
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const authService = new AuthService();
