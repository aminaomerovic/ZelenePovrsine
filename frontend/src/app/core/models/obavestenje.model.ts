export type TipObavestenja = 'StatusPrijave' | 'NoveSadnice' | 'EkoAkcija' | 'InternaKomunikacija';

export interface Obavestenje {
  id: number;
  naslov: string;
  sadrzaj: string;
  tip: TipObavestenja;
  datum: string;
  procitano: boolean;
  korisnikId: number;
  prijavaProblemaId?: number;
}

export interface ObavestenjeForma {
  naslov: string;
  sadrzaj: string;
  tip: TipObavestenja;
  korisnikId: number;
  prijavaProblemaId?: number;
}
