using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.ViewModel
{
    public class ClienteLoginViewModel
   {        [Required(ErrorMessage = "O campo Email é Obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "O campo Senha é Obrigatório")]
        [MaxLength(48)]
        [Display(Name = "Senha")]
        public string? Senha { get; set; }
    }
}
