using System;
using System.IO;
using System.IO.Compression;
using System.Text.Json;
using System.Threading.Tasks;
using System.Reflection;
using System.Diagnostics;

namespace Nammil_Installer.Services
{
    public static class InstallEngine
    {
        public static async Task InstallAsync(string appPath, string mediaPath, string accountName)
        {
            await Task.Run(() =>
            {
                // 1. Create Directories
                if (!Directory.Exists(appPath))
                {
                    Directory.CreateDirectory(appPath);
                }

                string finalMediaPath = mediaPath;
                if (!finalMediaPath.EndsWith("Media", StringComparison.OrdinalIgnoreCase) && !finalMediaPath.Contains("Elvan Nammil", StringComparison.OrdinalIgnoreCase))
                {
                    finalMediaPath = Path.Combine(finalMediaPath, "Elvan Nammil", "Media");
                }

                if (!Directory.Exists(finalMediaPath))
                {
                    Directory.CreateDirectory(finalMediaPath);
                }

                // 2. Extract Embedded Zip
                var assembly = Assembly.GetExecutingAssembly();
                using (var stream = assembly.GetManifestResourceStream("Nammil_Installer.Assets.app_payload.zip"))
                {
                    if (stream == null) throw new Exception("Embedded zip not found.");
                    
                    using (var archive = new ZipArchive(stream, ZipArchiveMode.Read))
                    {
                        foreach (var entry in archive.Entries)
                        {
                            var destinationPath = Path.GetFullPath(Path.Combine(appPath, entry.FullName));

                            if (destinationPath.EndsWith("\\") || destinationPath.EndsWith("/"))
                            {
                                Directory.CreateDirectory(destinationPath);
                            }
                            else
                            {
                                Directory.CreateDirectory(Path.GetDirectoryName(destinationPath));
                                entry.ExtractToFile(destinationPath, true);
                            }
                        }
                    }
                }

                // 3. Create Settings File
                var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                var settingsDir = Path.Combine(appData, "Elvan Nammil");
                if (!Directory.Exists(settingsDir))
                {
                    Directory.CreateDirectory(settingsDir);
                }

                var settingsPath = Path.Combine(settingsDir, "nammil_settings.json");
                
                var settingsObj = new
                {
                    language = "en",
                    theme = "system",
                    autoOrganize = true,
                    duplicateAction = "skip",
                    notificationSound = "kumizhi",
                    accountSounds = new { },
                    isFirstBoot = false,
                    mediaFolder = finalMediaPath,
                    mediaFolderPath = finalMediaPath,
                    accounts = new[]
                    {
                        new { id = "account_1", name = accountName }
                    }
                };

                var options = new JsonSerializerOptions { WriteIndented = true };
                var json = JsonSerializer.Serialize(settingsObj, options);
                File.WriteAllText(settingsPath, json);

                // 4. Create Desktop Shortcut (via PowerShell to avoid COM Interop complexities in .NET 9)
                string desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                string shortcutPath = Path.Combine(desktop, "Elvan Nammil.lnk");
                string targetPath = Path.Combine(appPath, "Elvan Nammil.exe");
                
                string iconPath = Path.Combine(appPath, "resources", "app.asar.unpacked", "assets", "app_icon.ico");
                if (!File.Exists(iconPath)) iconPath = targetPath; // Fallback to exe icon

                string psCommand = $@"$s=(New-Object -COM WScript.Shell).CreateShortcut('{shortcutPath}');$s.TargetPath='{targetPath}';$s.IconLocation='{iconPath}';$s.WorkingDirectory='{appPath}';$s.Save()";
                
                var startInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = $"-NoProfile -ExecutionPolicy Bypass -Command \"{psCommand}\"",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using (var process = Process.Start(startInfo))
                {
                    process.WaitForExit();
                }
                
                // Note: Registry Uninstaller keys would be added here, but skipped for brevity in this MVP implementation
            });
        }

        public static void LaunchApp(string appPath)
        {
            var targetPath = Path.Combine(appPath, "Elvan Nammil.exe");
            if (File.Exists(targetPath))
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = targetPath,
                    WorkingDirectory = appPath,
                    UseShellExecute = true
                });
            }
        }
    }
}
