import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KorisniciService, KorisnikPregled } from '../../core/services/korisnici.service';

@Component({
  selector: 'app-korisnici',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Korisnici</h2>

      <table>
        <tr><th>Ime i prezime</th><th>Email</th><th>Uloga</th><th>Aktivan</th><th></th></tr>
        @for (k of korisnici; track k.id) {
          <tr>
            <td>{{ k.ime }} {{ k.prezime }}</td>
            <td>{{ k.email }}</td>
            <td>
              <select [ngModel]="k.uloga" (ngModelChange)="promeniUlogu(k, $event)">
                <option value="Gradjanin">Građanin</option>
                <option value="Radnik">Radnik</option>
                <option value="Nadzornik">Nadzornik</option>
                <option value="Administrator">Administrator</option>
              </select>
            </td>
            <td>{{ k.aktivan ? 'Da' : 'Ne' }}</td>
            <td>
              <button class="btn secondary" (click)="promeniAktivnost(k)">
                {{ k.aktivan ? 'Deaktiviraj' : 'Aktiviraj' }}
              </button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="5">Nema registrovanih korisnika.</td></tr>
        }
      </table>
    </div>
  `
})
export class KorisniciComponent implements OnInit {
  korisnici: KorisnikPregled[] = [];

  constructor(private servis: KorisniciService) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.servis.getSve().subscribe((podaci) => this.korisnici = podaci);
  }

  promeniUlogu(k: KorisnikPregled, novaUloga: string) {
    this.servis.promeniUlogu(k.id, novaUloga).subscribe(() => this.ucitaj());
  }

  promeniAktivnost(k: KorisnikPregled) {
    this.servis.promeniAktivnost(k.id, !k.aktivan).subscribe(() => this.ucitaj());
  }
}