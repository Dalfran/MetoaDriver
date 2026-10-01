import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ProfileConducteurRequest,
  ProfileConducteurResponse
} from '../models/conducteur.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileConducteurService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8089/api/v1/conducteurs';


  getProfileByUserId(
    userId: string
  ): Observable<ProfileConducteurResponse> {

    return this.http.get<ProfileConducteurResponse>(
      `${this.apiUrl}/users/${userId}`
    );
  }


  createProfile(
    userId: string,
    data: ProfileConducteurRequest
  ): Observable<ProfileConducteurResponse> {

    return this.http.post<ProfileConducteurResponse>(
      `${this.apiUrl}/users/${userId}`,
      {
        ...data,
        userId
      }
    );
  }


  updateProfile(
    userId: string,
    data: ProfileConducteurRequest
  ): Observable<ProfileConducteurResponse> {

    return this.http.put<ProfileConducteurResponse>(
      `${this.apiUrl}/users/${userId}`,
      {
        ...data,
        userId
      }
    );
  }


  deleteProfile(
    userId: string
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/users/${userId}`,
      {
        responseType: 'text'
      }
    );
  }


  uploadDocument(
    userId: string,
    file: File,
    type: string
  ): Observable<ProfileConducteurResponse> {

    const formData = new FormData();

    formData.append('file', file);

    formData.append('type', type);

    return this.http.post<ProfileConducteurResponse>(
      `${this.apiUrl}/users/${userId}/document`,
      formData
    );
  }
}
