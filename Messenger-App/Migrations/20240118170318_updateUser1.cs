using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class updateUser1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DisplayUserName",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DisplayUserName",
                table: "AspNetUsers");
        }
    }
}
