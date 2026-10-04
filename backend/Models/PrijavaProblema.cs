using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public enum KategorijaProblema
    {
        SuvoDrvo,
        PokvarenRekvizit,
        Smece,
        Vandalizam,
        Ostalo
    }

    public enum StatusPrijave
    {
        Primljeno,
        UObradi,
        Reseno
    }

    public class PrijavaProblema
    {
        public int Id { get; set; }

        [Required]
        public string Opis { get; set; } = string.Empty;

        [Required]
        public KategorijaProblema Kategorija { get; set; }

        [MaxLength(255)]
        public string? Fotografija { get; set; }

        public DateTime DatumPrijave { get; set; } = DateTime.UtcNow;

        public DateTime? DatumResavanja { get; set; }

        [Required]
        public StatusPrijave Status { get; set; } = StatusPrijave.Primljeno;

        public double KoordinateLat { get; set; }

        public double KoordinateLng { get; set; }

        [Required]
        public int GradjaninId { get; set; }
        public Korisnik? Gradjanin { get; set; }

        [Required]
        public int ZelenaPovrsinaId { get; set; }
        public ZelenaPovrsina? ZelenaPovrsina { get; set; }
        [JsonIgnore]
        public RadniNalog? RadniNalog { get; set; }
        [JsonIgnore]
        public ICollection<Obavestenje>? Obavestenja { get; set; }
    }
}
