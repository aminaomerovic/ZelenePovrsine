import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IzvrsenjeRada } from '../models/radni-nalog.model';

@Injectable({ providedIn: 'root' })
export class IzvrsenjaRadaService {
  private apiUrl = `${environment.apiUrl}/izvrsenjarada`;

  constructor(private http: HttpClient) {}

  getSva(): Observable<IzvrsenjeRada[]> {
    return this.http.get<IzvrsenjeRada[]>(this.apiUrl);
  }

  kreiraj(radniNalogId: number, trajanjeMin: number): Observable<IzvrsenjeRada> {
    return this.http.post<IzvrsenjeRada>(this.apiUrl, { radniNalogId, trajanjeMin });
  }
}
