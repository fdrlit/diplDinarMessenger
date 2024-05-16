using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class createmanytomany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Conversation_ConversationId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ConversationId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "ApplicationUserConversation",
                columns: table => new
                {
                    ConversationsId = table.Column<string>(type: "text", nullable: false),
                    UsersId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserConversation", x => new { x.ConversationsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserConversation_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserConversation_Conversation_ConversationsId",
                        column: x => x.ConversationsId,
                        principalTable: "Conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserConversation_UsersId",
                table: "ApplicationUserConversation",
                column: "UsersId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Conversation_ConversationId",
                table: "AspNetUsers",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ConversationId",
                table: "AspNetUsers",
                column: "ConversationId");

            migrationBuilder.AddColumn<string>(
                name: "ConversationId",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.DropTable(
                name: "ApplicationUserConversation");
        }
    }
}
