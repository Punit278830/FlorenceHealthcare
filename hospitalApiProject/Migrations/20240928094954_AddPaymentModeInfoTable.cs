using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hospitalApiProject.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentModeInfoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AbhaPatientDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AbhaNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AbhaAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Mobile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Dob = table.Column<DateOnly>(type: "date", nullable: false),
                    PatientImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbhaPatientDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdditionalInvoiceItems",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    invoiceId = table.Column<int>(type: "int", nullable: true),
                    ItemName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Discount = table.Column<int>(type: "int", nullable: true),
                    Fee = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    FinalAmount = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdditionalInvoiceItems", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "appointmentInfo",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    patientId = table.Column<int>(type: "int", nullable: false),
                    doctorId = table.Column<int>(type: "int", nullable: false),
                    departmentid = table.Column<int>(type: "int", nullable: true),
                    scheduledByid = table.Column<int>(type: "int", nullable: true),
                    date = table.Column<DateTime>(type: "datetime", nullable: false),
                    notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    AppointmentTime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    appointmentStatus = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    fee = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__appointm__3213E83F8234A53E", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "consultationData",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appointmentId = table.Column<int>(type: "int", nullable: false),
                    examinationNote = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    advice = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    diffDiagnosis = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    finalDiagnosis = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    followupDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__consulta__3213E83FF94E34E0", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "consultationFiles",
                columns: table => new
                {
                    fileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appointmentId = table.Column<int>(type: "int", nullable: true),
                    fileName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    fileType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    fileData = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    docName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__consulta__C2C6FFDC666D5E0B", x => x.fileId);
                });

            migrationBuilder.CreateTable(
                name: "departmentInfo",
                columns: table => new
                {
                    DepartmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    departmentName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    departmentStatus = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__departme__3213E83F62AE26B1", x => x.DepartmentId);
                });

            migrationBuilder.CreateTable(
                name: "diagnosisTemplateMaster",
                columns: table => new
                {
                    diagnosId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    diagnosName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    diagnosText = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    diagnosStatus = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__diagnosi__330F5D69B0F1B8E9", x => x.diagnosId);
                });

            migrationBuilder.CreateTable(
                name: "FilesUpload",
                columns: table => new
                {
                    FileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appointmentID = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    FileType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    FileData = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    UploadDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Files__6F0F989FE714CBA2", x => x.FileID);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceInfo",
                columns: table => new
                {
                    invoiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    patientId = table.Column<int>(type: "int", nullable: false),
                    appoitmentId = table.Column<int>(type: "int", nullable: false),
                    createdDate = table.Column<DateOnly>(type: "date", nullable: true),
                    amount = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceInfo", x => x.invoiceId);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceItemMaster",
                columns: table => new
                {
                    itemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    itemName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    discount = table.Column<int>(type: "int", nullable: true),
                    fee = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__appointm__3213E83F8234A53E", x => x.itemId);
                });

            migrationBuilder.CreateTable(
                name: "MedicineMaster",
                columns: table => new
                {
                    MedId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    GenericName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    ManufactureName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    MedType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Unit = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Medicine__EB77FC56BA45806B", x => x.MedId);
                });

            migrationBuilder.CreateTable(
                name: "patientInfo",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    firstName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    lastName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    mobile = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    address = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    gender = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    dob = table.Column<DateOnly>(type: "date", nullable: false),
                    patientImage = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    regstrationDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IdentityName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    IdentityNumber = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__patientI__3213E83FF314494B", x => x.PatientId);
                });

            migrationBuilder.CreateTable(
                name: "PatientMedications",
                columns: table => new
                {
                    MedicationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK__PatientM__62EC1AFA5A3CD8AB", x => x.MedicationId);
                });

            migrationBuilder.CreateTable(
                name: "PaymentModeInfo",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    invoiceId = table.Column<int>(type: "int", nullable: false),
                    paymentMode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    transactionId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    paymentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentModeInfo", x => x.PaymentId);
                });

            migrationBuilder.CreateTable(
                name: "Question",
                columns: table => new
                {
                    QuestionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionText = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    QuestionType = table.Column<int>(type: "int", nullable: false),
                    QuestionnaireID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Question__0DC06F8CAFDD6C54", x => x.QuestionID);
                });

            migrationBuilder.CreateTable(
                name: "Questionnaire",
                columns: table => new
                {
                    QuestionnaireID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionnaireName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    QuestinaryDeptID = table.Column<int>(type: "int", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Question__A56EF40518DEEF97", x => x.QuestionnaireID);
                });

            migrationBuilder.CreateTable(
                name: "staffInfo",
                columns: table => new
                {
                    staffId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    firstName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    lastName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    IdentityName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    IdentityNumber = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    mobile = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    address = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    departmentId = table.Column<int>(type: "int", nullable: false),
                    designation = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    consultationFee = table.Column<int>(type: "int", nullable: true),
                    activeStatus = table.Column<int>(type: "int", nullable: false),
                    password = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    Dob = table.Column<DateOnly>(type: "date", nullable: false),
                    gender = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    education = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    DOJ = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__staffInf__DDDFDD369429D882", x => x.staffId);
                });

            migrationBuilder.CreateTable(
                name: "staffSchedule",
                columns: table => new
                {
                    scheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    staffId = table.Column<int>(type: "int", nullable: false),
                    departmentId = table.Column<int>(type: "int", nullable: false),
                    scheduleDate = table.Column<DateOnly>(type: "date", nullable: false),
                    fromTime = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    fromPostfix = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    toTime = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    toPostfix = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    ApplyScheduleDate = table.Column<DateOnly>(type: "date", nullable: true),
                    leaveStatus = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__staffSch__A532EDD49C3FEBF7", x => x.scheduleId);
                });

            migrationBuilder.CreateTable(
                name: "VitalInfo",
                columns: table => new
                {
                    vitalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    BP = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Weight = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Height = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Pulse = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    tempurature = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    OxigenLevel = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__VitalInf__9EF955AEC367167B", x => x.vitalId);
                });

            migrationBuilder.CreateTable(
                name: "Options",
                columns: table => new
                {
                    OptionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionID = table.Column<int>(type: "int", nullable: true),
                    OptionText = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    mapQuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Options__92C7A1DF3FC9B492", x => x.OptionID);
                    table.ForeignKey(
                        name: "FK__Options__Questio__58D1301D",
                        column: x => x.QuestionID,
                        principalTable: "Question",
                        principalColumn: "QuestionID");
                });

            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    AnswerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionID = table.Column<int>(type: "int", nullable: true),
                    ParticipantID = table.Column<int>(type: "int", nullable: true),
                    AnswerText = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    SelectedOptionID = table.Column<int>(type: "int", nullable: true),
                    appointmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Answers__D48250246664615B", x => x.AnswerID);
                    table.ForeignKey(
                        name: "FK__Answers__Questio__5BAD9CC8",
                        column: x => x.QuestionID,
                        principalTable: "Question",
                        principalColumn: "QuestionID");
                    table.ForeignKey(
                        name: "FK__Answers__Selecte__5CA1C101",
                        column: x => x.SelectedOptionID,
                        principalTable: "Options",
                        principalColumn: "OptionID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answers_QuestionID",
                table: "Answers",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_SelectedOptionID",
                table: "Answers",
                column: "SelectedOptionID");

            migrationBuilder.CreateIndex(
                name: "IX_Options_QuestionID",
                table: "Options",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "UQ_StaffInfo_Email",
                table: "staffInfo",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AbhaPatientDetails");

            migrationBuilder.DropTable(
                name: "AdditionalInvoiceItems");

            migrationBuilder.DropTable(
                name: "Answers");

            migrationBuilder.DropTable(
                name: "appointmentInfo");

            migrationBuilder.DropTable(
                name: "consultationData");

            migrationBuilder.DropTable(
                name: "consultationFiles");

            migrationBuilder.DropTable(
                name: "departmentInfo");

            migrationBuilder.DropTable(
                name: "diagnosisTemplateMaster");

            migrationBuilder.DropTable(
                name: "FilesUpload");

            migrationBuilder.DropTable(
                name: "InvoiceInfo");

            migrationBuilder.DropTable(
                name: "InvoiceItemMaster");

            migrationBuilder.DropTable(
                name: "MedicineMaster");

            migrationBuilder.DropTable(
                name: "patientInfo");

            migrationBuilder.DropTable(
                name: "PatientMedications");

            migrationBuilder.DropTable(
                name: "PaymentModeInfo");

            migrationBuilder.DropTable(
                name: "Questionnaire");

            migrationBuilder.DropTable(
                name: "staffInfo");

            migrationBuilder.DropTable(
                name: "staffSchedule");

            migrationBuilder.DropTable(
                name: "VitalInfo");

            migrationBuilder.DropTable(
                name: "Options");

            migrationBuilder.DropTable(
                name: "Question");
        }
    }
}
