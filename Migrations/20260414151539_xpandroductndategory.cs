using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INKFLOW.Migrations
{
    /// <inheritdoc />
    public partial class xpandroductndategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Hardness",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaterialOrBase",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Shape",
                table: "Products",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hardness",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MaterialOrBase",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Shape",
                table: "Products");
        }
    }
}
