import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { COUNTRIES } from '../data/countries';
import { formatCurrency } from '../services/calculator';
import { DemoDataLabel } from './DemoDataLabel';
import { BarChart3, TrendingUp, ShieldCheck, Download } from 'lucide-react';

export const ProviderReportsPage: React.FC = () => {
  const { state } = useDemoStore();
  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;
  const providerApps = state.applications.filter((a) => a.country === state.activeCountry);

  const totalFinancingRequested = providerApps.reduce((sum, a) => sum + a.requestedAmount, 0);
  const totalFinancingDisbursed = providerApps
    .filter((a) => a.status === 'ACCEPTED' || a.status === 'DISBURSED')
    .reduce((sum, a) => sum + a.requestedAmount, 0);

  return (
    <div id="provider-reports-page" className="space-y-6 animate-fadeIn pb-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Shariah Portfolio & Compliance Analytics
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional portfolio metrics and Shariah supervisory board audit reporting
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export SAC Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Requested Pipeline</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(totalFinancingRequested, state.activeCountry, 'en')}
          </div>
          <span className="text-xs text-slate-500">{providerApps.length} Total Applications</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Approved / Disbursed</span>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono">
            {formatCurrency(totalFinancingDisbursed, state.activeCountry, 'en')}
          </div>
          <span className="text-xs text-emerald-700 font-semibold">100% Shariah Compliant</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Governance Rating</span>
          <div className="text-2xl font-extrabold text-blue-900 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
            Tier 1
          </div>
          <span className="text-xs text-slate-500">{countryConfig.regulatoryBody}</span>
        </div>
      </div>
    </div>
  );
};
