using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messenger_App.Migrations
{
    public partial class adduserimages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "Avatars",
                table: "AspNetUsers",
                type: "text[]",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatars",
                table: "AspNetUsers");
        }
    }
}
