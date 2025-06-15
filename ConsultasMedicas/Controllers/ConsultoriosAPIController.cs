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
    public class ConsultoriosAPIController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConsultoriosAPIController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ConsultoriosAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consultorio>>> GetConsultorios()
        {
            return await _context.Consultorios.ToListAsync();
        }

        // GET: api/ConsultoriosAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Consultorio>> GetConsultorio(int id)
        {
            var consultorio = await _context.Consultorios.FindAsync(id);

            if (consultorio == null)
            {
                return NotFound();
            }

            return consultorio;
        }

        // PUT: api/ConsultoriosAPI/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsultorio(int id, Consultorio consultorio)
        {
            if (id != consultorio.IdConsultorio)
            {
                return BadRequest();
            }

            _context.Entry(consultorio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultorioExists(id))
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

        // POST: api/ConsultoriosAPI
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Consultorio>> PostConsultorio(Consultorio consultorio)
        {
            _context.Consultorios.Add(consultorio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConsultorio", new { id = consultorio.IdConsultorio }, consultorio);
        }

        // DELETE: api/ConsultoriosAPI/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultorio(int id)
        {
            var consultorio = await _context.Consultorios.FindAsync(id);
            if (consultorio == null)
            {
                return NotFound();
            }

            _context.Consultorios.Remove(consultorio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsultorioExists(int id)
        {
            return _context.Consultorios.Any(e => e.IdConsultorio == id);
        }
    }
}
