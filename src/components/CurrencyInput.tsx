import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/countries';

interface CurrencyInputProps {
  id: string;
  value: number;
  onChange: (val: number) => void;
  country: CountryCode;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  value,
  onChange,
  country,
  min = 0,
  max,
  step = 500,
  disabled = false,
  className = '',
  placeholder = '0.00',
}) => {
  const config = COUNTRIES[country] || COUNTRIES.MY;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(rawVal);
    if (isNaN(num)) {
      onChange(0);
    } else {
      onChange(num);
    }
  };

  return (
    <div className={`relative rounded-xl shadow-inner ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-xs font-mono font-bold text-[#c4a67e] bg-[#c4a67e]/10 px-2 py-0.5 rounded border border-[#c4a67e]/30">
          {config.currencySymbol}
        </span>
      </div>
      <input
        type="number"
        id={id}
        name={id}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 pl-16 pr-4 text-sm font-mono font-medium text-white placeholder:text-white/30 focus:border-[#c4a67e] focus:ring-1 focus:ring-[#c4a67e]/30 focus:outline-none transition disabled:bg-white/5 disabled:text-white/30"
      />
    </div>
  );
};
