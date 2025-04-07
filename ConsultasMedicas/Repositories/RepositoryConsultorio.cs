using ConsultasMedicas.Models;

namespace ConsultasMedicas.Repositories
{
    public class RepositoryConsultorio : RepositoryBase<Consultorio>
    {
        public RepositoryConsultorio(AppDbContext pContexto, bool pSaveChanges) : base(pContexto, pSaveChanges)
        {
        }
    }
}
