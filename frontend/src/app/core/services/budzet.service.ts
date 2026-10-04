import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budzet, BudzetPregled } from '../models/budzet.model';

@Injectable({ providedIn: 'root' })
export class BudzetService {
  private apiUrl = `${environment.apiUrl}/budzeti`;

  constructor(private http: HttpClient) {}

  getSve(): Observable<Budzet[]> {
    return this.http.get<Budzet[]>(this.apiUrl);
  }

  pregled(mesec: number, godina: number): Observable<BudzetPregled> {
    return this.http.get<BudzetPregled>(`${this.apiUrl}/pregled?mesec=${mesec}&godina=${godina}`);
  }

  postaviBudzet(budzet: Partial<Budzet>): Observable<Budzet> {
    return this.http.post<Budzet>(this.apiUrl, budzet);
  }
}