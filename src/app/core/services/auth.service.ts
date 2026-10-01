import { Injectable, inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { LoginRequest, LoginResponse, UserResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly platformId = inject(PLATFORM_ID);

  private readonly apiUrl = 'http://localhost:8089/api/auth';

  private readonly TOKEN_KEY = 'metoa_driver_token';

  private readonly USER_KEY = 'metoa_driver_user';

  /**
   * Connexion utilisateur.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (!isPlatformBrowser(this.platformId)) {
          return;
        }

        localStorage.setItem(this.TOKEN_KEY, response.token);

        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      }),
    );
  }

  /**
   * Récupère le JWT.
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Récupère l'utilisateur connecté.
   */
  getCurrentUser(): UserResponse | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = localStorage.getItem(this.USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as UserResponse;
    } catch (error) {
      console.error('Impossible de lire metoa_driver_user', error);

      return null;
    }
  }

  /**
   * Vérifie si un JWT existe.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Déconnexion.
   */
  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.TOKEN_KEY);

    localStorage.removeItem(this.USER_KEY);
  }
}
