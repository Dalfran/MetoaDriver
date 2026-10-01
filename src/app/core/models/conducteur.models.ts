import { UserResponse } from './user.models';

export interface ProfileConducteurResponse {
  profileConducteurId: string;

  adresse: string;
  bio: string | null;
  preferences: string;

  actif: boolean | null;

  noteMoyenne: number;
  totalAvis: number | null;
  nombreAvis: number | null;

  nombreTrajetsEffectues: number | null;

  vehicule: string | null;

  documentUrl: string | null;
  documentName: string | null;
  documentType: string | null;

  tauxAcceptation: number | null;

  dateCreationProfile: string | null;
  dateModificationProfile: string | null;

  userResDTO: UserResponse;
}

export interface ProfileConducteurRequest {
  adresse: string;
  bio?: string | null;
  preferences: string;

  actif?: boolean | null;

  vehicule?: string | null;

  userId?: string;
}
