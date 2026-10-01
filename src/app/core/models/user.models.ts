export interface UserResponse {
  idUser: string;

  nom: string;
  prenom: string;

  sexe: string | null;
  telephone: string | null;
  email: string;

  role: string;
  statusUser: string;

  photoUrl: string | null;
  coverPhotoUrl: string | null;
}

export interface UserUpdateRequest {
  nom: string;
  prenom: string;

  dateNaissance?: string | null;
  lieuNaissance?: string | null;

  sexe?: string | null;

  telephone: string;
  email: string;

  dateModification?: string | null;
}
