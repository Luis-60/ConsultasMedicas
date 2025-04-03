using Microsoft.AspNetCore.Mvc;

namespace ConsultasMedicas.Controllers
{
    public class MedicoController : Controller
    {
        public IActionResult Create()
        {
            return View();
        }
    }
}
