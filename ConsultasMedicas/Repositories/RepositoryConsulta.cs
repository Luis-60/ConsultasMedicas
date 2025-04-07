using ConsultasMedicas.Models;

namespace ConsultasMedicas.Repositories
{
    public class RepositoryConsulta : RepositoryBase<Consulta>
    {
        public RepositoryConsulta(AppDbContext pContexto, bool pSaveChanges) : base(pContexto, pSaveChanges)
        {
        }
    }
}
