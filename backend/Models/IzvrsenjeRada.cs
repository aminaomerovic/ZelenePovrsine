using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public class IzvrsenjeRada
    {
        public int Id { get; set; }

        public DateTime Datum { get; set; } = DateTime.UtcNow;

        public int TrajanjeMin { get; set; }

        public int RadniNalogId { get; set; }
        [JsonIgnore]
        public RadniNalog? RadniNalog { get; set; }

        public int RadnikId { get; set; }
        public Korisnik? Radnik { get; set; }
    }
}