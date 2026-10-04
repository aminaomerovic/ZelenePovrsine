import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RadniNalog, RadniNalogForma, StatusRadnogNaloga } from '../models/radni-nalog.model';

@Injectable({ providedIn: 'root' })
export class RadniNaloziService {
  private apiUrl = `${environment.apiUrl}/radninalozi`;

  constructor(private http: HttpClient) {}

  getSvi(): Observable<RadniNalog[]> {
    return this.http.get<RadniNalog[]>(this.apiUrl);
  }

  getMoji(): Observable<RadniNalog[]> {
    return this.http.get<RadniNalog[]>(`${this.apiUrl}/moji`);
  }

  getJedan(id: number): Observable<RadniNalog> {
    return this.http.get<RadniNalog>(`${this.apiUrl}/${id}`);
  }

  kreiraj(forma: RadniNalogForma): Observable<RadniNalog> {
    return this.http.post<RadniNalog>(this.apiUrl, forma);
  }

  dodeliRadnika(id: number, radnikId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/dodeli`, { radnikId });
  }

  izmeniStatus(id: number, status: StatusRadnogNaloga): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, { status });
  }
}
