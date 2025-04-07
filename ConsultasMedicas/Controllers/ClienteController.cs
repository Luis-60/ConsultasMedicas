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
using ConsultasMedicas.ViewModels;

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

            // Armazenar o token em um cookie
            Response.Cookies.Append("AuthToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddHours(2)
            });

            return RedirectToAction("Index");
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            if (!Request.Cookies.TryGetValue("AuthToken", out var token) || string.IsNullOrEmpty(token))
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

        [HttpGet]
        public async Task<IActionResult> Editar()
        {
            if (!Request.Cookies.TryGetValue("AuthToken", out var token) || string.IsNullOrEmpty(token))
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
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            await CarregarCombos();
            return View(cliente);
        }

        [HttpPost]
        public async Task<IActionResult> Editar(Cliente cliente)
        {
            if (!Request.Cookies.TryGetValue("AuthToken", out var token) || string.IsNullOrEmpty(token))
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
            var clienteExistente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);

            if (clienteExistente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            if (ModelState.IsValid)
            {
                // Atualizar os dados do cliente existente
                clienteExistente.Nome = cliente.Nome;
                clienteExistente.Telefone = cliente.Telefone;
                clienteExistente.Email = cliente.Email;
                clienteExistente.DataNascimento = cliente.DataNascimento;
                clienteExistente.CPF = cliente.CPF;
                clienteExistente.IdSexo = cliente.IdSexo;

                // Salvar as alterações no banco de dados
                _context.Clientes.Update(clienteExistente);
                await _context.SaveChangesAsync();

                ViewData["Mensagem"] = "Dados salvos com sucesso.";
                await CarregarCombos();
                return View(clienteExistente);
            }

            await CarregarCombos();
            return View(cliente);
        }

        [HttpGet]
        public async Task<IActionResult> Deletar()
        {
            if (!Request.Cookies.TryGetValue("AuthToken", out var token) || string.IsNullOrEmpty(token))
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
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            return View(cliente);
        }

        [HttpPost, ActionName("Deletar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletarConfirmado()
        {
            if (!Request.Cookies.TryGetValue("AuthToken", out var token) || string.IsNullOrEmpty(token))
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
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);

            if (cliente != null)
            {
                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction("Index", "Home");
        }
        [HttpGet]
        public async Task<IActionResult> VerConsultas(int id)
        {
            var consultas = await _context.Consultas
                                          .Include(c => c.Cliente)
                                          .Include(c => c.Medico)
                                          .ThenInclude(m => m.Especialidade)
                                          .Include(c => c.Medico)
                                          .ThenInclude(m => m.Consultorio)
                                          .ThenInclude(co => co.UF)
                                          .Where(c => c.IdCliente == id)
                                          .Select(c => new ConsultaViewModel
                                          {
                                              IdConsulta = c.IdConsulta,
                                              Data = c.Data,
                                              Horario = c.Horario,
                                              IdCliente = c.Cliente.IdCliente,
                                              NomeCliente = c.Cliente.Nome,
                                              EmailCliente = c.Cliente.Email,
                                              TelefoneCliente = c.Cliente.Telefone,
                                              IdEspecialidade = c.Medico.Especialidade.IdEspecialidade,
                                              NomeEspecialidade = c.Medico.Especialidade.Nome,
                                              IdConsultorio = c.Medico.Consultorio.IdConsultorio,
                                              NomeConsultorio = c.Medico.Consultorio.Nome,
                                              EnderecoConsultorio = c.Medico.Consultorio.Endereco,
                                              CidadeConsultorio = c.Medico.Consultorio.Cidade,
                                              UFConsultorio = c.Medico.Consultorio.UF.Nome
                                          })
                                          .ToListAsync();

            if (consultas == null || !consultas.Any())
            {
                return NotFound("Nenhuma consulta encontrada para este cliente.");
            }

            return View(consultas);
        }
    }
}