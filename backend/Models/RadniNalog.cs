using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public enum TipRada
    {
        Kosenje,
        Zalivanje,
        Sadnja,
        Orezivanje,
        CiscenjeOtpada,
        PopravkaMobilijara
    }

    public enum StatusRadnogNaloga
    {
        Otvoren,
        UToku,
        Zavrsen,
        Otkazan
    }

    public class RadniNalog
    {
        public int Id { get; set; }

        [Required]
        public TipRada TipRada { get; set; }

        public string? Opis { get; set; }

        public DateTime DatumKreiranja { get; set; } = DateTime.UtcNow;

        public DateTime? Rok { get; set; }

        [Required]
        public StatusRadnogNaloga Status { get; set; } = StatusRadnogNaloga.Otvoren;

        [Required]
        public int ZelenaPovrsinaId { get; set; }
        public ZelenaPovrsina? ZelenaPovrsina { get; set; }

        [Required]
        public int NadzornikId { get; set; }
        public Korisnik? Nadzornik { get; set; }

        public int? RadnikId { get; set; }
        public Korisnik? Radnik { get; set; }

        public int? PrijavaProblemaId { get; set; }
        public PrijavaProblema? PrijavaProblema { get; set; }

        public ICollection<IzvrsenjeRada>? IzvrsenjaRada { get; set; }

        [JsonIgnore]
        public ICollection<UtrosakResursa>? UtrosciResursa { get; set; }
    }
}
