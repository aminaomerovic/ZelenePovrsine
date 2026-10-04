import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RadnikKratko {
  id: number;
  ime: string;
  prezime: string;
}

export interface KorisnikPregled {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  uloga: string;
  aktivan: boolean;
  datumRegistracije: string;
}

@Injectable({ providedIn: 'root' })
export class KorisniciService {
  private apiUrl = `${environment.apiUrl}/korisnici`;

  constructor(private http: HttpClient) {}

  getRadnici(): Observable<RadnikKratko[]> {
    return this.http.get<RadnikKratko[]>(`${this.apiUrl}/radnici`);
  }

  getSve(): Observable<KorisnikPregled[]> {
    return this.http.get<KorisnikPregled[]>(this.apiUrl);
  }

  promeniUlogu(id: number, uloga: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/uloga`, { uloga });
  }

  promeniAktivnost(id: number, aktivan: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/aktivan`, { aktivan });
  }
}