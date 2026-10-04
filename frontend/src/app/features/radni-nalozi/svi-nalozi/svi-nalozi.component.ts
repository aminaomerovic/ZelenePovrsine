import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RadniNaloziService } from '../../../core/services/radni-nalozi.service';
import { ZelenePovrsineService } from '../../../core/services/zelene-povrsine.service';
import { KorisniciService, RadnikKratko } from '../../../core/services/korisnici.service';
import { RadniNalog, RadniNalogForma, StatusRadnogNaloga, TipRada } from '../../../core/models/radni-nalog.model';
import { ZelenaPovrsina } from '../../../core/models/zelena-povrsina.model';

@Component({
  selector: 'app-svi-nalozi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Radni nalozi</h2>

      <div class="card">
        <h3>Novi radni nalog</h3>

        <select [(ngModel)]="tipRada" name="tipRada">
        <option value="Kosenje">Košenje</option>
        <option value="Zalivanje">Zalivanje</option>
        <option value="Sadnja">Sadnja</option>
        <option value="Orezivanje">Orezivanje</option>
        <option value="CiscenjeOtpada">Čišćenje otpada</option>
        <option value="PopravkaMobilijara">Popravka mobilijara</option>
        </select>

        <label>Zelena površina</label>
        
        <select [(ngModel)]="zelenaPovrsinaId" name="povrsina" [disabled]="!!prijavaProblemaId">
          <option [ngValue]="null" disabled>Izaberi lokaciju</option>
          @for (p of povrsine; track p.id) {
            <option [ngValue]="p.id">{{ p.naziv }}</option>
          }
        </select>

        <label>Opis</label>
        <textarea [(ngModel)]="opis" name="opis" rows="2"></textarea>

        <label>Rok</label>
        <input type="date" [(ngModel)]="rok" name="rok">

        <button class="btn" (click)="kreiraj()">Kreiraj nalog</button>
      </div>

      @for (nalog of nalozi; track nalog.id) {
        <div class="card">
          <h3>{{ nalog.tipRada }} <span class="badge" [class]="bojaStatusa(nalog.status)">{{ nalog.status }}</span></h3>
          <p>{{ nalog.zelenaPovrsina?.naziv }} @if (nalog.opis) { — {{ nalog.opis }} }</p>
          <p style="font-size:13px; color:#666;">
            Dodeljen: {{ nalog.radnik?.ime || 'niko još' }}
            @if (nalog.rok) { • Rok: {{ nalog.rok | date:'dd.MM.yyyy' }} }
          </p>

          <div style="display:flex; gap:8px; margin-top:8px; align-items:center;">
            <select [(ngModel)]="dodelaMap[nalog.id]" name="dodela-{{nalog.id}}">
              <option [ngValue]="null" disabled>Dodeli radnika</option>
              @for (r of radnici; track r.id) {
                <option [ngValue]="r.id">{{ r.ime }} {{ r.prezime }}</option>
              }
            </select>
            <button class="btn secondary" (click)="dodeli(nalog)">Dodeli</button>

            @if (nalog.status !== 'Zavrsen') {
              <button class="btn" (click)="promeniStatus(nalog, 'Zavrsen')">Označi kao završen</button>
            }
          </div>
        </div>
      } @empty {
        <p>Nema kreiranih radnih naloga.</p>
      }
    </div>
  `
})
export class SviNaloziComponent implements OnInit {
  nalozi: RadniNalog[] = [];
  povrsine: ZelenaPovrsina[] = [];
  radnici: RadnikKratko[] = [];

  tipRada: TipRada = 'Kosenje';
  zelenaPovrsinaId: number | null = null;
  opis = '';
  rok = '';
  prijavaProblemaId: number | null = null;

  dodelaMap: { [id: number]: number | null } = {};

  constructor(
    private servis: RadniNaloziService,
    private povrsineServis: ZelenePovrsineService,
    private korisniciServis: KorisniciService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ucitaj();
    this.povrsineServis.getSve().subscribe((podaci) => this.povrsine = podaci);
    this.korisniciServis.getRadnici().subscribe((podaci) => this.radnici = podaci);

    this.route.queryParams.subscribe((params) => {
      if (params['povrsinaId']) this.zelenaPovrsinaId = +params['povrsinaId'];
      if (params['prijavaId']) this.prijavaProblemaId = +params['prijavaId'];
    });
  }

  ucitaj() {
    this.servis.getSvi().subscribe((podaci) => {
      this.nalozi = podaci;
      podaci.forEach((n) => this.dodelaMap[n.id] = null);
    });
  }

  kreiraj() {
    if (!this.zelenaPovrsinaId) {
      alert('Izaberi zelenu površinu.');
      return;
    }

    const forma: RadniNalogForma = {
      tipRada: this.tipRada,
      opis: this.opis,
      rok: this.rok || undefined,
      zelenaPovrsinaId: this.zelenaPovrsinaId,
      prijavaProblemaId: this.prijavaProblemaId ?? undefined
    };

    this.servis.kreiraj(forma).subscribe(() => {
      this.opis = '';
      this.rok = '';
      this.prijavaProblemaId = null;
      this.zelenaPovrsinaId = null;
      this.ucitaj();
    });
  }

  dodeli(nalog: RadniNalog) {
    const radnikId = this.dodelaMap[nalog.id];
    if (!radnikId) return;
    this.servis.dodeliRadnika(nalog.id, radnikId).subscribe(() => this.ucitaj());
  }

  promeniStatus(nalog: RadniNalog, status: StatusRadnogNaloga) {
    this.servis.izmeniStatus(nalog.id, status).subscribe(() => this.ucitaj());
  }

  bojaStatusa(status: string): string {
    if (status === 'Zavrsen') return 'zeleno';
    if (status === 'Otkazan') return 'crveno';
    return 'zuto';
  }
}