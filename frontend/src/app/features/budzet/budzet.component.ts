import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudzetService } from '../../core/services/budzet.service';
import { BudzetPregled } from '../../core/models/budzet.model';

@Component({
  selector: 'app-budzet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="kontejner">
      <h2>Planiranje budžeta</h2>

      <div class="forma">
        <select [(ngModel)]="mesec">
          @for (m of meseci; track m.broj) {
            <option [ngValue]="m.broj">{{ m.naziv }}</option>
          }
        </select>
        <input type="number" [(ngModel)]="godina" placeholder="Godina" />
        <input type="number" [(ngModel)]="planiranIznos" placeholder="Planirani iznos (din)" />
        <button (click)="postaviBudzet()">Sačuvaj budžet</button>
      </div>

      <button class="dugme-pregled" (click)="ucitajPregled()">Prikaži pregled za izabrani mesec</button>

      @if (pregled) {
        <div class="pregled" [class.prekoracen]="pregled.prekoracen">
          <p>Planirano: <b>{{ pregled.planiranIznos }} din</b></p>
          <p>Potrošeno: <b>{{ pregled.potroseno }} din</b></p>
          @if (pregled.prekoracen) {
            <p class="upozorenje">⚠ Budžet je prekoračen za ovaj mesec.</p>
          } @else {
            <p class="ok">Potrošnja je u okviru planiranog budžeta.</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .kontejner { padding: 24px; max-width: 600px; margin: 0 auto; }
    .forma { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    select, input { padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
    button { padding: 8px 14px; border: none; border-radius: 6px; background: var(--boja-dugmad); color: white; cursor: pointer; }
    button:hover { background: var(--boja-dugmad-hover); }
    .dugme-pregled { margin-bottom: 20px; }
    .pregled { padding: 16px; border-radius: 8px; background: white; border: 1px solid #eee; }
    .pregled.prekoracen { border-color: #b00020; }
    .upozorenje { color: #b00020; font-weight: bold; }
    .ok { color: var(--boja-dugmad); font-weight: bold; }
  `],
})
export class BudzetComponent implements OnInit {
  meseci = [
    { broj: 1, naziv: 'Januar' }, { broj: 2, naziv: 'Februar' }, { broj: 3, naziv: 'Mart' },
    { broj: 4, naziv: 'April' }, { broj: 5, naziv: 'Maj' }, { broj: 6, naziv: 'Jun' },
    { broj: 7, naziv: 'Jul' }, { broj: 8, naziv: 'Avgust' }, { broj: 9, naziv: 'Septembar' },
    { broj: 10, naziv: 'Oktobar' }, { broj: 11, naziv: 'Novembar' }, { broj: 12, naziv: 'Decembar' },
  ];

  mesec = new Date().getMonth() + 1;
  godina = new Date().getFullYear();
  planiranIznos = 0;
  pregled: BudzetPregled | null = null;

  constructor(private budzetService: BudzetService) {}

  ngOnInit(): void {
    this.ucitajPregled();
  }

  postaviBudzet(): void {
    this.budzetService.postaviBudzet({ mesec: this.mesec, godina: this.godina, planiranIznos: this.planiranIznos })
      .subscribe(() => this.ucitajPregled());
  }

  ucitajPregled(): void {
    this.budzetService.pregled(this.mesec, this.godina).subscribe((p) => (this.pregled = p));
  }
}