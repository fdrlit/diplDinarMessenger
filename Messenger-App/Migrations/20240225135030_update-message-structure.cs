using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class updatemessagestructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message");

            migrationBuilder.DropTable(
                name: "ApplicationUserConversation");

            migrationBuilder.DropTable(
                name: "Conversation");

            migrationBuilder.DropIndex(
                name: "IX_Message_ConversationId",
                table: "Message");

            migrationBuilder.RenameColumn(
                name: "ConversationId",
                table: "Message",
                newName: "RecipientId");

            migrationBuilder.AddColumn<int>(
                name: "RecipientType",
                table: "Message",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GroupId",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Group",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.Id);
                });
            //migrationBuilder.CreateTable(
            //    name: "ApplicationUserGroup",
            //    columns: table => new
            //    {
            //        Id = table.Column<string>(type: "text", nullable: false),
            //        GroupId = table.Column<string>(type: "text", nullable: false),
            //        UserId = table.Column<string>(type: "text", nullable: false),
            //        CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_ApplicationUserGroup", x => x.Id);
            //        table.ForeignKey(
            //            name: "FK_ApplicationUserGroup_AspNetUsers_UserId",
            //            column: x => x.UserId,
            //            principalTable: "AspNetUsers",
            //            principalColumn: "Id");
            //        table.ForeignKey(
            //            name: "FK_ApplicationUserGroup_Group_GroupId",
            //            column: x => x.GroupId,
            //            principalTable: "Group",
            //            principalColumn: "Id");
            //    });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_GroupId",
                table: "AspNetUsers",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Group_GroupId",
                table: "AspNetUsers",
                column: "GroupId",
                principalTable: "Group",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Group_GroupId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Group");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_GroupId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "RecipientType",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "RecipientId",
                table: "Message",
                newName: "ConversationId");

            migrationBuilder.CreateTable(
                name: "Conversation",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SymmetricKey = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversation", x => x.Id);
                });

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
                name: "IX_Message_ConversationId",
                table: "Message",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserConversation_UsersId",
                table: "ApplicationUserConversation",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Conversation_ConversationId",
                table: "Message",
                column: "ConversationId",
                principalTable: "Conversation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
