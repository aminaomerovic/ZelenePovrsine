# Zelene Povrsine

Web aplikacija za evidenciju i odrzavanje gradskih zelenih povrsina. Gradjani
prijavljuju probleme (suvo drvo, polomljen mobilijar, smece...), nadzornici
prave radne naloge i dodeljuju ih radnicima, a administrator upravlja
korisnicima, kvartovima i budzetom. Sistem prati utrosak resursa i troskove i
daje osnovne izvestaje.

## Tehnologije

- Backend: .NET 8 Web API, Entity Framework Core, MySQL (Pomelo), JWT autentifikacija, BCrypt
- Frontend: Angular 18 (standalone komponente), Leaflet za mapu
- Swagger za testiranje API-ja

## Struktura

- `backend/` .NET Web API
- `frontend/` Angular aplikacija

## Pokretanje

Potrebno je: .NET 8 SDK, `dotnet-ef` alat, Node.js 18+ i MySQL server.

### Backend

1. U `backend/appsettings.json` podesiti konekciju ka MySQL bazi (`DefaultConnection`).
2. U folderu `backend`:
   ```bash
   dotnet restore
   dotnet ef database update
   dotnet run
   ```
   Komanda `database update` primenjuje postojece migracije (`PocetnaMigracija`
   i `DodajKvartoveIBudzet`) i pravi bazu `zelene_povrsine` ako ne postoji.
3. API radi na `http://localhost:5000`, Swagger je na `http://localhost:5000/swagger`.

### Frontend

1. U folderu `frontend`:
   ```bash
   npm install
   ng serve
   ```
2. Aplikacija je na `http://localhost:4200`.

Adresa API-ja je u `src/environments/environment.ts` (podrazumevano
`http://localhost:5000/api`).

### Prvi administrator

Javna registracija uvek pravi nalog sa ulogom Gradjanin. Prvi administrator se
postavlja direktno u bazi:

```sql
UPDATE Korisnici SET Uloga = 3 WHERE Email = 'admin@primer.com';
```

Posle toga administrator ostalim korisnicima menja ulogu na stranici Korisnici.

## Uloge

| Uloga | Mogucnosti |
|---|---|
| Gradjanin | prijava problema, pregled svojih prijava i obavestenja |
| Radnik | pregled dodeljenih naloga, promena statusa, unos izvrsenog rada |
| Nadzornik | zelene povrsine, radni nalozi, prijave, resursi, izvestaji |
| Administrator | sve navedeno + korisnici, kvartovi i budzet |

## Funkcionalnosti

- Evidencija zelenih povrsina sa mapom (Leaflet), statusom, kvartom i biljnim vrstama
- Prijava problema sa opisom, kategorijom, fotografijom i lokacijom na mapi
- Radni nalozi: kreiranje, dodela radniku, statusi Otvoren, U toku, Zavrsen, Otkazan
- Kada se radni nalog vezan za prijavu zavrsi, prijava automatski prelazi u
  status Reseno i gradjanin dobija obavestenje
- Resursi (gorivo, voda, alat, sadnice) i utrosak po radnom nalogu
- Mesecni budzet i poredjenje planiranog i potrosenog iznosa
- Izvestaji: prijave po statusu, prosecno vreme resavanja, ucestalost
  intervencija, troskovi po lokaciji i po mesecu, eko pokazatelji

Spisak API endpointa je u `backend/README.md`.

## Poznata ogranicenja

- Fotografija uz prijavu se cuva kao tekst (naziv fajla ili link), nema pravog
  upload-a fajla.
- Mapa prikazuje sacuvane lokacije, nema pracenja lokacije u realnom vremenu.
- Obavestenja postoje samo unutar aplikacije, nema slanja email-a ili SMS-a.
- Na macOS-u port 5000 moze da zauzme AirPlay Receiver. U tom slucaju treba
  ga iskljuciti u podesavanjima ili promeniti port u `launchSettings.json` i
  `environment.ts`.
