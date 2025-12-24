import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const value = email.trim();
  if (!value) return false;

  // Practical RFC5322-ish check; avoid over-strict regex.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(value)) return false;

  // Reasonable max length guard
  return value.length <= 254;
}

export function normalizeAndValidatePhone(phone, defaultCountry = 'ET') {
  if (phone == null || phone === '') return { ok: true, value: null };
  if (typeof phone !== 'string') return { ok: false, message: 'Invalid phone number' };

  const raw = phone.trim();
  if (!raw) return { ok: true, value: null };

  let parsed = null;
  try {
    parsed = raw.startsWith('+')
      ? parsePhoneNumberFromString(raw)
      : parsePhoneNumberFromString(raw, defaultCountry);
  } catch {
    parsed = null;
  }

  if (!parsed || !parsed.isValid()) {
    return { ok: false, message: 'Invalid phone number (include a valid country code)' };
  }

  return { ok: true, value: parsed.number };
}
