import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resurs, ResursForma, UtrosakResursa, UtrosakResursaForma } from '../models/resurs.model';

@Injectable({ providedIn: 'root' })
export class ResursiService {
  private apiUrl = `${environment.apiUrl}/resursi`;
  private utrosciUrl = `${environment.apiUrl}/utrosciresursa`;

  constructor(private http: HttpClient) {}

  getSvi(): Observable<Resurs[]> {
    return this.http.get<Resurs[]>(this.apiUrl);
  }

  kreiraj(forma: ResursForma): Observable<Resurs> {
    return this.http.post<Resurs>(this.apiUrl, forma);
  }

  obrisi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUtroske(): Observable<UtrosakResursa[]> {
    return this.http.get<UtrosakResursa[]>(this.utrosciUrl);
  }

  kreirajUtrosak(forma: UtrosakResursaForma): Observable<UtrosakResursa> {
    return this.http.post<UtrosakResursa>(this.utrosciUrl, forma);
  }
}
