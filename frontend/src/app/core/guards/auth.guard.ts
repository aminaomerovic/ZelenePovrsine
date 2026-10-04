import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// pusta dalje samo ulogovane korisnike, ostale vraca na prijavu
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.jeUlogovan()) return true;

  router.navigate(['/prijava']);
  return false;
};
