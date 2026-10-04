import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container" style="max-width: 420px;">
      <div class="card">
        <h2>Registracija</h2>

        @if (greska) {
          <div class="greska">{{ greska }}</div>
        }

        <form (ngSubmit)="registruj()">
          <label>Ime</label>
          <input [(ngModel)]="ime" name="ime" required>

          <label>Prezime</label>
          <input [(ngModel)]="prezime" name="prezime" required>

          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required>

          <label>Telefon</label>
          <input [(ngModel)]="telefon" name="telefon">

          <label>Lozinka</label>
          <input type="password" [(ngModel)]="lozinka" name="lozinka" required minlength="6">

          <button class="btn" type="submit">Registruj se</button>
        </form>

        <p style="margin-top: 12px; font-size: 14px;">
          Već imaš nalog? <a routerLink="/prijava">Prijavi se</a>
        </p>
      </div>
    </div>
  `
})
export class RegistracijaComponent {
  ime = '';
  prezime = '';
  email = '';
  telefon = '';
  lozinka = '';
  greska = '';

  constructor(private auth: AuthService, private router: Router) {}

  registruj() {
    this.greska = '';
    this.auth.registracija({
      ime: this.ime,
      prezime: this.prezime,
      email: this.email,
      telefon: this.telefon,
      lozinka: this.lozinka
    }).subscribe({
      next: () => this.router.navigate(['/zelene-povrsine']),
      error: (err) => this.greska = err.error?.poruka || 'Greška pri registraciji.'
    });
  }
}
