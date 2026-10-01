import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly authService = inject(AuthService);

  readonly utilisateur = this.authService.getCurrentUser();

  get nomComplet(): string {
    if (!this.utilisateur) {
      return 'Chauffeur';
    }

    return `
      ${this.utilisateur.prenom ?? ''}
      ${this.utilisateur.nom ?? ''}
    `.trim();
  }

  get prenom(): string {
    return this.utilisateur?.prenom || 'Chauffeur';
  }
}
