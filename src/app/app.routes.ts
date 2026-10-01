import { Routes } from '@angular/router';

import { driverGuard } from './core/guards/driver-guard';

export const routes: Routes = [
  // ======================================================
  // LOGIN
  // ======================================================

  {
    path: 'login',

    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },

  // ======================================================
  // ESPACE CHAUFFEUR
  // ======================================================

  {
    path: '',

    canActivate: [driverGuard],

    loadComponent: () =>
      import('./layouts/driver-layout/driver-layout').then((m) => m.DriverLayout),

    children: [
      // Dashboard

      {
        path: 'dashboard',

        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'profil',
        loadComponent: () =>
          import('./features/profil/profil')
            .then(m => m.Profil)
      },

      // Les prochaines pages seront ajoutées ici

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // ======================================================
  // FALLBACK
  // ======================================================

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
