using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class removeReceiver : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_message_ReceiverId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "ReceiverId",
                table: "Message");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_message_ReceiverId",
                table: "Message",
                column: "ReceiverId");

            migrationBuilder.AddColumn<string>(
                name: "ReceiverId",
                table: "Message",
                type: "text",
                nullable: true);
        }
    }
}
