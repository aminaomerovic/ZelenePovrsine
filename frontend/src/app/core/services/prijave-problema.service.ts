import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PrijavaProblema, PrijavaProblemaForma, StatusPrijave } from '../models/prijava-problema.model';

@Injectable({ providedIn: 'root' })
export class PrijaveProblemaService {
  private apiUrl = `${environment.apiUrl}/prijaveproblema`;

  constructor(private http: HttpClient) {}

  getSve(): Observable<PrijavaProblema[]> {
    return this.http.get<PrijavaProblema[]>(this.apiUrl);
  }

  getMoje(): Observable<PrijavaProblema[]> {
    return this.http.get<PrijavaProblema[]>(`${this.apiUrl}/moje`);
  }

  getJedna(id: number): Observable<PrijavaProblema> {
    return this.http.get<PrijavaProblema>(`${this.apiUrl}/${id}`);
  }

  kreiraj(forma: PrijavaProblemaForma): Observable<PrijavaProblema> {
    return this.http.post<PrijavaProblema>(this.apiUrl, forma);
  }

  izmeniStatus(id: number, status: StatusPrijave): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, { status });
  }
}
