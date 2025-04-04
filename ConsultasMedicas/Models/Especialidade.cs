using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.Models
{
    public class Especialidade
    {
        [Key]
        public int IdEspecialidade { get; set; }
        [MaxLength(50)]
        public string? Nome { get; set; }
    }
}
