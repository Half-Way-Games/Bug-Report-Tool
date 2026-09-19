using System;
using System.Text;
using Godot;
using Godot.Collections;
namespace FantasyRPG.Components.Debug;

public partial class BugReportForm : Control
{
    [Export] private TextureRect screenshotPreview;
    [Export] private HttpRequest httpRequest;
    [Export] private TextEdit reporterNotes;
    [Export] private Button submitBugReport;
    [Export] private Button closeButton;
    [Export] private Label statusLabel;
    [Export] private AnimationPlayer animationPlayer;

    private static readonly string ReportUrl = ProjectSettings.GetSetting("tools/bug_report/url").AsString();
    private static readonly string HeaderKey = ProjectSettings.GetSetting("tools/bug_report/header_key").AsString();
    
    private static readonly System.Collections.Generic.Dictionary<string, Func<Dictionary>> payloadProviders = new();
    
    private Image screenshot;
    
    private Dictionary collectedPayload = new();

    private Input.MouseModeEnum previousMouseMode;

    private static readonly StringName reportInput = "Report";
    private static readonly StringName enterAnimation = "Enter";
    private static readonly StringName exitAnimation = "Exit";
    

    public override void _Ready()
    {
        httpRequest.RequestCompleted += OnRequestCompleted;
        submitBugReport.Pressed += SubmitBugReport;
        closeButton.Pressed += TogglePanel;
        animationPlayer.AnimationFinished += OnAnimationFinished;
    }
    
    public override void _ExitTree()
    {
        httpRequest.RequestCompleted -= OnRequestCompleted;
        submitBugReport.Pressed -= SubmitBugReport;
        closeButton.Pressed -= TogglePanel;
        animationPlayer.AnimationFinished -= OnAnimationFinished;
    }

    public override void _UnhandledInput(InputEvent @event)
    {
        if (@event.IsActionPressed(reportInput))
        {
            TogglePanel();
        }
    }

    public static void RegisterProvider(string key, Func<Dictionary> provider)
    {
        ArgumentNullException.ThrowIfNull(key);

        ArgumentNullException.ThrowIfNull(provider);

        if (payloadProviders.ContainsKey(key))
            throw new InvalidOperationException($"Bug report provider with key '{key}' already exists. Keys must be unique");

        payloadProviders.TryAdd(key, provider);
    }

    public static bool UnregisterProvider(string key)
    {
        return payloadProviders.Remove(key);
    }

    private void OpenForm()
    {
        screenshot = GetTree().Root.GetViewport().GetTexture().GetImage();
        
        // Resize image to be 1280, preserving aspect ratio
        var ratio = (float)screenshot.GetWidth() / screenshot.GetHeight();
        screenshot.Resize(1280, (int)(1280 / ratio));
        
        screenshotPreview.SetTexture(ImageTexture.CreateFromImage(screenshot));
        submitBugReport.Disabled = false;

        Show();
        animationPlayer.Play(enterAnimation);
        reporterNotes.GrabFocus();

        collectedPayload = BuildPayload();
    }

    private void SubmitBugReport()
    {
        if (reporterNotes.Text.Length == 0)
        {
            statusLabel.Text = "Please enter a description of the bug";
            statusLabel.Modulate = Colors.Tomato;
            statusLabel.Show();
            reporterNotes.GrabFocus();
            return;
        }

        submitBugReport.Disabled = true;

        var jpgBytes = screenshot.SaveJpgToBuffer();

        if (collectedPayload.Count == 0)
        {
            Log.Error("No payload collected. Did you forget to call RegisterProvider?");
            return;
        }

        collectedPayload["meta"].AsGodotDictionary().Add("reporter_note", reporterNotes.Text);

        string payloadJson = Json.Stringify(collectedPayload);

        Log.Debug($"Reporter Note: {reporterNotes.Text}");

        // Multipart
        string boundary = "----GodotBugReport" + Guid.NewGuid().ToString("N");
        byte[] body = BuildMultipartBody(boundary, payloadJson, jpgBytes);

        var headers = new[]
        {
            $"Content-Type: multipart/form-data; boundary={boundary}",
            $"X-Bug-Token: {HeaderKey}"
        };

        // Send raw body
        var err = httpRequest.RequestRaw(ReportUrl, headers, HttpClient.Method.Post, body);
        if (err != Error.Ok)
        {
            Log.Error($"Error submitting bug report: {err}");
        }
    }

    private static Dictionary BuildPayload()
    {
        var payload = new Dictionary();

        var meta = new Dictionary();

        meta.Add("build_version", ProjectSettings.GetSetting("application/config/version"));
        meta.Add("platform", $"{OS.GetName()} {OS.GetVersion()}");
        var memory = OS.GetMemoryInfo();
        meta.Add("hardware_stats", new Dictionary
        {
            {"cpu", OS.GetProcessorName()},
            {"gpu", RenderingServer.GetVideoAdapterName() ?? "Unknown"},
            {"ram", new Dictionary
            {
                {"free", memory["free"].AsDouble() / 1073741824.0},
                {"total", memory["physical"].AsDouble() / 1073741824.0}
            }},
            {"display", new Dictionary
            {
                {"size", DisplayServer.ScreenGetSize()},
                {"refresh", DisplayServer.ScreenGetRefreshRate()}
            }}
        });

        payload.Add("meta", meta);

        var data = new Dictionary();

        foreach (var provider in payloadProviders)
        {
            try
            {
                var section = provider.Value.Invoke() ?? new Dictionary();
                data.Add(provider.Key, section);
            }
            catch (Exception ex)
            {
                // Don't fail the whole report on provider failure
                data[provider.Key] = new Dictionary {{"error", ex.Message}};
            }
        }

        payload.Add("data", data);

        return payload;
    }

    private static byte[] BuildMultipartBody(string boundary, string payloadJson, byte[] screenshotBytes)
    {
        const string CRLF = "\r\n";

        var ms = new System.IO.MemoryStream();

        // Part 1: Payload JSON
        WriteString($"--{boundary}{CRLF}");
        WriteString($"Content-Disposition: form-data; name=\"payload\"{CRLF}");
        WriteString($"Content-Type: application/json; charset=utf-8{CRLF}{CRLF}");
        WriteString(payloadJson);
        WriteString(CRLF);

        // Part 2: Screenshot
        WriteString($"--{boundary}{CRLF}");
        WriteString($"Content-Disposition: form-data; name=\"screenshot\"; filename=\"screenshot.jpg\"{CRLF}");
        WriteString($"Content-Type: image/jpeg{CRLF}{CRLF}");
        ms.Write(screenshotBytes, 0, screenshotBytes.Length);
        WriteString(CRLF);

        // End
        WriteString($"--{boundary}--{CRLF}");

        return ms.ToArray();

        void WriteString(string s)
        {
            var bytes = Encoding.UTF8.GetBytes(s);
            ms.Write(bytes, 0, bytes.Length);
        }
    }

    private void TogglePanel()
    {
        if (IsVisible())
        {
            animationPlayer.Play(exitAnimation);
            Input.SetMouseMode(previousMouseMode);
            reporterNotes.ReleaseFocus();
        }
        else
        {
            previousMouseMode = Input.GetMouseMode();
            Input.SetMouseMode(Input.MouseModeEnum.Visible);
            OpenForm();
        }
    }

    private void OnRequestCompleted(long result, long responseCode, string[] headers, byte[] body)
    {
        Log.Info($"Bug report submit result = {result}, response code = {responseCode}");

        if (result != (long)HttpRequest.Result.Success)
        {
            statusLabel.Text =  $"Bug Report error: {(HttpRequest.Result)result}";
            statusLabel.Modulate = Colors.Tomato;
        }
        else
        {
            statusLabel.Text = "Bug report submitted successfully!";
            statusLabel.Modulate = Colors.Green;
            submitBugReport.Disabled = true;
        }
        
        statusLabel.Show();
        collectedPayload.Clear();
    }
    
    private void OnAnimationFinished(StringName animName)
    {
        if (!animName.Equals(exitAnimation))
            return;
        Hide();
        collectedPayload.Clear();
        statusLabel.Hide();
        screenshot = null;
    }
}