import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserResponse, UserUpdateRequest } from '../models/user.models';

export interface ChangePasswordRequest {
  ancienPasse: string;
  nouveauPasse: string;
  confirmationPasse: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8089/api/users';

  // =========================================================
  // GET USER
  // =========================================================

  getUserById(idUser: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${idUser}`);
  }

  // =========================================================
  // UPDATE USER
  // =========================================================

  updateUser(idUser: string, data: UserUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${idUser}`, data);
  }

  // =========================================================
  // PHOTO PROFIL
  // =========================================================

  uploadPhoto(idUser: string, file: File): Observable<UserResponse> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<UserResponse>(`${this.apiUrl}/${idUser}/photo`, formData);
  }

  // =========================================================
  // PHOTO COUVERTURE
  // =========================================================

  uploadCoverPhoto(idUser: string, file: File): Observable<UserResponse> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<UserResponse>(`${this.apiUrl}/${idUser}/cover`, formData);
  }

  // =========================================================
  // DELETE PHOTO
  // =========================================================

  deletePhoto(idUser: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idUser}/photo`);
  }

  // =========================================================
  // DELETE COVER
  // =========================================================

  deleteCoverPhoto(idUser: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idUser}/cover`);
  }

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  changePassword(data: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/me/password`, data);
  }

  // =========================================================
  // PHOTO URL
  // =========================================================

  getPhotoUrl(photoUrl: string | null | undefined): string | null {
    if (!photoUrl) {
      return null;
    }

    if (photoUrl.startsWith('http')) {
      return photoUrl;
    }

    return `http://localhost:8089${photoUrl}`;
  }
}
