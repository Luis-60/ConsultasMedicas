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
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarCliente(int id, [FromBody] Cliente clienteAtualizado)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null)
                {
                    return NotFound("Cliente não encontrado");
                }

                cliente.Nome = clienteAtualizado.Nome;
                cliente.Telefone = new string(clienteAtualizado.Telefone?.Where(char.IsDigit).ToArray() ?? Array.Empty<char>());
                
                if (!string.IsNullOrEmpty(clienteAtualizado.Senha))
                {
                    cliente.Senha = clienteAtualizado.Senha;
                }

                await _context.SaveChangesAsync();
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
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.IdCliente == id);
        }
    }
}