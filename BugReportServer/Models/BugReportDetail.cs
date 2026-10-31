using System.Text.Json;
namespace BugReportServer.Models;

public record BugReportDetail : BugReportListItem
{
    public          string?      ScreenshotPath { get; init; }
    public          JsonElement? HardwareStats  { get; init; }
    public required JsonElement  PayloadData    { get; init; }
    public required JsonElement  RawPayload     { get; init; }
}