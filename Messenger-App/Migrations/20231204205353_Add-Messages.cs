using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class AddMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "message",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    SenderId = table.Column<string>(type: "text", nullable: true),
                    ReceiverId = table.Column<string>(type: "text", nullable: true),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_message", x => x.Id);
                    table.ForeignKey(
                        name: "FK_message_AspNetUsers_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_message_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_message_ReceiverId",
                table: "message",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_message_SenderId",
                table: "message",
                column: "SenderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "message");
        }
    }
}
