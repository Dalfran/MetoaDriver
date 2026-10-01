export interface LoginRequest {
  email: string;
  passe: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  idUser: string;
  nom: string;
  prenom: string;
  sexe?: string | null;
  telephone?: string | null;
  email: string;
  role: string;
  statusUser: string;

  // Préparé pour notre future migration User
  photoUrl?: string | null;
  coverPhotoUrl?: string | null;
}
