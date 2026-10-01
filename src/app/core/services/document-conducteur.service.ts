import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  DocumentConducteurResponse,
  TypeDocumentConducteur
} from '../models/document-conducteur.models';

@Injectable({
  providedIn: 'root'
})
export class DocumentConducteurService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8089/api/v1/conducteurs';

// =====================================================
// UPLOAD
// =====================================================

  uploadDocument(
    userId: string,
    file: File,
    type: TypeDocumentConducteur
  ): Observable<DocumentConducteurResponse> {


const formData = new FormData();

formData.append('file', file);
formData.append('type', type);

return this.http.post<DocumentConducteurResponse>(
  `${this.apiUrl}/users/${userId}/document`,
    formData
  );


}

// =====================================================
// LISTE DES DOCUMENTS
// =====================================================

getDocuments(
userId: string
): Observable<DocumentConducteurResponse[]> {

    return this.http.get<DocumentConducteurResponse[]>(
      `${this.apiUrl}/users/${userId}/document`
    );

}

// =====================================================
// URL DOCUMENT
// =====================================================

getDocumentUrl(
userId: string,
documentId: string
): string {


    return `${this.apiUrl}/users/${userId}/document/${documentId}`;

}

// =====================================================
// CONSULTATION SECURISEE
// =====================================================

getDocument(
userId: string,
documentId: string
): Observable<Blob> {


    return this.http.get(
      this.getDocumentUrl(userId, documentId),
      {
        responseType: 'blob'
      }
    );


}

// =====================================================
// SUPPRESSION
// =====================================================

deleteDocument(
userId: string,
documentId: string
): Observable<void> {


    return this.http.delete<void>(
      `${this.apiUrl}/users/${userId}/document/${documentId}`
    );


}

}
