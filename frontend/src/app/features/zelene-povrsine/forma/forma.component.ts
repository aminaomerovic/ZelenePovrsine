import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';
import { KvartService } from '../../../core/services/kvart.service';
import { TipZelenePovrsine } from '../../../core/models/zelena-povrsina.model';
import { Kvart } from '../../../core/models/kvart.model';

type StatusZelenePovrsine = 'Uredno' | 'PotrebnoKosenje' | 'PotrebnoOrezivanje' | 'PotrebnaPopravkaMobilijara';

@Component({
  selector: 'app-forma-zelena-povrsina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width: 600px;">
      <div class="card">
        <h2>{{ idZaIzmenu ? 'Izmeni zelenu površinu' : 'Nova zelena površina' }}</h2>

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

        @if (idZaIzmenu) {
          <label>Status</label>
          <select [(ngModel)]="status" name="status">
            <option value="Uredno">Uredno</option>
            <option value="PotrebnoKosenje">Potrebno košenje</option>
            <option value="PotrebnoOrezivanje">Potrebno orezivanje</option>
            <option value="PotrebnaPopravkaMobilijara">Potrebna popravka mobilijara</option>
          </select>

          <label>Poslednje održavanje</label>
          <input type="date" [(ngModel)]="poslednjeOdrzavanje" name="poslednjeOdrzavanje">
        }

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
  status: StatusZelenePovrsine = 'Uredno';
  poslednjeOdrzavanje?: string;
  adresa = '';
  grad = '';
  povrsina = 0;
  opis = '';
  kvartId?: number;
  kvartovi: Kvart[] = [];

  idZaIzmenu?: number;

  lat = 43.1367;
  lng = 20.5122;

  private mapa!: L.Map;
  private marker!: L.Marker;

  constructor(
    private servis: ZelenePovrsineService,
    private kvartServis: KvartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.kvartServis.getSve().subscribe((k) => (this.kvartovi = k));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idZaIzmenu = Number(idParam);
      this.servis.getJedna(this.idZaIzmenu).subscribe((zp: any) => {
        this.naziv = zp.naziv;
        this.tip = zp.tip as TipZelenePovrsine;
        this.status = zp.status as StatusZelenePovrsine;
        this.poslednjeOdrzavanje = zp.poslednjeOdrzavanje ? zp.poslednjeOdrzavanje.substring(0, 10) : undefined;
        this.adresa = zp.adresa;
        this.grad = zp.grad;
        this.povrsina = zp.povrsina;
        this.opis = zp.opis ?? '';
        this.kvartId = zp.kvartId;
        this.lat = zp.koordinateLat;
        this.lng = zp.koordinateLng;

        if (this.mapa) {
          this.mapa.setView([this.lat, this.lng], 13);
          this.marker.setLatLng([this.lat, this.lng]);
        }
      });
    }
  }

  ngAfterViewInit() {
    this.mapa = L.map('mapa-forma').setView([this.lat, this.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap saradnici'
    }).addTo(this.mapa);

    this.marker = L.marker([this.lat, this.lng]).addTo(this.mapa);

    this.mapa.on('click', (e: L.LeafletMouseEvent) => {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;
      this.marker.setLatLng(e.latlng);
    });
  }

  sacuvaj() {
    if (this.idZaIzmenu) {
      this.servis.izmeni(this.idZaIzmenu, {
        naziv: this.naziv,
        tip: this.tip,
        status: this.status,
        poslednjeOdrzavanje: this.poslednjeOdrzavanje ? new Date(this.poslednjeOdrzavanje) : undefined,
        adresa: this.adresa,
        grad: this.grad,
        povrsina: this.povrsina,
        opis: this.opis,
        koordinateLat: this.lat,
        koordinateLng: this.lng,
        kvartId: this.kvartId
      } as any).subscribe(() => this.router.navigate(['/zelene-povrsine']));
    } else {
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
}