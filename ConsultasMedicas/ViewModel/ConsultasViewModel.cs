using System.ComponentModel.DataAnnotations;

namespace ConsultasMedicas.ViewModels
{
    public class ConsultaViewModel
    {
        // Dados da Consulta
        public int IdConsulta { get; set; }
        [Display(Name = "Data")]
        public DateTime Data { get; set; }
        [Display(Name = "Horário")]
        public TimeSpan Horario { get; set; }

        // Dados do Cliente
        public int IdCliente { get; set; }
        [Display(Name = "Nome do Cliente")]
        public string? NomeCliente { get; set; }
        [Display(Name = "Email do Cliente")]
        public string? EmailCliente { get; set; }
        [Display(Name = "Telefone do Cliente")]
        public string? TelefoneCliente { get; set; }

        // Dados da Especialidade
        public int IdEspecialidade { get; set; }
        [Display(Name = "Especialidade")]
        public string? NomeEspecialidade { get; set; }

        // Dados do Consultório
        public int IdConsultorio { get; set; }
        [Display(Name = "Consultório")]
        public string? NomeConsultorio { get; set; }
        [Display(Name = "Endereço")]
        public string? EnderecoConsultorio { get; set; }
        [Display(Name = "Cidade")]
        public string? CidadeConsultorio { get; set; }
        [Display(Name = "UF")]
        public string? UFConsultorio { get; set; }
    }
}