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
        [MaxLength(48)]
        public string? Senha { get; set; }
        [Required(ErrorMessage = "O campo Telefone é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Telefone")]
        public string? Telefone { get; set; }
        [Required(ErrorMessage = "O campo Email é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Email")]
        public string? Email { get; set; }
        [Required(ErrorMessage = "O campo Data de Nascimento é Obrigatório")]
        [Display(Name = "Data de Nascimento")]
        public DateTime DataNascimento { get; set; }
        [Required(ErrorMessage = "O campo CPF é Obrigatório")]
        [MaxLength(16)]
        [Display(Name = "CPF")]
        public int CPF { get; set; }
        [Display(Name = "Sexo")]
        [ForeignKey("Sexo")]
        public int IdSexo { get; set; }
        public virtual Sexo? Sexo { get; set;}
     
    }
}
