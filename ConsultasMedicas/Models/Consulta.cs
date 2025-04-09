using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ConsultasMedicas.Models;

public class Consulta
{
    [Key]
    public int IdConsulta { get; set; }
    [Display(Name = "Médico")]
    [ForeignKey("Medico")]
    public int IdMedico { get; set; }
    [Display(Name = "Cliente")]
    [ForeignKey("Cliente")]
    public int IdCliente { get; set; }

    [Display(Name = "Horário")]
    [Required(ErrorMessage = "O campo Horário é Obrigatório")]
    [DataType(DataType.Time)]
    public TimeSpan Horario { get; set; }

    [Display(Name = "Data")]
    [Required(ErrorMessage = "O campo Data é Obrigatório")]
    [DataType(DataType.Date)]


    public DateTime Data { get; set; }
    public virtual Medico? Medico { get; set; }
    public virtual Cliente? Cliente { get; set; }
}