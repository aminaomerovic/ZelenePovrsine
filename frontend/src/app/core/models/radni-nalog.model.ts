import { Korisnik } from './korisnik.model';
import { ZelenaPovrsina } from './zelena-povrsina.model';

export type TipRada = 'Kosenje' | 'Zalivanje' | 'Sadnja' | 'Orezivanje' | 'CiscenjeOtpada' | 'PopravkaMobilijara';
export type StatusRadnogNaloga = 'Otvoren' | 'UToku' | 'Zavrsen' | 'Otkazan';

export interface IzvrsenjeRada {
  id: number;
  datum: string;
  trajanjeMin: number;
  radniNalogId: number;
  radnikId: number;
  radnik?: Korisnik;
}

export interface RadniNalog {
  id: number;
  tipRada: TipRada;
  opis?: string;
  datumKreiranja: string;
  rok?: string;
  status: StatusRadnogNaloga;
  zelenaPovrsinaId: number;
  zelenaPovrsina?: ZelenaPovrsina;
  nadzornikId: number;
  nadzornik?: Korisnik;
  radnikId?: number;
  radnik?: Korisnik;
  prijavaProblemaId?: number;
  izvrsenjaRada?: IzvrsenjeRada[];
}

export interface RadniNalogForma {
  tipRada: TipRada;
  opis?: string;
  rok?: string;
  zelenaPovrsinaId: number;
  prijavaProblemaId?: number;
  radnikId?: number;
}
