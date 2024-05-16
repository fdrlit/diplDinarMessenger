using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class updateMessagetype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "EncryptedText",
                table: "Message",
                type: "text",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "bytea");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "EncryptedText",
                table: "Message",
                type: "bytea",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
