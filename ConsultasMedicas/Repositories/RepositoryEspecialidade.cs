using ConsultasMedicas.Models;

namespace ConsultasMedicas.Repositories
{
    public class RepositoryEspecialidade : RepositoryBase<Especialidade>
    {
        public RepositoryEspecialidade(AppDbContext pContexto, bool pSaveChanges) : base(pContexto, pSaveChanges)
        {
        }
    }
}
