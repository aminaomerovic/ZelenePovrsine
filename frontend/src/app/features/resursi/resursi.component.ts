import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResursiService } from '../../core/services/resursi.service';
import { RadniNaloziService } from '../../core/services/radni-nalozi.service';
import { AuthService } from '../../core/services/auth.service';
import { Resurs, TipResursa, UtrosakResursa } from '../../core/models/resurs.model';
import { RadniNalog } from '../../core/models/radni-nalog.model';

@Component({
  selector: 'app-resursi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Resursi</h2>

      @if (auth.imaUlogu('Nadzornik', 'Administrator')) {
        <div class="card">
          <h3>Novi resurs</h3>
          <label>Naziv</label>
          <input [(ngModel)]="naziv" name="naziv">

          <label>Tip</label>
          <select [(ngModel)]="tip" name="tip">
            <option value="Gorivo">Gorivo</option>
            <option value="Voda">Voda</option>
            <option value="Alat">Alat</option>
            <option value="Sadnice">Sadnice</option>
          </select>

          <label>Jedinica mere</label>
          <input [(ngModel)]="jedinicaMere" name="jedinica" placeholder="npr. l, kg, kom">

          <label>Trenutna količina</label>
          <input type="number" [(ngModel)]="kolicina" name="kolicina">

          <label>Cena po jedinici (RSD)</label>
          <input type="number" [(ngModel)]="cena" name="cena">

          <button class="btn" (click)="dodajResurs()">Dodaj resurs</button>
        </div>
      }

      <div class="card">
        <h3>Svi resursi</h3>
        <table>
          <tr><th>Naziv</th><th>Tip</th><th>Količina</th><th>Cena/j.m.</th></tr>
          @for (r of resursi; track r.id) {
            <tr>
              <td>{{ r.naziv }}</td>
              <td>{{ r.tip }}</td>
              <td>{{ r.kolicina }} {{ r.jedinicaMere }}</td>
              <td>{{ r.cenaPoJedinici }} RSD</td>
            </tr>
          }
        </table>
      </div>

      <div class="card">
        <h3>Evidentiraj utrošak</h3>
        <label>Resurs</label>
        <select [(ngModel)]="utrosakResursId" name="utrosakResurs">
          <option [ngValue]="null" disabled>Izaberi resurs</option>
          @for (r of resursi; track r.id) {
            <option [ngValue]="r.id">{{ r.naziv }}</option>
          }
        </select>

        <label>Radni nalog</label>
        <select [(ngModel)]="utrosakNalogId" name="utrosakNalog">
          <option [ngValue]="null" disabled>Izaberi radni nalog</option>
          @for (n of nalozi; track n.id) {
            <option [ngValue]="n.id">#{{ n.id }} — {{ n.tipRada }}</option>
          }
        </select>

        <label>Količina utrošena</label>
        <input type="number" [(ngModel)]="utrosakKolicina" name="utrosakKolicina">

        <button class="btn" (click)="dodajUtrosak()">Evidentiraj</button>
      </div>

      <div class="card">
        <h3>Evidentirani utrošci</h3>
        <table>
          <tr><th>Datum</th><th>Resurs ID</th><th>Nalog ID</th><th>Količina</th><th>Ukupna cena</th></tr>
          @for (u of utrosci; track u.id) {
            <tr>
              <td>{{ u.datum | date:'dd.MM.yyyy' }}</td>
              <td>{{ u.resursId }}</td>
              <td>{{ u.radniNalogId }}</td>
              <td>{{ u.kolicina }}</td>
              <td>{{ u.ukupnaCena }} RSD</td>
            </tr>
          }
        </table>
      </div>
    </div>
  `
})
export class ResursiComponent implements OnInit {
  resursi: Resurs[] = [];
  utrosci: UtrosakResursa[] = [];
  nalozi: RadniNalog[] = [];

  naziv = '';
  tip: TipResursa = 'Alat';
  jedinicaMere = '';
  kolicina = 0;
  cena = 0;

  utrosakResursId: number | null = null;
  utrosakNalogId: number | null = null;
  utrosakKolicina = 0;

  constructor(
    private servis: ResursiService,
    private naloziServis: RadniNaloziService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.ucitajResurse();
    this.ucitajUtroske();

    // Radnik vidi samo svoje naloge, Nadzornik/Administrator sve
    if (this.auth.imaUlogu('Radnik')) {
      this.naloziServis.getMoji().subscribe((podaci) => this.nalozi = podaci);
    } else {
      this.naloziServis.getSvi().subscribe((podaci) => this.nalozi = podaci);
    }
  }

  ucitajResurse() {
    this.servis.getSvi().subscribe((podaci) => this.resursi = podaci);
  }

  ucitajUtroske() {
    this.servis.getUtroske().subscribe((podaci) => this.utrosci = podaci);
  }

  dodajResurs() {
    this.servis.kreiraj({
      naziv: this.naziv,
      tip: this.tip,
      jedinicaMere: this.jedinicaMere,
      kolicina: this.kolicina,
      cenaPoJedinici: this.cena
    }).subscribe(() => {
      this.naziv = '';
      this.jedinicaMere = '';
      this.kolicina = 0;
      this.cena = 0;
      this.ucitajResurse();
    });
  }

  dodajUtrosak() {
    if (!this.utrosakResursId || !this.utrosakNalogId) {
      alert('Izaberi resurs i radni nalog.');
      return;
    }

    this.servis.kreirajUtrosak({
      resursId: this.utrosakResursId,
      radniNalogId: this.utrosakNalogId,
      kolicina: this.utrosakKolicina
    }).subscribe(() => {
      this.utrosakKolicina = 0;
      this.ucitajUtroske();
      this.ucitajResurse();
    });
  }
}