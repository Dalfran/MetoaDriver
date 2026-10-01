import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const driverGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const user = authService.getCurrentUser();

  /**
   * Aucun utilisateur connecté.
   */
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  /**
   * Utilisateur connecté mais
   * qui n'est pas chauffeur.
   */
    if (user.role !== 'CHAUFFEUR') {
    console.warn('Accès refusé : utilisateur non chauffeur');

    authService.logout();

    return router.createUrlTree(['/login']);
  }

  /**
   * Chauffeur autorisé.
   */
  return true;
};
