using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConsultasMedicas.Models
{
    public class Medico
    {
        [Key]
        [Required(ErrorMessage = "O campo Id é Obrigatório")]
        public int IdMedico { get; set; }

        [Required(ErrorMessage = "O campo Nome é Obrigatório")]
        [MaxLength(255)]
        public string Nome { get; set; }
        [Display(Name = "Consultório")]
        [ForeignKey("Consultorio")]
        public int idConsultorio { get; set; }
        [Display(Name = "Especialidade")]
        [ForeignKey("Especialidade")]
        public int idEspecialidade { get; set; }

        public virtual Consultorio Consultorio { get; set; }
        public virtual Especialidade Especialidade { get; set; }

    }
}
