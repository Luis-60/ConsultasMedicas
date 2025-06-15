using ConsultasMedicas.Models;
using ConsultasMedicas.Services;
using Microsoft.AspNetCore.Mvc;

namespace ConsultasMedicas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicoCombosAPIController : ControllerBase
    {
        private readonly ServiceMedico _serviceMedico;

        public MedicoCombosAPIController(ServiceMedico serviceMedico)
        {
            _serviceMedico = serviceMedico;
        }

        // GET: api/MedicoCombosAPI/Consultorios
        [HttpGet("Consultorios")]
        public async Task<IActionResult> GetConsultorios()
        {
            try
            {
                var consultorios = await _serviceMedico.RptConsultorio.ListarTodosAsync();
                if (consultorios == null)
                    return NotFound();
                return Ok(consultorios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao carregar consultórios: {ex.Message}");
            }
        }

        // GET: api/MedicoCombosAPI/Especialidades
        [HttpGet("Especialidades")]
        public async Task<IActionResult> GetEspecialidades()
        {
            try
            {
                var especialidades = await _serviceMedico.RptEspecialidade.ListarTodosAsync();
                if (especialidades == null)
                    return NotFound();
                return Ok(especialidades);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao carregar especialidades: {ex.Message}");
            }
        }

        // GET: api/MedicoCombosAPI/Sexos
        [HttpGet("Sexos")]
        public async Task<IActionResult> GetSexos()
        {
            try
            {
                var sexos = await _serviceMedico.RptSexo.ListarTodosAsync();
                if (sexos == null)
                    return NotFound();
                return Ok(sexos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao carregar sexos: {ex.Message}");
            }
        }
    }
}
