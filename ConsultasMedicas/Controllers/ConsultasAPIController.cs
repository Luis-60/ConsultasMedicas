using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsultasMedicas.Models;

namespace ConsultasMedicas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultasAPIController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConsultasAPIController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ConsultasAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consulta>>> GetConsultas()
        {
            try
            {
                var consultas = await _context.Consultas
                    .Include(c => c.Medico)
                        .ThenInclude(m => m.Especialidade)
                    .Include(c => c.Cliente)
                    .ToListAsync();

                // Log para debugar os dados retornados
                foreach (var consulta in consultas)
                {
                    Console.WriteLine($"Consulta ID: {consulta.IdConsulta}");
                    Console.WriteLine($"Médico ID: {consulta.IdMedico}");
                    Console.WriteLine($"Médico objeto: {(consulta.Medico != null ? "presente" : "nulo")}");
                    if (consulta.Medico != null)
                    {
                        Console.WriteLine($"Nome do Médico: {consulta.Medico.Nome}");
                        Console.WriteLine($"Especialidade objeto: {(consulta.Medico.Especialidade != null ? "presente" : "nulo")}");
                        if (consulta.Medico.Especialidade != null)
                        {
                            Console.WriteLine($"Nome da Especialidade: {consulta.Medico.Especialidade.Nome}");
                        }
                    }
                    Console.WriteLine("-------------------");
                }

                // Serializando para visualizar exatamente o que está sendo retornado
                var options = new System.Text.Json.JsonSerializerOptions
                {
                    WriteIndented = true,
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = null
                };
                
                var serializedConsultas = System.Text.Json.JsonSerializer.Serialize(consultas, options);
                Console.WriteLine("Dados serializados que serão retornados:");
                Console.WriteLine(serializedConsultas);

                return consultas;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar consultas: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // GET: api/ConsultasAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Consulta>> GetConsulta(int id)
        {
            var consulta = await _context.Consultas
                .Include(c => c.Medico)
                    .ThenInclude(m => m.Especialidade)
                .Include(c => c.Cliente)
                .FirstOrDefaultAsync(c => c.IdConsulta == id);

            if (consulta == null)
            {
                return NotFound();
            }

            return consulta;
        }        // PUT: api/ConsultasAPI/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsulta(int id, Consulta consulta)
        {
            try 
            {
                if (id != consulta.IdConsulta)
                {
                    return BadRequest("ID da consulta não corresponde");
                }

                var consultaExistente = await _context.Consultas
                    .Include(c => c.Medico)
                        .ThenInclude(m => m.Especialidade)
                    .Include(c => c.Cliente)
                    .FirstOrDefaultAsync(c => c.IdConsulta == id);

                if (consultaExistente == null)
                {
                    return NotFound("Consulta não encontrada");
                }

                // Verifica se já existe outra consulta no mesmo horário para o médico selecionado
                var consultaConflito = await _context.Consultas
                    .FirstOrDefaultAsync(c => c.IdMedico == consulta.IdMedico && 
                                            c.Data.Date == consulta.Data.Date && 
                                            c.Horario == consulta.Horario &&
                                            c.IdConsulta != id);

                if (consultaConflito != null)
                {
                    return BadRequest("Já existe uma consulta agendada para este horário");
                }

                // Verifica se o médico existe
                var medico = await _context.Medicos
                    .Include(m => m.Especialidade)
                    .FirstOrDefaultAsync(m => m.IdMedico == consulta.IdMedico);
                    
                if (medico == null)
                {
                    return BadRequest("Médico não encontrado");
                }

                // Atualiza os campos permitidos
                consultaExistente.Data = consulta.Data;
                consultaExistente.Horario = consulta.Horario;
                consultaExistente.IdMedico = consulta.IdMedico;
                consultaExistente.Medico = medico;

                await _context.SaveChangesAsync();

                // Recarrega a consulta com todos os relacionamentos antes de retornar
                await _context.Entry(consultaExistente)
                    .Reference(c => c.Medico)
                    .LoadAsync();

                if (consultaExistente.Medico != null)
                {
                    await _context.Entry(consultaExistente.Medico)
                        .Reference(m => m.Especialidade)
                        .LoadAsync();
                }

                return Ok(consultaExistente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar consulta: {ex.Message}");
            }
        }

        // POST: api/ConsultasAPI
        [HttpPost]
        public async Task<ActionResult<Consulta>> PostConsulta(Consulta consulta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var medico = await _context.Medicos
                    .Include(m => m.Especialidade)
                    .FirstOrDefaultAsync(m => m.IdMedico == consulta.IdMedico);
                    
                if (medico == null)
                {
                    return BadRequest("Médico não encontrado");
                }

                var cliente = await _context.Clientes.FindAsync(consulta.IdCliente);
                if (cliente == null)
                {
                    return BadRequest("Cliente não encontrado");
                }

                var consultaExistente = await _context.Consultas
                    .FirstOrDefaultAsync(c => c.IdMedico == consulta.IdMedico && 
                                            c.Data.Date == consulta.Data.Date && 
                                            c.Horario == consulta.Horario);

                if (consultaExistente != null)
                {
                    return BadRequest("Já existe uma consulta agendada para este horário");
                }

                _context.Consultas.Add(consulta);
                await _context.SaveChangesAsync();

                // Carregar os relacionamentos antes de retornar
                await _context.Entry(consulta)
                    .Reference(c => c.Medico)
                    .LoadAsync();

                if (consulta.Medico != null)
                {
                    await _context.Entry(consulta.Medico)
                        .Reference(m => m.Especialidade)
                        .LoadAsync();
                }

                return CreatedAtAction(nameof(GetConsulta), new { id = consulta.IdConsulta }, consulta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao agendar consulta: {ex.Message}");
            }
        }

        // DELETE: api/ConsultasAPI/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsulta(int id)
        {
            var consulta = await _context.Consultas.FindAsync(id);
            if (consulta == null)
            {
                return NotFound();
            }

            _context.Consultas.Remove(consulta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsultaExists(int id)
        {
            return _context.Consultas.Any(e => e.IdConsulta == id);
        }
    }
}