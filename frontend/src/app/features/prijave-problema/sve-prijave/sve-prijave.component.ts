import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrijaveProblemaService } from '../../../core/services/prijave-problema.service';
import { PrijavaProblema, StatusPrijave } from '../../../core/models/prijava-problema.model';

@Component({
  selector: 'app-sve-prijave',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Sve prijave problema</h2>

      @for (prijava of prijave; track prijava.id) {
        <div class="card">
          <h3>{{ prijava.kategorija }} <span class="badge" [class]="bojaStatusa(prijava.status)">{{ prijava.status }}</span></h3>
          <p>{{ prijava.opis }}</p>
          <p style="font-size:13px; color:#666;">
            Prijavio: {{ prijava.gradjanin?.ime }} {{ prijava.gradjanin?.prezime }} •
            Lokacija: {{ prijava.zelenaPovrsina?.naziv }}
          </p>

          <div style="display:flex; gap:8px; margin-top:8px;">
            @if (prijava.status !== 'UObradi') {
              <button class="btn secondary" (click)="promeniStatus(prijava, 'UObradi')">Prebaci u obradu</button>
            }
            @if (prijava.status !== 'Reseno') {
              <button class="btn" (click)="promeniStatus(prijava, 'Reseno')">Označi kao rešeno</button>
            }
            <button class="btn secondary" (click)="napraviNalog(prijava)">Napravi radni nalog</button>
          </div>
        </div>
      } @empty {
        <p>Nema prijavljenih problema.</p>
      }
    </div>
  `
})
export class SvePrijaveComponent implements OnInit {
  prijave: PrijavaProblema[] = [];

  constructor(private servis: PrijaveProblemaService, private router: Router) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.servis.getSve().subscribe((podaci) => this.prijave = podaci);
  }

  promeniStatus(prijava: PrijavaProblema, status: StatusPrijave) {
    this.servis.izmeniStatus(prijava.id, status).subscribe(() => this.ucitaj());
  }

  // prebacuje na formu za kreiranje radnog naloga, sa vec popunjenom prijavom
  napraviNalog(prijava: PrijavaProblema) {
    this.router.navigate(['/radni-nalozi/novi'], { queryParams: { prijavaId: prijava.id, povrsinaId: prijava.zelenaPovrsinaId } });
  }

  bojaStatusa(status: string): string {
    if (status === 'Reseno') return 'zeleno';
    if (status === 'Primljeno') return 'crveno';
    return 'zuto';
  }
}
