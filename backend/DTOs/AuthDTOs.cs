using System.ComponentModel.DataAnnotations;

namespace ZelenePovrsineAPI.DTOs
{
    public class RegistracijaDto
    {
        [Required, MaxLength(50)]
        public string Ime { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Prezime { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Lozinka { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefon { get; set; }
    }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Lozinka { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public int KorisnikId { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Uloga { get; set; } = string.Empty;
    }
}
