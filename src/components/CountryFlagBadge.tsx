import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/countries';

interface CountryFlagBadgeProps {
  country: CountryCode;
  className?: string;
  showCurrency?: boolean;
}

export const CountryFlagBadge: React.FC<CountryFlagBadgeProps> = ({
  country,
  className = '',
  showCurrency = true,
}) => {
  const config = COUNTRIES[country] || COUNTRIES.MY;

  return (
    <span
      id={`country-flag-${country}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] text-white/90 text-xs font-medium border border-white/10 ${className}`}
    >
      <span className="text-sm leading-none">{config.flag}</span>
      <span>{config.name}</span>
      {showCurrency && (
        <span className="text-[#c4a67e] bg-[#c4a67e]/10 border border-[#c4a67e]/20 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">
          {config.currency}
        </span>
      )}
    </span>
  );
};
