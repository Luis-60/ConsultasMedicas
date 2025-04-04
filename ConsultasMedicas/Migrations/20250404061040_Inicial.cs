using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConsultasMedicas.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Especialidades",
                columns: table => new
                {
                    IdEspecialidade = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Especialidades", x => x.IdEspecialidade);
                });

            migrationBuilder.CreateTable(
                name: "Sexos",
                columns: table => new
                {
                    IdSexo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sexos", x => x.IdSexo);
                });

            migrationBuilder.CreateTable(
                name: "Tipos",
                columns: table => new
                {
                    IdTipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tipos", x => x.IdTipo);
                });

            migrationBuilder.CreateTable(
                name: "UFs",
                columns: table => new
                {
                    IdUF = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UFs", x => x.IdUF);
                });

            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    IdCliente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(48)", maxLength: 48, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CPF = table.Column<int>(type: "int", maxLength: 16, nullable: false),
                    IdSexo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.IdCliente);
                    table.ForeignKey(
                        name: "FK_Clientes_Sexos_IdSexo",
                        column: x => x.IdSexo,
                        principalTable: "Sexos",
                        principalColumn: "IdSexo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Consultorios",
                columns: table => new
                {
                    IdConsultorio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Endereco = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Cidade = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IdUF = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consultorios", x => x.IdConsultorio);
                    table.ForeignKey(
                        name: "FK_Consultorios_UFs_IdUF",
                        column: x => x.IdUF,
                        principalTable: "UFs",
                        principalColumn: "IdUF",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Medicos",
                columns: table => new
                {
                    IdMedico = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CRM = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CPF = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(48)", maxLength: 48, nullable: false),
                    IdConsultorio = table.Column<int>(type: "int", nullable: false),
                    IdEspecialidade = table.Column<int>(type: "int", nullable: false),
                    IdSexo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicos", x => x.IdMedico);
                    table.ForeignKey(
                        name: "FK_Medicos_Consultorios_IdConsultorio",
                        column: x => x.IdConsultorio,
                        principalTable: "Consultorios",
                        principalColumn: "IdConsultorio",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Medicos_Especialidades_IdEspecialidade",
                        column: x => x.IdEspecialidade,
                        principalTable: "Especialidades",
                        principalColumn: "IdEspecialidade",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Medicos_Sexos_IdSexo",
                        column: x => x.IdSexo,
                        principalTable: "Sexos",
                        principalColumn: "IdSexo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Consultas",
                columns: table => new
                {
                    IdConsulta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdMedico = table.Column<int>(type: "int", nullable: false),
                    IdCliente = table.Column<int>(type: "int", nullable: false),
                    Horario = table.Column<TimeSpan>(type: "time", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consultas", x => x.IdConsulta);
                    table.ForeignKey(
                        name: "FK_Consultas_Clientes_IdCliente",
                        column: x => x.IdCliente,
                        principalTable: "Clientes",
                        principalColumn: "IdCliente",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Consultas_Medicos_IdMedico",
                        column: x => x.IdMedico,
                        principalTable: "Medicos",
                        principalColumn: "IdMedico",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_IdSexo",
                table: "Clientes",
                column: "IdSexo");

            migrationBuilder.CreateIndex(
                name: "IX_Consultas_IdCliente",
                table: "Consultas",
                column: "IdCliente");

            migrationBuilder.CreateIndex(
                name: "IX_Consultas_IdMedico",
                table: "Consultas",
                column: "IdMedico");

            migrationBuilder.CreateIndex(
                name: "IX_Consultorios_IdUF",
                table: "Consultorios",
                column: "IdUF");

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_IdConsultorio",
                table: "Medicos",
                column: "IdConsultorio");

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_IdEspecialidade",
                table: "Medicos",
                column: "IdEspecialidade");

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_IdSexo",
                table: "Medicos",
                column: "IdSexo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Consultas");

            migrationBuilder.DropTable(
                name: "Tipos");

            migrationBuilder.DropTable(
                name: "Clientes");

            migrationBuilder.DropTable(
                name: "Medicos");

            migrationBuilder.DropTable(
                name: "Consultorios");

            migrationBuilder.DropTable(
                name: "Especialidades");

            migrationBuilder.DropTable(
                name: "Sexos");

            migrationBuilder.DropTable(
                name: "UFs");
        }
    }
}
