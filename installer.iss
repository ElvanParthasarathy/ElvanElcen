#define MyAppName "Elvan Nammil"
#define MyAppVersion "2.1.0"
#define MyAppPublisher "Elvan Parthasarathy"
#define MyAppExeName "Elvan Nammil.exe"
#define MyOutputDir "release"
#define MyAppURL "https://nammil.elvan.dev"
#define MyAppId "com.nammil.elvan"

[Setup]
AppId={{5A8C4A9D-2F38-4F43-A1C2-8B1E4A35B9D1}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes

; Modern Theme Settings
WizardStyle=modern
SetupIconFile=build\icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
Compression=lzma2/ultra64
SolidCompression=yes
OutputDir={#MyOutputDir}
OutputBaseFilename=Elvan Nammil Setup
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

; Custom UI Images (Branding)
WizardImageFile=build\setup_sidebar.bmp
WizardSmallImageFile=build\setup_icon.bmp

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "release\win-unpacked\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "release\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Code]
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  AppDataPath: String;
begin
  if CurUninstallStep = usPostUninstall then
  begin
    AppDataPath := ExpandConstant('{userappdata}\{#MyAppName}');
    if DirExists(AppDataPath) then
    begin
      if MsgBox('Do you want to remove all app data (WhatsApp session, settings, cache)?'#13#10#13#10'Click Yes for a clean uninstall.'#13#10'Click No to keep your data for future reinstalls.',
        mbConfirmation, MB_YESNO) = IDYES then
      begin
        DelTree(AppDataPath, True, True, True);
      end;
    end;
  end;
end;
