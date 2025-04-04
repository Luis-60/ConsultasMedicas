using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConsultasMedicas.Models
{
    public class Consultorio
    {
        [Key]
        public int IdConsultorio { get; set; }
        [Required(ErrorMessage = "O Campo Nome é Obrigatório")]
        [MaxLength(255)]
        [Display(Name = "Nome")]
        public string? Nome { get; set; }
        [MaxLength(50)]        
        [Required(ErrorMessage = "O Campo Endereço é Obrigatório")]
        [Display(Name = "Endereço")]
        public string? Endereco { get; set; }
        [MaxLength(50)]
        [Required(ErrorMessage = "O Campo Cidade é Obrigatório")]
        [Display(Name = "Cidade")]
        public string? Cidade { get; set; }
        [ForeignKey("UF")]
        [Display(Name = "UF")]
        public int IdUF { get; set; }
        public virtual UF? UF { get; set; }


    }
}
