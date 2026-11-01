using System.Text.Json;
using BugReportServer.Models;
using MySqlConnector;
namespace BugReportServer.Services;

public class BugReportDatabase(IConfiguration config)
{
    private readonly string connectionString = config.GetConnectionString("MariaDb") ?? throw new InvalidOperationException("Missing MariaDb connection string.");

    public async Task<List<BugReportListItem>> ListReportsAsync(int limit, int offset)
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        
        command.CommandText = """
                              SELECT id, received_at, build_version, platform, summary, reporter_note
                              FROM bug_reports
                              ORDER BY id DESC
                              LIMIT @limit OFFSET @offset
                              """;
        command.Parameters.AddWithValue("@limit", limit);
        command.Parameters.AddWithValue("@offset", offset);

        var bugs = new List<BugReportListItem>();
        
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            bugs.Add(new BugReportListItem{
                Id = reader.GetInt32("id"),
                ReceivedAt = reader.GetDateTime("received_at"),
                BuildVersion = reader.GetString("build_version"),
                Platform = reader.GetString("platform"),
                Summary = reader.IsDBNull(reader.GetOrdinal("summary"))
                    ? null 
                    : reader.GetString("summary"),
                ReporterNote = reader.IsDBNull(reader.GetOrdinal("reporter_note"))
                    ? null 
                    : reader.GetString("reporter_note"),
            });
        }
        
        return bugs;
    }
    public async Task<BugReportDetail?> GetReportByIdAsync(string id)
    { 
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        
        command.CommandText = """
                              SELECT *
                              FROM bug_reports
                              WHERE id = @id
                              LIMIT 1
                              """;
        command.Parameters.AddWithValue("@id", id);
        
        await using var reader = await command.ExecuteReaderAsync();
        
        await reader.ReadAsync();

        return reader.HasRows ? new BugReportDetail
        {
            Id = reader.GetInt16("id"),
            ReceivedAt = reader.GetDateTime("received_at"),
            BuildVersion = reader.GetString("build_version"),
            Platform = reader.GetString("platform"),
            Summary = reader.IsDBNull(reader.GetOrdinal("summary"))
                ? null
                : reader.GetString("summary"),
            ReporterNote = reader.IsDBNull(reader.GetOrdinal("reporter_note"))
                ? null
                : reader.GetString("reporter_note"),
            ScreenshotPath = reader.IsDBNull(reader.GetOrdinal("screenshot_path"))
                ? null
                : reader.GetString("screenshot_path"),
            HardwareStats = reader.IsDBNull(reader.GetOrdinal("hardware_stats"))
                ? null
                : JsonSerializer.Deserialize<JsonElement>(reader.GetString("hardware_stats")),
            PayloadData = JsonSerializer.Deserialize<JsonElement>(reader.GetString("payload_data")),
            RawPayload = JsonSerializer.Deserialize<JsonElement>(reader.GetString("raw_payload"))
        } : null;
    }
}