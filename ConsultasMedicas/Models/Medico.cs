using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConsultasMedicas.Models
{
    public class Medico
    {
        [Key]
        public int IdMedico { get; set; }

        [Required(ErrorMessage = "O campo Nome é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Nome")]
        public string Nome { get; set; }
        [Required(ErrorMessage = "O campo Telefone é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Telefone")]
        
        public string Telefone { get; set; }
        [Required(ErrorMessage = "O campo Email é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "O campo CRM é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "CRM")]
        public string CRM { get; set; }
        [Required(ErrorMessage = "O campo CPF é Obrigatório")]
        [MaxLength(16)]
        [Display(Name = "CPF")]
        public string CPF { get; set; }
        [Required(ErrorMessage = "O campo Senha é Obrigatório")]
        [MaxLength(48)]
        [Display(Name = "Senha")]
        public string Senha { get; set; }
        [Display(Name = "Consultório")]
        [ForeignKey("Consultorio")]
        public int idConsultorio { get; set; }
        [Display(Name = "Especialidade")]
        [ForeignKey("Especialidade")]
        public int idEspecialidade { get; set; }
        [Display(Name = "Sexo")]
        [ForeignKey("Sexo")]
        public int idSexo { get; set; }
        public virtual Sexo Sexo { get; set; }
        public virtual Consultorio Consultorio { get; set; }
        public virtual Especialidade Especialidade { get; set; }

    }
}
