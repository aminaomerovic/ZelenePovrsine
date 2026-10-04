import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UlogaKorisnika } from '../models/korisnik.model';


export function roleGuard(dozvoljeneUloge: UlogaKorisnika[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.imaUlogu(...dozvoljeneUloge)) return true;

    router.navigate(['/pocetna']);
    return false;
  };
}
