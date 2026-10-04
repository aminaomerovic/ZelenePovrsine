using System.ComponentModel.DataAnnotations;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.DTOs
{
    public class ZelenaPovrsinaCreateDto
    {
        [Required, MaxLength(100)]
        public string Naziv { get; set; } = string.Empty;

        [Required]
        public TipZelenePovrsine Tip { get; set; }

        [Required, MaxLength(200)]
        public string Adresa { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Grad { get; set; } = string.Empty;

        public double Povrsina { get; set; }

        public string? Opis { get; set; }

        public DateTime? DatumSadnje { get; set; }

        public double KoordinateLat { get; set; }

        public double KoordinateLng { get; set; }

        public int? KvartId { get; set; }
    }

    public class ZelenaPovrsinaUpdateDto : ZelenaPovrsinaCreateDto
    {
        [Required]
        public StatusZelenePovrsine Status { get; set; }

        public DateTime? PoslednjeOdrzavanje { get; set; }
    }
}