# Zelene Povrsine API

.NET 8 Web API za aplikaciju Zelene Povrsine. Koristi MySQL bazu preko Entity
Framework Core, JWT za autentifikaciju i Swagger za dokumentaciju.

## Pokretanje

```bash
dotnet restore
dotnet ef database update
dotnet run
```

- Konekcija ka bazi i JWT podesavanja su u `appsettings.json`.
- Migracije: `PocetnaMigracija` i `DodajKvartoveIBudzet`.
- Server radi na `http://localhost:5000`, Swagger na `http://localhost:5000/swagger`.

Ako se menjaju modeli, nova migracija se pravi sa:

```bash
dotnet ef migrations add NazivMigracije
dotnet ef database update
```

## Autentifikacija

Posle registracije ili logina API vraca JWT token. Zasticeni endpointi traze
header `Authorization: Bearer <token>`. U Swagger-u se token unosi preko
dugmeta Authorize.

Uloge (enum `UlogaKorisnika`): `Gradjanin`, `Radnik`, `Nadzornik`,
`Administrator`. Registracija uvek pravi Gradjanina, ulogu menja samo
administrator.

Svi datumi se cuvaju i vracaju u UTC formatu (sa `Z` na kraju).

## Endpointi

U zagradi su uloge koje imaju pristup. Gde nije navedeno, dovoljno je biti ulogovan.

### Auth
- `POST /api/auth/registracija` (javno)
- `POST /api/auth/login` (javno)

### Zelene povrsine
- `GET /api/zelenepovrsine`
- `GET /api/zelenepovrsine/{id}`
- `POST /api/zelenepovrsine` (Nadzornik, Administrator)
- `PUT /api/zelenepovrsine/{id}` (Nadzornik, Administrator)
- `DELETE /api/zelenepovrsine/{id}` (Administrator)

### Biljne vrste
- `GET /api/biljnevrste`
- `GET /api/biljnevrste/po-povrsini/{zelenaPovrsinaId}`
- `POST /api/biljnevrste` (Nadzornik, Administrator)
- `DELETE /api/biljnevrste/{id}` (Nadzornik, Administrator)

### Kvartovi
- `GET /api/kvartovi`
- `GET /api/kvartovi/{id}`
- `POST /api/kvartovi` (Administrator)
- `PUT /api/kvartovi/{id}` (Administrator)
- `DELETE /api/kvartovi/{id}` (Administrator, samo ako kvart nije u upotrebi)

### Prijave problema
- `GET /api/prijaveproblema` (Nadzornik, Administrator)
- `GET /api/prijaveproblema/moje` (Gradjanin)
- `GET /api/prijaveproblema/{id}`
- `POST /api/prijaveproblema` (Gradjanin)
- `PUT /api/prijaveproblema/{id}/status` (Nadzornik, Administrator)

### Radni nalozi
- `GET /api/radninalozi` (Nadzornik, Administrator)
- `GET /api/radninalozi/{id}`
- `GET /api/radninalozi/moji` (Radnik)
- `POST /api/radninalozi` (Nadzornik, Administrator)
- `PUT /api/radninalozi/{id}/dodeli` (Nadzornik, Administrator)
- `PUT /api/radninalozi/{id}/status` (Nadzornik, Administrator, Radnik)

Kada nalog vezan za prijavu dobije status Zavrsen, prijava prelazi u Reseno,
upisuje se datum resavanja i gradjaninu se salje obavestenje.

### Izvrsenja rada
- `GET /api/izvrsenjarada` (Nadzornik, Administrator)
- `POST /api/izvrsenjarada` (Radnik)

### Resursi i utrosak
- `GET /api/resursi`
- `POST /api/resursi` (Nadzornik, Administrator)
- `DELETE /api/resursi/{id}` (Administrator)
- `GET /api/utrosciresursa`
- `POST /api/utrosciresursa`
- `GET /api/utrosciresursa/po-lokaciji/{zelenaPovrsinaId}`

### Obavestenja
- `GET /api/obavestenja/moja`
- `POST /api/obavestenja` (Nadzornik, Administrator)
- `PUT /api/obavestenja/{id}/procitano`

### Korisnici
- `GET /api/korisnici` (Administrator)
- `GET /api/korisnici/radnici` (Nadzornik, Administrator)
- `PUT /api/korisnici/{id}/uloga` (Administrator)
- `PUT /api/korisnici/{id}/aktivan` (Administrator)

### Budzet
- `GET /api/budzeti` (Nadzornik, Administrator)
- `GET /api/budzeti/pregled?mesec={m}&godina={g}` (Nadzornik, Administrator)
- `POST /api/budzeti` (Administrator)

### Izvestaji (Nadzornik, Administrator)
- `GET /api/izvestaji/prijave-status`
- `GET /api/izvestaji/po-kvartu`
- `GET /api/izvestaji/prosecno-vreme-resavanja`
- `GET /api/izvestaji/ucestalost-intervencija`
- `GET /api/izvestaji/troskovi-po-lokaciji`
- `GET /api/izvestaji/troskovi-po-mesecu`
- `GET /api/izvestaji/eko-pokazatelji`
