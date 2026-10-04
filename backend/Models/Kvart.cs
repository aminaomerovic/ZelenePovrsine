using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public class Kvart
    {
        public int Id { get; set; }
        public string Naziv { get; set; } = string.Empty;

        // povratna kolekcija, ne prikazuje se u JSON-u da ne pravi krug
        [JsonIgnore]
        public ICollection<ZelenaPovrsina> ZelenePovrsine { get; set; } = new List<ZelenaPovrsina>();
    }
}