using System.ComponentModel.DataAnnotations;

namespace ZelenePovrsineAPI.DTOs
{
    public class BiljnaVrstaCreateDto
    {
        [Required, MaxLength(100)]
        public string Naziv { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Vrsta { get; set; }

        public DateTime? DatumSadnje { get; set; }

        [MaxLength(200)]
        public string? EkoloskiPokazatelj { get; set; }

        [Required]
        public int ZelenaPovrsinaId { get; set; }
    }
}
