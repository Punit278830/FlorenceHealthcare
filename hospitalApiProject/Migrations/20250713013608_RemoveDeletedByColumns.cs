using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospitalApiProject.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDeletedByColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "InvoiceInfo");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "appointmentInfo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "InvoiceInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "appointmentInfo",
                type: "int",
                nullable: true);
        }
    }
}
