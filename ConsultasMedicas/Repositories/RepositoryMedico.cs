using ConsultasMedicas.Models;

namespace ConsultasMedicas.Repositories
{
    public class RepositoryMedico : RepositoryBase<Medico>
    {
        public RepositoryMedico(AppDbContext pContexto, bool pSaveChanges) : base(pContexto, pSaveChanges)
        {
        }
    }
}
