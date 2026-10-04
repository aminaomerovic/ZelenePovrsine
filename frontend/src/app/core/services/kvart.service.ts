import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Kvart } from '../models/kvart.model';

@Injectable({ providedIn: 'root' })
export class KvartService {
  private apiUrl = `${environment.apiUrl}/kvartovi`;

  constructor(private http: HttpClient) {}

  getSve(): Observable<Kvart[]> {
    return this.http.get<Kvart[]>(this.apiUrl);
  }

  dodaj(kvart: Partial<Kvart>): Observable<Kvart> {
    return this.http.post<Kvart>(this.apiUrl, kvart);
  }

  izmeni(id: number, kvart: Partial<Kvart>): Observable<Kvart> {
    return this.http.put<Kvart>(`${this.apiUrl}/${id}`, kvart);
  }

  obrisi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}