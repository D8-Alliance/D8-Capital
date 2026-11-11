import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { COUNTRIES } from '../data/countries';
import { RateMethod } from '../types';
import {
  calculateFinancing,
  calculateVehicleFinancing,
  calculateAssetFinancing,
  formatCurrency,
  formatProfitRate,
} from '../services/calculator';
import { CurrencyInput } from './CurrencyInput';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import {
  Calculator as CalcIcon,
  Percent,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info,
  Table as TableIcon,
} from 'lucide-react';

interface CalculatorPageProps {
  onProceedToApply: (amount: number, tenure: number) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onProceedToApply }) => {
  const { state } = useDemoStore();
  const { t, locale } = useI18n();

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;

  // Calculator Modes
  const [calcMode, setCalcMode] = useState<'personal' | 'vehicle' | 'business'>(
    state.activeCountry === 'TR' ? 'vehicle' : state.activeCountry === 'AZ' ? 'business' : 'personal'
  );

  // Common Inputs
  const [amount, setAmount] = useState<number>(
    state.activeCountry === 'MY' ? 50000 : state.activeCountry === 'TR' ? 1200000 : 100000
  );
  const [annualRate, setAnnualRate] = useState<number>(
    state.activeCountry === 'MY' ? 0.045 : state.activeCountry === 'TR' ? 0.32 : 0.14
  );
  const [tenureYears, setTenureYears] = useState<number>(
    state.activeCountry === 'MY' ? 7 : state.activeCountry === 'TR' ? 4 : 3
  );
  const [rateMethod, setRateMethod] = useState<RateMethod>(
    state.activeCountry === 'MY' ? 'flat' : 'reducing'
  );

  // Vehicle specific
  const [vehiclePrice, setVehiclePrice] = useState<number>(1500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);

  // Business specific
  const [assetCost, setAssetCost] = useState<number>(120000);
  const [securityDepositPercent, setSecurityDepositPercent] = useState<number>(15);

  // Show Amortization Table toggle
  const [showSchedule, setShowSchedule] = useState(false);

  // Calculation computation
  let calculation = calculateFinancing(amount, annualRate, tenureYears, rateMethod);

  if (calcMode === 'vehicle') {
    const downPayment = vehiclePrice * (downPaymentPercent / 100);
    const vehicleCalc = calculateVehicleFinancing(
      vehiclePrice,
      downPayment,
      annualRate,
      tenureYears,
      rateMethod
    );
    calculation = vehicleCalc;
  } else if (calcMode === 'business') {
    const securityDeposit = assetCost * (securityDepositPercent / 100);
    const assetCalc = calculateAssetFinancing(
      assetCost,
      securityDeposit,
      annualRate,
      tenureYears,
      rateMethod
    );
    calculation = assetCalc;
  }

  return (
    <div id="calculator-page" className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('calc.title')} ({countryConfig.name})
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('calc.subtitle')}</p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setCalcMode('personal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              calcMode === 'personal'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('calc.personalTab')}
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('vehicle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              calcMode === 'vehicle'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('calc.vehicleTab')}
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('business')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              calcMode === 'business'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('calc.businessTab')}
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalcIcon className="w-4 h-4 text-emerald-700" />
              <span>Financing Parameters</span>
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {rateMethod === 'flat' ? 'Flat Profit Method (MY)' : 'Reducing Balance / Annuity (TR/AZ)'}
            </span>
          </div>

          {/* Mode Specific Inputs */}
          {calcMode === 'personal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t('calc.financingAmount')}
                </label>
                <CurrencyInput
                  id="calc-personal-amount"
                  value={amount}
                  onChange={setAmount}
                  country={state.activeCountry}
                />
              </div>
            </div>
          )}

          {calcMode === 'vehicle' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t('calc.vehiclePrice')}
                </label>
                <CurrencyInput
                  id="calc-vehicle-price"
                  value={vehiclePrice}
                  onChange={setVehiclePrice}
                  country={state.activeCountry}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>{t('calc.downPayment')} ({downPaymentPercent}%)</span>
                  <span className="text-emerald-800 font-mono">
                    {formatCurrency(vehiclePrice * (downPaymentPercent / 100), state.activeCountry, locale)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {calcMode === 'business' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t('calc.assetValue')}
                </label>
                <CurrencyInput
                  id="calc-asset-cost"
                  value={assetCost}
                  onChange={setAssetCost}
                  country={state.activeCountry}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Advance Security Deposit / Hamish Jiddiyyah ({securityDepositPercent}%)</span>
                  <span className="text-emerald-800 font-mono">
                    {formatCurrency(assetCost * (securityDepositPercent / 100), state.activeCountry, locale)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={5}
                  value={securityDepositPercent}
                  onChange={(e) => setSecurityDepositPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Tenure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                {t('common.tenure')}
              </span>
              <span className="text-emerald-800 font-bold">{tenureYears} Years ({tenureYears * 12} Months)</span>
            </div>
            <input
              type="range"
              min={1}
              max={state.activeCountry === 'MY' ? 10 : 7}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value))}
              className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Profit Rate Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-emerald-700" />
                {t('common.profitRate')}
              </span>
              <span className="text-emerald-800 font-mono font-bold">
                {formatProfitRate(annualRate)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={state.activeCountry === 'TR' ? 15 : state.activeCountry === 'AZ' ? 8 : 2}
                max={state.activeCountry === 'TR' ? 50 : state.activeCountry === 'AZ' ? 24 : 12}
                step={0.25}
                value={(annualRate * 100).toFixed(2)}
                onChange={(e) => setAnnualRate(parseFloat(e.target.value) / 100)}
                className="flex-1 accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-700 w-16 text-right">
                {(annualRate * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Rate Method Toggle */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Calculation Methodology (§10)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRateMethod('flat')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  rateMethod === 'flat'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-xs block">Flat Rate Formula</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5 block">
                  Total Profit = P × r × t (Malaysia BNM Standard)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRateMethod('reducing')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  rateMethod === 'reducing'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-xs block">Reducing Balance / Annuity</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5 block">
                  Compounded monthly amortization (TR / AZ Standard)
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Bento Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Estimated Output
              </span>
              <span className="text-xs font-mono text-slate-300">
                {tenureYears * 12} Monthly Payments
              </span>
            </div>

            {/* Monthly Highlight */}
            <div className="space-y-1">
              <span className="text-xs text-slate-300">{t('common.monthlyInstalment')}</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {formatCurrency(calculation.monthlyInstalment, state.activeCountry, locale)}
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('calc.indicativeNotice')}
              </span>
            </div>

            {/* Breakdown Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {t('calc.totalProfit')}
                </span>
                <span className="text-sm font-bold text-amber-300 font-mono mt-0.5 block">
                  {formatCurrency(calculation.totalProfit, state.activeCountry, locale)}
                </span>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {t('calc.totalPayable')}
                </span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                  {formatCurrency(calculation.totalPayable, state.activeCountry, locale)}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={() => onProceedToApply(calculation.principal, tenureYears)}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply for Financing with this Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Schedule Preview */}
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-between shadow-2xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-700" />
              <span>{t('calc.schedulePreview')}</span>
            </span>
            <span className="text-emerald-800 font-bold">{showSchedule ? 'Hide' : 'View'}</span>
          </button>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {showSchedule && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-700" />
              <span>{t('calc.schedulePreview')} (First 6 Months)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Method: {rateMethod.toUpperCase()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">{t('calc.monthCol')}</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">{t('calc.principalCol')}</th>
                  <th className="py-2.5 px-3">{t('calc.profitCol')}</th>
                  <th className="py-2.5 px-3 text-right">{t('calc.balanceCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {calculation.schedulePreview.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800">
                      Month {row.month}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {formatCurrency(row.monthlyPayment, state.activeCountry, locale)}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-800">
                      {formatCurrency(row.principalPaid, state.activeCountry, locale)}
                    </td>
                    <td className="py-2.5 px-3 text-amber-700">
                      {formatCurrency(row.profitPaid, state.activeCountry, locale)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {formatCurrency(row.remainingBalance, state.activeCountry, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer />
    </div>
  );
};
