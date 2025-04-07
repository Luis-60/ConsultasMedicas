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
using Microsoft.AspNetCore.Authorization;

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
        private void VerificarTokenJWT(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier);

            if (emailClaim == null)
            {
                Console.WriteLine("Token inválido: nameid não encontrado.");
            }
            else
            {
                Console.WriteLine($"Token válido: nameid = {emailClaim.Value}");
            }
        }

        private string GerarTokenJWT(string email, string role)
        {
            var keyConfig = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(keyConfig))
            {
                throw new ArgumentNullException("Jwt:Key", "A chave JWT não está configurada.");
            }
            var key = Encoding.ASCII.GetBytes(keyConfig);
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

        [HttpGet]
        public async Task<IActionResult> Registrar()
        {
            await CarregarCombos();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Registrar(Medico medico)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var incluirMedico = await _serviceMedico.RptMedico.IncluirAsync(medico);

            var token = GerarTokenJWT(medico.Email!, "Medico");

            ViewData["Token"] = token;
            await CarregarCombos();

            return View("Index", incluirMedico);
        }

        [HttpPost]
        public async Task<IActionResult> Login(MedicoLoginViewModel login)
        {
            var medico = await _context.Medicos
                .FirstOrDefaultAsync(m => m.Nome == login.Nome && m.Senha == login.Senha);

            if (medico == null)
                return Unauthorized("Nome ou senha inválidos.");

            var token = GerarTokenJWT(medico.Email!, "Medico");

            TempData["Token"] = token;

            return RedirectToAction("Index");
            
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Index()
        {
            var token = TempData["Token"] as string;
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token não fornecido.");
            }

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier);

            if (emailClaim == null)
            {
                return Unauthorized("Token inválido.");
            }

            var email = emailClaim.Value;
            var medico = _context.Medicos.FirstOrDefault(m => m.Email == email);

            if (medico == null)
            {
                return NotFound("Médico não encontrado.");
            }

            return View(medico);
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
