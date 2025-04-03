using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Consulta
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int IdCliente { get; set; }

    [Required]
    public int IdMedico { get; set; }

    [Required]
    public int IdHorario { get; set; }

    [Required]
    public DateTime DataAtendimento { get; set; }
}