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
    public class ClientesAPIController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesAPIController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes
                .Include(c => c.Sexo)
                .FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        [HttpGet("login")]
        public async Task<ActionResult<Cliente>> Login([FromQuery] string email, [FromQuery] string senha)
        {
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(senha))
                {
                    return BadRequest("Email e senha são obrigatórios");
                }

                var cliente = await _context.Clientes
                    .Include(c => c.Sexo)
                    .FirstOrDefaultAsync(c => c.Email == email);

                if (cliente == null)
                {
                    return NotFound("Cliente não encontrado");
                }

                if (cliente.Senha != senha)
                {
                    return BadRequest("Senha incorreta");
                }

                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarCliente(int id, [FromBody] ClienteUpdateDTO updateDto)
        {
            try
            {
                Console.WriteLine($"Recebendo atualização para cliente ID: {id}");
                var jsonOptions = new System.Text.Json.JsonSerializerOptions { WriteIndented = true };
                Console.WriteLine($"Dados recebidos: {System.Text.Json.JsonSerializer.Serialize(updateDto, jsonOptions)}");

                if (updateDto == null)
                {
                    return BadRequest(new { message = "Dados do cliente não podem ser nulos" });
                }

                // Validação do ID
                if (id != updateDto.IdCliente)
                {
                    var erro = $"ID inválido: recebido {updateDto.IdCliente}, esperado {id}";
                    Console.WriteLine(erro);
                    return BadRequest(new { message = erro });
                }

                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null)
                {
                    Console.WriteLine($"Cliente não encontrado: ID {id}");
                    return NotFound("Cliente não encontrado");
                }

                Console.WriteLine($"Cliente encontrado: {cliente.Nome}");

                // Validação e limpeza do telefone
                if (string.IsNullOrWhiteSpace(updateDto.Telefone))
                {
                    return BadRequest("Telefone é obrigatório");
                }

                // Limpa a formatação do telefone mantendo como string
                updateDto.Telefone = new string(updateDto.Telefone.Where(char.IsDigit).ToArray());
                if (string.IsNullOrWhiteSpace(updateDto.Telefone))
                {
                    return BadRequest("Telefone inválido: deve conter números");
                }

                // Atualiza os campos básicos
                cliente.Nome = updateDto.Nome.Trim();
                cliente.Telefone = updateDto.Telefone;

                // Só atualiza a senha se uma nova foi fornecida e não for espaço em branco
                if (!string.IsNullOrWhiteSpace(updateDto.Senha) && updateDto.Senha.Trim() != " ")
                {
                    cliente.Senha = updateDto.Senha.Trim();
                    Console.WriteLine("Senha atualizada");
                }
                else
                {
                    Console.WriteLine("Senha não atualizada: mantendo senha atual");
                }

                await _context.SaveChangesAsync();
                Console.WriteLine($"Cliente atualizado com sucesso: {cliente.Nome}");
                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao atualizar: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente([FromBody] Cliente cliente)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelErrors = string.Join("; ", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage));
                    return BadRequest($"Validação falhou: {modelErrors}");
                }

                // Validação básica
                if (string.IsNullOrEmpty(cliente.Nome) || 
                    string.IsNullOrEmpty(cliente.Email) || 
                    string.IsNullOrEmpty(cliente.CPF) || 
                    string.IsNullOrEmpty(cliente.Senha))
                {
                    return BadRequest("Todos os campos obrigatórios devem ser preenchidos");
                }

                // Limpa CPF e Telefone
                cliente.CPF = new string(cliente.CPF.Where(char.IsDigit).ToArray());
                cliente.Telefone = new string(cliente.Telefone?.Where(char.IsDigit).ToArray() ?? Array.Empty<char>());

                // Salva o cliente
                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCliente), new { id = cliente.IdCliente }, cliente);
            }
            catch (Exception ex)
            {
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, $"Erro interno: {message}");
            }
        }        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null)
                {
                    return NotFound();
                }

                // Verificar se o cliente tem consultas agendadas
                var consultasAgendadas = await _context.Consultas
                    .Where(c => c.IdCliente == id && c.Data >= DateTime.Today)
                    .AnyAsync();

                if (consultasAgendadas)
                {
                    return BadRequest(new { message = "Não é possível excluir o perfil pois há consultas agendadas." });
                }

                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao excluir o perfil.", error = ex.Message });
            }
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.IdCliente == id);
        }
    }
}