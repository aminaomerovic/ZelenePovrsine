namespace ZelenePovrsineAPI.Models
{
    public class Budzet
    {
        public int Id { get; set; }
        public int Mesec { get; set; } // 1-12
        public int Godina { get; set; }
        public decimal PlaniranIznos { get; set; }
        public DateTime DatumKreiranja { get; set; } = DateTime.UtcNow;
    }
}