using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.Models
{
    public class MedicoUpdateDTO
    {
        [Required]
        public int IdMedico { get; set; }

        [Required(ErrorMessage = "O campo Nome é Obrigatório")]
        [MaxLength(255)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo Email é Obrigatório")]
        [MaxLength(255)]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "O campo Telefone é Obrigatório")]
        [MaxLength(255)]
        [RegularExpression(@"^[0-9]+$", ErrorMessage = "O telefone deve conter apenas números")]
        public string Telefone { get; set; }

        [MaxLength(48)]
        public string? Senha { get; set; }

        // Campos somente leitura para referência
        public string? CRM { get; set; }
        public string? CPF { get; set; }
        public int IdConsultorio { get; set; }
        public int IdEspecialidade { get; set; }
        public int IdSexo { get; set; }
    }
}
