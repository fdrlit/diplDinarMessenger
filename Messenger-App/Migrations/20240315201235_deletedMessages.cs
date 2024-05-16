using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Migrations;
using static System.Net.Mime.MediaTypeNames;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class deletedMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DeletedMessages",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    MessageId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeletedMessages_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DeletedMessages_Message_MessageId",
                        column: x => x.UserId,
                        principalTable: "Message",
                        principalColumn: "Id");
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeletedMessages");
        }
    }
}
