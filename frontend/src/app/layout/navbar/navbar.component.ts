import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ObavestenjaService } from '../../core/services/obavestenja.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <div class="logo">
        <span class="logo-znacka">
          <img src="logo.svg" alt="Logo Zelene površine" width="22" height="22">
        </span>
        <span>Zelene Površine</span>
      </div>

      @if (auth.jeUlogovan()) {
        <button class="hamburger" (click)="preklopiMeni()" aria-label="Otvori meni">
          <span></span><span></span><span></span>
        </button>
      }

      @if (auth.jeUlogovan()) {
        <div class="nav-sadrzaj" [class.otvoren]="menuOtvoren()">
          <div class="linkovi">
            <a routerLink="/zelene-povrsine" routerLinkActive="aktivan" (click)="zatvoriMeni()">Zelene površine</a>
            <a routerLink="/mapa" routerLinkActive="aktivan" (click)="zatvoriMeni()">Mapa</a>
            <a routerLink="/obavestenja" routerLinkActive="aktivan" (click)="zatvoriMeni()">
              Obaveštenja
              @if (obavestenjaServis.brojNeprocitanih() > 0) {
                <span class="tacka-nova"></span>
              }
            </a>

            @if (auth.imaUlogu('Gradjanin')) {
              <a routerLink="/prijave/nova" routerLinkActive="aktivan" (click)="zatvoriMeni()">Prijavi problem</a>
              <a routerLink="/prijave/moje" routerLinkActive="aktivan" (click)="zatvoriMeni()">Moje prijave</a>
            }

            @if (auth.imaUlogu('Radnik')) {
              <a routerLink="/radni-nalozi/moji" routerLinkActive="aktivan" (click)="zatvoriMeni()">Moji nalozi</a>
              <a routerLink="/resursi" routerLinkActive="aktivan" (click)="zatvoriMeni()">Resursi</a>
            }

            @if (auth.imaUlogu('Nadzornik', 'Administrator')) {
              <a routerLink="/radni-nalozi" routerLinkActive="aktivan" (click)="zatvoriMeni()">Radni nalozi</a>
              <a routerLink="/prijave" routerLinkActive="aktivan" (click)="zatvoriMeni()">Sve prijave</a>
              <a routerLink="/resursi" routerLinkActive="aktivan" (click)="zatvoriMeni()">Resursi</a>
              <a routerLink="/izvestaji" routerLinkActive="aktivan" (click)="zatvoriMeni()">Izveštaji</a>
            }

            @if (auth.imaUlogu('Administrator')) {
              <a routerLink="/korisnici" routerLinkActive="aktivan" (click)="zatvoriMeni()">Korisnici</a>
              <a routerLink="/kvartovi" routerLinkActive="aktivan" (click)="zatvoriMeni()">Kvartovi</a>
              <a routerLink="/budzet" routerLinkActive="aktivan" (click)="zatvoriMeni()">Budžet</a>
            }
          </div>

          <div class="korisnicki-deo">
            <span class="korisnik">{{ auth.trenutniKorisnik()?.ime }} ({{ auth.trenutniKorisnik()?.uloga }})</span>
            <button class="btn secondary" (click)="auth.logout()">Odjava</button>
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    nav {
      display: flex;
      align-items: center;
      padding: 10px 24px;
      background: var(--boja-primarna);
      color: white;
      position: relative;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: bold;
      font-family: var(--font-naslov);
      font-size: 17px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .logo-znacka {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--boja-pozadina);
      flex-shrink: 0;
    }

    .logo-znacka img {
      display: block;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 36px;
      height: 36px;
      background: transparent;
      border: none;
      cursor: pointer;
      margin-left: auto;
      padding: 0;
    }

    .hamburger span {
      display: block;
      width: 22px;
      height: 3px;
      background: var(--boja-akcenat);
      border-radius: 2px;
    }

    .nav-sadrzaj {
      display: flex;
      align-items: center;
      flex: 1;
      margin-left: 40px;
    }

    .linkovi {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
      margin: 0 auto;
    }

    .korisnicki-deo {
      display: flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
    }

    a {
      color: #cfd9d0;
      text-decoration: none;
      font-size: 14px;
      position: relative;
    }

    a.aktivan {
      color: var(--boja-akcenat);
      font-weight: bold;
    }

    .tacka-nova {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #e53935;
      border-radius: 50%;
      margin-left: 6px;
      vertical-align: middle;
    }

    .korisnik {
      font-size: 13px;
      opacity: 0.85;
    }

    @media (max-width: 900px) {
      .hamburger {
        display: flex;
      }

      .nav-sadrzaj {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        margin-left: 0;
        background: var(--boja-primarna);
        padding: 12px 24px 20px;
        gap: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        z-index: 20;
      }

      .nav-sadrzaj.otvoren {
        display: flex;
      }

      .linkovi {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        margin: 0;
      }

      .korisnicki-deo {
        justify-content: space-between;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOtvoren = signal(false);
  private interval: any;

  constructor(public auth: AuthService, public obavestenjaServis: ObavestenjaService) {}

  ngOnInit() {
    if (this.auth.jeUlogovan()) {
      this.obavestenjaServis.osveziBrojNeprocitanih();
    }

    // periodicna provera novih obavestenja na svakih 20 sekundi
    this.interval = setInterval(() => {
      if (this.auth.jeUlogovan()) {
        this.obavestenjaServis.osveziBrojNeprocitanih();
      }
    }, 20000);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  preklopiMeni() {
    this.menuOtvoren.update((v) => !v);
  }

  zatvoriMeni() {
    this.menuOtvoren.set(false);
  }
}