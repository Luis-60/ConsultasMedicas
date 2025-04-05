using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;

namespace SeuProjeto.ViewModels
{
    public class ConsultaViewModel
    {
        public Consulta Consulta { get; set; } = new Consulta();
        public int IdMedico { get; set; }
        public int IdEspecialidade { get; set; }
        public int IdUF { get; set; }
        public DateTime Data { get; set; }
        public TimeSpan Horario { get; set; }

        // Listas para os combos
        public List<SelectListItem> UFs { get; set; } = new();
        public List<SelectListItem> Especialidades { get; set; } = new();
        public List<SelectListItem> Medicos { get; set; } = new();

        public List<SelectListItem> Consultorios { get; set; } = new();

        public List<SelectListItem> Horarios { get; set; } = new(); 
    }
}