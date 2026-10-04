import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';
import { ZelenaPovrsina } from '../../../core/models/zelena-povrsina.model';

@Component({
  selector: 'app-detalji-zelena-povrsina',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" style="max-width:600px;">
      @if (povrsina) {
        <a routerLink="/zelene-povrsine" style="font-size:13px;">← Nazad na listu</a>
        <div class="card">
          <h2>{{ povrsina.naziv }} <span class="badge" [class]="bojaStatusa(povrsina.status)">{{ povrsina.status }}</span></h2>
          <p>{{ povrsina.tip }} — {{ povrsina.adresa }}, {{ povrsina.grad }}</p>
          <p>Kvart: {{ povrsina.kvart?.naziv || 'nije određen' }}</p>
          <p>Površina: {{ povrsina.povrsina }} m²</p>
          @if (povrsina.opis) { <p>{{ povrsina.opis }}</p> }
          @if (povrsina.datumSadnje) { <p style="font-size:13px; color:#666;">Zasađeno: {{ povrsina.datumSadnje | date:'dd.MM.yyyy' }}</p> }
          @if (povrsina.poslednjeOdrzavanje) { <p style="font-size:13px; color:#666;">Poslednje održavanje: {{ povrsina.poslednjeOdrzavanje | date:'dd.MM.yyyy' }}</p> }

          @if (povrsina.biljneVrste?.length) {
            <h3>Biljne vrste</h3>
            <ul>
              @for (b of povrsina.biljneVrste; track b.id) {
                <li>{{ b.naziv }} @if (b.vrsta) { ({{ b.vrsta }}) }</li>
              }
            </ul>
          }
        </div>
      } @else {
        <p>Učitavanje...</p>
      }
    </div>
  `
})
export class DetaljiZelenaPovrsinaComponent implements OnInit {
  povrsina: ZelenaPovrsina | null = null;

  constructor(private route: ActivatedRoute, private servis: ZelenePovrsineService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.servis.getJedna(id).subscribe((p) => this.povrsina = p);
  }

  bojaStatusa(status: string): string {
    if (status === 'Uredno') return 'zeleno';
    if (status === 'PotrebnaPopravkaMobilijara') return 'crveno';
    return 'zuto';
  }
}