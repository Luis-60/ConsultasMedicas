using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.Models
{
    public class Sexo
    {
        [Key]
        public int IdSexo { get; set; }
        [MaxLength(50)]
        public string? Nome { get; set; }
    }
}
