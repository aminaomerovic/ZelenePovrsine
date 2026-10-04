namespace ZelenePovrsineAPI.Models
{
    public class UtrosakResursa
    {
        public int Id { get; set; }

        public double Kolicina { get; set; }

        public decimal UkupnaCena { get; set; }

        public DateTime Datum { get; set; } = DateTime.UtcNow;

        public int ResursId { get; set; }
        public Resurs? Resurs { get; set; }

        public int RadniNalogId { get; set; }
        public RadniNalog? RadniNalog { get; set; }
    }
}
