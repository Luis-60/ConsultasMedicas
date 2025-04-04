using Microsoft.AspNetCore.Mvc;

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
            return View();
        }
    }
}
