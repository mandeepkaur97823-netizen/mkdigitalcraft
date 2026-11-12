import React from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import {
  COUNTRY_DIAL_RULES,
  CountryDialRule,
  getCountryByIso,
  sanitizeLocalDigits,
  validateCountryPhone,
} from '../utils/phoneCountries';

interface PhoneNumberInputProps {
  id: string;
  countryIso: string;
  onCountryChange: (iso: string) => void;
  value: string;
  onChange: (digitsOnly: string) => void;
  error?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  id,
  countryIso,
  onCountryChange,
  value,
  onChange,
  error,
}) => {
  const country: CountryDialRule = getCountryByIso(countryIso);
  const digits = sanitizeLocalDigits(value, country);
  const isCompleteValid = digits.length > 0 && !validateCountryPhone(country, digits);

  return (
    <div>
      <div
        className={`flex items-stretch rounded-xl bg-[#07090E]/90 border transition-all duration-200 overflow-hidden ${
          error
            ? 'border-rose-500/70 focus-within:border-rose-400 focus-within:ring-1 focus-within:ring-rose-400/50'
            : 'border-white/12 hover:border-white/25 focus-within:border-[#E5B869] focus-within:bg-[#090C12] focus-within:ring-1 focus-within:ring-[#E5B869]/60'
        }`}
      >
        {/* Country Dial Selector */}
        <div className="relative flex items-center border-r border-white/10 bg-[#111520]/80 shrink-0">
          <div className="flex items-center gap-1.5 pl-3 pr-7 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white pointer-events-none select-none">
            <span className="text-[10px] font-mono font-bold text-[#E5B869] px-1.5 py-0.5 rounded bg-[#E5B869]/12 border border-[#E5B869]/25">
              {country.iso}
            </span>
            <span className="font-mono text-xs sm:text-sm text-[#E2E8F0]">
              {country.dialCode}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#E5B869] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
          <select
            aria-label="Select country dial code"
            value={country.iso}
            onChange={(e) => {
              const nextCountry = getCountryByIso(e.target.value);
              onCountryChange(nextCountry.iso);
              onChange(sanitizeLocalDigits(digits, nextCountry));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-[#111520] text-white"
          >
            {COUNTRY_DIAL_RULES.map((item) => (
              <option key={item.iso} value={item.iso} className="bg-[#111520] text-white">
                {item.name} ({item.dialCode})
              </option>
            ))}
          </select>
        </div>

        {/* Local Phone Digits Input */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            value={digits}
            maxLength={country.maxDigits}
            onChange={(e) => {
              const cleaned = sanitizeLocalDigits(e.target.value, country);
              onChange(cleaned);
            }}
            placeholder={country.placeholder}
            className="w-full min-w-0 px-3 sm:px-3.5 py-2.5 sm:py-3 pr-14 bg-transparent text-white text-base sm:text-sm placeholder:text-[#94A3B8]/40 outline-none font-mono tracking-wide"
          />

          {/* Compact Digit Count / Valid Indicator */}
          <span
            className={`absolute right-2.5 text-[10px] font-mono inline-flex items-center gap-1 pointer-events-none ${
              isCompleteValid ? 'text-emerald-400' : 'text-[#94A3B8]/65'
            }`}
          >
            {isCompleteValid && <Check className="w-3 h-3" />}
            <span>
              {digits.length}/{country.maxDigits}
            </span>
          </span>
        </div>
      </div>

      {error ? (
        <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        <p className="mt-1 text-[10px] text-[#94A3B8]/70">
          {country.name} ({country.dialCode}) · {country.minDigits === country.maxDigits ? `${country.minDigits} digits` : `${country.minDigits}–${country.maxDigits} digits`}
        </p>
      )}
    </div>
  );
};
