using System.ComponentModel.DataAnnotations;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.DTOs
{
    public class PrijavaProblemaCreateDto
    {
        [Required]
        public string Opis { get; set; } = string.Empty;

        [Required]
        public KategorijaProblema Kategorija { get; set; }

        [MaxLength(255)]
        public string? Fotografija { get; set; }

        public double KoordinateLat { get; set; }

        public double KoordinateLng { get; set; }

        [Required]
        public int ZelenaPovrsinaId { get; set; }
    }

    public class PrijavaProblemaUpdateStatusDto
    {
        [Required]
        public StatusPrijave Status { get; set; }
    }
}
