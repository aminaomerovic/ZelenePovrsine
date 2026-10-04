import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IzvestajiService } from '../../core/services/izvestaji.service';
import { BudzetService } from '../../core/services/budzet.service';
import { BudzetPregled } from '../../core/models/budzet.model';

@Component({
  selector: 'app-izvestaji',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Izveštaji i analitika</h2>

      <div class="card">
        <h3>Prijave po statusu</h3>
        <p>Ukupno prijava: <b>{{ prijaveStatus?.ukupno || 0 }}</b></p>
        <table>
          <tr><th>Status</th><th>Broj</th></tr>
          @for (s of prijaveStatus?.poStatusu; track s.status) {
            <tr><td>{{ s.status }}</td><td>{{ s.broj }}</td></tr>
          }
        </table>
      </div>

      <div class="card">
        <h3>Prosečno vreme rešavanja prijava</h3>
        <p style="font-size:22px;"><b>{{ prosecnoVreme?.prosecnoVremeSati || 0 }}</b> sati</p>
        <p style="font-size:13px; color:#666;">Na osnovu {{ prosecnoVreme?.brojResenih || 0 }} rešenih prijava</p>
      </div>

      <div class="card">
        <h3>Učestalost intervencija po tipu rada</h3>
        <table>
          <tr><th>Tip rada</th><th>Broj naloga</th></tr>
          @for (i of ucestalost; track i.tipRada) {
            <tr><td>{{ i.tipRada }}</td><td>{{ i.broj }}</td></tr>
          }
        </table>
      </div>

      <div class="card">
        <h3>Troškovi po mesecima</h3>
        <table>
          <tr><th>Mesec</th><th>Ukupan trošak</th></tr>
          @for (t of troskovi; track t.mesec) {
            <tr><td>{{ t.mesec }}/{{ t.godina }}</td><td>{{ t.ukupanTrosak }} RSD</td></tr>
          }
        </table>
      </div>

      <div class="card">
        <h3>Eko pokazatelji</h3>
        <p>Ukupno posađenih biljaka: <b>{{ ekoPokazatelji?.ukupnoBiljaka || 0 }}</b></p>
        <p>Procenjeno smanjenje emisije CO₂: <b>{{ ekoPokazatelji?.proceniCO2KgGodisnje || 0 }} kg/godišnje</b></p>
        <table>
          <tr><th>Vrsta</th><th>Broj</th></tr>
          @for (v of ekoPokazatelji?.biodiverzitet; track v.vrsta) {
            <tr><td>{{ v.vrsta }}</td><td>{{ v.broj }}</td></tr>
          }
        </table>
      </div>

      <div class="card">
        <h3>Zelene površine po kvartu</h3>
        <table>
          <tr><th>Kvart</th><th>Broj površina</th></tr>
          @for (k of poKvartu; track k.kvart) {
            <tr><td>{{ k.kvart }}</td><td>{{ k.brojPovrsina }}</td></tr>
          }
        </table>
      </div>

      <div class="card">
        <h3>Budžet — tekući mesec</h3>
        @if (budzetPregled) {
          <p>Planirano: <b>{{ budzetPregled.planiranIznos }} RSD</b></p>
          <p>Potrošeno: <b>{{ budzetPregled.potroseno }} RSD</b></p>
          @if (budzetPregled.prekoracen) {
            <p style="color:#b00020; font-weight:bold;">⚠ Budžet je prekoračen za ovaj mesec.</p>
          } @else {
            <p style="color:#2C6E63; font-weight:bold;">Potrošnja je u okviru planiranog budžeta.</p>
          }
        }
      </div>
    </div>
  `
})
export class IzvestajiComponent implements OnInit {
  prijaveStatus: any;
  prosecnoVreme: any;
  ucestalost: any[] = [];
  troskovi: any[] = [];
  ekoPokazatelji: any;
  poKvartu: any[] = [];
  budzetPregled: BudzetPregled | null = null;

  constructor(
    private servis: IzvestajiService,
    private budzetServis: BudzetService
  ) {}

  ngOnInit() {
    this.servis.prijavePoStatusu().subscribe((p) => this.prijaveStatus = p);
    this.servis.prosecnoVremeResavanja().subscribe((p) => this.prosecnoVreme = p);
    this.servis.ucestalostIntervencija().subscribe((p) => this.ucestalost = p);
    this.servis.troskoviPoMesecu().subscribe((p) => this.troskovi = p);
    this.servis.ekoPokazatelji().subscribe((p) => this.ekoPokazatelji = p);
    this.servis.poKvartu().subscribe((p) => this.poKvartu = p);

    const sad = new Date();
    this.budzetServis.pregled(sad.getMonth() + 1, sad.getFullYear()).subscribe((p) => this.budzetPregled = p);
  }
}