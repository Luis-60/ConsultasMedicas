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
using ConsultasMedicas.Repositories;

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
            Response.Cookies.Delete("AuthToken");
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
                clienteExistente.Senha = cliente.Senha;
                clienteExistente.Telefone = cliente.Telefone;
                clienteExistente.Email = cliente.Email;
                clienteExistente.DataNascimento = cliente.DataNascimento;
                clienteExistente.CPF = cliente.CPF;
                clienteExistente.IdSexo = cliente.IdSexo;

                // Salvar as alterações no banco de dados
                _context.Clientes.Update(clienteExistente);
                await _serviceCliente.RptCliente.AlterarAsync(clienteExistente);

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
                                              NomeMedico = c.Medico.Nome,
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

        public IActionResult MarcarConsulta()
        {
            var viewModel = new ConsultaViewModel
            {
                UFs = _context.Consultorios
                    .Select(c => c.UF)
                    .Distinct()
                    .Select(uf => new SelectListItem
                    {
                        Text = uf.Nome,
                        Value = uf.IdUF.ToString()
                    }).ToList(),

                Especialidades = _context.Especialidades
                    .Select(e => new SelectListItem { Text = e.Nome, Value = e.IdEspecialidade.ToString() }),

                Consultorios = _context.Consultorios
                    .Select(c => new SelectListItem { Text = c.Nome, Value = c.IdConsultorio.ToString() }),

                Medicos = _context.Medicos
                    .Select(m => new SelectListItem { Text = m.Nome, Value = m.IdMedico.ToString() }),

                Horarios = Enumerable.Range(6, 25) // de 6:00 até 18:00 de meia em meia hora
                    .Select(h => new SelectListItem
                    {
                        Text = $"{h}:00",
                        Value = new TimeSpan(h, 0, 0).ToString()
                    }),


            };

            return View(viewModel);

        }

        [HttpPost]
        public async Task<IActionResult> Create(ConsultaViewModel model)
        {
            if (!ModelState.IsValid)
            {
                
                
                model.Especialidades = _context.Especialidades
                    .Select(e => new SelectListItem { Value = e.Nome, Text = e.Nome })
                    .ToList();

                model.Consultorios = new List<SelectListItem>();
                model.Medicos = new List<SelectListItem>();
                return View("MarcarConsulta", model);
            }

            // Aqui seria o ponto de obter o ID do cliente logado via JWT
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

            var consulta = new Consulta
            {
                IdMedico = model.IdMedico,
                Data = model.Data.Date,
                Horario = model.Horario,
                IdCliente = cliente.IdCliente
            };

            _context.Consultas.Add(consulta);
            await _context.SaveChangesAsync(); // aqui está o uso correto do await
            TempData["Sucesso"] = "Consulta marcada com sucesso";

            return RedirectToAction("VerConsultas", "Cliente", new { id = cliente.IdCliente });
        }



        //[HttpGet]
        //public async Task<IActionResult> MarcarConsulta()
        //{
        //    var viewModel = new ConsultaViewModel
        //    {
        //        UFs = new SelectList(await _context.UFs.ToListAsync(), "IdUF", "Nome"),
        //        Especialidades = new SelectList(Enumerable.Empty<Especialidade>(), "IdEspecialidade", "Nome"),
        //        Consultorios = new SelectList(Enumerable.Empty<Consultorio>(), "IdConsultorio", "Nome"),
        //        Medicos = new SelectList(Enumerable.Empty<Medico>(), "IdMedico", "Nome")
        //    };

        //    return View(viewModel);
        //}

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> MarcarConsulta(ConsultaViewModel viewModel)
        //{
        //    if (!Request.Cookies.TryGetValue("AuthToken", out var token) || string.IsNullOrEmpty(token))
        //    {
        //        return Unauthorized("Token não fornecido.");
        //    }

        //    var handler = new JwtSecurityTokenHandler();
        //    var jwtToken = handler.ReadJwtToken(token);
        //    var emailClaim = jwtToken.Claims.FirstOrDefault();

        //    if (emailClaim == null)
        //    {
        //        return Unauthorized("Token inválido.");
        //    }

        //    var email = emailClaim.Value;
        //    var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);

        //    if (cliente == null)
        //    {
        //        return NotFound("Cliente não encontrado.");
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        var consulta = new Consulta
        //        {
        //            IdCliente = cliente.IdCliente,
        //            IdMedico = viewModel.IdMedico,
        //            Data = viewModel.Data,
        //            Horario = viewModel.Horario
        //        };

        //        _context.Consultas.Add(consulta);
        //        await _context.SaveChangesAsync();
        //        return RedirectToAction(nameof(Index));
        //    }

        //    viewModel.UFs = new SelectList(await _context.UFs.ToListAsync(), "IdUF", "Nome");
        //    viewModel.Especialidades = new SelectList(await _context.Especialidades.Where(e => e.IdUF == viewModel.IdUF).ToListAsync(), "IdEspecialidade", "Nome");
        //    viewModel.Consultorios = new SelectList(await _context.Consultorios.Where(c => c.IdUF == viewModel.IdUF).ToListAsync(), "IdConsultorio", "Nome");
        //    viewModel.Medicos = new SelectList(await _context.Medicos.Where(m => m.IdEspecialidade == viewModel.IdEspecialidade && m.IdConsultorio == viewModel.IdConsultorio).ToListAsync(), "IdMedico", "Nome");

        //return View(viewModel);

        //  [HttpGet]
        // public JsonResult ObterConsultoriosPorUF(int idUF)
        //  {
        //    var consultorios = _context.Consultorios
        //      .Where(c => c.IdUF == idUF)
        //    .Select(c => new {
        //      c.IdConsultorio,
        //     c.Nome
        //  }).ToList();

        //   return Json(consultorios);
        //  }

        //public JsonResult ObterConsultoriosPorUFEspecialidade(int idUF, string nomeEspecialidade)
        //{
        //  var consultorios = _context.Medicos
        //    .Where(m => m.Consultorio.IdUF == idUF && m.Especialidade.Nome == nomeEspecialidade)
        //  .Select(m => new {
        //    m.Consultorio.IdConsultorio,
        //  m.Consultorio.Nome
        // })
        // .Distinct()
        // .ToList();

        //    return Json(consultorios);
        //}
        [HttpGet]

        public JsonResult ObterTodosConsultorios()
        {
            var consultorios = _context.Consultorios
                .Select(c => new
                {
                    idConsultorio = c.IdConsultorio,
                    nome = c.Nome
                })
                .ToList();

            return Json(consultorios);
        }



        [HttpGet]
        public JsonResult ObterEspecialidadesPorConsultorio(int idConsultorio)
        {
            var especialidades = _context.Medicos
                .Where(m => m.IdConsultorio == idConsultorio)
                .Select(m => m.Especialidade.Nome)
                .Distinct()
                .ToList();

            return Json(especialidades);
        }

        [HttpGet]
        public JsonResult ObterMedicosPorConsultorioEspecialidade(int idConsultorio, string nomeEspecialidade)
        {
            var medicos = _context.Medicos
                .Where(m => m.IdConsultorio == idConsultorio && m.Especialidade.Nome == nomeEspecialidade)
                .Select(m => new {
                    m.IdMedico,
                    m.Nome
                })
                .ToList();

            return Json(medicos);
        }


    };



}