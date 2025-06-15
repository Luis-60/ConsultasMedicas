using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConsultasMedicas.Models
{
    public class Cliente
    {
        [Key]
        public int IdCliente { get; set; }
        [Required(ErrorMessage = "O campo Nome é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Nome")]
        public string? Nome { get; set; }

        [Required(ErrorMessage = "O campo Senha é Obrigatório")]
        [MaxLength(100)]
        public string? Senha { get; set; }

        [Required(ErrorMessage = "O campo Telefone é Obrigatório")]
        [StringLength(11, ErrorMessage = "O telefone deve ter 11 dígitos")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "O telefone deve conter apenas números")]
        [Display(Name = "Telefone")]
        public string? Telefone { get; set; }
        [Required(ErrorMessage = "O campo Email é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Email")]
        public string? Email { get; set; }
        [Required(ErrorMessage = "O campo Data de Nascimento é Obrigatório")]
        [Display(Name = "Data de Nascimento")]
        public DateTime DataNascimento { get; set; }        [Required(ErrorMessage = "O campo CPF é Obrigatório")]
        [StringLength(11, ErrorMessage = "O CPF deve ter 11 dígitos")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "O CPF deve conter apenas números")]
        [Display(Name = "CPF")]
        public string? CPF { get; set; }

        [Display(Name = "Sexo")]
        [Required(ErrorMessage = "O campo Sexo é obrigatório")]
        [ForeignKey("Sexo")]
        public int IdSexo { get; set; }

        public virtual Sexo? Sexo { get; set; }
     
    }
}
