using System.ComponentModel.DataAnnotations;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.DTOs
{
    public class ResursCreateDto
    {
        [Required, MaxLength(100)]
        public string Naziv { get; set; } = string.Empty;

        [Required]
        public TipResursa Tip { get; set; }

        [Required, MaxLength(20)]
        public string JedinicaMere { get; set; } = string.Empty;

        public double Kolicina { get; set; }

        public decimal CenaPoJedinici { get; set; }
    }
}
