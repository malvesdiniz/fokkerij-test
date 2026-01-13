import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Initial Redirect
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // 2. Dashboard Feature
  {
    path: 'dashboard',
    title: 'Fokkerij - Dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },

  // 3. Horse Management Feature (Grouped by Prefix)
  {
    path: 'horses',
    children: [
      {
        path: '',
        title: 'Paarden',
        loadComponent: () =>
          import('./features/horses/horses.component').then((m) => m.HorsesComponent),
      },
      {
        path: 'add',
        title: 'Nieuw paard',
        loadComponent: () =>
          import('./features/horse/pages/add-horse/add-horse-page.component').then(
            (m) => m.AddHorsePageComponent
          ),
      },
      // {
      //   path: ':id',
      //   title: 'Paard Details',
      //   loadComponent: () => import('./features/horse-management/pages/horse-details-page.component')
      //     .then(m => m.HorseDetailsPageComponent)
      // }
    ],
  },

  // 4. Breeding Feature
  {
    path: 'breeding',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ), // TEMPORARY
  },

  // 5. Journal Feature
  {
    path: 'journal',
    title: 'Dagboek',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ), // TEMPORARY
  },

  // 6. Fallback (404)
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
