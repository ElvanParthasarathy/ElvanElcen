const fs = require('fs');

const data = [
  ["GENERAL_TITLE", "General", "பொது", "Podhu", "പൊതുവായ", "Podhuvaya", "പൊതു"],
  ["GENERAL_DESC", "Startup, tray and performance", "துவக்கம், பணித்தட்டு, செயல்திறன்", "Thuvakkam, panithattu, seyalthiran", "സ്റ്റാർട്ടപ്പ്, ട്രേ, പ്രകടനം", "Startup, tray, prakadanam", "തുവക്കം, പണിത്തട്ടു, ചെയൽതിറൻ"],
  ["GENERAL_STARTUP", "Launch on Startup", "துவக்கத்தில் இயங்கு", "Thuvakkathil iyangu", "സ്റ്റാർട്ടപ്പിൽ ആരംഭിക്കുക", "Startuppil aarambhikkuka", "തുവക്കത്തിൽ ഇയങ്കു"],
  ["GENERAL_STARTUP_DESC", "Start Nammil when Windows starts", "விண்டோஸ் துவக்கத்தில் நம்மில்-ஐ திற", "Windows thuvakkathil Nammil-ai thira", "വിൻഡോസ് തുടങ്ങുമ്പോൾ നമ്മിൽ തുറക്കുക", "Windows thudangumpol Nammil thurakkuka", "വിൺടോസ് തുവക്കത്തിൽ നമ്മിൽ-ഐ തിറ"],
  ["GENERAL_START_MINIMIZED", "Start Minimized", "சிறிதாக்கி துவக்கு", "Sirithaakki thuvakku", "ചെറുതാക്കി ആരംഭിക്കുക", "Cheruthakki aarambhikkuka", "ചിറിതാക്കി തുവക്കു"],
  ["GENERAL_TRAY", "Close to System Tray", "பணித்தட்டில் மூடு", "Panithattil moodu", "സിസ്റ്റം ട്രേയിലേക്ക് ക്ലോസ് ചെയ്യുക", "System trayilekku close cheyyuka", "പണിത്തട്ടിൽ മൂടു"],
  ["GENERAL_TRAY_DESC", "Keep running in background when closed", "மூடும்போது பின்னணியில் இயங்கு", "Moodumbodhu pinnaniyil iyangu", "അടയ്ക്കുമ്പോൾ ബാക്ക്ഗ്രൗണ്ടിൽ പ്രവർത്തിക്കുക", "Adaykkumpol backgroundil pravarthikkuka", "മൂടുംപോതു പിന്നണിയിൽ ഇയങ്കു"],
  ["GENERAL_LOW_MEMORY", "Low Memory Mode", "குறைந்த நினைவக முறை", "Kuraintha ninaivaga murai", "ലോ മെമ്മറി മോഡ്", "Low memory mode", "കുറൈന്ത നിനൈവക മുറൈ"],
  ["GENERAL_LOW_MEMORY_DESC", "Reduce memory when minimized. Notifications still work.", "சிறிதாக்கினால் நினைவகம் குறையும். அறிவிப்புகள் வரும்.", "Sirithaakkinaal ninaivagam kuraiyum. Arivippugal varum.", "ചെറുതാക്കുമ്പോൾ മെമ്മറി കുറയ്ക്കുക. അറിയിപ്പുകൾ വരും.", "Cheruthakkumpol memory kuraykkuka. Ariyippukal varum.", "ചിറിതാക്കിനാൽ നിനൈവകം കുറൈയും. അറിവിപ്പുകൾ വരും."],
  ["GENERAL_HW_ACCEL", "Hardware Acceleration", "வன்பொருள் முடுக்கம்", "Vanporul mudukkam", "ഹാർഡ്വെയർ ആക്സിലറേഷൻ", "Hardware acceleration", "വൻപൊരുൾ മുടുക്കം"],
  ["GENERAL_HW_ACCEL_DESC", "Use GPU for rendering. Disable if you see flickering.", "GPU-ஐ பயன்படுத்து. திரை மினுமினுத்தால் முடக்கவும்.", "GPU-vai payanpaduthu. Thirai minuminutthaal mudakkavum.", "GPU ഉപയോഗിക്കുക. സ്ക്രീൻ ഫ്ലിക്കറിംഗ് ഉണ്ടെങ്കിൽ ഓഫ് ചെയ്യുക.", "GPU upayogikkuka. Screen flickering undengil off cheyyuka.", "GPU-ഐ പയൻപടുത്തു. തിരൈ മിനുമിനുത്താൽ മുടക്കവും."],
  ["GENERAL_RESTART_REQUIRED", "Restart required to apply", "மாற்றங்களுக்கு மறுதொடக்கம் தேவை", "Maatrangalukku maruthodakkam thevai", "മാറ്റങ്ങൾക്ക് റീസ്റ്റാർട്ട് ആവശ്യമാണ്", "Maattangalkku restart aavashyamanu", "മാറ്റങ്കളുക്കു മറുതൊടക്കം തേവൈ"],
  ["GENERAL_PERFORMANCE", "Performance", "செயல்திறன்", "Seyalthiran", "പ്രകടനം", "Prakadanam", "ചെയൽതിറൻ"],
  ["GENERAL_RESTART_NOW", "Restart Now", "உடனே மறுதொடக்கம் செய்", "Udane maruthodakkam sei", "ഉടനെ റീസ്റ്റാർട്ട് ചെയ്യുക", "Udane restart cheyyuka", "ഉടനേ മറുതൊടക്കം ചെയ്"],
  ["NOTIF_TITLE", "Notifications", "அறிவிப்புகள்", "Arivippugal", "അറിയിപ്പുകൾ", "Ariyippukal", "അറിവിപ്പുകൾ"],
  ["NOTIF_DESC", "Message alerts and sounds", "செய்தி அறிவிப்புகள், ஒலிகள்", "Seidhi arivippugal, oligal", "സന്ദേശ അറിയിപ്പുകൾ, ശബ്ദങ്ങൾ", "Sandesha ariyippukal, shabdhangal", "ചെയ്തി അറിവിപ്പുകൾ, ഒലികൾ"],
  ["NOTIF_ENABLE", "Desktop Notifications", "திரைமுகப்பு அறிவிப்புகள்", "Thiraimugappu arivippugal", "ഡെസ്ക്ടോപ്പ് അറിയിപ്പുകൾ", "Desktop ariyippukal", "തിരൈമുകപ്പു അറിവിപ്പുകൾ"],
  ["NOTIF_ENABLE_DESC", "Show Windows notifications for new messages", "புதிய செய்திகளுக்கு விண்டோஸ் அறிவிப்புகளைப் பெறு", "Puthiya seidhikalukku Windows arivippugalaip peru", "പുതിയ സന്ദേശങ്ങൾക്ക് വിൻഡോസ് അറിയിപ്പുകൾ കാണിക്കുക", "Puthiya sandhesangalkku Windows ariyippukal kaanikkuka", "പുതിയ ചെയ്തികളുക്കു വിൺടോസ് അറിവിപ്പുകളൈപ് പെറു"],
  ["NOTIF_FLASH", "Flash Taskbar", "பணிப்பட்டியை ஒளிரச்செய்", "Panippattiyai oliracchey", "ടാസ്ക്ബാർ ഫ്ലാഷ് ചെയ്യുക", "Taskbar flash cheyyuka", "പണിപ്പട്ടിയൈ ഒളിരച്ചെയ്"],
  ["NOTIF_FLASH_DESC", "Flash the taskbar icon when a new message arrives", "புதிய செய்தி வரும்போது பணிப்பட்டி சின்னத்தை ஒளிரச்செய்", "Puthiya seidhi varumbothu panippatti chinnathai oliracchey", "പുതിയ സന്ദേശം വരുമ്പോൾ ടാസ്ക്ബാർ ഐക്കൺ ഫ്ലാഷ് ചെയ്യുക", "Puthiya sandhesam varumpol taskbar icon flash cheyyuka", "പുതിയ ചെയ്തി വരുംപോതു പണിപ്പട്ടി ചിന്നത്തൈ ഒളിരച്ചെയ്"],
  ["NOTIF_SOUND_TITLE", "Notification Sound", "அறிவிப்பு ஒலி", "Arivippu oli", "അറിയിപ്പ് ശബ്ദം", "Ariyippu shabdam", "അറിവിപ്പു ഒലി"],
  ["NOTIF_SOUND_DEFAULT", "Default (Windows)", "இயல்புநிலை (விண்டோஸ்)", "Iyalbunilai (Windows)", "ഡിഫോൾട്ട് (വിൻഡോസ്)", "Default (Windows)", "ഇയൽപുനിലൈ (വിൺടോസ്)"],
  ["NOTIF_SOUND_THULI", "Thuli", "துளி", "Thuli", "തുള്ളി", "Thulli", "തുളി"],
  ["NOTIF_SOUND_THULLAL", "Thullal", "துள்ளல்", "Thullal", "തുള്ളൽ", "Thullal", "തുള്ളൽ"],
  ["NOTIF_SOUND_THENDRAL", "Thendral", "தென்றல்", "Thendral", "തെന്നൽ", "Thennal", "തെൻറൽ"],
  ["NOTIF_SOUND_MINNAL", "Minnal", "மின்னல்", "Minnal", "മിന്നൽ", "Minnal", "മിന്നൽ"],
  ["NOTIF_SOUND_KUMIZHI", "Kumizhi", "குமிழி", "Kumizhi", "കുമിള", "Kumila", "കുമിഴി"],
  ["NOTIF_SOUND_ALAI", "Alai", "அலை", "Alai", "തിര", "Thira", "അലൈ"],
  ["NOTIF_SOUND_BEEP", "Beep", "சிற்றொலி", "Sitroli", "ബീപ്", "Beep", "ചിറ്റൊലി"],
  ["NOTIF_SOUND_EXCLAMATION", "Exclamation", "எச்சரிக்கை", "Eccharikkai", "മുന്നറിയിപ്പ്", "Munnariyippu", "എച്ചരിക്കൈ"],
  ["NOTIF_SOUND_CRITICAL", "Critical", "நெருக்கடி", "Nerukkadi", "അടിയന്തരം", "Adiyantharam", "നെരുക്കടി"],
  ["NOTIF_SOUND_QUESTION", "Question", "கேள்வி", "Kelvi", "ചോദ്യം", "Chodyam", "കേൾവി"],
  ["NOTIF_SOUND_SILENT", "Silent", "அமைதி", "Amaidhi", "നിശ്ശബ്ദം", "Nishshabdam", "അമൈതി"],
  ["NOTIF_SOUND_CUSTOM", "Custom...", "தனிப்பயன்...", "Thanippayan...", "കസ്റ്റം...", "Custom...", "തനിപ്പയൻ..."],
  ["NOTIF_PER_ACCOUNT", "Per-Account Notifications", "கணக்கு வாரியான அறிவிப்புகள்", "Kanakku vaariyaana arivippugal", "അക്കൗണ്ട് തിരിച്ചുള്ള അറിയിപ്പുകൾ", "Account thirichulla ariyippukal", "കണക്കു വാരിയാന അറിവിപ്പുകൾ"],
  ["ABOUT_TITLE", "About", "பற்றி", "Patri", "കുറിച്ച്", "Kurichu", "പറ്റി"],
  ["ABOUT_DESC", "App info and credits", "செயலி விவரங்கள், உரிமைகள்", "Seyali vivarangal, urimaigal", "ആപ്പ് വിവരങ്ങൾ, ക്രെഡിറ്റ്സ്", "App vivarangal, credits", "ചെയലി വിവരങ്കൾ, ഉരിമൈകൾ"],
  ["ABOUT_VERSION", "Version", "பதிப்பு", "Pathippu", "പതിപ്പ്", "Pathippu", "പതിപ്പു"],
  ["ABOUT_DEVELOPER", "Developer", "உருவாக்குநர்", "Uruvaakkunar", "ഡെവലപ്പർ", "Developer", "ഉരുവാക്കുനർ"],
  ["ABOUT_DEV_NAME", "Elvan Parthasarathy", "எல்வன் பார்த்தசாரதி", "Elvan Parthasarathy", "എൽവൻ പാർത്തസാരതി", "Elvan Parthasarathy", "എൽവൻ പാർത്തചാരതി"],
  ["ABOUT_BUILT_WITH", "Built with", "தொழில்நுட்பம்:", "Thozhilnutpam:", "സാങ്കേതികവിദ്യ:", "Sankethikavidya:", "തൊഴിൽനുട്പം:"],
  ["ABOUT_SHORTCUTS", "Keyboard Shortcuts", "விசைப்பலகை குறுக்குவழிகள்", "Visaippalagai kurukkuvazhigal", "കീബോർഡ് കുറുക്കുവഴികൾ", "Keyboard kurukkuvazhikal", "വിചൈപ്പലകൈ കുറുക്കുവഴികൾ"],
  ["ABOUT_SHORTCUT_DEVTOOLS", "DevTools", "உருவாக்குநர் கருவிகள்", "Uruvaakkunar karuvigal", "ഡെവ്ടൂൾസ്", "DevTools", "ഉരുവാക്കുനർ കരുവികൾ"],
  ["ABOUT_COPYRIGHT", "Copyright", "பதிப்புரிமை", "Pathippurimai", "പകർപ്പവകാശം", "Pakarppavakasam", "പതിപ്പുരിമൈ"],
  ["NOTIF_PAGE_TITLE", "Notifications", "அறிவிப்புகள்", "Arivippugal", "അറിയിപ്പുകൾ", "Ariyippukal", "അറിവിപ്പുകൾ"],
  ["NOTIF_SIDEBAR_ALL", "All Accounts", "அனைத்து கணக்குகள்", "Anaithu kanakkugal", "എല്ലാ അക്കൗണ്ടുകളും", "Ella accountukalum", "അനൈത്തു കണക്കുകൾ"],
  ["NOTIF_PLURAL", "notifications", "அறிவிப்புகள்", "Arivippugal", "അറിയിപ്പുകൾ", "Ariyippukal", "അറിവിപ്പുകൾ"],
  ["NOTIF_ALL_CAUGHT_UP", "All caught up!", "அனைத்தும் படிக்கப்பட்டன!", "Anaithum padikkapattana!", "എല്ലാം വായിച്ചു!", "Ellam vaayichu!", "അനൈത്തും പടിക്കപ്പട്ടന!"],
  ["NOTIF_EMPTY_MSG_ALL", "New message notifications from your WhatsApp accounts will appear here.", "உங்கள் வாட்ஸ்அப் கணக்குகளின் புதிய செய்திகள் இங்கே தோன்றும்.", "Ungal WhatsApp kanakkugalin puthiya seithigal inge thondrum.", "നിങ്ങളുടെ വാട്ട്സ്ആപ്പ് അക്കൗണ്ടുകളിൽ നിന്നുള്ള പുതിയ സന്ദേശ അറിയിപ്പുകൾ ഇവിടെ വരും.", "Ningalude WhatsApp accountukalil ninnulla puthiya sandesha ariyippukal ivide varum.", "ഉങ്കൾ വാട്സ്അപ് കണക്കുകളിൻ പുതിയ ചെയ്തികൾ ഇങ്കേ തോൻറും."],
  ["NOTIF_EMPTY_MSG_SINGLE", "New message notifications from {account} will appear here.", "{account} இலிருந்து புதிய செய்திகள் இங்கே தோன்றும்.", "{account} ilirunthu puthiya seithigal inge thondrum.", "{account}-ൽ നിന്നുള്ള പുതിയ സന്ദേശ അറിയിപ്പുകൾ ഇവിടെ വരും.", "{account}-l ninnulla puthiya sandesha ariyippukal ivide varum.", "{account} ഇലിരുന്തു പുതിയ ചെയ്തികൾ ഇങ്കേ തോൻറും."],
  ["BTN_CLEAR", "Clear", "அகற்று", "Agatru", "ഒഴിവാക്കുക", "Ozhivaakkuka", "അകറ്റു"]
];

const files = [
  { path: 'src/i18n/en.ts', index: 1 },
  { path: 'src/i18n/ta.ts', index: 2 },
  { path: 'src/i18n/ta-Latn.ts', index: 3 },
  { path: 'src/i18n/ml.ts', index: 4 },
  { path: 'src/i18n/ml-Latn.ts', index: 5 },
  { path: 'src/i18n/ta-ml.ts', index: 6 }
];

for (const file of files) {
  const filePath = require('path').join(__dirname, file.path);
  let content = fs.readFileSync(filePath, 'utf8');

  for (const row of data) {
    const key = row[0];
    const newValue = row[file.index];
    
    const regex = new RegExp(`(\\[k\\.${key}\\]:\\s*)(['"\`])([\\s\\S]*?)\\2`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, (match, p1) => {
        return `${p1}'${newValue.replace(/'/g, "\\'")}'`;
      });
    } else {
      console.log(`Key ${key} not found in ${file.path}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file.path}`);
}
