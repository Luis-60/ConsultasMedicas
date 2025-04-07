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
using ConsultasMedicas.ViewModel;

namespace ConsultasMedicas.Controllers
{
    public class ClienteController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ServiceCliente _serviceCliente;

        public ClienteController(IConfiguration configuration, AppDbContext context, ServiceCliente cliente)
        {
            _serviceCliente = cliente;
            _context = context;
            _configuration = configuration;
        }

        private async Task CarregarCombos()
        {
            ViewData["Sexo"] = new SelectList(await _serviceCliente.RptSexo.ListarTodosAsync(), "IdSexo", "Nome");

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
        public async Task<IActionResult> Registrar(Cliente cliente)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var incluirCliente = await _serviceCliente.RptCliente.IncluirAsync(cliente);

            var token = GerarTokenJWT(cliente.Email!, "Cliente");

            ViewData["Token"] = token;
            await CarregarCombos();

            return View("Index", incluirCliente);
        }

        [HttpPost]
        public async Task<IActionResult> Login(ClienteLoginViewModel login)
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.Nome == login.Nome && c.Senha == login.Senha);

            if (cliente == null)
                return Unauthorized("Nome ou senha inválidos.");

            var token = GerarTokenJWT(cliente.Email!, "Cliente");

            TempData["Token"] = token;

            return RedirectToAction("Index");

        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var token = TempData["Token"] as string;
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token não fornecido.");
            }

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var emailClaim = jwtToken.Claims.FirstOrDefault();

            if (emailClaim == null)
            {
                return Unauthorized("Token inválido.");
            }

            var email = emailClaim.Value;
            var cliente = _context.Clientes.FirstOrDefault(c => c.Email == email);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }
            await CarregarCombos();
            return View(cliente);
        }

        public async Task<IActionResult> Editar(int id)
        {
            await CarregarCombos();
            var cliente = await _serviceCliente.RptCliente.SelecionarChaveAsync(id);
            return View(cliente);
        }

        //    [HttpPost]
        //    public async Task<IActionResult> Editar(Medico medico)
        //    {
        //        await CarregarCombos();
        //        if (ModelState.IsValid)
        //        {
        //            ViewData["Mensagem"] = "Dados salvos com sucesso.";
        //            await _serviceMedico.RptMedico.AlterarAsync(medico);
        //            return View(medico);
        //        }
        //        return View();
        //    }

        //    public async Task<IActionResult> Deletar(int? id)
        //    {
        //        if (id == null)
        //            return NotFound();

        //        var medico = await _context.Medicos.FirstOrDefaultAsync(m => m.IdMedico == id);
        //        if (medico == null)
        //            return NotFound();

        //        return View(medico);
        //    }

        //    [HttpPost, ActionName("Deletar")]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> DeletarConfirmado(int id)
        //    {
        //        var medico = await _context.Medicos.FindAsync(id);
        //        if (medico != null)
        //        {
        //            _context.Medicos.Remove(medico);
        //            await _context.SaveChangesAsync();
        //        }

        //        return RedirectToAction(nameof(Index));
        //    }
        //}
    }
}