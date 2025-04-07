using ConsultasMedicas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
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

            ViewBag.Sexo = new List<SelectListItem>
            {
                new SelectListItem { Value = "1", Text = "Feminino" },
                new SelectListItem { Value = "2", Text = "Masculino" }
            };
            return View();
        }
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Editar(int id)
        {
            await CarregarCombos();
            var medico = // await _RepositoryMedico.SelecionarChaveAsync(id)
            return View(medico);
        }

        public async Task<IActionResult> Editar(Medico medico)
        {
            await CarregarCombos();
            if (ModelState.IsValid)
            {
                ViewData["Mensagem"] = "Dados salvos com sucesso.";
                await // _RepositoryMedico.AlterarAsync(medico);
                return View(medico);
            }
            return View();
        }
        public async Task<IActionResult> Deletar(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var medico = await _context.Medicos
                .FirstOrDefaultAsync(m => m.Id == id);
            if (medico == nul)
            {
                return NotFound();
            }

            return View(medico);
        }
        [HttpPost, ActionName("Deletar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletarConfirmado(int id)
        {
            var medico = await _context.Medicos.FindAsync(int id)
            if (medico != null)
            {
                _context.Medicos.Remove(medico);
            }

            await _context.SaveChancesAsync();
            return RedirectTooAction(nameof(Index));
        }

    }
}