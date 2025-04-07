using ConsultasMedicas.Models;

namespace ConsultasMedicas.Repositories
{
    public class RepositoryUF : RepositoryBase<UF>
    {
        public RepositoryUF(AppDbContext pContexto, bool pSaveChanges) : base(pContexto, pSaveChanges)
        {
        }
    }
}
