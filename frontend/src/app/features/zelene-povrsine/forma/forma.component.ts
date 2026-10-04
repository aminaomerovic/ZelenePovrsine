import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';
import { KvartService } from '../../../core/services/kvart.service';
import { TipZelenePovrsine } from '../../../core/models/zelena-povrsina.model';
import { Kvart } from '../../../core/models/kvart.model';

@Component({
  selector: 'app-forma-zelena-povrsina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width: 600px;">
      <div class="card">
        <h2>Nova zelena površina</h2>

        <label>Naziv</label>
        <input [(ngModel)]="naziv" name="naziv">

        <label>Tip</label>
        <select [(ngModel)]="tip" name="tip">
          <option value="Park">Park</option>
          <option value="Drvored">Drvored</option>
          <option value="Travnjak">Travnjak</option>
          <option value="CvetnaLeja">Cvetna leja</option>
          <option value="DecjeIgraliste">Dečje igralište</option>
        </select>

        <label>Kvart</label>
        <select [(ngModel)]="kvartId" name="kvartId">
          <option [ngValue]="undefined">-- Izaberi kvart --</option>
          @for (k of kvartovi; track k.id) {
            <option [ngValue]="k.id">{{ k.naziv }}</option>
          }
        </select>

        <label>Adresa</label>
        <input [(ngModel)]="adresa" name="adresa" autocomplete="off">

        <label>Grad</label>
        <input [(ngModel)]="grad" name="grad" autocomplete="off">

        <label>Površina (m²)</label>
        <input type="number" [(ngModel)]="povrsina" name="povrsina">

        <label>Opis</label>
        <textarea [(ngModel)]="opis" name="opis" rows="3"></textarea>

        <label>Lokacija — klikni na mapu da postaviš tačku</label>
        <div id="mapa-forma" style="height: 300px; border-radius: 8px; margin-bottom: 12px;"></div>
        <p style="font-size:13px; color:#666;">Koordinate: {{ lat | number:'1.5-5' }}, {{ lng | number:'1.5-5' }}</p>

        <button class="btn" (click)="sacuvaj()">Sačuvaj</button>
      </div>
    </div>
  `
})
export class FormaZelenaPovrsinaComponent implements OnInit, AfterViewInit {
  naziv = '';
  tip: TipZelenePovrsine = 'Park';
  adresa = '';
  grad = '';
  povrsina = 0;
  opis = '';
  kvartId?: number;
  kvartovi: Kvart[] = [];

  // pocetne koordinate - centar Novog Pazara, korisnik klikom menja
  lat = 43.1367;
  lng = 20.5122;

  private mapa!: L.Map;
  private marker!: L.Marker;

  constructor(
    private servis: ZelenePovrsineService,
    private kvartServis: KvartService,
    private router: Router
  ) {}

  ngOnInit() {
    // ucitavanje kvartova za padajuci meni
    this.kvartServis.getSve().subscribe((k) => (this.kvartovi = k));
  }

  ngAfterViewInit() {
    this.mapa = L.map('mapa-forma').setView([this.lat, this.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap saradnici'
    }).addTo(this.mapa);

    this.marker = L.marker([this.lat, this.lng]).addTo(this.mapa);

    // klik na mapu pomera marker i cuva koordinate
    this.mapa.on('click', (e: L.LeafletMouseEvent) => {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;
      this.marker.setLatLng(e.latlng);
    });
  }

  sacuvaj() {
    this.servis.kreiraj({
      naziv: this.naziv,
      tip: this.tip,
      adresa: this.adresa,
      grad: this.grad,
      povrsina: this.povrsina,
      opis: this.opis,
      koordinateLat: this.lat,
      koordinateLng: this.lng,
      kvartId: this.kvartId
    }).subscribe(() => this.router.navigate(['/zelene-povrsine']));
  }
}