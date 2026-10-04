using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public enum TipResursa
    {
        Gorivo,
        Voda,
        Alat,
        Sadnice
    }

    public class Resurs
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Naziv { get; set; } = string.Empty;

        [Required]
        public TipResursa Tip { get; set; }

        [Required, MaxLength(20)]
        public string JedinicaMere { get; set; } = string.Empty;

        public double Kolicina { get; set; }

        public decimal CenaPoJedinici { get; set; }
        [JsonIgnore]
        public ICollection<UtrosakResursa>? UtrosciResursa { get; set; }
    }
}
