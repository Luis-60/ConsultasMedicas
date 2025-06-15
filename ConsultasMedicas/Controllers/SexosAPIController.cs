using ConsultasMedicas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultasMedicas.Controllers
{    [Route("api/[controller]")]
    [ApiController]
    public class SexosAPIController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SexosAPIController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SexosAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sexo>>> GetSexos()
        {
            try 
            {
                var sexos = await _context.Sexos.ToListAsync();
                return Ok(sexos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // GET: api/SexosAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sexo>> GetSexo(int id)
        {
            var sexo = await _context.Sexos.FindAsync(id);

            if (sexo == null)
            {
                return NotFound();
            }

            return sexo;
        }
    }
}
