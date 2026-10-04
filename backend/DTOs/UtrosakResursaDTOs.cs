using System.ComponentModel.DataAnnotations;

namespace ZelenePovrsineAPI.DTOs
{
    public class UtrosakResursaCreateDto
    {
        [Required]
        public int ResursId { get; set; }

        [Required]
        public int RadniNalogId { get; set; }

        [Required]
        public double Kolicina { get; set; }
    }
}
