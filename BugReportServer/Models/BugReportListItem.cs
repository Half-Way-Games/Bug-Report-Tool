namespace BugReportServer.Models;

public record BugReportListItem
{
    public          int      Id           { get; init; }
    public          DateTime ReceivedAt   { get; init; }
    public required string   BuildVersion { get; init; }
    public required string   Platform     { get; init; }
    public          string?  Summary      { get; init; }
    public          string?  ReporterNote { get; init; }
}