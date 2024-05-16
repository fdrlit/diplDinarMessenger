using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class replyMessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReplyMessageId",
                table: "Message",
                type: "text",
                nullable: true,
                defaultValue: "");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "ReplyMessageId",
                table: "Message");
        }
    }
}
