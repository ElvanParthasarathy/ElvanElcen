export const RESERVED_NAMES = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];

export function sanitizeName(raw: string): string {
  return raw
    .replace(/[<>:"\/\\|?*]/g, '')
    .replace(/^[\s.]+|[\s.]+$/g, '')
    .substring(0, 50);
}

export function validateAccountName(
  name: string,
  accounts: any[],
  t: (key: string) => string,
  k: any,
  excludeIndex?: number
): string | null {
  const sanitized = sanitizeName(name);
  if (!sanitized) return t(k.ALERT_INVALID_NAME);
  if (RESERVED_NAMES.includes(sanitized.toUpperCase())) return t(k.ALERT_RESERVED_NAME);
  const isDuplicate = accounts.some((a: any, i: number) =>
    a.name.toLowerCase() === sanitized.toLowerCase() && i !== excludeIndex
  );
  if (isDuplicate) return t(k.ALERT_ACCOUNT_EXISTS);
  return null;
}
