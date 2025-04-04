using Microsoft.EntityFrameworkCore;

namespace ConsultasMedicas.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Consulta> Consultas { get; set; }
        public DbSet<Consultorio> Consultorios { get; set; }
        public DbSet<Especialidade> Especialidades { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Sexo> Sexos { get; set; }
        public DbSet<Tipo> Tipos { get; set; }
        public DbSet<UF> UFs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>()
              .HasOne(c => c.Sexo)
              .WithMany()
              .HasForeignKey(s => s.IdSexo);

            modelBuilder.Entity<Consulta>()
              .HasOne(c => c.Medico)
              .WithMany()
              .HasForeignKey(c => c.IdMedico)
              .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Consulta>()
                .HasOne(c => c.Cliente)
                .WithMany()
                .HasForeignKey(c => c.IdCliente)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Consultorio>()
                .HasOne(ct => ct.UF)
                .WithMany()
                .HasForeignKey(ct => ct.IdUF);

            modelBuilder.Entity<Medico>()
                .HasOne(m => m.Consultorio)
                .WithMany()
                .HasForeignKey(m => m.IdConsultorio);

            modelBuilder.Entity<Medico>()
                .HasOne(m => m.Sexo)
                .WithMany()
                .HasForeignKey(m => m.IdSexo);

            modelBuilder.Entity<Medico>()
                .HasOne(m => m.Especialidade)
                .WithMany()
                .HasForeignKey(m => m.IdEspecialidade);




        }
    }
}
