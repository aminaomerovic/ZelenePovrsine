import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Obavestenje } from '../models/obavestenje.model';

@Injectable({ providedIn: 'root' })
export class ObavestenjaService {
  private apiUrl = `${environment.apiUrl}/obavestenja`;

  // navbar prati ovaj signal da prikaže crvenu tačkicu
  brojNeprocitanih = signal(0);

  constructor(private http: HttpClient) {}

  getMoja(): Observable<Obavestenje[]> {
    return this.http.get<Obavestenje[]>(`${this.apiUrl}/moja`).pipe(
      tap((podaci) => this.brojNeprocitanih.set(podaci.filter((o) => !o.procitano).length))
    );
  }

  oznaciProcitano(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/procitano`, {});
  }

  // poziva navbar da osvezi broj bez otvaranja cele stranice obavestenja
  osveziBrojNeprocitanih() {
    this.getMoja().subscribe();
  }
}