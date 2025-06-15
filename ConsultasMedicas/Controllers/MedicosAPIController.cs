using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsultasMedicas.Models;

namespace ConsultasMedicas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicosAPIController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicosAPIController(AppDbContext context)
        {
            _context = context;
        }        // GET: api/MedicosAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medico>>> GetMedicos([FromQuery] int? especialidade = null)
        {
            var query = _context.Medicos
                .Include(m => m.Consultorio)
                .Include(m => m.Especialidade)
                .Include(m => m.Sexo)
                .AsQueryable();            if (especialidade.HasValue && especialidade.Value > 0)
            {
                query = query.Where(m => m.IdEspecialidade == especialidade.Value);
            }

            return await query.ToListAsync();
        }

        // GET: api/MedicosAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Medico>> GetMedico(int id)
        {
            var medico = await _context.Medicos
                .Include(m => m.Consultorio)
                .Include(m => m.Especialidade)
                .Include(m => m.Sexo)
                .FirstOrDefaultAsync(m => m.IdMedico == id);

            if (medico == null)
            {
                return NotFound();
            }

            return medico;
        }        // PUT: api/MedicosAPI/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedico(int id, [FromBody] MedicoUpdateDTO updateDto)
        {
            try
            {
                Console.WriteLine($"Recebendo atualização para médico ID: {id}");
                var jsonOptions = new System.Text.Json.JsonSerializerOptions 
                { 
                    WriteIndented = true 
                };
                Console.WriteLine($"Dados recebidos: {System.Text.Json.JsonSerializer.Serialize(updateDto, jsonOptions)}");

                if (updateDto == null)
                {
                    return BadRequest("Dados do médico não podem ser nulos");
                }

                if (id != updateDto.IdMedico)
                {
                    Console.WriteLine($"ID inválido: recebido {updateDto.IdMedico}, esperado {id}");
                    return BadRequest("ID inválido");
                }

                // Busca o médico atual do banco
                var medicoAtual = await _context.Medicos.FindAsync(id);
                if (medicoAtual == null)
                {
                    Console.WriteLine($"Médico não encontrado: ID {id}");
                    return NotFound("Médico não encontrado");
                }

                Console.WriteLine($"Médico encontrado: {medicoAtual.Nome}");                // Validação e limpeza do telefone
                if (string.IsNullOrWhiteSpace(updateDto.Telefone))
                {
                    return BadRequest("Telefone é obrigatório");
                }

                // Limpa a formatação do telefone mantendo como string
                updateDto.Telefone = Regex.Replace(updateDto.Telefone, @"[^\d]", "");
                if (string.IsNullOrWhiteSpace(updateDto.Telefone))
                {
                    return BadRequest("Telefone inválido: deve conter números");
                }

                // Valida se o email já existe para outro médico
                if (medicoAtual.Email != updateDto.Email)
                {
                    var existingEmail = await _context.Medicos
                        .FirstOrDefaultAsync(m => m.Email == updateDto.Email && m.IdMedico != id);
                    if (existingEmail != null)
                    {
                        Console.WriteLine($"Email já existe: {updateDto.Email}");
                        return BadRequest("Email já cadastrado para outro médico");
                    }
                }                // Atualiza os campos básicos
                medicoAtual.Nome = updateDto.Nome.Trim();
                medicoAtual.Email = updateDto.Email.Trim();
                medicoAtual.Telefone = updateDto.Telefone;

                // Mantém os outros campos inalterados
                // CRM, CPF, IdConsultorio, IdEspecialidade e IdSexo não são alterados aqui
                // pois são campos que não devem ser alterados na edição básica do perfil

                // Só atualiza a senha se uma nova foi fornecida e não for espaço em branco
                if (!string.IsNullOrWhiteSpace(updateDto.Senha) && updateDto.Senha.Trim() != " ")
                {
                    medicoAtual.Senha = updateDto.Senha.Trim();
                    Console.WriteLine("Senha atualizada");
                }
                else
                {
                    Console.WriteLine("Senha não atualizada: mantendo senha atual");
                }

                try
                {
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"Médico atualizado com sucesso: {medicoAtual.Nome}");
                    return NoContent();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    Console.WriteLine($"Erro de concorrência: {ex.Message}");
                    if (!MedicoExists(id))
                    {
                        return NotFound();
                    }
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao atualizar médico: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest($"Erro ao atualizar médico: {ex.Message}");
            }
        }

        // POST: api/MedicosAPI
        [HttpPost]
        public async Task<ActionResult<Medico>> PostMedico(Medico medico)
        {
            // Validações básicas
            if (string.IsNullOrWhiteSpace(medico.Nome) ||
                string.IsNullOrWhiteSpace(medico.Email) ||
                string.IsNullOrWhiteSpace(medico.Telefone) ||
                string.IsNullOrWhiteSpace(medico.CRM) ||
                string.IsNullOrWhiteSpace(medico.CPF) ||
                string.IsNullOrWhiteSpace(medico.Senha))
            {
                return BadRequest("Todos os campos são obrigatórios.");
            }

            // Limpa a formatação do telefone
            medico.Telefone = Regex.Replace(medico.Telefone ?? "", @"[^\d]", "");

            // Valida se o CRM já existe
            if (await _context.Medicos.AnyAsync(m => m.CRM == medico.CRM))
            {
                return BadRequest("CRM já cadastrado.");
            }

            // Valida se o CPF já existe
            if (await _context.Medicos.AnyAsync(m => m.CPF == medico.CPF))
            {
                return BadRequest("CPF já cadastrado.");
            }

            // Valida se o email já existe
            if (await _context.Medicos.AnyAsync(m => m.Email == medico.Email))
            {
                return BadRequest("Email já cadastrado.");
            }

            try
            {
                _context.Medicos.Add(medico);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetMedico", new { id = medico.IdMedico }, medico);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao cadastrar médico: " + ex.Message);
            }
        }

        // DELETE: api/MedicosAPI/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedico(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
            {
                return NotFound();
            }

            _context.Medicos.Remove(medico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/MedicosAPI/login
        [HttpGet("login")]
        public async Task<ActionResult<Medico>> Login([FromQuery] string email, [FromQuery] string senha)
        {
            var medico = await _context.Medicos
                .Include(m => m.Consultorio)
                .Include(m => m.Especialidade)
                .Include(m => m.Sexo)
                .FirstOrDefaultAsync(m => m.Email == email && m.Senha == senha);

            if (medico == null)
            {
                return NotFound("Email ou senha inválidos");
            }

            // Não retornar a senha
            medico.Senha = null;

            return medico;
        }

        private bool MedicoExists(int id)
        {
            return _context.Medicos.Any(e => e.IdMedico == id);
        }
    }
}
