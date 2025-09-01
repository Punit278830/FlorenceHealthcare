using Microsoft.Data.SqlClient;
using System;
using System.IO;

class Program
{
    static async Task Main(string[] args)
    {
        string connectionString = "Server=162.222.225.88;Database=florenceDb;User Id=mohit2024;Password=Spice@1234;TrustServerCertificate=True;";
        string scriptPath = "migration_script_multihospital.sql";
        
        try
        {
            string sql = await File.ReadAllTextAsync(scriptPath);
            
            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand(sql, connection);
            command.CommandTimeout = 120; // 2 minutes
            
            int result = await command.ExecuteNonQueryAsync();
            Console.WriteLine($"Migration script executed successfully. Rows affected: {result}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error executing migration: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}
