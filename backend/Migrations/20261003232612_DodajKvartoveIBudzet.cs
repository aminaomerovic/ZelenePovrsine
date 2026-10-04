using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZelenePovrsineAPI.Migrations
{
    /// <inheritdoc />
    public partial class DodajKvartoveIBudzet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KvartId",
                table: "ZelenePovrsine",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Budzeti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Mesec = table.Column<int>(type: "int", nullable: false),
                    Godina = table.Column<int>(type: "int", nullable: false),
                    PlaniranIznos = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    DatumKreiranja = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Budzeti", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Kvartovi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Naziv = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kvartovi", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ZelenePovrsine_KvartId",
                table: "ZelenePovrsine",
                column: "KvartId");

            migrationBuilder.AddForeignKey(
                name: "FK_ZelenePovrsine_Kvartovi_KvartId",
                table: "ZelenePovrsine",
                column: "KvartId",
                principalTable: "Kvartovi",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ZelenePovrsine_Kvartovi_KvartId",
                table: "ZelenePovrsine");

            migrationBuilder.DropTable(
                name: "Budzeti");

            migrationBuilder.DropTable(
                name: "Kvartovi");

            migrationBuilder.DropIndex(
                name: "IX_ZelenePovrsine_KvartId",
                table: "ZelenePovrsine");

            migrationBuilder.DropColumn(
                name: "KvartId",
                table: "ZelenePovrsine");
        }
    }
}
