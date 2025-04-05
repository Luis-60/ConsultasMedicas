using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Reflection.Metadata.Ecma335;

namespace ConsultasMedicas.Controllers
{
    public class Cliente : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Registrar()
        {
            return View();
        }


        public IActionResult MarcarConsulta()
        {
            ViewBag.UFs = new List<SelectListItem>
    {
        new SelectListItem { Value = "1", Text = "SP" },
        new SelectListItem { Value = "2", Text = "RJ" },
        new SelectListItem { Value = "3", Text = "MG" }
    };

            ViewBag.Especialidades = new List<SelectListItem>
    {
        new SelectListItem { Value = "1", Text = "Cardiologista" },
        new SelectListItem { Value = "2", Text = "Dermatologista" },
        new SelectListItem { Value = "3", Text = "Ortopedista" }
    };

            ViewBag.Medicos = new List<SelectListItem>
    {
        new SelectListItem { Value = "1", Text = "Dra. Ana Paula" },
        new SelectListItem { Value = "2", Text = "Dr. João Souza" },
        new SelectListItem { Value = "3", Text = "Dr. Pedro Mendes" }
    };
            ViewBag.Consultorios = new List<SelectListItem>
    {
        new SelectListItem { Value = "1", Text = "Santa Casa de Aparecida" },
        new SelectListItem { Value = "2", Text = "José Alfredo da Paz" },
        new SelectListItem { Value = "3", Text = "Albert Einstein dos Pobres" }
    };
            ViewBag.Horarios = new List<SelectListItem>
{
        new SelectListItem { Value = "06:00", Text = "06:00" },
        new SelectListItem { Value = "06:30", Text = "06:30" },
        new SelectListItem { Value = "07:00", Text = "07:00" },
        new SelectListItem { Value = "07:30", Text = "07:30" },
        new SelectListItem { Value = "08:00", Text = "08:00" },
        new SelectListItem { Value = "08:30", Text = "08:30" },
        new SelectListItem { Value = "09:00", Text = "09:00" },
        new SelectListItem { Value = "09:30", Text = "09:30" },
        new SelectListItem { Value = "10:00", Text = "10:00" },
        new SelectListItem { Value = "10:30", Text = "10:30" },
        new SelectListItem { Value = "11:00", Text = "11:00" },
        new SelectListItem { Value = "11:30", Text = "11:30" },
        new SelectListItem { Value = "13:30", Text = "13:30" },
        new SelectListItem { Value = "14:00", Text = "14:00" },
        new SelectListItem { Value = "14:30", Text = "14:30" },
        new SelectListItem { Value = "15:00", Text = "15:00" },
        new SelectListItem { Value = "15:30", Text = "15:30" },
        new SelectListItem { Value = "16:00", Text = "16:00" },
        new SelectListItem { Value = "16:30", Text = "16:30" },
        new SelectListItem { Value = "17:00", Text = "17:00" },
        new SelectListItem { Value = "17:30", Text = "17:30" },
        new SelectListItem { Value = "18:00", Text = "18:00" }
};

            return View();

        }
        public IActionResult VerConsultas()
        {
            return View();

        }

    }
}
