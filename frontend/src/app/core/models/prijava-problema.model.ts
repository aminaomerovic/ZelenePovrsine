import { Korisnik } from './korisnik.model';
import { ZelenaPovrsina } from './zelena-povrsina.model';

export type KategorijaProblema = 'SuvoDrvo' | 'PokvarenRekvizit' | 'Smece' | 'Vandalizam' | 'Ostalo';
export type StatusPrijave = 'Primljeno' | 'UObradi' | 'Reseno';

export interface PrijavaProblema {
  id: number;
  opis: string;
  kategorija: KategorijaProblema;
  fotografija?: string;
  datumPrijave: string;
  datumResavanja?: string;
  status: StatusPrijave;
  koordinateLat: number;
  koordinateLng: number;
  gradjaninId: number;
  gradjanin?: Korisnik;
  zelenaPovrsinaId: number;
  zelenaPovrsina?: ZelenaPovrsina;
}

export interface PrijavaProblemaForma {
  opis: string;
  kategorija: KategorijaProblema;
  fotografija?: string;
  koordinateLat: number;
  koordinateLng: number;
  zelenaPovrsinaId: number;
}
