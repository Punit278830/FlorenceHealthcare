using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospitalApiProject.Migrations
{
    /// <inheritdoc />
    public partial class AddHospitalSoftDeleteColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "VitalInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "staffSchedule",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "staffInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrescriptionValidity",
                table: "staffInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RoleId",
                table: "staffInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Questionnaire",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Question",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "PrescriptionTemplateMaster",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "PaymentModeInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "PatientVisits",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "PatientMedications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "patientInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Options",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "MedicinesGroup",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "MedicineMaster",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "MedicationGroup",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "InvoiceItemMaster",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "InvoiceInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "FilesUpload",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "diagnosisTemplateMaster",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "departmentInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "displayName",
                table: "departmentInfo",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "consultationFiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "consultationData",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "CareContexts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "appointmentInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Answers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Hospital",
                columns: table => new
                {
                    HospitalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ContactPerson = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ContactNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    AddressLine1 = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    AddressLine2 = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Pincode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RegistrationNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LicenseNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    GSTIN = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    WebsiteUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospital", x => x.HospitalId);
                });

            migrationBuilder.CreateTable(
                name: "RoleMaster",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RoleDisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RoleDescription = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    HospitalId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleMaster", x => x.RoleId);
                    table.ForeignKey(
                        name: "FK_RoleMaster_Hospital_HospitalId",
                        column: x => x.HospitalId,
                        principalTable: "Hospital",
                        principalColumn: "HospitalId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_staffInfo_RoleId",
                table: "staffInfo",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleMaster_HospitalId",
                table: "RoleMaster",
                column: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_StaffInfo_RoleMaster",
                table: "staffInfo",
                column: "RoleId",
                principalTable: "RoleMaster",
                principalColumn: "RoleId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StaffInfo_RoleMaster",
                table: "staffInfo");

            migrationBuilder.DropTable(
                name: "RoleMaster");

            migrationBuilder.DropTable(
                name: "Hospital");

            migrationBuilder.DropIndex(
                name: "IX_staffInfo_RoleId",
                table: "staffInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "VitalInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "staffSchedule");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "staffInfo");

            migrationBuilder.DropColumn(
                name: "PrescriptionValidity",
                table: "staffInfo");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "staffInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Questionnaire");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "PrescriptionTemplateMaster");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "PaymentModeInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "PatientVisits");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "PatientMedications");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "patientInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Options");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "MedicinesGroup");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "MedicineMaster");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "MedicationGroup");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "InvoiceItemMaster");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "InvoiceInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "FilesUpload");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "diagnosisTemplateMaster");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "departmentInfo");

            migrationBuilder.DropColumn(
                name: "displayName",
                table: "departmentInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "consultationFiles");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "consultationData");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "CareContexts");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "appointmentInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "AdditionalInvoiceItems");
        }
    }
}
