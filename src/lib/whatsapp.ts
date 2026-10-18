export function normalizeWhatsAppNumber(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return undefined;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15 || digits.startsWith('0')) return undefined;
  return digits;
}

export function buildWhatsAppUrl(number: string | undefined, message: string): string | undefined {
  if (!number || !/^\d{8,15}$/.test(number) || number.startsWith('0')) return undefined;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function isWhatsAppUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && url.hostname === 'wa.me'
      && /^\/[1-9]\d{7,14}$/.test(url.pathname)
      && !url.username
      && !url.password;
  } catch {
    return false;
  }
}

export function attemptWhatsAppOpenOnce(
  reference: string,
  value: string | null | undefined,
  attemptedReferences: Set<string>,
  open: (url: string) => void,
): boolean {
  if (!isWhatsAppUrl(value) || attemptedReferences.has(reference)) return false;
  attemptedReferences.add(reference);
  try {
    open(value);
  } catch {
    // Popup restrictions are handled by the visible manual link.
  }
  return true;
}