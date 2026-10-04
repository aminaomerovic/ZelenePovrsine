import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrijaveProblemaService } from '../../../core/services/prijave-problema.service';
import { PrijavaProblema } from '../../../core/models/prijava-problema.model';

@Component({
  selector: 'app-moje-prijave',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Moje prijave</h2>

      @for (prijava of prijave; track prijava.id) {
        <div class="card">
          <h3>{{ prijava.kategorija }} <span class="badge" [class]="bojaStatusa(prijava.status)">{{ prijava.status }}</span></h3>
          <p>{{ prijava.opis }}</p>
          <p style="font-size:13px; color:#666;">
            Prijavljeno: {{ prijava.datumPrijave | date:'dd.MM.yyyy HH:mm' }}
            @if (prijava.datumResavanja) {
              • Rešeno: {{ prijava.datumResavanja | date:'dd.MM.yyyy HH:mm' }}
            }
          </p>
        </div>
      } @empty {
        <p>Još uvek nisi prijavila/prijavio nijedan problem.</p>
      }
    </div>
  `
})
export class MojePrijaveComponent implements OnInit {
  prijave: PrijavaProblema[] = [];

  constructor(private servis: PrijaveProblemaService) {}

  ngOnInit() {
    this.servis.getMoje().subscribe((podaci) => this.prijave = podaci);
  }

  bojaStatusa(status: string): string {
    if (status === 'Reseno') return 'zeleno';
    if (status === 'Primljeno') return 'crveno';
    return 'zuto';
  }
}
