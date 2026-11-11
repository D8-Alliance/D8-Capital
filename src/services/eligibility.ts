import { CountryCode } from '../types';
import { calculateFinancing } from './calculator';

export interface EligibilityInput {
  country: CountryCode;
  age: number;
  employmentType: string;
  monthlyIncome: number;
  existingMonthlyCommitments: number;
  requestedAmount: number;
  tenureYears: number;
  annualProfitRate?: number;
  rateMethod?: 'flat' | 'reducing';
  // Business fields
  isBusiness?: boolean;
  businessOperatingYears?: number;
  annualRevenue?: number;
}

export interface EligibilityResult {
  status: 'POTENTIALLY_ELIGIBLE' | 'ADDITIONAL_INFO_REQUIRED' | 'MAY_NOT_MEET';
  calculatedDsr: number; // percentage e.g. 48.5
  estimatedMonthly: number;
  maxRecommendedFinancing: number;
  factors: {
    name: string;
    passed: boolean;
    detail: string;
  }[];
  explanation: string;
  recommendation: string;
}

export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const defaultRate = input.country === 'MY' ? 0.045 : input.country === 'TR' ? 0.28 : 0.12;
  const rateMethod = input.rateMethod || (input.country === 'MY' ? 'flat' : 'reducing');
  const rate = input.annualProfitRate || defaultRate;

  const calc = calculateFinancing(
    input.requestedAmount,
    rate,
    input.tenureYears,
    rateMethod
  );

  const income = Math.max(1, input.monthlyIncome || 0);
  const existingCommitments = Math.max(0, input.existingMonthlyCommitments || 0);
  const newCommitment = calc.monthlyInstalment;
  const totalCommitment = existingCommitments + newCommitment;

  // DSR = (existing commitments + estimated new monthly) / monthly income
  const dsr = (totalCommitment / income) * 100;

  const factors: { name: string; passed: boolean; detail: string }[] = [];

  // Age factor
  const ageValid = input.age >= 21 && input.age <= 60;
  factors.push({
    name: 'Age Criterion (21 - 60 years)',
    passed: ageValid,
    detail: `Applicant age is ${input.age || 'unspecified'}. Minimum age is 21, maximum maturity age is 60.`,
  });

  // Income threshold
  const minIncome = input.country === 'MY' ? 2500 : input.country === 'TR' ? 25000 : 1200;
  const incomeValid = income >= minIncome;
  factors.push({
    name: 'Minimum Income Threshold',
    passed: incomeValid,
    detail: `Monthly income provided meets the indicative entry threshold.`,
  });

  // DSR factor
  const dsrValid = dsr <= 60;
  const dsrBorderline = dsr > 60 && dsr <= 70;
  factors.push({
    name: 'Debt Service Ratio (DSR ≤ 60%)',
    passed: dsrValid,
    detail: `Calculated DSR is ${dsr.toFixed(1)}% (Threshold: 60%). Existing commitments: ${existingCommitments.toFixed(0)}, New estimated instalment: ${newCommitment.toFixed(0)}.`,
  });

  // Business specific check
  if (input.isBusiness) {
    const bizValid = (input.businessOperatingYears || 0) >= 2;
    factors.push({
      name: 'Business Operating History (≥ 2 Years)',
      passed: bizValid,
      detail: `Operating history is ${input.businessOperatingYears || 0} years. Minimum 2 years required for SME equipment facilities.`,
    });
  }

  // Determine outcome
  let status: 'POTENTIALLY_ELIGIBLE' | 'ADDITIONAL_INFO_REQUIRED' | 'MAY_NOT_MEET' = 'POTENTIALLY_ELIGIBLE';
  let explanation = '';
  let recommendation = '';

  if (dsr <= 60 && ageValid && incomeValid) {
    status = 'POTENTIALLY_ELIGIBLE';
    explanation = `Your indicative Debt Service Ratio (DSR) is ${dsr.toFixed(1)}%, which is within the standard conservative benchmark of ≤60%.`;
    recommendation = `You appear to meet the indicative criteria to apply. Proceed to compare Shariah-compliant financing products and submit your application.`;
  } else if (dsrBorderline || !ageValid || !incomeValid) {
    status = 'ADDITIONAL_INFO_REQUIRED';
    explanation = `Your indicative DSR is ${dsr.toFixed(1)}%, which is slightly elevated (60%–70%), or secondary eligibility details require supporting documentation.`;
    recommendation = `Participating providers may require additional income documentation, a guarantor, or a lower financing amount to evaluate your profile.`;
  } else {
    status = 'MAY_NOT_MEET';
    explanation = `Your indicative DSR of ${dsr.toFixed(1)}% exceeds the standard indicative limit (70%).`;
    recommendation = `Consider reducing the requested financing amount, extending the tenure, or clearing existing monthly commitments before submitting.`;
  }

  // Calculate max recommended financing (assuming max DSR of 60%)
  const maxAvailableMonthly = Math.max(0, income * 0.6 - existingCommitments);
  let maxRecommendedFinancing = 0;
  if (maxAvailableMonthly > 0) {
    if (rateMethod === 'flat') {
      const tenureMonths = input.tenureYears * 12;
      // monthly = (P + P*r*t)/m = P(1 + r*t)/m => P = monthly * m / (1 + r*t)
      maxRecommendedFinancing = (maxAvailableMonthly * tenureMonths) / (1 + rate * input.tenureYears);
    } else {
      const i = rate / 12;
      const n = input.tenureYears * 12;
      const compound = Math.pow(1 + i, n);
      maxRecommendedFinancing = maxAvailableMonthly * (compound - 1) / (i * compound);
    }
  }

  return {
    status,
    calculatedDsr: Number(dsr.toFixed(1)),
    estimatedMonthly: Math.round(newCommitment * 100) / 100,
    maxRecommendedFinancing: Math.max(0, Math.round(maxRecommendedFinancing / 1000) * 1000),
    factors,
    explanation,
    recommendation,
  };
}
