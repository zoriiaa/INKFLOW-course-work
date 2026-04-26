using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INKFLOW.Migrations
{
    /// <inheritdoc />
    public partial class finalproductstructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Shape",
                table: "Products",
                newName: "Specification");

            migrationBuilder.RenameColumn(
                name: "MaterialOrBase",
                table: "Products",
                newName: "Size");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Specification",
                table: "Products",
                newName: "Shape");

            migrationBuilder.RenameColumn(
                name: "Size",
                table: "Products",
                newName: "MaterialOrBase");
        }
    }
}
