using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public class BiljnaVrsta
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Naziv { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Vrsta { get; set; }

        public DateTime? DatumSadnje { get; set; }

        [MaxLength(200)]
        public string? EkoloskiPokazatelj { get; set; }

        [Required]
        public int ZelenaPovrsinaId { get; set; }
        
        [JsonIgnore]
         public ZelenaPovrsina? ZelenaPovrsina { get; set; }
    }
}
