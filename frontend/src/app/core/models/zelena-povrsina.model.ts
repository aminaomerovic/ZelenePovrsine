export type TipZelenePovrsine = 'Park' | 'Drvored' | 'Travnjak' | 'CvetnaLeja' | 'DecjeIgraliste';
export type StatusZelenePovrsine = 'Uredno' | 'PotrebnoKosenje' | 'PotrebnoOrezivanje' | 'PotrebnaPopravkaMobilijara';
import { Kvart } from './kvart.model';



export interface BiljnaVrsta {
  id: number;
  naziv: string;
  vrsta?: string;
  datumSadnje?: string;
  ekoloskiPokazatelj?: string;
  zelenaPovrsinaId: number;
}

export interface ZelenaPovrsina {
  id: number;
  naziv: string;
  tip: TipZelenePovrsine;
  adresa: string;
  grad: string;
  povrsina: number;
  opis?: string;
  datumSadnje?: string;
  poslednjeOdrzavanje?: string;
  status: StatusZelenePovrsine;
  koordinateLat: number;
  koordinateLng: number;
  biljneVrste?: BiljnaVrsta[];
  kvartId?: number;
  kvart?: Kvart;
}

// koristi se pri kreiranju/izmeni - id i status se ne salju pri kreiranju
export interface ZelenaPovrsinaForma {
  naziv: string;
  tip: TipZelenePovrsine;
  adresa: string;
  grad: string;
  povrsina: number;
  opis?: string;
  datumSadnje?: string;
  koordinateLat: number;
  koordinateLng: number;
  status?: StatusZelenePovrsine;
  poslednjeOdrzavanje?: string;
  kvartId?: number;
}