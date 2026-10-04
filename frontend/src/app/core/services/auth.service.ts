import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginZahtev, RegistracijaZahtev, UlogaKorisnika } from '../models/korisnik.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // navbar i ostale komponente reaguju na promenu ulogovanog korisnika
  trenutniKorisnik = signal<AuthResponse | null>(this.ucitajIzLocalStorage());

  constructor(private http: HttpClient, private router: Router) {}

  private ucitajIzLocalStorage(): AuthResponse | null {
    const podaci = localStorage.getItem('korisnik');
    return podaci ? JSON.parse(podaci) : null;
  }

  registracija(zahtev: RegistracijaZahtev): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registracija`, zahtev).pipe(
      tap((odgovor) => this.sacuvajKorisnika(odgovor))
    );
  }

  login(zahtev: LoginZahtev): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, zahtev).pipe(
      tap((odgovor) => this.sacuvajKorisnika(odgovor))
    );
  }

  private sacuvajKorisnika(odgovor: AuthResponse) {
    localStorage.setItem('korisnik', JSON.stringify(odgovor));
    this.trenutniKorisnik.set(odgovor);
  }

  logout() {
    localStorage.removeItem('korisnik');
    this.trenutniKorisnik.set(null);
    this.router.navigate(['/prijava']);
  }

  getToken(): string | null {
    return this.trenutniKorisnik()?.token ?? null;
  }

  jeUlogovan(): boolean {
    return this.trenutniKorisnik() !== null;
  }

  imaUlogu(...uloge: UlogaKorisnika[]): boolean {
    const korisnik = this.trenutniKorisnik();
    return !!korisnik && uloge.includes(korisnik.uloga);
  }
}
