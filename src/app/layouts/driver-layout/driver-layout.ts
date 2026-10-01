import { Component, OnInit, inject } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { UserResponse } from '../../core/models/auth.models';

@Component({
  selector: 'app-driver-layout',

  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],

  templateUrl: './driver-layout.html',

  styleUrl: './driver-layout.css'
})
export class DriverLayout implements OnInit {

  // ========================================================
  // SERVICES
  // ========================================================

  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  // ========================================================
  // DONNÉES UTILISATEUR
  // ========================================================

  utilisateur: UserResponse | null = null;

  // ========================================================
  // INITIALISATION
  // ========================================================

  ngOnInit(): void {
    this.chargerUtilisateur();
  }

  // ========================================================
  // CHARGER UTILISATEUR
  // ========================================================

  private chargerUtilisateur(): void {

    this.utilisateur =
      this.authService.getCurrentUser();

    if (!this.utilisateur) {

      console.warn(
        '⚠️ Aucun utilisateur chauffeur trouvé.'
      );

      this.router.navigate(['/login']);

      return;
    }

    console.log(
      '👤 Chauffeur connecté :',
      this.utilisateur
    );
  }

  // ========================================================
  // NOM COMPLET
  // ========================================================

  get nomComplet(): string {

    if (!this.utilisateur) {
      return 'Chauffeur';
    }

    return `
      ${this.utilisateur.prenom ?? ''}
      ${this.utilisateur.nom ?? ''}
    `.trim();
  }

  // ========================================================
  // INITIALE
  // ========================================================

  get initiale(): string {

    return (
      this.utilisateur?.prenom
        ?.charAt(0)
        ?.toUpperCase() || 'C'
    );
  }

  // ========================================================
  // PHOTO
  // ========================================================

  getPhotoProfilUrl(): string | null {

    /*
     * Pour le moment, photoUrl n'est pas encore
     * réellement renvoyée par UserResDTO du backend.
     *
     * On prépare néanmoins le layout pour
     * l'évolution future.
     */

    return this.utilisateur?.photoUrl ?? null;
  }

  // ========================================================
  // DÉCONNEXION
  // ========================================================

  deconnexion(): void {

    console.log(
      '👋 Déconnexion du chauffeur'
    );

    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
