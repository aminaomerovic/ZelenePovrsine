using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Korisnik> Korisnici { get; set; }
        public DbSet<ZelenaPovrsina> ZelenePovrsine { get; set; }
        public DbSet<BiljnaVrsta> BiljneVrste { get; set; }
        public DbSet<RadniNalog> RadniNalozi { get; set; }
        public DbSet<IzvrsenjeRada> IzvrsenjaRada { get; set; }
        public DbSet<PrijavaProblema> PrijaveProblema { get; set; }
        public DbSet<Resurs> Resursi { get; set; }
        public DbSet<UtrosakResursa> UtrosciResursa { get; set; }
        public DbSet<Obavestenje> Obavestenja { get; set; }
        public DbSet<Kvart> Kvartovi { get; set; }
        public DbSet<Budzet> Budzeti { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Korisnik>()
                .HasIndex(k => k.Email)
                .IsUnique();

            modelBuilder.Entity<RadniNalog>()
                .HasOne(rn => rn.ZelenaPovrsina)
                .WithMany(zp => zp.RadniNalozi)
                .HasForeignKey(rn => rn.ZelenaPovrsinaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RadniNalog>()
                .HasOne(rn => rn.Nadzornik)
                .WithMany(k => k.RadniNaloziKaoNadzornik)
                .HasForeignKey(rn => rn.NadzornikId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RadniNalog>()
                .HasOne(rn => rn.Radnik)
                .WithMany(k => k.RadniNaloziKaoRadnik)
                .HasForeignKey(rn => rn.RadnikId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<RadniNalog>()
                .HasOne(rn => rn.PrijavaProblema)
                .WithOne(pp => pp.RadniNalog)
                .HasForeignKey<RadniNalog>(rn => rn.PrijavaProblemaId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<IzvrsenjeRada>()
                .HasOne(ir => ir.RadniNalog)
                .WithMany(rn => rn.IzvrsenjaRada)
                .HasForeignKey(ir => ir.RadniNalogId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IzvrsenjeRada>()
                .HasOne(ir => ir.Radnik)
                .WithMany(k => k.IzvrsenjaRada)
                .HasForeignKey(ir => ir.RadnikId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrijavaProblema>()
                .HasOne(pp => pp.Gradjanin)
                .WithMany(k => k.PrijavaProblema)
                .HasForeignKey(pp => pp.GradjaninId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrijavaProblema>()
                .HasOne(pp => pp.ZelenaPovrsina)
                .WithMany(zp => zp.PrijavaProblema)
                .HasForeignKey(pp => pp.ZelenaPovrsinaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BiljnaVrsta>()
                .HasOne(bv => bv.ZelenaPovrsina)
                .WithMany(zp => zp.BiljneVrste)
                .HasForeignKey(bv => bv.ZelenaPovrsinaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UtrosakResursa>()
                .HasOne(ur => ur.Resurs)
                .WithMany(r => r.UtrosciResursa)
                .HasForeignKey(ur => ur.ResursId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UtrosakResursa>()
                .HasOne(ur => ur.RadniNalog)
                .WithMany(rn => rn.UtrosciResursa)
                .HasForeignKey(ur => ur.RadniNalogId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Obavestenje>()
                .HasOne(o => o.Korisnik)
                .WithMany(k => k.Obavestenja)
                .HasForeignKey(o => o.KorisnikId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Obavestenje>()
                .HasOne(o => o.PrijavaProblema)
                .WithMany(pp => pp.Obavestenja)
                .HasForeignKey(o => o.PrijavaProblemaId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Resurs>()
                .Property(r => r.CenaPoJedinici)
                .HasPrecision(10, 2);

            modelBuilder.Entity<UtrosakResursa>()
                .Property(ur => ur.UkupnaCena)
                .HasPrecision(10, 2);

            modelBuilder.Entity<ZelenaPovrsina>()
                .HasOne(z => z.Kvart)
                .WithMany(k => k.ZelenePovrsine)
                .HasForeignKey(z => z.KvartId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Budzet>()
                .Property(b => b.PlaniranIznos)
                .HasPrecision(10, 2);

            // datumi kao UTC
            var utcKonverter = new ValueConverter<DateTime, DateTime>(
                v => v,
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            var utcKonverterNullable = new ValueConverter<DateTime?, DateTime?>(
                v => v,
                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

            foreach (var entitet in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entitet.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                        property.SetValueConverter(utcKonverter);
                    else if (property.ClrType == typeof(DateTime?))
                        property.SetValueConverter(utcKonverterNullable);
                }
            }
        }
    }
}
