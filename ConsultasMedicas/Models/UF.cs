using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.Models
{
    public class UF
    {
        [Key]
        public int IdUF { get; set; }
        [MaxLength(2)]
        public string? Nome { get; set; }
    }
}
