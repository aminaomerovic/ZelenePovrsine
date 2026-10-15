import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';

// crveni marker za povrsine sa nerešenim prijavama (iste dimenzije kao podrazumevani plavi)
const crveniMarker = L.divIcon({
  className: '',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#d32f2f" stroke="#8e1b1b" stroke-width="1"/>
    <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
  </svg>`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

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
    // centar mapa
    this.mapa = L.map('mapa-glavna').setView([43.1367, 20.5122], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap saradnici'
    }).addTo(this.mapa);

    // ucitavanje povrsina i dodavanje markera
    // povrsine sa nerešenim prijavama dobijaju crveni marker
    forkJoin({
      povrsine: this.servis.getSve(),
      idSaPrijavama: this.servis.getIdSaAktivnimPrijavama()
    }).subscribe(({ povrsine, idSaPrijavama }) => {
      const saPrijavama = new Set(idSaPrijavama);
      povrsine.forEach((p) => {
        const imaPrijavu = saPrijavama.has(p.id);
        const marker = imaPrijavu
          ? L.marker([p.koordinateLat, p.koordinateLng], { icon: crveniMarker })
          : L.marker([p.koordinateLat, p.koordinateLng]);
        marker
          .addTo(this.mapa)
          .bindPopup(`<b>${p.naziv}</b><br>${p.tip}<br>Status: ${p.status}` +
            (imaPrijavu ? '<br><span style="color:#d32f2f;">Ima nerešenu prijavu</span>' : ''));
      });
    });
  }
}
