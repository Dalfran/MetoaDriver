export type TypeDocumentConducteur =
  | 'PERMIS_CONDUIRE'
  | 'CARTE_IDENTITE'
  | 'ASSURANCE'
  | 'CARTE_GRISE'
  | 'AUTRE';

export interface DocumentConducteurResponse {
  documentId: string;
  nom: string;
  url: string;
  type: TypeDocumentConducteur;
  dateUpload: string;
  dateModification: string | null;
}
