using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class updatechatstructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "message",
                newName: "Message");

            migrationBuilder.AddColumn<string>(
                name: "ConversationId",
                table: "Message",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConversationId",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Conversation",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversation", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Message_ConversationId",
                table: "Message",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ConversationId",
                table: "AspNetUsers",
                column: "ConversationId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Conversation_ConversationId",
                table: "AspNetUsers",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Message",
                newName: "message");

            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Conversation");

            migrationBuilder.DropIndex(
                name: "IX_Message_ConversationId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ConversationId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Conversation_ConversationId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message");
        }
    }
}
