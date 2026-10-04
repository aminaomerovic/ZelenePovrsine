import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { PrijaveProblemaService } from '../../../core/services/prijave-problema.service';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';
import { ZelenaPovrsina } from '../../../core/models/zelena-povrsina.model';
import { KategorijaProblema } from '../../../core/models/prijava-problema.model';

@Component({
  selector: 'app-nova-prijava',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width: 600px;">
      <div class="card">
        <h2>Prijavi problem</h2>

        <label>Zelena površina</label>
        <select [(ngModel)]="zelenaPovrsinaId" name="povrsina">
          <option [ngValue]="null" disabled>Izaberi lokaciju</option>
          @for (p of povrsine; track p.id) {
            <option [ngValue]="p.id">{{ p.naziv }} ({{ p.grad }})</option>
          }
        </select>

        <label>Kategorija problema</label>
        <select [(ngModel)]="kategorija" name="kategorija">
          <option value="SuvoDrvo">Suvo drvo</option>
          <option value="PokvarenRekvizit">Pokvaren rekvizit</option>
          <option value="Smece">Smeće</option>
          <option value="Vandalizam">Vandalizam</option>
          <option value="Ostalo">Ostalo</option>
        </select>

        <label>Opis problema</label>
        <textarea [(ngModel)]="opis" name="opis" rows="3"></textarea>

        <label>Fotografija (link ili opis fotografije)</label>
        <input [(ngModel)]="fotografija" name="fotografija" placeholder="npr. link do slike">

        <label>Tačna lokacija — klikni na mapu</label>
        <div id="mapa-prijava" style="height: 300px; border-radius: 8px; margin-bottom: 12px;"></div>
        <p style="font-size:13px; color:#666;">GPS koordinate: {{ lat | number:'1.5-5' }}, {{ lng | number:'1.5-5' }}</p>

        <button class="btn" (click)="posalji()">Pošalji prijavu</button>
      </div>
    </div>
  `
})
export class NovaPrijavaComponent implements OnInit, AfterViewInit {
  povrsine: ZelenaPovrsina[] = [];
  zelenaPovrsinaId: number | null = null;
  kategorija: KategorijaProblema = 'Ostalo';
  opis = '';
  fotografija = '';

  lat = 43.1367;
  lng = 20.5122;

  private mapa!: L.Map;
  private marker!: L.Marker;

  constructor(
    private prijaveServis: PrijaveProblemaService,
    private povrsineServis: ZelenePovrsineService,
    private router: Router
  ) {}

  ngOnInit() {
    this.povrsineServis.getSve().subscribe((podaci) => this.povrsine = podaci);
  }

  ngAfterViewInit() {
    this.mapa = L.map('mapa-prijava').setView([this.lat, this.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap saradnici'
    }).addTo(this.mapa);

    this.marker = L.marker([this.lat, this.lng]).addTo(this.mapa);

    // svaki klik na mapu automatski salje GPS koordinate uz prijavu
    this.mapa.on('click', (e: L.LeafletMouseEvent) => {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;
      this.marker.setLatLng(e.latlng);
    });
  }

  posalji() {
    if (!this.zelenaPovrsinaId) {
      alert('Izaberi zelenu površinu.');
      return;
    }

    this.prijaveServis.kreiraj({
      opis: this.opis,
      kategorija: this.kategorija,
      fotografija: this.fotografija,
      koordinateLat: this.lat,
      koordinateLng: this.lng,
      zelenaPovrsinaId: this.zelenaPovrsinaId
    }).subscribe(() => this.router.navigate(['/prijave/moje']));
  }
}
