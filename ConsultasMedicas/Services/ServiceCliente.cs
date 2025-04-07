using ConsultasMedicas.Models;
using ConsultasMedicas.Repositories;

namespace ConsultasMedicas.Services
{
    public class ServiceCliente
    {
        private AppDbContext _contexto;
        public RepositoryCliente RptCliente { get; set; }
        public RepositorySexo RptSexo { get; set; }

        public ServiceCliente(AppDbContext pContexto)
        {
            _contexto = pContexto;

            RptCliente = new RepositoryCliente(_contexto, true);
            RptSexo = new RepositorySexo(_contexto, true);
        }
    }
}
