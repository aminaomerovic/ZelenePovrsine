export interface Budzet {
  id: number;
  mesec: number;
  godina: number;
  planiranIznos: number;
  datumKreiranja?: string;
}

export interface BudzetPregled {
  mesec: number;
  godina: number;
  planiranIznos: number;
  potroseno: number;
  prekoracen: boolean;
}