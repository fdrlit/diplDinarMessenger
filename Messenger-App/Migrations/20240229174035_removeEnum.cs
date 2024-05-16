using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class removeEnum : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RecipientType",
                table: "Message",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Group",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Group");

            migrationBuilder.AlterColumn<int>(
                name: "RecipientType",
                table: "Message",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
