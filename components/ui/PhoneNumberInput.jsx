'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString
} from 'libphonenumber-js';

function safeParsePhone(value, defaultCountry) {
  if (!value) return null;
  try {
    if (value.startsWith('+')) return parsePhoneNumberFromString(value);
    return parsePhoneNumberFromString(value, defaultCountry);
  } catch {
    return null;
  }
}

export default function PhoneNumberInput({
  value,
  onChange,
  onValidityChange,
  defaultCountry = 'ET',
  required = false,
  disabled = false,
  containerClassName = '',
  selectClassName = '',
  inputClassName = '',
  'aria-label': ariaLabel = 'Phone number'
}) {
  const countries = useMemo(() => {
    try {
      return getCountries();
    } catch {
      return [];
    }
  }, []);

  const options = useMemo(() => {
    const list = countries
      .map((code) => {
        let callingCode = '';
        try {
          callingCode = getCountryCallingCode(code);
        } catch {
          callingCode = '';
        }
        return { code, callingCode };
      })
      .filter((x) => x.callingCode);

    list.sort((a, b) => {
      const an = Number(a.callingCode);
      const bn = Number(b.callingCode);
      if (an !== bn) return an - bn;
      return a.code.localeCompare(b.code);
    });

    return list;
  }, [countries]);

  const parsedInitial = useMemo(() => safeParsePhone(value, defaultCountry), [value, defaultCountry]);

  const [country, setCountry] = useState(parsedInitial?.country || defaultCountry);
  const [nationalNumber, setNationalNumber] = useState(parsedInitial?.nationalNumber || '');

  useEffect(() => {
    const parsed = safeParsePhone(value, country);
    if (!parsed) return;

    const nextCountry = parsed.country || country;
    const nextNational = parsed.nationalNumber || '';

    setCountry((prev) => (prev !== nextCountry ? nextCountry : prev));
    setNationalNumber((prev) => (prev !== nextNational ? nextNational : prev));
  }, [value]);

  const callingCode = useMemo(() => {
    try {
      return getCountryCallingCode(country);
    } catch {
      return '';
    }
  }, [country]);

  const emit = (nextCountry, nextNational) => {
    const raw = `${nextNational || ''}`;
    const digits = raw.replace(/[^0-9]/g, '');
    const parsed = safeParsePhone(digits, nextCountry);
    const isValid = !!(parsed && parsed.isValid());

    onValidityChange?.(isValid);

    if (parsed) {
      onChange?.(parsed.number);
      return;
    }

    let nextCallingCode = '';
    try {
      nextCallingCode = getCountryCallingCode(nextCountry);
    } catch {
      nextCallingCode = '';
    }

    const fallback = nextCallingCode ? `+${nextCallingCode}${digits}` : `+${digits}`;
    onChange?.(fallback);
  };

  return (
    <div className={`flex gap-2 ${containerClassName}`}>
      <select
        value={country}
        onChange={(e) => {
          const next = e.target.value;
          setCountry(next);
          emit(next, nationalNumber);
        }}
        disabled={disabled}
        className={
          selectClassName ||
          'h-12 px-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
        }
        aria-label="Country code"
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            +{opt.callingCode} ({opt.code})
          </option>
        ))}
      </select>

      <div className="flex-1">
        <input
          type="tel"
          value={nationalNumber}
          onChange={(e) => {
            const next = e.target.value;
            setNationalNumber(next);
            emit(country, next);
          }}
          disabled={disabled}
          required={required}
          inputMode="tel"
          autoComplete="tel"
          aria-label={ariaLabel}
          className={
            inputClassName ||
            'w-full h-12 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
          }
          placeholder={callingCode ? `Phone number (without +${callingCode})` : 'Phone number'}
        />
      </div>
    </div>
  );
}
