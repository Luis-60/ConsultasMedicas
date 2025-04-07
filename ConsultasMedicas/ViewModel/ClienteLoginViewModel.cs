using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.ViewModel
{
    public class ClienteLoginViewModel
   {
        [Required(ErrorMessage = "O campo Nome é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Nome")]
        public string? Nome { get; set; }

        [Required(ErrorMessage = "O campo Senha é Obrigatório")]
        [MaxLength(48)]
        [Display(Name = "Senha")]
        public string? Senha { get; set; }
    }
}
