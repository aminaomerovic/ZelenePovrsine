using System.ComponentModel.DataAnnotations;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.DTOs
{
    public class ObavestenjeCreateDto
    {
        [Required, MaxLength(100)]
        public string Naslov { get; set; } = string.Empty;

        [Required]
        public string Sadrzaj { get; set; } = string.Empty;

        [Required]
        public TipObavestenja Tip { get; set; }

        [Required]
        public int KorisnikId { get; set; }

        public int? PrijavaProblemaId { get; set; }
    }
}
