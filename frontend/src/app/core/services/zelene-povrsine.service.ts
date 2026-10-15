import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ZelenaPovrsina, ZelenaPovrsinaForma } from '../models/zelena-povrsina.model';

@Injectable({ providedIn: 'root' })
export class ZelenePovrsineService {
  private apiUrl = `${environment.apiUrl}/zelenepovrsine`;

  constructor(private http: HttpClient) {}

  getSve(): Observable<ZelenaPovrsina[]> {
    return this.http.get<ZelenaPovrsina[]>(this.apiUrl);
  }

  getJedna(id: number): Observable<ZelenaPovrsina> {
    return this.http.get<ZelenaPovrsina>(`${this.apiUrl}/${id}`);
  }

  // id povrsina koje imaju bar jednu neresenu prijavu
  getIdSaAktivnimPrijavama(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/sa-aktivnim-prijavama`);
  }


  kreiraj(forma: ZelenaPovrsinaForma): Observable<ZelenaPovrsina> {
    return this.http.post<ZelenaPovrsina>(this.apiUrl, forma);
  }

  izmeni(id: number, forma: ZelenaPovrsinaForma): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, forma);
  }

  obrisi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
