using BugReportServer.Services;
using Microsoft.Extensions.FileProviders;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<BugReportDatabase>();
builder.Services.AddSingleton<ScreenshotStorage>();
builder.Services.AddCors();

var app = builder.Build();

var uploadDir = builder.Configuration["UploadDir"] ?? "/data/uploads";
var uploadPath = Path.GetFullPath(uploadDir);

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

app.Run();
