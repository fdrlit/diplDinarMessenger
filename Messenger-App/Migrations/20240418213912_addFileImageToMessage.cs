using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class addFileImageToMessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "Images",
                table: "Message",
                type: "text[]",
                nullable: true);
            migrationBuilder.AddColumn<List<string>>(
                name: "Files",
                table: "Message",
                type: "text[]",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("Images", "Message");
            migrationBuilder.DropColumn("Files", "Message");
        }
    }
}
