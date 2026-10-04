import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';

@Component({
  selector: 'app-mapa-zelenih-povrsina',
  standalone: true,
  template: `
    <div class="container">
      <h2>Mapa zelenih površina</h2>
      <div id="mapa-glavna" style="height: 550px; border-radius: 10px;"></div>
    </div>
  `
})
export class MapaZelenihPovrsinaComponent implements AfterViewInit {
  private mapa!: L.Map;

  constructor(private servis: ZelenePovrsineService) {}

  ngAfterViewInit() {
    // centar mape - Novi Pazar, moze se prilagoditi
    this.mapa = L.map('mapa-glavna').setView([43.1367, 20.5122], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap saradnici'
    }).addTo(this.mapa);

    // ucitavamo sve povrsine i dodajemo marker za svaku
    this.servis.getSve().subscribe((povrsine) => {
      povrsine.forEach((p) => {
        L.marker([p.koordinateLat, p.koordinateLng])
          .addTo(this.mapa)
          .bindPopup(`<b>${p.naziv}</b><br>${p.tip}<br>Status: ${p.status}`);
      });
    });
  }
}
