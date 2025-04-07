using ConsultasMedicas.Models;
using ConsultasMedicas.Repositories;

namespace ConsultasMedicas.Services
{
    public class Cliente
    {
        public class ServiceCliente
        {
            private AppDbContext _contexto;
            public RepositorySexo RptSexo { get; set; }

            public ServiceCliente(AppDbContext pContexto)
            {
                _contexto = pContexto;
                RptSexo = new RepositorySexo(_contexto, true);
            }
        }
    }
}
