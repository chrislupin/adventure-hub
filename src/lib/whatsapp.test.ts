import { describe, expect, it } from 'vitest';
import { attemptWhatsAppOpenOnce, buildWhatsAppUrl, isWhatsAppUrl, normalizeWhatsAppNumber } from '@/lib/whatsapp';

describe('WhatsApp destination and message links', () => {
  it('normalizes an international number to digits only', () => {
    expect(normalizeWhatsAppNumber('+254 (711) 851-915')).toBe('254711851915');
  });

  it('rejects invalid numbers instead of constructing a link', () => {
    expect(normalizeWhatsAppNumber('254ABC')).toBeUndefined();
    expect(normalizeWhatsAppNumber('0711851915')).toBeUndefined();
    expect(buildWhatsAppUrl(undefined, 'message')).toBeUndefined();
  });

  it('URL-encodes newlines and reserved message characters', () => {
    const url = buildWhatsAppUrl('254711851915', 'Reference: AHI-1\nService: Quad & balloon');
    expect(url).toContain('https://wa.me/254711851915?text=');
    expect(new URL(url as string).searchParams.get('text')).toBe('Reference: AHI-1\nService: Quad & balloon');
  });

  it('accepts only HTTPS links to a digit-only wa.me destination', () => {
    expect(isWhatsAppUrl('https://wa.me/254711851915?text=hello')).toBe(true);
    expect(isWhatsAppUrl('https://example.com/254711851915')).toBe(false);
    expect(isWhatsAppUrl('javascript:alert(1)')).toBe(false);
  });

  it('attempts an automatic open once per persisted reference and tolerates popup blocking', () => {
    const attempted = new Set<string>();
    const open = (url: string) => { expect(url).toBe('https://wa.me/254711851915?text=hello'); };

    expect(attemptWhatsAppOpenOnce('AHI-1', 'https://wa.me/254711851915?text=hello', attempted, open)).toBe(true);
    expect(attemptWhatsAppOpenOnce('AHI-1', 'https://wa.me/254711851915?text=hello', attempted, open)).toBe(false);
    expect(attempted.size).toBe(1);
    expect(() => attemptWhatsAppOpenOnce('AHI-2', 'https://wa.me/254711851915?text=hello', new Set(), () => { throw new Error('popup blocked'); })).not.toThrow();
    expect(attemptWhatsAppOpenOnce('AHI-3', null, new Set(), () => { throw new Error('should not open'); })).toBe(false);
  });
});