const fs = require('fs');

const data = [
  ["GENERAL_TITLE", "பொதுவாய"],
  ["GENERAL_DESC", "ஸ்டார்ட்டப், ட்ரே, ப்ரகடனம்"],
  ["GENERAL_STARTUP", "ஸ்டார்ட்டப்பில் ஆரம்பிக்குக"],
  ["GENERAL_STARTUP_DESC", "வின்டோஸ் துடங்கும்போள் நம்மில் துறக்குக"],
  ["GENERAL_START_MINIMIZED", "செறுதாக்கி ஆரம்பிக்குக"],
  ["GENERAL_TRAY", "ஸிஸ்டம் ட்ரேயிலேக்கு க்லோஸ் செய்யுக"],
  ["GENERAL_TRAY_DESC", "அடைய்க்கும்போள் பாக்க்ரௌண்டில் ப்ரவர்த்திக்குக"],
  ["GENERAL_LOW_MEMORY", "லோ மெம்மறி மோட்"],
  ["GENERAL_LOW_MEMORY_DESC", "செறுதாக்கும்போள் மெம்மறி குறய்க்குக. அறியிப்புகள் வரும்."],
  ["GENERAL_HW_ACCEL", "ஹார்ட்வெயர் ஆக்ஸிலரேஷன்"],
  ["GENERAL_HW_ACCEL_DESC", "GPU உபயோகிக்குக. ஸ்க்ரீன் ஃப்ளிக்கரிங் உண்டெங்கில் ஓஃப் செய்யுக."],
  ["GENERAL_RESTART_REQUIRED", "மாற்றங்களுக்கு றீஸ்டார்ட் ஆவஷ்யமாணு"],
  ["GENERAL_PERFORMANCE", "ப்ரகடனம்"],
  ["GENERAL_RESTART_NOW", "உடனெ றீஸ்டார்ட் செய்யுக"],
  ["NOTIF_TITLE", "அறியிப்புகள்"],
  ["NOTIF_DESC", "ஸந்தேச அறியிப்புகள், சப்தங்கள்"],
  ["NOTIF_ENABLE", "டெஸ்க்டாப் அறியிப்புகள்"],
  ["NOTIF_ENABLE_DESC", "புதிய ஸந்தேசங்களுக்கு வின்டோஸ் அறியிப்புகள் காணிக்குக"],
  ["NOTIF_FLASH", "டாஸ்க்பார் ஃப்ளாஷ் செய்யுக"],
  ["NOTIF_FLASH_DESC", "புதிய ஸந்தேசம் வரும்போள் டாஸ்க்பார் ஐக்கண் ஃப்ளாஷ் செய்யுக"],
  ["NOTIF_SOUND_TITLE", "அறியிப்பு சப்தம்"],
  ["NOTIF_SOUND_DEFAULT", "டிஃபால்ட் (வின்டோஸ்)"],
  ["NOTIF_SOUND_BEEP", "பீப்"],
  ["NOTIF_SOUND_EXCLAMATION", "முன்னறியிப்பு"],
  ["NOTIF_SOUND_CRITICAL", "அடியந்தரம்"],
  ["NOTIF_SOUND_QUESTION", "சோத்யம்"],
  ["NOTIF_SOUND_SILENT", "நிஷப்தம்"],
  ["NOTIF_SOUND_CUSTOM", "கஸ்டம்..."],
  ["NOTIF_PER_ACCOUNT", "அக்கௌண்ட் திரிச்சுள்ள அறியிப்புகள்"],
  ["ABOUT_TITLE", "குறிச்சு"],
  ["ABOUT_DESC", "ஆப் விவரங்கள், க்ரெடிட்ஸ்"],
  ["ABOUT_VERSION", "பதிப்பு"],
  ["ABOUT_DEVELOPER", "டெவலப்பர்"],
  ["ABOUT_DEV_NAME", "எல்வன் பார்த்தஸாரதி"],
  ["ABOUT_BUILT_WITH", "ஸாங்கேதிகவித்ய:"],
  ["ABOUT_SHORTCUTS", "கீபோர்ட் குறுக்குவழிகள்"],
  ["ABOUT_SHORTCUT_DEVTOOLS", "டெவ்டூல்ஸ்"],
  ["ABOUT_COPYRIGHT", "பகர்ப்பவகாசம்"],
  ["NOTIF_PAGE_TITLE", "அறியிப்புகள்"],
  ["NOTIF_SIDEBAR_ALL", "எல்லா அக்கௌண்டுகளும்"],
  ["NOTIF_PLURAL", "அறியிப்புகள்"],
  ["NOTIF_ALL_CAUGHT_UP", "எல்லாம் வாயிச்சு!"],
  ["NOTIF_EMPTY_MSG_ALL", "நிங்களுடெ வாட்ஸ்ஆப் அக்கௌண்டுகளில் நின்னுள்ள புதிய ஸந்தேச அறியிப்புகள் இவிடெ வரும்."],
  ["NOTIF_EMPTY_MSG_SINGLE", "{account}-ல் நின்னுள்ள புதிய ஸந்தேச அறியிப்புகள் இவிடெ வரும்."],
  ["BTN_CLEAR", "ஒழிவாக்குக"]
];

const filePath = require('path').join(__dirname, 'src/i18n/ml-ta.ts');
let content = fs.readFileSync(filePath, 'utf8');

for (const row of data) {
  const key = row[0];
  const newValue = row[1];
  
  const regex = new RegExp(`(\\[k\\.${key}\\]:\\s*)(['"\`])([\\s\\S]*?)\\2`, 'g');
  if (content.match(regex)) {
    content = content.replace(regex, (match, p1) => {
      return `${p1}'${newValue.replace(/'/g, "\\'")}'`;
    });
  } else {
    console.log(`Key ${key} not found in ml-ta.ts`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Updated ml-ta.ts`);
