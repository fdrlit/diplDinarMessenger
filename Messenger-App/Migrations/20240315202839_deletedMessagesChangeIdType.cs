using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class deletedMessagesChangeIdType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "DeletedMessages",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "DeletedMessages",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
        }
    }
}
