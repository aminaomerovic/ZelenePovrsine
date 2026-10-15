import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';
import { ZelenaPovrsina } from '../../../core/models/zelena-povrsina.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-lista-zelenih-povrsina',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2>Zelene površine</h2>
        @if (auth.imaUlogu('Nadzornik', 'Administrator')) {
          <a class="btn" routerLink="/zelene-povrsine/nova">+ Nova površina</a>
        }
      </div>

      <label style="display:flex; align-items:center; gap:6px; margin:8px 0 16px;">
        <input type="checkbox" [(ngModel)]="samoSaPrijavama">
        Prikaži samo površine sa nerešenim prijavama
      </label>

      @for (povrsina of prikazanePovrsine; track povrsina.id) {
        <div class="card">
          <h3><a [routerLink]="['/zelene-povrsine', povrsina.id]" style="color:inherit;">{{ povrsina.naziv }}</a> <span class="badge" [class]="bojaStatusa(povrsina.status)">{{ povrsina.status }}</span></h3>
          <p>{{ povrsina.tip }} — {{ povrsina.adresa }}, {{ povrsina.grad }}</p>
          <p>Površina: {{ povrsina.povrsina }} m² @if (povrsina.biljneVrste?.length) { • {{ povrsina.biljneVrste?.length }} biljnih vrsta }</p>
          @if (povrsina.opis) {
            <p style="color:#666;">{{ povrsina.opis }}</p>
          }
          <div style="display:flex; gap:8px; margin-top:8px;">
            @if (auth.imaUlogu('Nadzornik', 'Administrator')) {
              <a class="btn" [routerLink]="['/zelene-povrsine', povrsina.id, 'izmeni']">Izmeni</a>
            }
            @if (auth.imaUlogu('Administrator')) {
              <button class="btn" (click)="obrisi(povrsina.id)">Obriši</button>
            }
          </div>
        </div>
      } @empty {
        @if (samoSaPrijavama) {
          <p>Nema zelenih površina sa nerešenim prijavama.</p>
        } @else {
          <p>Nema unetih zelenih površina.</p>
        }
      }
    </div>
  `
})
export class ListaZelenihPovrsinaComponent implements OnInit {
  povrsine: ZelenaPovrsina[] = [];
  idSaPrijavama = new Set<number>();
  samoSaPrijavama = false;

  constructor(private servis: ZelenePovrsineService, public auth: AuthService) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.servis.getSve().subscribe((podaci) => this.povrsine = podaci);
    this.servis.getIdSaAktivnimPrijavama().subscribe({
      next: (idevi) => this.idSaPrijavama = new Set(idevi),
      error: (greska) => console.error('Greška pri učitavanju površina sa prijavama', greska)
    });
  }

  // ako je cekirano, prikazuju se samo povrsine sa nerešenim prijavama
  get prikazanePovrsine(): ZelenaPovrsina[] {
    if (!this.samoSaPrijavama) return this.povrsine;
    return this.povrsine.filter((p) => this.idSaPrijavama.has(p.id));
  }

  obrisi(id: number) {
    if (!confirm('Da li si sigurna da želiš da obrišeš ovu zelenu površinu?')) return;
    this.servis.obrisi(id).subscribe(() => this.ucitaj());
  }

  bojaStatusa(status: string): string {
    if (status === 'Uredno') return 'zeleno';
    if (status === 'PotrebnaPopravkaMobilijara') return 'crveno';
    return 'zuto';
  }
}