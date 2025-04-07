using ConsultasMedicas.Models;
using Microsoft.EntityFrameworkCore;
using ConsultasMedicas.Models;
using ConsultasMedicas.Interfaces;
namespace ConsultasMedicas.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T>, IDisposable where T : class
    {

        public AppDbContext contexto;
        public bool saveChanges = true;

        public RepositoryBase(AppDbContext pContexto, bool pSaveChanges)
        {
            contexto = pContexto;
            saveChanges = pSaveChanges;
        }

        public T Alterar(T entity)
        {
            contexto.Entry<T>(entity).State = EntityState.Modified;
            if (saveChanges)
            {
                contexto.SaveChanges();
            }
            return entity;

        }

        public async Task<T> AlterarAsync(T entity)
        {
            contexto.Entry<T>(entity).State = EntityState.Modified;
            if (saveChanges)
            {
                await contexto.SaveChangesAsync();
            }
            return entity;
        }

        public void Dispose()
        {
            contexto.Dispose();
        }

        public void Excluir(T entity)
        {
            contexto.Entry<T>(entity).State = EntityState.Deleted;
            if (saveChanges)
            {
                contexto.SaveChanges();
            }
        }

        public void Excluir(int id)
        {
            var obj = SelecionarChave(id);
            if (obj != null)
            {
                contexto.Entry<T>(obj).State = EntityState.Deleted;
                if (saveChanges)
                {
                    contexto.SaveChanges();
                }
            }
        }

        public async Task ExcluirAsync(T entity)
        {
            contexto.Entry<T>(entity).State = EntityState.Deleted;
            if (saveChanges)
            {
                await contexto.SaveChangesAsync();
            }
        }

        public async Task ExcluirAsync(int id)
        {
            var obj = await SelecionarChaveAsync(id);
            if (obj != null)
            {
                contexto.Entry<T>(obj).State = EntityState.Deleted;
                if (saveChanges)
                {
                    await contexto.SaveChangesAsync();
                }
            }
        }

        public T Incluir(T entity)
        {
            contexto.Set<T>().Add(entity);

            if (saveChanges)
            {
                contexto.SaveChanges();
            }
            return entity;
        }

        public async Task<T> IncluirAsync(T entity)
        {
            await contexto.Set<T>().AddAsync(entity);

            if (saveChanges)
            {
                await contexto.SaveChangesAsync();
            }
            return entity;
        }

        public List<T> ListarTodos()
        {
            return contexto.Set<T>().ToList();
        }
        public async Task<List<T>> ListarTodosAsync()
        {
            return await contexto.Set<T>().ToListAsync();
        }

        public T SelecionarChave(params object[] variavel)
        {
            return contexto.Set<T>().Find(variavel)!;
        }

        public async Task<T> SelecionarChaveAsync(params object[] variavel)
        {
            return await contexto.Set<T>().FindAsync(variavel);
        }
    }
}