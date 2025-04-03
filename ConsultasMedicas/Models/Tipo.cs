using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.Models
{
    public class Tipo
    {
        [Key]
        public int IdTipo { get; set; }
[Required]
        public string Nome { get; set; }
    }
}
