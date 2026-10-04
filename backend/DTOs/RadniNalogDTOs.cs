using System.ComponentModel.DataAnnotations;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.DTOs
{
    public class RadniNalogCreateDto
    {
        [Required]
        public TipRada TipRada { get; set; }

        public string? Opis { get; set; }

        public DateTime? Rok { get; set; }

        [Required]
        public int ZelenaPovrsinaId { get; set; }

        public int? PrijavaProblemaId { get; set; }

        public int? RadnikId { get; set; }
    }

    public class RadniNalogUpdateStatusDto
    {
        [Required]
        public StatusRadnogNaloga Status { get; set; }
    }

    public class RadniNalogDodeliDto
    {
        [Required]
        public int RadnikId { get; set; }
    }
}
