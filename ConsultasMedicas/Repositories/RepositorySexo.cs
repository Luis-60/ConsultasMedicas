using ConsultasMedicas.Models;

namespace ConsultasMedicas.Repositories
{
    public class RepositorySexo : RepositoryBase<Sexo>
    {
        public RepositorySexo(AppDbContext pContexto, bool pSaveChanges) : base(pContexto, pSaveChanges)
        {
        }
    }
}
