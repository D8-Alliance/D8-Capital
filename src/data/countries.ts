import { CountryConfig } from '../types';

export const COUNTRIES: Record<string, CountryConfig> = {
  MY: {
    code: 'MY',
    name: 'Malaysia',
    nativeName: 'Malaysia',
    currency: 'MYR',
    currencySymbol: 'RM',
    defaultLocale: 'en',
    supportedLocales: ['en', 'ms'],
    flag: '🇲🇾',
    phoneCode: '+60',
    activeCategories: ['personal', 'vehicle', 'property', 'business', 'equipment', 'trade', 'takaful'],
    regulatoryBody: 'Bank Negara Malaysia (BNM) & Shariah Advisory Council (SAC)',
    shariahFrameworkNote: 'Governed under Islamic Financial Services Act (IFSA 2013) & BNM Shariah Governance Framework.',
  },
  TR: {
    code: 'TR',
    name: 'Türkiye',
    nativeName: 'Türkiye',
    currency: 'TRY',
    currencySymbol: '₺',
    defaultLocale: 'tr',
    supportedLocales: ['tr', 'en'],
    flag: '🇹🇷',
    phoneCode: '+90',
    activeCategories: ['vehicle', 'personal', 'property', 'business', 'equipment'],
    regulatoryBody: 'Banking Regulation and Supervision Agency (BDDK) & Participation Banks Association of Türkiye (TKBB)',
    shariahFrameworkNote: 'Operating under Participation Banking (Katılım Bankacılığı) principles and TKBB Advisory Board Standards.',
  },
  AZ: {
    code: 'AZ',
    name: 'Azerbaijan',
    nativeName: 'Azərbaycan',
    currency: 'AZN',
    currencySymbol: '₼',
    defaultLocale: 'az',
    supportedLocales: ['az', 'en'],
    flag: '🇦🇿',
    phoneCode: '+994',
    activeCategories: ['equipment', 'business', 'trade', 'personal'],
    regulatoryBody: 'Central Bank of the Republic of Azerbaijan (CBAR)',
    shariahFrameworkNote: 'Illustrative Islamic financing framework conforming to AAOIFI international Shariah standards.',
  },
};

export const COUNTRIES_LIST = Object.values(COUNTRIES);
