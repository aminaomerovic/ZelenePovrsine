import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container" style="max-width: 400px;">
      <div class="card">
        <h2>Prijava</h2>

        @if (greska) {
          <div class="greska">{{ greska }}</div>
        }

        <form (ngSubmit)="prijava()">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required>

          <label>Lozinka</label>
          <input type="password" [(ngModel)]="lozinka" name="lozinka" required>

          <button class="btn" type="submit">Prijavi se</button>
        </form>

        <p style="margin-top: 12px; font-size: 14px;">
          Nemaš nalog? <a routerLink="/registracija">Registruj se</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  lozinka = '';
  greska = '';

  constructor(private auth: AuthService, private router: Router) {}

  // login zahtev i preusmeravanje na pocetnu
  prijava() {
    this.greska = '';
    this.auth.login({ email: this.email, lozinka: this.lozinka }).subscribe({
      next: () => this.router.navigate(['/zelene-povrsine']),
      error: (err) => this.greska = err.error?.poruka || 'Greška pri prijavi.'
    });
  }
}
