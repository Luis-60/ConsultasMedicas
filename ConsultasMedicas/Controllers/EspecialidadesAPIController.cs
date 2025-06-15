using ConsultasMedicas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultasMedicas.Controllers
{    [Route("api/[controller]")]
    [ApiController]
    public class EspecialidadesAPIController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EspecialidadesAPIController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/EspecialidadesAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Especialidade>>> GetEspecialidades()
        {
            try 
            {
                var especialidades = await _context.Especialidades.ToListAsync();
                return Ok(especialidades);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // GET: api/EspecialidadesAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Especialidade>> GetEspecialidade(int id)
        {
            var especialidade = await _context.Especialidades.FindAsync(id);

            if (especialidade == null)
            {
                return NotFound();
            }

            return especialidade;
        }
    }
}
