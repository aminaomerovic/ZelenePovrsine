import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadniNaloziService } from '../../../core/services/radni-nalozi.service';
import { IzvrsenjaRadaService } from '../../../core/services/izvrsenja-rada.service';
import { RadniNalog } from '../../../core/models/radni-nalog.model';

@Component({
  selector: 'app-moji-nalozi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Moji radni nalozi</h2>

      @for (nalog of nalozi; track nalog.id) {
        <div class="card">
          <h3>{{ nalog.tipRada }} <span class="badge" [class]="bojaStatusa(nalog.status)">{{ nalog.status }}</span></h3>
          <p>{{ nalog.zelenaPovrsina?.naziv }} @if (nalog.opis) { — {{ nalog.opis }} }</p>
          @if (nalog.rok) {
            <p style="font-size:13px; color:#666;">Rok: {{ nalog.rok | date:'dd.MM.yyyy' }}</p>
          }

          @if (nalog.status !== 'Zavrsen') {
            <div style="display:flex; gap:8px; align-items:center; margin-top:8px;">
              <input type="number" style="width:120px; margin:0;" [(ngModel)]="trajanjeMap[nalog.id]" name="trajanje-{{nalog.id}}" placeholder="min">
              <button class="btn secondary" (click)="prijaviIzvrsenje(nalog)">Prijavi izvršenje</button>
              <button class="btn" (click)="zavrsi(nalog)">Označi kao završen</button>
            </div>
          }
        </div>
      } @empty {
        <p>Trenutno nemaš dodeljenih radnih naloga.</p>
      }
    </div>
  `
})
export class MojiNaloziComponent implements OnInit {
  nalozi: RadniNalog[] = [];
  trajanjeMap: { [id: number]: number } = {};

  constructor(
    private naloziServis: RadniNaloziService,
    private izvrsenjaServis: IzvrsenjaRadaService
  ) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.naloziServis.getMoji().subscribe((podaci) => this.nalozi = podaci);
  }

  prijaviIzvrsenje(nalog: RadniNalog) {
    const trajanje = this.trajanjeMap[nalog.id];
    if (!trajanje) {
      alert('Unesi trajanje u minutima.');
      return;
    }

    this.izvrsenjaServis.kreiraj(nalog.id, trajanje).subscribe(() => this.ucitaj());
  }

  zavrsi(nalog: RadniNalog) {
    this.naloziServis.izmeniStatus(nalog.id, 'Zavrsen').subscribe(() => this.ucitaj());
  }

  bojaStatusa(status: string): string {
    if (status === 'Zavrsen') return 'zeleno';
    if (status === 'Otkazan') return 'crveno';
    return 'zuto';
  }
}
