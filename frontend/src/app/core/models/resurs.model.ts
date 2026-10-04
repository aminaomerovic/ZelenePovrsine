export type TipResursa = 'Gorivo' | 'Voda' | 'Alat' | 'Sadnice';

export interface Resurs {
  id: number;
  naziv: string;
  tip: TipResursa;
  jedinicaMere: string;
  kolicina: number;
  cenaPoJedinici: number;
}

export interface ResursForma {
  naziv: string;
  tip: TipResursa;
  jedinicaMere: string;
  kolicina: number;
  cenaPoJedinici: number;
}

export interface UtrosakResursa {
  id: number;
  kolicina: number;
  ukupnaCena: number;
  datum: string;
  resursId: number;
  radniNalogId: number;
}

export interface UtrosakResursaForma {
  resursId: number;
  radniNalogId: number;
  kolicina: number;
}
