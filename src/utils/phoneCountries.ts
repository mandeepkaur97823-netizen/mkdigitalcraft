export interface CountryDialRule {
  iso: string;
  name: string;
  dialCode: string;
  minDigits: number;
  maxDigits: number;
  placeholder: string;
  startsWithPattern?: RegExp;
  startsWithHint?: string;
}

export const COUNTRY_DIAL_RULES: CountryDialRule[] = [
  {
    iso: 'IN',
    name: 'India',
    dialCode: '+91',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '98765 43210',
    startsWithPattern: /^[6-9]/,
    startsWithHint: 'Indian mobile numbers start with 6, 7, 8, or 9.',
  },
  {
    iso: 'US',
    name: 'United States',
    dialCode: '+1',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '202 555 0148',
    startsWithPattern: /^[2-9]/,
    startsWithHint: 'US numbers cannot start with 0 or 1.',
  },
  {
    iso: 'CA',
    name: 'Canada',
    dialCode: '+1',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '416 555 0198',
    startsWithPattern: /^[2-9]/,
    startsWithHint: 'Canadian numbers cannot start with 0 or 1.',
  },
  {
    iso: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '7700 900123',
    startsWithPattern: /^[1-9]/,
    startsWithHint: 'Enter UK number without leading 0.',
  },
  {
    iso: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '50 123 4567',
    startsWithPattern: /^[2-9]/,
    startsWithHint: 'Enter UAE number without leading 0.',
  },
  {
    iso: 'AU',
    name: 'Australia',
    dialCode: '+61',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '412 345 678',
    startsWithPattern: /^[2-9]/,
    startsWithHint: 'Enter Australian number without leading 0.',
  },
  {
    iso: 'NZ',
    name: 'New Zealand',
    dialCode: '+64',
    minDigits: 8,
    maxDigits: 10,
    placeholder: '21 123 4567',
    startsWithPattern: /^[2-9]/,
  },
  {
    iso: 'SG',
    name: 'Singapore',
    dialCode: '+65',
    minDigits: 8,
    maxDigits: 8,
    placeholder: '8123 4567',
    startsWithPattern: /^[3689]/,
  },
  {
    iso: 'SA',
    name: 'Saudi Arabia',
    dialCode: '+966',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '50 123 4567',
    startsWithPattern: /^5/,
    startsWithHint: 'Saudi mobile numbers start with 5.',
  },
  {
    iso: 'QA',
    name: 'Qatar',
    dialCode: '+974',
    minDigits: 8,
    maxDigits: 8,
    placeholder: '3312 3456',
  },
  {
    iso: 'KW',
    name: 'Kuwait',
    dialCode: '+965',
    minDigits: 8,
    maxDigits: 8,
    placeholder: '5001 2345',
  },
  {
    iso: 'OM',
    name: 'Oman',
    dialCode: '+968',
    minDigits: 8,
    maxDigits: 8,
    placeholder: '9212 3456',
  },
  {
    iso: 'BH',
    name: 'Bahrain',
    dialCode: '+973',
    minDigits: 8,
    maxDigits: 8,
    placeholder: '3600 1234',
  },
  {
    iso: 'DE',
    name: 'Germany',
    dialCode: '+49',
    minDigits: 10,
    maxDigits: 11,
    placeholder: '1512 3456789',
    startsWithPattern: /^[1-9]/,
  },
  {
    iso: 'FR',
    name: 'France',
    dialCode: '+33',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '6 12 34 56 78',
    startsWithPattern: /^[1-9]/,
  },
  {
    iso: 'IT',
    name: 'Italy',
    dialCode: '+39',
    minDigits: 9,
    maxDigits: 10,
    placeholder: '312 345 6789',
  },
  {
    iso: 'ES',
    name: 'Spain',
    dialCode: '+34',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '612 34 56 78',
  },
  {
    iso: 'NL',
    name: 'Netherlands',
    dialCode: '+31',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '6 12345678',
    startsWithPattern: /^[1-9]/,
  },
  {
    iso: 'CH',
    name: 'Switzerland',
    dialCode: '+41',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '78 123 45 67',
    startsWithPattern: /^[1-9]/,
  },
  {
    iso: 'IE',
    name: 'Ireland',
    dialCode: '+353',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '85 123 4567',
  },
  {
    iso: 'SE',
    name: 'Sweden',
    dialCode: '+46',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '70 123 45 67',
  },
  {
    iso: 'NO',
    name: 'Norway',
    dialCode: '+47',
    minDigits: 8,
    maxDigits: 8,
    placeholder: '412 34 567',
  },
  {
    iso: 'DK',
    name: 'Denmark',
    dialCode: '+45',
    minDigits: 8,
    maxDigits: 8,
    placeholder: '20 12 34 56',
  },
  {
    iso: 'MY',
    name: 'Malaysia',
    dialCode: '+60',
    minDigits: 9,
    maxDigits: 10,
    placeholder: '12 345 6789',
    startsWithPattern: /^1/,
  },
  {
    iso: 'ID',
    name: 'Indonesia',
    dialCode: '+62',
    minDigits: 9,
    maxDigits: 12,
    placeholder: '812 3456 7890',
    startsWithPattern: /^8/,
  },
  {
    iso: 'PH',
    name: 'Philippines',
    dialCode: '+63',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '917 123 4567',
    startsWithPattern: /^9/,
  },
  {
    iso: 'TH',
    name: 'Thailand',
    dialCode: '+66',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '81 234 5678',
  },
  {
    iso: 'JP',
    name: 'Japan',
    dialCode: '+81',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '90 1234 5678',
    startsWithPattern: /^[1-9]/,
  },
  {
    iso: 'KR',
    name: 'South Korea',
    dialCode: '+82',
    minDigits: 9,
    maxDigits: 10,
    placeholder: '10 1234 5678',
  },
  {
    iso: 'PK',
    name: 'Pakistan',
    dialCode: '+92',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '300 1234567',
    startsWithPattern: /^3/,
  },
  {
    iso: 'BD',
    name: 'Bangladesh',
    dialCode: '+880',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '1712 345678',
    startsWithPattern: /^1/,
  },
  {
    iso: 'LK',
    name: 'Sri Lanka',
    dialCode: '+94',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '71 234 5678',
  },
  {
    iso: 'NP',
    name: 'Nepal',
    dialCode: '+977',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '984 1234567',
    startsWithPattern: /^9/,
  },
  {
    iso: 'ZA',
    name: 'South Africa',
    dialCode: '+27',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '82 123 4567',
  },
  {
    iso: 'NG',
    name: 'Nigeria',
    dialCode: '+234',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '802 123 4567',
  },
  {
    iso: 'KE',
    name: 'Kenya',
    dialCode: '+254',
    minDigits: 9,
    maxDigits: 9,
    placeholder: '712 345678',
  },
  {
    iso: 'TR',
    name: 'Turkey',
    dialCode: '+90',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '501 234 5678',
    startsWithPattern: /^5/,
  },
  {
    iso: 'BR',
    name: 'Brazil',
    dialCode: '+55',
    minDigits: 10,
    maxDigits: 11,
    placeholder: '11 91234 5678',
  },
  {
    iso: 'MX',
    name: 'Mexico',
    dialCode: '+52',
    minDigits: 10,
    maxDigits: 10,
    placeholder: '55 1234 5678',
  },
];

export function getCountryByIso(iso: string): CountryDialRule {
  return COUNTRY_DIAL_RULES.find((c) => c.iso === iso) || COUNTRY_DIAL_RULES[0];
}

export function sanitizeLocalDigits(raw: string, country: CountryDialRule): string {
  let digits = raw.replace(/\D/g, '');
  const codeDigits = country.dialCode.replace('+', '');
  // If user pasted full number including dial code, strip leading dial code when longer than maxDigits
  if (digits.length > country.maxDigits && digits.startsWith(codeDigits)) {
    digits = digits.slice(codeDigits.length);
  }
  return digits.slice(0, country.maxDigits);
}

export function validateCountryPhone(country: CountryDialRule, rawPhone: string): string | undefined {
  const digits = sanitizeLocalDigits(rawPhone, country);

  if (!digits) {
    return `Please enter your ${country.name} (${country.dialCode}) number.`;
  }

  if (country.minDigits === country.maxDigits) {
    if (digits.length !== country.minDigits) {
      return `Enter a valid ${country.minDigits}-digit number for ${country.name} (${country.dialCode}).`;
    }
  } else if (digits.length < country.minDigits || digits.length > country.maxDigits) {
    return `Enter ${country.minDigits}–${country.maxDigits} digits for ${country.name} (${country.dialCode}).`;
  }

  // Reject obvious fake repeated or sequential digits (e.g. 0000000000, 9999999999, 1234567890)
  if (/^(\d)\1+$/.test(digits) || digits === '1234567890' || digits === '0123456789') {
    return 'Please enter a valid active phone number.';
  }

  if (country.startsWithPattern && !country.startsWithPattern.test(digits)) {
    return (
      country.startsWithHint ||
      `Number format doesn't match ${country.name} (${country.dialCode}).`
    );
  }

  return undefined;
}

export function formatFullPhone(country: CountryDialRule, rawPhone: string): string {
  const digits = sanitizeLocalDigits(rawPhone, country);
  return `${country.dialCode} ${digits}`.trim();
}
