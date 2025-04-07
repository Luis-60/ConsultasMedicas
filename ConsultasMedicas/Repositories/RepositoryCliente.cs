using ConsultasMedicas.Models;

namespace ConsultasMedicas.Repositories
{
    public class RepositoryCliente : RepositoryBase<Cliente>
    {
        public RepositoryCliente(AppDbContext pContexto, bool pSaveChanges) : base(pContexto, pSaveChanges)
        {
        }
    }
}
