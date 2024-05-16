using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FileServer.Migrations
{
    /// <inheritdoc />
    public partial class fileadd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "File",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    FilePath = table.Column<string>(type: "text", nullable: false),
                    FileType = table.Column<string>(type: "text", nullable: false),
                    FileHash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_File", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "File");
        }
    }
}
