using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class updateMessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_message_AspNetUsers_ReceiverId",
                table: "message");

            migrationBuilder.DropForeignKey(
                name: "FK_message_AspNetUsers_SenderId",
                table: "message");

            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "message",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReceiverId",
                table: "message",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateDate",
                table: "message",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_message_AspNetUsers_ReceiverId",
                table: "message",
                column: "ReceiverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_message_AspNetUsers_SenderId",
                table: "message",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "message",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiverId",
                table: "message",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.DropColumn(
                name: "CreateDate",
                table: "message");
        }
    }
}
