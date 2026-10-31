namespace BugReportServer.Services;

public class ScreenshotStorage
{
    private readonly string uploadPath;

    public ScreenshotStorage(IConfiguration config)
    {
        uploadPath = config["UploadPath"] ?? "/data/uploads";
        Directory.CreateDirectory(uploadPath);
    }

    public async Task<string> SaveScreenshotAsync(string id, IFormFile screenshot)
    {
        var relativeDir = DateTime.UtcNow.ToString("yyyy-MM-dd");
        var absoluteDir = Path.Combine(uploadPath, relativeDir);

        Directory.CreateDirectory(absoluteDir);

        var extension = Path.GetExtension(screenshot.FileName);

        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = ".jpg";
        }

        var fileName = $"{id}{extension}";
        var absolutePath = Path.Combine(absoluteDir, fileName);

        await using var stream = File.Create(absolutePath);
        await screenshot.CopyToAsync(stream);

        return Path.Combine(relativeDir, fileName).Replace("\\", "/"); 
    }
}