import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KvartService } from '../../core/services/kvart.service';
import { Kvart } from '../../core/models/kvart.model';

@Component({
  selector: 'app-kvartovi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="kontejner">
      <h2>Kvartovi</h2>

      <div class="forma-dodavanje">
        <input [(ngModel)]="noviNaziv" placeholder="Naziv kvarta" />
        <button (click)="dodajKvart()">Dodaj</button>
      </div>

      @if (greska) {
        <p class="greska">{{ greska }}</p>
      }

      <table>
        <thead><tr><th>Naziv</th><th></th></tr></thead>
        <tbody>
          @for (k of kvartovi; track k.id) {
            <tr>
              <td>
                @if (izmenaId === k.id) {
                  <input [(ngModel)]="izmenaNaziv" />
                } @else {
                  {{ k.naziv }}
                }
              </td>
              <td>
                @if (izmenaId === k.id) {
                  <button (click)="sacuvajIzmenu(k)">Sačuvaj</button>
                  <button (click)="otkaziIzmenu()">Otkaži</button>
                } @else {
                  <button (click)="pokreniIzmenu(k)">Izmeni</button>
                  <button (click)="obrisiKvart(k.id)">Obriši</button>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="2">Nema unetih kvartova.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .kontejner { padding: 24px; max-width: 600px; margin: 0 auto; }
    .forma-dodavanje { display: flex; gap: 8px; margin-bottom: 20px; }
    input { padding: 8px; border: 1px solid #ccc; border-radius: 6px; flex: 1; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
    button { margin-right: 6px; padding: 6px 12px; border: none; border-radius: 6px; background: var(--boja-dugmad); color: white; cursor: pointer; }
    button:hover { background: var(--boja-dugmad-hover); }
    .greska { color: #b00020; }
  `],
})
export class KvartoviComponent implements OnInit {
  kvartovi: Kvart[] = [];
  noviNaziv = '';
  greska = '';
  izmenaId: number | null = null;
  izmenaNaziv = '';

  constructor(private kvartService: KvartService) {}

  ngOnInit(): void {
    this.ucitaj();
  }

  ucitaj(): void {
    this.kvartService.getSve().subscribe((podaci) => (this.kvartovi = podaci));
  }

  dodajKvart(): void {
    if (!this.noviNaziv.trim()) return;
    this.kvartService.dodaj({ naziv: this.noviNaziv }).subscribe({
      next: () => { this.noviNaziv = ''; this.greska = ''; this.ucitaj(); },
      error: () => (this.greska = 'Greška pri dodavanju kvarta.'),
    });
  }

  pokreniIzmenu(k: Kvart): void {
    this.izmenaId = k.id;
    this.izmenaNaziv = k.naziv;
  }

  otkaziIzmenu(): void {
    this.izmenaId = null;
  }

  sacuvajIzmenu(k: Kvart): void {
    this.kvartService.izmeni(k.id, { naziv: this.izmenaNaziv }).subscribe(() => {
      this.izmenaId = null;
      this.ucitaj();
    });
  }

  obrisiKvart(id: number): void {
    this.kvartService.obrisi(id).subscribe({
      next: () => this.ucitaj(),
      error: () => (this.greska = 'Kvart se koristi kod postojećih zelenih površina i ne može se obrisati.'),
    });
  }
}