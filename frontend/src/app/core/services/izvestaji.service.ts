import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IzvestajiService {
  private apiUrl = `${environment.apiUrl}/izvestaji`;

  constructor(private http: HttpClient) {}

  prijavePoStatusu(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prijave-status`);
  }

  prosecnoVremeResavanja(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prosecno-vreme-resavanja`);
  }

  ucestalostIntervencija(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ucestalost-intervencija`);
  }

  troskoviPoMesecu(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/troskovi-po-mesecu`);
  }

  ekoPokazatelji(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eko-pokazatelji`);
  }

  poKvartu(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/po-kvartu`);
  }
}