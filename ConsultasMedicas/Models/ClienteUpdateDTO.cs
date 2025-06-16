using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.Models
{
    public class ClienteUpdateDTO
    {
        [Required(ErrorMessage = "O ID do cliente é obrigatório")]
        public int IdCliente { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório")]
        [StringLength(255, ErrorMessage = "O nome deve ter no máximo 255 caracteres")]        public string? Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório")]
        [StringLength(11, ErrorMessage = "O telefone deve ter 11 dígitos")]
        [RegularExpression(@"^\d{10,11}$", ErrorMessage = "O telefone deve conter apenas números e ter entre 10 e 11 dígitos")]
        public string? Telefone { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "A senha deve ter no máximo 500 caracteres")]
        public string? Senha { get; set; }
    }
}
