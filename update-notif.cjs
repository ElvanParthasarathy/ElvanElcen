const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, 'src/i18n');

// Update k.ts
let kStr = fs.readFileSync(path.join(i18nDir, 'k.ts'), 'utf8');
if (!kStr.includes('NOTIF_PAGE_TITLE')) {
  kStr = kStr.replace(/TIME_AM: 'TIME_AM',/s, 
"NOTIF_PAGE_TITLE: 'NOTIF_PAGE_TITLE',\n" +
"  NOTIF_SIDEBAR_ALL: 'NOTIF_SIDEBAR_ALL',\n" +
"  NOTIF_PLURAL: 'NOTIF_PLURAL',\n" +
"  NOTIF_ALL_CAUGHT_UP: 'NOTIF_ALL_CAUGHT_UP',\n" +
"  NOTIF_EMPTY_MSG_ALL: 'NOTIF_EMPTY_MSG_ALL',\n" +
"  NOTIF_EMPTY_MSG_SINGLE: 'NOTIF_EMPTY_MSG_SINGLE',\n" +
"  BTN_CLEAR: 'BTN_CLEAR',\n" +
"  TIME_AM: 'TIME_AM',");
  fs.writeFileSync(path.join(i18nDir, 'k.ts'), kStr);
}

const translations = {
  'en.ts': {
    NOTIF_PAGE_TITLE: 'Notifications',
    NOTIF_SIDEBAR_ALL: 'All Accounts',
    NOTIF_PLURAL: 'notifications',
    NOTIF_ALL_CAUGHT_UP: 'All caught up!',
    NOTIF_EMPTY_MSG_ALL: 'New message notifications from your WhatsApp accounts will appear here.',
    NOTIF_EMPTY_MSG_SINGLE: 'New message notifications from {account} will appear here.',
    BTN_CLEAR: 'Clear'
  },
  'ta.ts': {
    NOTIF_PAGE_TITLE: 'அறிவிப்புகள்',
    NOTIF_SIDEBAR_ALL: 'அனைத்து கணக்குகள்',
    NOTIF_PLURAL: 'அறிவிப்புகள்',
    NOTIF_ALL_CAUGHT_UP: 'அனைத்தும் வாசிக்கப்பட்டன!',
    NOTIF_EMPTY_MSG_ALL: 'உங்கள் வாட்ஸ்அப் கணக்குகளிலிருந்து புதிய செய்திகளின் அறிவிப்புகள் இங்கே தோன்றும்.',
    NOTIF_EMPTY_MSG_SINGLE: '{account} இலிருந்து புதிய செய்திகளின் அறிவிப்புகள் இங்கே தோன்றும்.',
    BTN_CLEAR: 'அழி'
  },
  'ml.ts': {
    NOTIF_PAGE_TITLE: 'അറിയിപ്പുകൾ',
    NOTIF_SIDEBAR_ALL: 'എല്ലാ അക്കൗണ്ടുകളും',
    NOTIF_PLURAL: 'അറിയിപ്പുകൾ',
    NOTIF_ALL_CAUGHT_UP: 'എല്ലാം വായിച്ചു!',
    NOTIF_EMPTY_MSG_ALL: 'നിങ്ങളുടെ വാട്ട്‌സ്ആപ്പ് അക്കൗണ്ടുകളിൽ നിന്നുള്ള പുതിയ സന്ദേശ അറിയിപ്പുകൾ ഇവിടെ ദൃശ്യമാകും.',
    NOTIF_EMPTY_MSG_SINGLE: '{account}-ൽ നിന്നുള്ള പുതിയ സന്ദേശ അറിയിപ്പുകൾ ഇവിടെ ദൃശ്യമാകും.',
    BTN_CLEAR: 'മായ്‌ക്കുക'
  },
  'ta-Latn.ts': {
    NOTIF_PAGE_TITLE: 'Arivippugal',
    NOTIF_SIDEBAR_ALL: 'Anaithu Kanakkugal',
    NOTIF_PLURAL: 'arivippugal',
    NOTIF_ALL_CAUGHT_UP: 'Anaithum vasikkapattana!',
    NOTIF_EMPTY_MSG_ALL: 'Ungal WhatsApp kanakkugalilirunthu puthiya seithigalin arivippugal inge thondrum.',
    NOTIF_EMPTY_MSG_SINGLE: '{account} ilirunthu puthiya seithigalin arivippugal inge thondrum.',
    BTN_CLEAR: 'Azhi'
  },
  'ml-Latn.ts': {
    NOTIF_PAGE_TITLE: 'Ariyippukal',
    NOTIF_SIDEBAR_ALL: 'Ella Accountukalum',
    NOTIF_PLURAL: 'ariyippukal',
    NOTIF_ALL_CAUGHT_UP: 'Ellam vayichu!',
    NOTIF_EMPTY_MSG_ALL: 'Ningalude WhatsApp accountukalil ninnulla puthiya sandesha ariyippukal ivide drishyamakum.',
    NOTIF_EMPTY_MSG_SINGLE: '{account}-l ninnulla puthiya sandesha ariyippukal ivide drishyamakum.',
    BTN_CLEAR: 'Maykkuka'
  },
  'ta-ml.ts': {
    NOTIF_PAGE_TITLE: 'അറിവിപ്പുകൾ',
    NOTIF_SIDEBAR_ALL: 'അനൈത്തു കണക്കുകൾ',
    NOTIF_PLURAL: 'അറിവിപ്പുകൾ',
    NOTIF_ALL_CAUGHT_UP: 'അനൈത്തും വാസിക്കപ്പട്ടന!',
    NOTIF_EMPTY_MSG_ALL: 'ഉങ്കൾ വാട്ട്‌സ്ആപ്പ് കണക്കുകളിലിരുന്തു പുതിയ സെയ്തികളിൻ അറിവിപ്പുകൾ ഇങ്കേ തോൻറും.',
    NOTIF_EMPTY_MSG_SINGLE: '{account} ഇലിരുന്തു പുതിയ സെയ്തികളിൻ അറിവിപ്പുകൾ ഇങ്കേ തോൻറും.',
    BTN_CLEAR: 'അഴി'
  },
  'ml-ta.ts': {
    NOTIF_PAGE_TITLE: 'அறியிப்புகள்',
    NOTIF_SIDEBAR_ALL: 'எல்லா அக்கவுண்டுகளும்',
    NOTIF_PLURAL: 'அறியிப்புகள்',
    NOTIF_ALL_CAUGHT_UP: 'எல்லாம் வாயிச்சு!',
    NOTIF_EMPTY_MSG_ALL: 'நிங்களுடெ வாட்ஸ்ஆப் அக்கவுண்டுகளில் நின்னுள்ள புதிய சந்தேச அறியிப்புகள் இவிடெ த்ருஷ்யமாகும்ப.',
    NOTIF_EMPTY_MSG_SINGLE: '{account}-ல் நின்னுள்ள புதிய சந்தேச அறியிப்புகள் இவிடெ த்ருஷ்யமாகும்ப.',
    BTN_CLEAR: 'மாய்க்குக'
  }
};

for (const [file, keys] of Object.entries(translations)) {
  const filePath = path.join(i18nDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('NOTIF_PAGE_TITLE')) continue;
  
  const lines = content.split('\n');
  let insertIndex = lines.length - 1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('}')) {
      insertIndex = i;
      break;
    }
  }
  
  const toInsert = "  [k.NOTIF_PAGE_TITLE]: '" + keys.NOTIF_PAGE_TITLE + "',\n" +
  "  [k.NOTIF_SIDEBAR_ALL]: '" + keys.NOTIF_SIDEBAR_ALL + "',\n" +
  "  [k.NOTIF_PLURAL]: '" + keys.NOTIF_PLURAL + "',\n" +
  "  [k.NOTIF_ALL_CAUGHT_UP]: '" + keys.NOTIF_ALL_CAUGHT_UP + "',\n" +
  "  [k.NOTIF_EMPTY_MSG_ALL]: '" + keys.NOTIF_EMPTY_MSG_ALL + "',\n" +
  "  [k.NOTIF_EMPTY_MSG_SINGLE]: '" + keys.NOTIF_EMPTY_MSG_SINGLE + "',\n" +
  "  [k.BTN_CLEAR]: '" + keys.BTN_CLEAR + "',";
  
  lines.splice(insertIndex, 0, toInsert);
  fs.writeFileSync(filePath, lines.join('\n'));
}
console.log('Done replacing i18n keys for notification UI!');
