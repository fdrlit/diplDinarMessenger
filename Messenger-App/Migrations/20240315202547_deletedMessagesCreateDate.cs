using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class deletedMessagesCreateDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
               name: "CreateDate",
               table: "DeletedMessages",
               type: "timestamp with time zone",
               nullable: false,
               defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_DeletedMessages_MessageId",
                table: "DeletedMessages",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_DeletedMessages_UserId",
                table: "DeletedMessages",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
               name: "CreateDate",
               table: "DeletedMessages"
            );
        }
    }
}
