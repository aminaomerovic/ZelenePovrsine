using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public enum TipZelenePovrsine
    {
        Park,
        Drvored,
        Travnjak,
        CvetnaLeja,
        DecjeIgraliste
    }

    public enum StatusZelenePovrsine
    {
        Uredno,
        PotrebnoKosenje,
        PotrebnoOrezivanje,
        PotrebnaPopravkaMobilijara
    }

    public class ZelenaPovrsina
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Naziv { get; set; } = string.Empty;

        [Required]
        public TipZelenePovrsine Tip { get; set; }

        [Required, MaxLength(200)]
        public string Adresa { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Grad { get; set; } = string.Empty;

        public int? KvartId { get; set; }
        public Kvart? Kvart { get; set; }

        public double Povrsina { get; set; }

        public string? Opis { get; set; }

        public DateTime? DatumSadnje { get; set; }

        public DateTime? PoslednjeOdrzavanje { get; set; }

        [Required]
        public StatusZelenePovrsine Status { get; set; } = StatusZelenePovrsine.Uredno;

        public double KoordinateLat { get; set; }

        public double KoordinateLng { get; set; }

        public ICollection<BiljnaVrsta>? BiljneVrste { get; set; }
        [JsonIgnore]
        public ICollection<RadniNalog>? RadniNalozi { get; set; }
        [JsonIgnore]
        public ICollection<PrijavaProblema>? PrijavaProblema { get; set; }
    }
}
