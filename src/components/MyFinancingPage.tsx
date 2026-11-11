import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { COUNTRIES } from '../data/countries';
import { formatCurrency, formatProfitRate } from '../services/calculator';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingDown,
  FileDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface MyFinancingPageProps {
  onExploreNewFinancing: () => void;
}

export const MyFinancingPage: React.FC<MyFinancingPageProps> = ({ onExploreNewFinancing }) => {
  const { state } = useDemoStore();
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'ibra'>('overview');
  const [simulatedPaidMonths, setSimulatedPaidMonths] = useState<number>(3);

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;
  const activeFacility = state.activeAccounts.find((a) => a.country === state.activeCountry) || state.activeAccounts[0];

  if (!activeFacility) {
    return (
      <div id="my-financing-empty" className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <Wallet className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{t('myFinancing.title')}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Once your financing application is approved by a participating Islamic institution and you execute the digital contract, your active facility management dashboard will appear here.
        </p>
        <button
          type="button"
          onClick={onExploreNewFinancing}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          Explore Financing Facilities
        </button>
      </div>
    );
  }

  const principal = activeFacility.facilityAmount;
  const monthly = activeFacility.monthlyInstalment;
  const totalMonths = activeFacility.tenureYears * 12;
  const totalPayable = monthly * totalMonths;
  const remainingBalance = Math.max(0, activeFacility.outstandingBalance - (simulatedPaidMonths * (principal / totalMonths)));
  const progressPercent = Math.min(100, (simulatedPaidMonths / totalMonths) * 100);

  // Early settlement Ibra rebate calculation
  const remainingMonths = totalMonths - simulatedPaidMonths;
  const unearnedProfitRebate = Math.max(0, (totalPayable - principal) * (remainingMonths / totalMonths) * 0.85);
  const netSettlementPayable = remainingBalance;

  return (
    <div id="my-financing-page" className="space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('nav.myFinancing')} (STEP 22)
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Active Shariah Financing Facility • {countryConfig.name}
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'schedule' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Payment Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ibra')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'ibra' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Ibra' (Early Settlement)
          </button>
        </div>
      </div>

      {/* Main Facility Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              Active Shariah Facility
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              {activeFacility.productName}
            </h2>
            <p className="text-xs text-slate-300">
              Provider: <strong>{activeFacility.providerName}</strong> • Facility Account:{' '}
              <span className="font-mono text-emerald-400">{activeFacility.accountNumber}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ACTIVE DISBURSED
            </span>
          </div>
        </div>

        {/* Facility Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('myFinancing.outstanding')}</span>
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono mt-0.5 block">
              {formatCurrency(remainingBalance, activeFacility.country, locale)}
            </span>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('common.monthlyInstalment')}</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono mt-0.5 block">
              {formatCurrency(monthly, activeFacility.country, locale)}
            </span>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('common.profitRate')}</span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono mt-0.5 block">
              {formatProfitRate(activeFacility.profitRate)}
            </span>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('myFinancing.nextPayment')}</span>
            <span className="text-lg sm:text-xl font-extrabold text-white mt-0.5 block">
              {new Date(activeFacility.nextPaymentDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Repayment Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-mono">
            <span>
              Tenure Progress: {simulatedPaidMonths} of {totalMonths} Months
            </span>
            <span className="font-bold text-emerald-400">{progressPercent.toFixed(1)}% Completed</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Demo Quick Action: Pay Instalment */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 text-xs">
          <span className="text-slate-400">
            Simulated Demo repayments update your balance in real-time.
          </span>
          <button
            type="button"
            onClick={() => setSimulatedPaidMonths((prev) => Math.min(totalMonths, prev + 1))}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pay Next Instalment (Demo Action)</span>
          </button>
        </div>
      </div>

      {/* TAB: Payment Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>{t('myFinancing.scheduleTitle')}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Facility Term: {totalMonths} Months
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Instalment #</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Principal</th>
                  <th className="py-2.5 px-3">Shariah Profit</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {Array.from({ length: 12 }).map((_, idx) => {
                  const monthNum = idx + 1;
                  const isPaid = monthNum <= simulatedPaidMonths;

                  return (
                    <tr key={monthNum} className={isPaid ? 'bg-emerald-50/30' : ''}>
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-800">
                        Month {monthNum}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {formatCurrency(monthly, activeFacility.country, locale)}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-800">
                        {formatCurrency(monthly * 0.75, activeFacility.country, locale)}
                      </td>
                      <td className="py-2.5 px-3 text-amber-700">
                        {formatCurrency(monthly * 0.25, activeFacility.country, locale)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Upcoming
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Ibra' Early Settlement Calculator */}
      {activeTab === 'ibra' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Shariah Early Settlement Rebate (Ibra') Simulator
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {t('myFinancing.ibraInfo')} Under Bank Negara Malaysia SAC / TKBB guidelines, customers who settle Shariah-compliant facilities prior to maturity are entitled to an unearned profit rebate (Ibra\').
              </p>
            </div>
          </div>

          {/* Ibra' Breakdown Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Gross Contract Balance
              </span>
              <span className="text-lg font-extrabold text-slate-900 font-mono mt-1 block">
                {formatCurrency(remainingBalance + unearnedProfitRebate, activeFacility.country, locale)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Estimated Ibra' Profit Rebate
              </span>
              <span className="text-lg font-extrabold text-emerald-900 font-mono mt-1 block">
                - {formatCurrency(unearnedProfitRebate, activeFacility.country, locale)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Net Early Settlement Amount
              </span>
              <span className="text-lg font-extrabold text-amber-300 font-mono mt-1 block">
                {formatCurrency(netSettlementPayable, activeFacility.country, locale)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer />
    </div>
  );
};
