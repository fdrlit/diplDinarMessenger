using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class updatemessageattrs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message");

            migrationBuilder.AlterColumn<string>(
                name: "ConversationId",
                table: "Message",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "ConversationId",
                table: "Message",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message");
        }
    }
}
