import { k } from './k';

export function formatNeram(ts: number, lang: string, t: (key: string) => string): string {
  try {
    const date = new Date(ts);
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    
    let displayHour = h % 12;
    displayHour = displayHour ? displayHour : 12;
    const timeStr = `${displayHour}:${m}`;

    if (lang === 'en') {
      return `${timeStr} ${h >= 12 ? 'PM' : 'AM'}`;
    }

    let periodKey = '';
    // 00:00 - 03:59
    if (h >= 0 && h < 4) periodKey = k.TIME_MIDNIGHT;
    // 04:00 - 05:59
    else if (h >= 4 && h < 6) periodKey = k.TIME_EARLY_MORNING;
    // 06:00 - 11:59
    else if (h >= 6 && h < 12) periodKey = k.TIME_MORNING;
    // 12:00 - 15:59
    else if (h >= 12 && h < 16) periodKey = k.TIME_AFTERNOON;
    // 16:00 - 18:59
    else if (h >= 16 && h < 19) periodKey = k.TIME_EVENING;
    // 19:00 - 23:59
    else if (h >= 19 && h <= 23) periodKey = k.TIME_NIGHT;

    if (periodKey) {
      const period = t(periodKey);
      if (period) {
        return `${period} ${timeStr}`;
      }
    }
    
    // Fallback if lang not found
    return `${timeStr} ${h >= 12 ? 'PM' : 'AM'}`;
  } catch (e) {
    return '';
  }
}
