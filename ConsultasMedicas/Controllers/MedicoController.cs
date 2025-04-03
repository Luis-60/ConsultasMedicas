using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace ConsultasMedicas.Controllers
{
    public class MedicoController : Controller
    {
        public IActionResult Registrar()
        {
            // Mock data for demonstration
            ViewBag.Especialidade = new List<SelectListItem>
            {
                new SelectListItem { Value = "1", Text = "Cardiologia" },
                new SelectListItem { Value = "2", Text = "Dermatologia" }
            };

            ViewBag.Consultorio = new List<SelectListItem>
            {
                new SelectListItem { Value = "1", Text = "Consultório A" },
                new SelectListItem { Value = "2", Text = "Consultório B" }
            };

            return View();
        }
        public IActionResult Login()
        {
            return View();
        }
    }
}
