using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class useronlineattributes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOnline",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "lastOnlineDate",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOnline",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "lastOnlineDate",
                table: "AspNetUsers");
        }
    }
}
