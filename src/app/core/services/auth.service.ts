import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../tokens/api.token';
import { User } from '../models/user';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiBase = inject(API_BASE_URL);
  private tokenKey = 'qr_token';

  user = signal<User | null>(null);
  isLoading = signal(false);

  constructor() {
    const token = this.getToken();
    if (token) {
      // Skip API call for test tokens
      if (this.isTestToken(token)) {
        this.loadTestUser();
      } else {
        this.fetchMe().catch(() => this.logout());
      }
    }
  }

  async register(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<{token: string; user: User}>(`${this.apiBase}/auth/register`, { 
          email, 
          password 
        })
      );
      this.setSession(response.token, response.user);
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<{token: string; user: User}>(`${this.apiBase}/auth/login`, { 
          email, 
          password 
        })
      );
      this.setSession(response.token, response.user);
    } finally {
      this.isLoading.set(false);
    }
  }

  async fetchMe(): Promise<void> {
    const user = await firstValueFrom(
      this.http.get<User>(`${this.apiBase}/auth/me`)
    );
    this.user.set(user);
  }

  setSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    this.user.set(user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.user.set(null);
    this.router.navigate(['/auth']);
  }

  private isTestToken(token: string): boolean {
    return token.startsWith('test-jwt-token-');
  }

  private loadTestUser(): void {
    const testUser = {
      id: 'test-user-001',
      email: 'test@example.com',
      createdAt: new Date().toISOString()
    };
    this.user.set(testUser);
  }
}