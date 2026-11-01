using System.Text.Json.Nodes;
using BugReportServer.Services;
using Microsoft.Extensions.FileProviders;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<BugReportDatabase>();
builder.Services.AddSingleton<ScreenshotStorage>();
builder.Services.AddHttpClient();
builder.Services.AddCors();

var app = builder.Build();

var uploadDir = builder.Configuration["UploadDir"];
var uploadPath = Path.GetFullPath(string.IsNullOrWhiteSpace(uploadDir) ? "/data/uploads" : uploadDir);
Directory.CreateDirectory(uploadPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadPath),
    RequestPath = "/api/screenshots"
});

app.MapGet("/health", () => new {status = "ok"});

app.MapGet("/api/bugs", async (BugReportDatabase db) =>
{
    var bugs = await db.ListReportsAsync(50, 0);
    return Results.Ok(new {bugs});
});

app.MapGet("/api/bugs/{id}", async (string id, BugReportDatabase db) =>
{
    var bug = await db.GetReportByIdAsync(id);
    
    return bug != null ? Results.Ok(new {bug}) : Results.NotFound();
});

app.MapPost("/bug-report", async (HttpRequest request, ScreenshotStorage ScreenshotStorage, IHttpClientFactory httpClientFactory, IConfiguration config, ILogger<Program> logger) =>
{
    logger.LogInformation("Received a bug report");

    if (!request.HasFormContentType)
    {
        return Results.BadRequest("Expected multipart/form-data");
    }

    var form = await request.ReadFormAsync();

    var payloadJson = form["payload"].FirstOrDefault();

    if (string.IsNullOrWhiteSpace(payloadJson))
    {
        logger.LogWarning("Missing payload");
        return Results.BadRequest("Missing payload");
    }

    JsonNode? payload;
    try
    {
        payload = JsonNode.Parse(payloadJson);
    }
    catch (Exception e)
    {
        logger.LogWarning(e, "Failed to parse payload JSON");
        return Results.BadRequest("Invalid payload JSON");
    }

    if (payload is null)
    {
        logger.LogWarning("Parsed payload was null");
        return Results.BadRequest("Invalid payload JSON");
    }

    string? screenshotPath = null;
    var screenshot = form.Files.GetFile("screenshot");

    if (screenshot is not null && screenshot.Length > 0)
    {
        var reportId = Guid.NewGuid().ToString();
        screenshotPath = await ScreenshotStorage.SaveScreenshotAsync(reportId, screenshot);
    }

    var report = new
    {
        build_version = payload["meta"]?["build_version"]?.GetValue<string>() ?? "unknown",
        reporter_note = payload["meta"]?["reporter_note"]?.GetValue<string>() ?? "No note added",
        platform = payload["meta"]?["platform"]?.GetValue<string>(),
        hardware_stats = payload["meta"]?["hardware_stats"],
        screenshot_path = screenshotPath,
        data = payload["data"]
    };
    
    var n8nWebhookUrl = config.GetConnectionString("N8NUrl");

    if (!string.IsNullOrWhiteSpace(n8nWebhookUrl))
    {
        try
        {
            var httpClient = httpClientFactory.CreateClient();
            var response = await httpClient.PostAsJsonAsync(n8nWebhookUrl, report);

            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("N8N webhook returned status code {StatusCode}", response.StatusCode);
            }
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to forward report to N8N");
        }
    }
    else
    {
        logger.LogWarning("N8NWebhookUrl is not configured; report was not forwarded");
    }
    
    return Results.NoContent();
});

app.Run();
