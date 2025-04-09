using ConsultasMedicas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultasMedicas.Controllers
{
    public class ConsultorioController : Controller
    {
        private readonly AppDbContext _context;

        public ConsultorioController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var consultorios = await _context.Consultorios
                .Include(c => c.UF) // Inclui os dados da UF relacionada
                .ToListAsync();
            return View(consultorios);
        }
        public async Task<IActionResult> CriarConsultorio()
        {
            ViewBag.UFs = await _context.UFs.ToListAsync(); // Carrega os dados da tabela UF
            return View();
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdUF,Cidade,Endereco,Nome")] Consultorio consultorio)
        {
            if (ModelState.IsValid)
            {
                _context.Add(consultorio);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(consultorio);
        }
        public async Task<IActionResult> Editar(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var consultorio = await _context.Consultorios
                .Include(c => c.UF) // Inclui os dados da UF relacionada
                .FirstOrDefaultAsync(c => c.IdConsultorio == id);

            if (consultorio == null)
            {
                return NotFound();
            }

            ViewBag.UFs = await _context.UFs.ToListAsync(); // Carrega os dados da tabela UF para o dropdown
            return View(consultorio);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Editar(int id, [Bind("IdConsultorio,IdUF,Cidade,Endereco,Nome")] Consultorio consultorio)
        {
            if (id != consultorio.IdConsultorio)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(consultorio);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Consultorios.Any(c => c.IdConsultorio == consultorio.IdConsultorio))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }

            ViewBag.UFs = await _context.UFs.ToListAsync(); // Recarrega os dados da tabela UF em caso de erro
            return View(consultorio);
        }
        public async Task<IActionResult> Deletar(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var consultorio = await _context.Consultorios
                .Include(c => c.UF) // Inclui os dados da UF relacionada
                .FirstOrDefaultAsync(c => c.IdConsultorio == id);

            if (consultorio == null)
            {
                return NotFound();
            }

            return View(consultorio);
        }


        [HttpPost, ActionName("Deletar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletarConfirmado(int id)
        {
            var consultorio = await _context.Consultorios.FindAsync(id);
            if (consultorio != null)
            {
                try
                {
                    _context.Consultorios.Remove(consultorio);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {

                    TempData["ErroConsultorio"] = "Não é possível deletar este consultório porque ele possui médicos vinculados.";
                    return RedirectToAction("Index", "Consultorio");
                }

            }

            return RedirectToAction(nameof(Index));
        }
    }
}