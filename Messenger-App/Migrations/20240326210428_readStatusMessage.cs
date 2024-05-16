using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class readStatusMessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ReadStatus",
                table: "Message",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadStatus",
                table: "Message");
        }
    }
}
