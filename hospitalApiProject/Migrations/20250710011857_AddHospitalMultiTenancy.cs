using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospitalApiProject.Migrations
{
    /// <inheritdoc />
    public partial class AddHospitalMultiTenancy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "transactionId",
                table: "PaymentModeInfo",
                newName: "TransactionId");

            migrationBuilder.RenameColumn(
                name: "paymentMode",
                table: "PaymentModeInfo",
                newName: "PaymentMode");

            migrationBuilder.RenameColumn(
                name: "paymentDate",
                table: "PaymentModeInfo",
                newName: "PaymentDate");

            migrationBuilder.RenameColumn(
                name: "invoiceId",
                table: "PaymentModeInfo",
                newName: "InvoiceId");

            migrationBuilder.AddColumn<bool>(
                name: "Alcohol",
                table: "VitalInfo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Diabetes",
                table: "VitalInfo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Hypertension",
                table: "VitalInfo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Smoking",
                table: "VitalInfo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Thyroid",
                table: "VitalInfo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Tobacco",
                table: "VitalInfo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "staffInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "regestrationNumber",
                table: "staffInfo",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "PaymentModeInfo",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentMode",
                table: "PaymentModeInfo",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "PaymentDate",
                table: "PaymentModeInfo",
                type: "datetime2",
                nullable: true,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "PaymentModeInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "itemId",
                table: "PaymentModeInfo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "itemName",
                table: "PaymentModeInfo",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "patientInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "MedicineMaster",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "InvoiceInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsConsultationPaid",
                table: "InvoiceInfo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "departmentInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "appointmentInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "AdditionalInvoiceItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "invoiceId",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ItemName",
                table: "AdditionalInvoiceItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FinalAmount",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "AdditionalInvoiceItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Discount",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "AdditionalInvoiceItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedBy",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkingToken",
                table: "AbhaPatientDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PatientId",
                table: "AbhaPatientDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateOnly>(
                name: "TokenDate",
                table: "AbhaPatientDetails",
                type: "date",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Hospitals",
                columns: table => new
                {
                    HospitalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospitals", x => x.HospitalId);
                });

            migrationBuilder.CreateTable(
                name: "MedicationGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GroupId = table.Column<int>(type: "int", nullable: false),
                    MedName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    MedType = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Dose = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Frequency = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Timing = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Duration = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Instruction = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationGroup", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MedicinesGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicinesGroup", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PatientVisits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    ReferenceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Display = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HiType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VisitDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientVisits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrescriptionTemplateMaster",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    templateName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    examinationNote = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    advice = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    diffDiagnosis = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    finalDiagnosis = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    diagnosisId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionTemplateMaster", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "CareContexts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientVisitId = table.Column<int>(type: "int", nullable: false),
                    ReferenceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Display = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareContexts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CareContexts_PatientVisits_PatientVisitId",
                        column: x => x.PatientVisitId,
                        principalTable: "PatientVisits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_staffInfo_HospitalId",
                table: "staffInfo",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_patientInfo_HospitalId",
                table: "patientInfo",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineMaster_HospitalId",
                table: "MedicineMaster",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceInfo_HospitalId",
                table: "InvoiceInfo",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_departmentInfo_HospitalId",
                table: "departmentInfo",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_appointmentInfo_HospitalId",
                table: "appointmentInfo",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_CareContexts_PatientVisitId",
                table: "CareContexts",
                column: "PatientVisitId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointmentInfo_Hospitals_HospitalId",
                table: "appointmentInfo",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_departmentInfo_Hospitals_HospitalId",
                table: "departmentInfo",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceInfo_Hospitals_HospitalId",
                table: "InvoiceInfo",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicineMaster_Hospitals_HospitalId",
                table: "MedicineMaster",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_patientInfo_Hospitals_HospitalId",
                table: "patientInfo",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_staffInfo_Hospitals_HospitalId",
                table: "staffInfo",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointmentInfo_Hospitals_HospitalId",
                table: "appointmentInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_departmentInfo_Hospitals_HospitalId",
                table: "departmentInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceInfo_Hospitals_HospitalId",
                table: "InvoiceInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicineMaster_Hospitals_HospitalId",
                table: "MedicineMaster");

            migrationBuilder.DropForeignKey(
                name: "FK_patientInfo_Hospitals_HospitalId",
                table: "patientInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_staffInfo_Hospitals_HospitalId",
                table: "staffInfo");

            migrationBuilder.DropTable(
                name: "CareContexts");

            migrationBuilder.DropTable(
                name: "Hospitals");

            migrationBuilder.DropTable(
                name: "MedicationGroup");

            migrationBuilder.DropTable(
                name: "MedicinesGroup");

            migrationBuilder.DropTable(
                name: "PrescriptionTemplateMaster");

            migrationBuilder.DropTable(
                name: "PatientVisits");

            migrationBuilder.DropIndex(
                name: "IX_staffInfo_HospitalId",
                table: "staffInfo");

            migrationBuilder.DropIndex(
                name: "IX_patientInfo_HospitalId",
                table: "patientInfo");

            migrationBuilder.DropIndex(
                name: "IX_MedicineMaster_HospitalId",
                table: "MedicineMaster");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceInfo_HospitalId",
                table: "InvoiceInfo");

            migrationBuilder.DropIndex(
                name: "IX_departmentInfo_HospitalId",
                table: "departmentInfo");

            migrationBuilder.DropIndex(
                name: "IX_appointmentInfo_HospitalId",
                table: "appointmentInfo");

            migrationBuilder.DropColumn(
                name: "Alcohol",
                table: "VitalInfo");

            migrationBuilder.DropColumn(
                name: "Diabetes",
                table: "VitalInfo");

            migrationBuilder.DropColumn(
                name: "Hypertension",
                table: "VitalInfo");

            migrationBuilder.DropColumn(
                name: "Smoking",
                table: "VitalInfo");

            migrationBuilder.DropColumn(
                name: "Thyroid",
                table: "VitalInfo");

            migrationBuilder.DropColumn(
                name: "Tobacco",
                table: "VitalInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "staffInfo");

            migrationBuilder.DropColumn(
                name: "regestrationNumber",
                table: "staffInfo");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "PaymentModeInfo");

            migrationBuilder.DropColumn(
                name: "itemId",
                table: "PaymentModeInfo");

            migrationBuilder.DropColumn(
                name: "itemName",
                table: "PaymentModeInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "patientInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "MedicineMaster");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "InvoiceInfo");

            migrationBuilder.DropColumn(
                name: "IsConsultationPaid",
                table: "InvoiceInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "departmentInfo");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "appointmentInfo");

            migrationBuilder.DropColumn(
                name: "LinkingToken",
                table: "AbhaPatientDetails");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "AbhaPatientDetails");

            migrationBuilder.DropColumn(
                name: "TokenDate",
                table: "AbhaPatientDetails");

            migrationBuilder.RenameColumn(
                name: "TransactionId",
                table: "PaymentModeInfo",
                newName: "transactionId");

            migrationBuilder.RenameColumn(
                name: "PaymentMode",
                table: "PaymentModeInfo",
                newName: "paymentMode");

            migrationBuilder.RenameColumn(
                name: "PaymentDate",
                table: "PaymentModeInfo",
                newName: "paymentDate");

            migrationBuilder.RenameColumn(
                name: "InvoiceId",
                table: "PaymentModeInfo",
                newName: "invoiceId");

            migrationBuilder.AlterColumn<string>(
                name: "transactionId",
                table: "PaymentModeInfo",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "paymentMode",
                table: "PaymentModeInfo",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<DateTime>(
                name: "paymentDate",
                table: "PaymentModeInfo",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "AdditionalInvoiceItems",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "invoiceId",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ItemName",
                table: "AdditionalInvoiceItems",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "FinalAmount",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "AdditionalInvoiceItems",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<int>(
                name: "Discount",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "AdditionalInvoiceItems",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedBy",
                table: "AdditionalInvoiceItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
