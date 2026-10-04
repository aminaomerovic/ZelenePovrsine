using System.ComponentModel.DataAnnotations;

namespace ZelenePovrsineAPI.DTOs
{
    public class IzvrsenjeRadaCreateDto
    {
        [Required]
        public int RadniNalogId { get; set; }

        [Required]
        public int TrajanjeMin { get; set; }
    }
}
