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

        // GET: api/ClientesAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        // GET: api/ClientesAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        // PUT: api/ClientesAPI/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.IdCliente)
            {
                return BadRequest();
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ClientesAPI
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCliente", new { id = cliente.IdCliente }, cliente);
        }

        // DELETE: api/ClientesAPI/5
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

        // GET: api/ClientesAPI/login
        [HttpGet("login")]
        public async Task<ActionResult<Cliente>> Login([FromQuery] string email, [FromQuery] string senha)
        {
            Console.WriteLine($"Tentativa de login - Email: {email}");
            
            var cliente = await _context.Clientes
                .AsNoTracking() // Para melhor performance
                .FirstOrDefaultAsync(c => c.Email == email && c.Senha == senha);

            if (cliente == null)
            {
                // Verificar se o email existe para dar uma mensagem mais específica
                var emailExists = await _context.Clientes
                    .AsNoTracking()
                    .AnyAsync(c => c.Email == email);

                if (emailExists)
                {
                    Console.WriteLine("Email encontrado, mas senha incorreta");
                    return BadRequest(new { message = "Senha incorreta" });
                }
                
                Console.WriteLine("Email não encontrado");
                return NotFound(new { message = "Email não encontrado" });
            }

            Console.WriteLine($"Login bem-sucedido para o cliente: {cliente.Nome}");

            // Por segurança, não retornar a senha
            cliente.Senha = null;
            return cliente;
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.IdCliente == id);
        }
    }
}
