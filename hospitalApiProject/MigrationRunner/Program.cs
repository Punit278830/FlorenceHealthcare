using Microsoft.Data.SqlClient;
using System;
using System.IO;

class Program
{
    static async Task Main(string[] args)
    {
        string connectionString = "Server=162.222.225.88;Database=florenceDb;User Id=mohit2024;Password=Spice@1234;TrustServerCertificate=True;";
        
        try
        {
            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();
            Console.WriteLine("Connected to database successfully.");
            
            // Check if HospitalId column exists
            string checkColumnSql = @"
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'InvoiceInfo' AND COLUMN_NAME = 'HospitalId'";
            
            using var checkCommand = new SqlCommand(checkColumnSql, connection);
            var result = await checkCommand.ExecuteScalarAsync();
            
            if (result != null)
            {
                Console.WriteLine("HospitalId column exists in InvoiceInfo table.");
                
                // Check column structure
                string columnsSql = @"
                    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'InvoiceInfo' 
                    ORDER BY ORDINAL_POSITION";
                
                using var columnsCommand = new SqlCommand(columnsSql, connection);
                using var columnsReader = await columnsCommand.ExecuteReaderAsync();
                
                Console.WriteLine("\nInvoiceInfo table columns:");
                while (await columnsReader.ReadAsync())
                {
                    Console.WriteLine($"{columnsReader["COLUMN_NAME"]} - {columnsReader["DATA_TYPE"]} - {columnsReader["IS_NULLABLE"]}");
                }
                
                columnsReader.Close();
                
                // Check existing invoices with minimal columns
                string checkInvoicesSql = @"
                    SELECT TOP 10 InvoiceId, HospitalId, PatientId 
                    FROM InvoiceInfo 
                    ORDER BY InvoiceId DESC";
                
                using var invoiceCommand = new SqlCommand(checkInvoicesSql, connection);
                using var reader = await invoiceCommand.ExecuteReaderAsync();
                
                Console.WriteLine("\nRecent invoices:");
                Console.WriteLine("InvoiceId | HospitalId | PatientId");
                Console.WriteLine("---------|-----------|----------");
                
                while (await reader.ReadAsync())
                {
                    var invoiceId = reader["InvoiceId"];
                    var hospitalId = reader["HospitalId"] == DBNull.Value ? "NULL" : reader["HospitalId"].ToString();
                    var patientId = reader["PatientId"];
                    
                    Console.WriteLine($"{invoiceId} | {hospitalId} | {patientId}");
                }
                
                reader.Close();
                
                // Count invoices with NULL HospitalId
                string countNullSql = "SELECT COUNT(*) FROM InvoiceInfo WHERE HospitalId IS NULL";
                using var countCommand = new SqlCommand(countNullSql, connection);
                var nullCount = await countCommand.ExecuteScalarAsync();
                
                Console.WriteLine($"\nInvoices with NULL HospitalId: {nullCount}");
                
                // Update NULL HospitalIds to 1 (assuming first hospital)
                if (Convert.ToInt32(nullCount) > 0)
                {
                    Console.WriteLine("Updating NULL HospitalIds to 1...");
                    string updateSql = "UPDATE InvoiceInfo SET HospitalId = 1 WHERE HospitalId IS NULL";
                    using var updateCommand = new SqlCommand(updateSql, connection);
                    var updatedRows = await updateCommand.ExecuteNonQueryAsync();
                    Console.WriteLine($"Updated {updatedRows} invoice records with HospitalId = 1");
                }
            }
            else
            {
                Console.WriteLine("HospitalId column does NOT exist in InvoiceInfo table!");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }
        }
    }
}
