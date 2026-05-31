import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/landing/landing.component')
        .then(m => m.LandingComponent)
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/settings.component')
        .then(m => m.SettingsComponent)
  },
  {
    path: 'availability',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/availability/manage-availability.component')
        .then(m => m.ManageAvailabilityComponent)
  },
  {
    path: 'book',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/appointments/book-appointment/book-appointment.component')
        .then(m => m.BookAppointmentComponent)
  },
  {
    path: 'session-notes/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/session-notes/session-notes.component')
        .then(m => m.SessionNotesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];