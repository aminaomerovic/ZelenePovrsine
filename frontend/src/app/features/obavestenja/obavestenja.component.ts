import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObavestenjaService } from '../../core/services/obavestenja.service';
import { Obavestenje } from '../../core/models/obavestenje.model';

@Component({
  selector: 'app-obavestenja',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Obaveštenja</h2>

      @for (o of obavestenja; track o.id) {
        <div class="card" [style.opacity]="o.procitano ? 0.6 : 1">
          <h3>{{ o.naslov }} @if (!o.procitano) { <span class="badge crveno">novo</span> }</h3>
          <p>{{ o.sadrzaj }}</p>
          <p style="font-size:13px; color:#666;">{{ o.datum | date:'dd.MM.yyyy HH:mm' }}</p>

          @if (!o.procitano) {
            <button class="btn secondary" (click)="oznaci(o)">Označi kao pročitano</button>
          }
        </div>
      } @empty {
        <p>Nema obaveštenja.</p>
      }
    </div>
  `
})
export class ObavestenjaComponent implements OnInit {
  obavestenja: Obavestenje[] = [];

  constructor(private servis: ObavestenjaService) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.servis.getMoja().subscribe((podaci) => this.obavestenja = podaci);
  }

  oznaci(o: Obavestenje) {
    this.servis.oznaciProcitano(o.id).subscribe(() => this.ucitaj());
  }
}
