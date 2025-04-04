using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.Models
{
    public class Tipo
    {
        [Key]
        public int IdTipo { get; set; }
        [MaxLength(50)]
        public string? Nome { get; set; }
    }
}
