using ConsultasMedicas.Models;
using ConsultasMedicas.Repositories;

namespace ConsultasMedicas.Services
{
    public class ServiceMedico
    {
        private AppDbContext _contexto;
        public RepositoryEspecialidade RptEspecialidade { get; set; }
        public RepositoryMedico RptMedico { get; set; }
        public RepositoryConsultorio RptConsultorio { get; set; }
        public RepositorySexo RptSexo { get; set; }
        public RepositoryUF RptUF { get; set; }

        public ServiceMedico(AppDbContext pContexto)
        {
            _contexto = pContexto;
            RptEspecialidade = new RepositoryEspecialidade(_contexto, true);
            RptMedico = new RepositoryMedico(_contexto, true);
            RptConsultorio = new RepositoryConsultorio(_contexto, true);
            RptSexo = new RepositorySexo(_contexto, true);
            RptUF = new RepositoryUF(_contexto, true);
        }
    }
}
