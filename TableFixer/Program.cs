using Microsoft.Data.SqlClient;

class Program
{
    static async Task Main(string[] args)
    {
        string connectionString = "Server=162.222.225.88;Database=florenceDb;User Id=mohit2024;Password=Spice@1234;TrustServerCertificate=True;";
        
        try
        {
            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();
            Console.WriteLine($"Connected to database: {connection.Database}");
            
            // Check what tables exist
            using var tablesCommand = new SqlCommand(@"
                SELECT TABLE_SCHEMA, TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME LIKE '%Hospital%'
                ORDER BY TABLE_SCHEMA, TABLE_NAME", connection);
                
            using var tablesReader = await tablesCommand.ExecuteReaderAsync();
            Console.WriteLine("\nHospital-related tables in the database:");
            while (await tablesReader.ReadAsync())
            {
                Console.WriteLine($"{tablesReader[0]}.{tablesReader[1]}");
            }
            tablesReader.Close();
            
            // Check Hospital table specifically
            using var hospitalCommand = new SqlCommand(@"
                SELECT COUNT(*) as TableCount 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME = 'Hospital'", connection);
                
            var hospitalCount = await hospitalCommand.ExecuteScalarAsync();
            Console.WriteLine($"\nNumber of Hospital tables: {hospitalCount}");
            
            // Get all columns in Hospital table
            using var columnsCommand = new SqlCommand(@"
                SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH, ORDINAL_POSITION
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Hospital'
                ORDER BY ORDINAL_POSITION", connection);
                
            using var columnsReader = await columnsCommand.ExecuteReaderAsync();
            Console.WriteLine("\nHospital table columns (in order):");
            while (await columnsReader.ReadAsync())
            {
                Console.WriteLine($"{columnsReader[4]}: {columnsReader[0]} ({columnsReader[1]})");
            }
            columnsReader.Close();
            
            // Try to select data from Hospital table using only basic columns
            try
            {
                using var dataCommand = new SqlCommand("SELECT HospitalId, Name FROM Hospital", connection);
                using var dataReader = await dataCommand.ExecuteReaderAsync();
                Console.WriteLine("\nSample data from Hospital table (HospitalId, Name only):");
                
                if (!dataReader.HasRows)
                {
                    Console.WriteLine("No data found in Hospital table.");
                }
                else
                {
                    while (await dataReader.ReadAsync())
                    {
                        Console.WriteLine($"ID: {dataReader[0]}, Name: {dataReader[1]}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading Hospital data: {ex.Message}");
            }
            
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
