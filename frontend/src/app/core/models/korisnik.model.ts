// uloge moraju da se poklapaju sa enumom UlogaKorisnika na backendu
export type UlogaKorisnika = 'Gradjanin' | 'Radnik' | 'Nadzornik' | 'Administrator';

export interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  uloga: UlogaKorisnika;
}

export interface AuthResponse {
  token: string;
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;
  uloga: UlogaKorisnika;
}

export interface RegistracijaZahtev {
  ime: string;
  prezime: string;
  email: string;
  lozinka: string;
  telefon?: string;
}

export interface LoginZahtev {
  email: string;
  lozinka: string;
}
