import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { RegistracijaComponent } from './features/auth/registracija/registracija.component';

import { ListaZelenihPovrsinaComponent } from './features/zelene-povrsine/lista/lista.component';
import { FormaZelenaPovrsinaComponent } from './features/zelene-povrsine/forma/forma.component';
import { MapaZelenihPovrsinaComponent } from './features/zelene-povrsine/mapa/mapa.component';

import { NovaPrijavaComponent } from './features/prijave-problema/nova-prijava/nova-prijava.component';
import { MojePrijaveComponent } from './features/prijave-problema/moje-prijave/moje-prijave.component';
import { SvePrijaveComponent } from './features/prijave-problema/sve-prijave/sve-prijave.component';

import { SviNaloziComponent } from './features/radni-nalozi/svi-nalozi/svi-nalozi.component';
import { MojiNaloziComponent } from './features/radni-nalozi/moji-nalozi/moji-nalozi.component';

import { KvartoviComponent } from './features/kvartovi/kvartovi.component';
import { BudzetComponent } from './features/budzet/budzet.component';

import { ResursiComponent } from './features/resursi/resursi.component';
import { ObavestenjaComponent } from './features/obavestenja/obavestenja.component';
import { IzvestajiComponent } from './features/izvestaji/izvestaji.component';
import { DetaljiZelenaPovrsinaComponent } from './features/zelene-povrsine/detalji/detalji.component';
import { KorisniciComponent } from './features/korisnici/korisnici.component';


export const routes: Routes = [
  { path: '', redirectTo: 'zelene-povrsine', pathMatch: 'full' },

  // javne rute - prijava i registracija
  { path: 'prijava', component: LoginComponent },
  { path: 'registracija', component: RegistracijaComponent },

  // zelene povrsine - vide svi ulogovani, uredjuju samo nadzornik/administrator
  { path: 'zelene-povrsine', component: ListaZelenihPovrsinaComponent, canActivate: [authGuard] },
  {
    path: 'zelene-povrsine/nova',
    component: FormaZelenaPovrsinaComponent,
    canActivate: [authGuard, roleGuard(['Nadzornik', 'Administrator'])]
  },
  
{
  path: 'zelene-povrsine/:id/izmeni',
  component: FormaZelenaPovrsinaComponent,
  canActivate: [authGuard, roleGuard(['Nadzornik', 'Administrator'])]
},

  { path: 'mapa', component: MapaZelenihPovrsinaComponent, canActivate: [authGuard] },
  { path: 'zelene-povrsine/:id', component: DetaljiZelenaPovrsinaComponent, canActivate: [authGuard] },

  // prijave problema
  {
    path: 'prijave/nova',
    component: NovaPrijavaComponent,
    canActivate: [authGuard, roleGuard(['Gradjanin'])]
  },
  {
    path: 'prijave/moje',
    component: MojePrijaveComponent,
    canActivate: [authGuard, roleGuard(['Gradjanin'])]
  },
  {
    path: 'prijave',
    component: SvePrijaveComponent,
    canActivate: [authGuard, roleGuard(['Nadzornik', 'Administrator'])]
  },

  { path: 'korisnici', component: KorisniciComponent, canActivate: [authGuard, roleGuard(['Administrator'])] },

  // radni nalozi
  {
    path: 'radni-nalozi',
    component: SviNaloziComponent,
    canActivate: [authGuard, roleGuard(['Nadzornik', 'Administrator'])]
  },
  {
    path: 'radni-nalozi/novi',
    redirectTo: 'radni-nalozi',
    pathMatch: 'full'
  },
  {
    path: 'radni-nalozi/moji',
    component: MojiNaloziComponent,
    canActivate: [authGuard, roleGuard(['Radnik'])]
  },

  { path: 'kvartovi', component: KvartoviComponent, canActivate: [authGuard, roleGuard(['Administrator'])] },
{ path: 'budzet', component: BudzetComponent, canActivate: [authGuard, roleGuard(['Administrator'])] },

  // resursi - samo nadzornik/administrator
{
  path: 'resursi',
  component: ResursiComponent,
  canActivate: [authGuard, roleGuard(['Nadzornik', 'Administrator', 'Radnik'])]
},

  // obavestenja - svi ulogovani vide svoja
  { path: 'obavestenja', component: ObavestenjaComponent, canActivate: [authGuard] },

  // izvestaji - samo nadzornik/administrator
  {
    path: 'izvestaji',
    component: IzvestajiComponent,
    canActivate: [authGuard, roleGuard(['Nadzornik', 'Administrator'])]
  },

  { path: '**', redirectTo: 'zelene-povrsine' }
];
