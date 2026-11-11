import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { COUNTRIES } from '../data/countries';
import { evaluateEligibility } from '../services/eligibility';
import { formatCurrency } from '../services/calculator';
import { CurrencyInput } from './CurrencyInput';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface EligibilityPageProps {
  onProceedToProducts: () => void;
}

export const EligibilityPage: React.FC<EligibilityPageProps> = ({ onProceedToProducts }) => {
  const { state } = useDemoStore();
  const { t, locale } = useI18n();

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;

  // Form Inputs
  const [age, setAge] = useState<number>(35);
  const [employmentType, setEmploymentType] = useState<string>('Employed (Private Sector)');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(
    state.activeCountry === 'MY' ? 8500 : state.activeCountry === 'TR' ? 140000 : 8000
  );
  const [existingDebt, setExistingDebt] = useState<number>(
    state.activeCountry === 'MY' ? 1800 : state.activeCountry === 'TR' ? 25000 : 1200
  );
  const [desiredAmount, setDesiredAmount] = useState<number>(
    state.activeCountry === 'MY' ? 50000 : state.activeCountry === 'TR' ? 1200000 : 100000
  );
  const [desiredTenure, setDesiredTenure] = useState<number>(
    state.activeCountry === 'MY' ? 7 : state.activeCountry === 'TR' ? 4 : 3
  );

  // Evaluate
  const assessment = evaluateEligibility({
    country: state.activeCountry,
    age,
    employmentType,
    monthlyIncome,
    existingMonthlyCommitments: existingDebt,
    requestedAmount: desiredAmount,
    tenureYears: desiredTenure,
  });

  const getResultBadge = () => {
    switch (assessment.status) {
      case 'POTENTIALLY_ELIGIBLE':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          title: t('eligibility.potentiallyEligible'),
          desc: assessment.explanation,
        };
      case 'ADDITIONAL_INFO_REQUIRED':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          icon: AlertCircle,
          iconColor: 'text-amber-600',
          title: t('eligibility.additionalInfo'),
          desc: assessment.explanation,
        };
      case 'MAY_NOT_MEET':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-900',
          icon: XCircle,
          iconColor: 'text-rose-600',
          title: t('eligibility.mayNotMeet'),
          desc: assessment.explanation,
        };
    }
  };

  const resultBadge = getResultBadge();
  const ResultIcon = resultBadge.icon;

  return (
    <div id="eligibility-page" className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('eligibility.title')} ({countryConfig.name})
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('eligibility.subtitle')}</p>
        </div>
      </div>

      {/* Grid: Form + Assessment Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Applicant Profile Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t('eligibility.age')}
              </label>
              <input
                type="number"
                min={21}
                max={65}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 21)}
                className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t('eligibility.employment')}
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Employed (Private Sector)">Private Sector</option>
                <option value="Government / Civil Service">Civil Service / GLC</option>
                <option value="Self-Employed / Business Owner">Self-Employed / SME</option>
                <option value="Professional / Freelance">Professional Practice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t('eligibility.monthlyIncome')}
            </label>
            <CurrencyInput
              id="eligibility-income"
              value={monthlyIncome}
              onChange={setMonthlyIncome}
              country={state.activeCountry}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t('eligibility.commitments')}
            </label>
            <CurrencyInput
              id="eligibility-debt"
              value={existingDebt}
              onChange={setExistingDebt}
              country={state.activeCountry}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Desired Amount
              </label>
              <CurrencyInput
                id="eligibility-desired-amount"
                value={desiredAmount}
                onChange={setDesiredAmount}
                country={state.activeCountry}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tenure (Years)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={desiredTenure}
                onChange={(e) => setDesiredTenure(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Assessment Results Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-sm space-y-6 ${resultBadge.bg}`}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/80 shadow-xs shrink-0">
                <ResultIcon className={`w-8 h-8 ${resultBadge.iconColor}`} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                  Indicative Assessment Result
                </span>
                <h3 className="text-xl font-extrabold">{resultBadge.title}</h3>
                <p className="text-xs leading-relaxed opacity-90">{resultBadge.desc}</p>
              </div>
            </div>

            {/* DSR Metrics Bento */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-white/70 rounded-2xl border border-black/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {t('eligibility.dsrLabel')}
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-0.5">
                  {assessment.calculatedDsr}%
                </span>
                <span className="text-[10px] text-slate-500">Benchmark: ≤60%</span>
              </div>

              <div className="p-3.5 bg-white/70 rounded-2xl border border-black/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {t('eligibility.maxRecFinancing')}
                </span>
                <span className="text-lg font-extrabold font-mono text-emerald-800 block mt-0.5">
                  {formatCurrency(assessment.maxRecommendedFinancing, state.activeCountry, locale)}
                </span>
                <span className="text-[10px] text-slate-500">
                  Est. Monthly: {formatCurrency(assessment.estimatedMonthly, state.activeCountry, locale)}
                </span>
              </div>
            </div>

            {/* Factors Checklist */}
            <div className="space-y-2 pt-2 border-t border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider block text-slate-800">
                {t('eligibility.criteriaBreakdown')}
              </span>
              <div className="space-y-1.5">
                {assessment.factors.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/80 border border-black/5 flex items-start gap-2 text-xs"
                  >
                    {f.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block">{f.name}</span>
                      <p className="text-[11px] text-slate-600">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToProducts}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('eligibility.proceedToApply')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <RegulatoryDisclaimer />
    </div>
  );
};
