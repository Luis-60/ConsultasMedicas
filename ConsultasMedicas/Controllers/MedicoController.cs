using ConsultasMedicas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ConsultasMedicas.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ConsultasMedicas.Controllers
{
    public class MedicoController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ServiceMedico _serviceMedico;

        public MedicoController(IConfiguration configuration, AppDbContext context, ServiceMedico medico)
        {
            _serviceMedico = medico;
            _context = context;
            _configuration = configuration;
        }

        private async Task CarregarCombos()
        {
            ViewData["Consultorio"] = new SelectList(await _serviceMedico.RptConsultorio.ListarTodosAsync(), "IdConsultorio", "Nome");
            ViewData["Sexo"] = new SelectList(await _serviceMedico.RptSexo.ListarTodosAsync(), "IdSexo", "Nome");
            ViewData["Especialidade"] = new SelectList(await _serviceMedico.RptEspecialidade.ListarTodosAsync(), "IdEspecialidade", "Nome");
            ViewData["UF"] = new SelectList(await _serviceMedico.RptUF.ListarTodosAsync(), "IdUF", "Nome");
        }

        private string GerarTokenJWT(string email, string role)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, email),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("registrar")]
        [ProducesResponseType(typeof(string), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Registrar([FromBody] Medico medico)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var incluirMedico = await _serviceMedico.RptMedico.IncluirAsync(medico);

            var token = GerarTokenJWT(medico.Email!, "Medico");

            ViewData["Token"] = token;
            await CarregarCombos();

            return View("Index", incluirMedico);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Medico login)
        {
            var medico = await _context.Medicos
                .FirstOrDefaultAsync(m => m.Email == login.Email && m.Senha == login.Senha);

            if (medico == null)
                return Unauthorized("E-mail ou senha inválidos.");

            var token = GerarTokenJWT(medico.Email!, "Medico");

            return Ok(new
            {
                token,
                nome = medico.Nome,
                email = medico.Email,
                id = medico.IdMedico
            });
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
            var medico = await _serviceMedico.RptMedico.SelecionarChaveAsync(id);
            return View(medico);
        }

        [HttpPost]
        public async Task<IActionResult> Editar(Medico medico)
        {
            await CarregarCombos();
            if (ModelState.IsValid)
            {
                ViewData["Mensagem"] = "Dados salvos com sucesso.";
                await _serviceMedico.RptMedico.AlterarAsync(medico);
                return View(medico);
            }
            return View();
        }

        public async Task<IActionResult> Deletar(int? id)
        {
            if (id == null)
                return NotFound();

            var medico = await _context.Medicos.FirstOrDefaultAsync(m => m.IdMedico == id);
            if (medico == null)
                return NotFound();

            return View(medico);
        }

        [HttpPost, ActionName("Deletar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletarConfirmado(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico != null)
            {
                _context.Medicos.Remove(medico);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
