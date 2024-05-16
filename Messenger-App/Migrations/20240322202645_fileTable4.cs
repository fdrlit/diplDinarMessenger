using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class fileTable4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FilesId",
                table: "Message",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "File",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    FilePath = table.Column<string>(type: "text", nullable: false),
                    FileType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_File", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Message_FilesId",
                table: "Message",
                column: "FilesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_File_FilesId",
                table: "Message",
                column: "FilesId",
                principalTable: "File",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_File_FilesId",
                table: "Message");

            migrationBuilder.DropTable(
                name: "File");

            migrationBuilder.DropIndex(
                name: "IX_Message_FilesId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "FilesId",
                table: "Message");
        }
    }
}
