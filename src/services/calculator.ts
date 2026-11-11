import { CountryCode, LocaleCode, RateMethod } from '../types';

export interface CalculationResult {
  principal: number;
  annualRate: number;
  tenureYears: number;
  tenureMonths: number;
  rateMethod: RateMethod;
  monthlyInstalment: number;
  totalProfit: number;
  totalPayable: number;
  schedulePreview: {
    month: number;
    monthlyPayment: number;
    principalPaid: number;
    profitPaid: number;
    remainingBalance: number;
  }[];
}

/**
 * Exact Financing Formulas per Section 10
 */
export function calculateFinancing(
  principal: number,
  annualRate: number, // e.g. 0.045 for 4.5%
  tenureYears: number,
  rateMethod: RateMethod = 'flat'
): CalculationResult {
  const safePrincipal = Math.max(0, principal || 0);
  const safeRate = Math.max(0, annualRate || 0);
  const safeTenureYears = Math.max(0.25, tenureYears || 1);
  const tenureMonths = Math.round(safeTenureYears * 12);

  if (safePrincipal === 0 || tenureMonths === 0) {
    return {
      principal: safePrincipal,
      annualRate: safeRate,
      tenureYears: safeTenureYears,
      tenureMonths,
      rateMethod,
      monthlyInstalment: 0,
      totalProfit: 0,
      totalPayable: 0,
      schedulePreview: [],
    };
  }

  let monthlyInstalment = 0;
  let totalProfit = 0;
  let totalPayable = 0;

  if (rateMethod === 'flat') {
    // FLAT RATE FORMULA (Section 10)
    // totalProfit = principal × annualRate × tenureYears
    // totalPayable = principal + totalProfit
    // monthly = totalPayable / (tenureYears × 12)
    totalProfit = safePrincipal * safeRate * safeTenureYears;
    totalPayable = safePrincipal + totalProfit;
    monthlyInstalment = totalPayable / tenureMonths;
  } else {
    // REDUCING BALANCE / ANNUITY (Section 10)
    // i = annualRate / 12
    // n = tenureMonths
    // monthly = principal × i × (1 + i)^n / ((1 + i)^n − 1)
    // totalPayable = monthly × n
    // totalProfit = totalPayable − principal
    const i = safeRate / 12;
    const n = tenureMonths;
    if (i === 0) {
      monthlyInstalment = safePrincipal / n;
      totalPayable = safePrincipal;
      totalProfit = 0;
    } else {
      const compound = Math.pow(1 + i, n);
      monthlyInstalment = (safePrincipal * i * compound) / (compound - 1);
      totalPayable = monthlyInstalment * n;
      totalProfit = Math.max(0, totalPayable - safePrincipal);
    }
  }

  // Generate sample 6-month preview
  const schedulePreview = [];
  let remaining = safePrincipal;
  const avgMonthlyProfit = totalProfit / tenureMonths;
  const avgMonthlyPrincipal = safePrincipal / tenureMonths;

  for (let m = 1; m <= Math.min(6, tenureMonths); m++) {
    const profitPortion = rateMethod === 'flat' ? avgMonthlyProfit : remaining * (safeRate / 12);
    const principalPortion = monthlyInstalment - profitPortion;
    remaining = Math.max(0, remaining - principalPortion);
    schedulePreview.push({
      month: m,
      monthlyPayment: monthlyInstalment,
      principalPaid: Math.max(0, principalPortion),
      profitPaid: Math.max(0, profitPortion),
      remainingBalance: remaining,
    });
  }

  return {
    principal: safePrincipal,
    annualRate: safeRate,
    tenureYears: safeTenureYears,
    tenureMonths,
    rateMethod,
    monthlyInstalment,
    totalProfit,
    totalPayable,
    schedulePreview,
  };
}

/**
 * Specialized Vehicle Katılım Finansmanı Calculator (Section 10)
 */
export function calculateVehicleFinancing(
  vehiclePrice: number,
  downPayment: number,
  annualRate: number,
  tenureYears: number,
  rateMethod: RateMethod = 'reducing'
): CalculationResult & { financingAmount: number; downPaymentRatio: number } {
  const safeVehiclePrice = Math.max(0, vehiclePrice || 0);
  const safeDownPayment = Math.max(0, downPayment || 0);
  const financingAmount = Math.max(0, safeVehiclePrice - safeDownPayment);
  const downPaymentRatio = safeVehiclePrice > 0 ? (safeDownPayment / safeVehiclePrice) * 100 : 0;

  const result = calculateFinancing(financingAmount, annualRate, tenureYears, rateMethod);

  return {
    ...result,
    financingAmount,
    downPaymentRatio,
  };
}

/**
 * Specialized SME Asset / Equipment Ijarah Lease Calculator (Section 10)
 */
export function calculateAssetFinancing(
  equipmentValue: number,
  downPayment: number,
  annualProfitMargin: number,
  tenureYears: number,
  rateMethod: RateMethod = 'reducing'
): CalculationResult & { netLeaseAmount: number; downPaymentRatio: number } {
  const safeValue = Math.max(0, equipmentValue || 0);
  const safeDownPayment = Math.max(0, downPayment || 0);
  const netLeaseAmount = Math.max(0, safeValue - safeDownPayment);
  const downPaymentRatio = safeValue > 0 ? (safeDownPayment / safeValue) * 100 : 0;

  const result = calculateFinancing(netLeaseAmount, annualProfitMargin, tenureYears, rateMethod);

  return {
    ...result,
    netLeaseAmount,
    downPaymentRatio,
  };
}

/**
 * Format currency with locale and symbol
 */
export function formatCurrency(
  amount: number,
  country: CountryCode = 'MY',
  locale: LocaleCode = 'en'
): string {
  const safeAmount = isNaN(amount) ? 0 : amount;

  switch (country) {
    case 'MY':
      // Malaysia convention: RM 50,000.00
      return `RM ${new Intl.NumberFormat(locale === 'ms' ? 'ms-MY' : 'en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(safeAmount)}`;

    case 'TR':
      // Türkiye convention: ₺1.200.000,00
      return `₺${new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(safeAmount)}`;

    case 'AZ':
      // Azerbaijan convention: ₼100.000,00
      return `₼${new Intl.NumberFormat(locale === 'az' ? 'az-Latn-AZ' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(safeAmount)}`;

    default:
      return `${safeAmount.toFixed(2)}`;
  }
}

/**
 * Format percentage rate (e.g. 0.045 -> "4.50%")
 */
export function formatProfitRate(rate: number): string {
  const pct = (rate * 100);
  return `${pct.toFixed(2)}% p.a.`;
}
