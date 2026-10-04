using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZelenePovrsineAPI.Migrations
{
    /// <inheritdoc />
    public partial class PocetnaMigracija : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Ime = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Prezime = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LozinkaHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefon = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DatumRegistracije = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Aktivan = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Uloga = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Resursi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Naziv = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Tip = table.Column<int>(type: "int", nullable: false),
                    JedinicaMere = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Kolicina = table.Column<double>(type: "double", nullable: false),
                    CenaPoJedinici = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resursi", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ZelenePovrsine",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Naziv = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Tip = table.Column<int>(type: "int", nullable: false),
                    Adresa = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Grad = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Povrsina = table.Column<double>(type: "double", nullable: false),
                    Opis = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DatumSadnje = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PoslednjeOdrzavanje = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    KoordinateLat = table.Column<double>(type: "double", nullable: false),
                    KoordinateLng = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZelenePovrsine", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BiljneVrste",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Naziv = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Vrsta = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DatumSadnje = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EkoloskiPokazatelj = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ZelenaPovrsinaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BiljneVrste", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BiljneVrste_ZelenePovrsine_ZelenaPovrsinaId",
                        column: x => x.ZelenaPovrsinaId,
                        principalTable: "ZelenePovrsine",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PrijaveProblema",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Opis = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Kategorija = table.Column<int>(type: "int", nullable: false),
                    Fotografija = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DatumPrijave = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DatumResavanja = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    KoordinateLat = table.Column<double>(type: "double", nullable: false),
                    KoordinateLng = table.Column<double>(type: "double", nullable: false),
                    GradjaninId = table.Column<int>(type: "int", nullable: false),
                    ZelenaPovrsinaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrijaveProblema", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrijaveProblema_Korisnici_GradjaninId",
                        column: x => x.GradjaninId,
                        principalTable: "Korisnici",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PrijaveProblema_ZelenePovrsine_ZelenaPovrsinaId",
                        column: x => x.ZelenaPovrsinaId,
                        principalTable: "ZelenePovrsine",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Obavestenja",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Naslov = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Sadrzaj = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Tip = table.Column<int>(type: "int", nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Procitano = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    KorisnikId = table.Column<int>(type: "int", nullable: false),
                    PrijavaProblemaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Obavestenja", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Obavestenja_Korisnici_KorisnikId",
                        column: x => x.KorisnikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Obavestenja_PrijaveProblema_PrijavaProblemaId",
                        column: x => x.PrijavaProblemaId,
                        principalTable: "PrijaveProblema",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RadniNalozi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TipRada = table.Column<int>(type: "int", nullable: false),
                    Opis = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DatumKreiranja = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Rok = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ZelenaPovrsinaId = table.Column<int>(type: "int", nullable: false),
                    NadzornikId = table.Column<int>(type: "int", nullable: false),
                    RadnikId = table.Column<int>(type: "int", nullable: true),
                    PrijavaProblemaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RadniNalozi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RadniNalozi_Korisnici_NadzornikId",
                        column: x => x.NadzornikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RadniNalozi_Korisnici_RadnikId",
                        column: x => x.RadnikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_RadniNalozi_PrijaveProblema_PrijavaProblemaId",
                        column: x => x.PrijavaProblemaId,
                        principalTable: "PrijaveProblema",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_RadniNalozi_ZelenePovrsine_ZelenaPovrsinaId",
                        column: x => x.ZelenaPovrsinaId,
                        principalTable: "ZelenePovrsine",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IzvrsenjaRada",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Datum = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TrajanjeMin = table.Column<int>(type: "int", nullable: false),
                    RadniNalogId = table.Column<int>(type: "int", nullable: false),
                    RadnikId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IzvrsenjaRada", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IzvrsenjaRada_Korisnici_RadnikId",
                        column: x => x.RadnikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IzvrsenjaRada_RadniNalozi_RadniNalogId",
                        column: x => x.RadniNalogId,
                        principalTable: "RadniNalozi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UtrosciResursa",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Kolicina = table.Column<double>(type: "double", nullable: false),
                    UkupnaCena = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ResursId = table.Column<int>(type: "int", nullable: false),
                    RadniNalogId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UtrosciResursa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UtrosciResursa_RadniNalozi_RadniNalogId",
                        column: x => x.RadniNalogId,
                        principalTable: "RadniNalozi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UtrosciResursa_Resursi_ResursId",
                        column: x => x.ResursId,
                        principalTable: "Resursi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_BiljneVrste_ZelenaPovrsinaId",
                table: "BiljneVrste",
                column: "ZelenaPovrsinaId");

            migrationBuilder.CreateIndex(
                name: "IX_IzvrsenjaRada_RadnikId",
                table: "IzvrsenjaRada",
                column: "RadnikId");

            migrationBuilder.CreateIndex(
                name: "IX_IzvrsenjaRada_RadniNalogId",
                table: "IzvrsenjaRada",
                column: "RadniNalogId");

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_Email",
                table: "Korisnici",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Obavestenja_KorisnikId",
                table: "Obavestenja",
                column: "KorisnikId");

            migrationBuilder.CreateIndex(
                name: "IX_Obavestenja_PrijavaProblemaId",
                table: "Obavestenja",
                column: "PrijavaProblemaId");

            migrationBuilder.CreateIndex(
                name: "IX_PrijaveProblema_GradjaninId",
                table: "PrijaveProblema",
                column: "GradjaninId");

            migrationBuilder.CreateIndex(
                name: "IX_PrijaveProblema_ZelenaPovrsinaId",
                table: "PrijaveProblema",
                column: "ZelenaPovrsinaId");

            migrationBuilder.CreateIndex(
                name: "IX_RadniNalozi_NadzornikId",
                table: "RadniNalozi",
                column: "NadzornikId");

            migrationBuilder.CreateIndex(
                name: "IX_RadniNalozi_PrijavaProblemaId",
                table: "RadniNalozi",
                column: "PrijavaProblemaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RadniNalozi_RadnikId",
                table: "RadniNalozi",
                column: "RadnikId");

            migrationBuilder.CreateIndex(
                name: "IX_RadniNalozi_ZelenaPovrsinaId",
                table: "RadniNalozi",
                column: "ZelenaPovrsinaId");

            migrationBuilder.CreateIndex(
                name: "IX_UtrosciResursa_RadniNalogId",
                table: "UtrosciResursa",
                column: "RadniNalogId");

            migrationBuilder.CreateIndex(
                name: "IX_UtrosciResursa_ResursId",
                table: "UtrosciResursa",
                column: "ResursId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BiljneVrste");

            migrationBuilder.DropTable(
                name: "IzvrsenjaRada");

            migrationBuilder.DropTable(
                name: "Obavestenja");

            migrationBuilder.DropTable(
                name: "UtrosciResursa");

            migrationBuilder.DropTable(
                name: "RadniNalozi");

            migrationBuilder.DropTable(
                name: "Resursi");

            migrationBuilder.DropTable(
                name: "PrijaveProblema");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "ZelenePovrsine");
        }
    }
}
