import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { FinancingApplication } from '../types';
import { StatusBadge } from './StatusBadge';
import { CountryFlagBadge } from './CountryFlagBadge';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import { formatCurrency } from '../services/calculator';
import {
  Building2,
  FileCheck2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface ProviderDashboardProps {
  onReviewApplication: (app: FinancingApplication) => void;
  onNavigateTab: (tab: string) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  onReviewApplication,
  onNavigateTab,
}) => {
  const { state } = useDemoStore();
  const { t, locale } = useI18n();

  // Provider's application queue for active country
  const providerApps = state.applications.filter((a) => a.country === state.activeCountry);

  const pendingCount = providerApps.filter((a) => a.status === 'SUBMITTED').length;
  const inReviewCount = providerApps.filter(
    (a) => a.status === 'DOCUMENTS_VERIFICATION' || a.status === 'PROVIDER_ASSESSMENT'
  ).length;
  const offerCount = providerApps.filter((a) => a.status === 'OFFER_ISSUED').length;
  const disbursedCount = providerApps.filter(
    (a) => a.status === 'ACCEPTED' || a.status === 'DISBURSED'
  ).length;

  return (
    <div id="provider-dashboard" className="space-y-8 animate-fadeIn pb-24">
      {/* Provider Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-blue-300 tracking-wider">
                  Participating Financial Institution Portal (§15)
                </span>
                <CountryFlagBadge country={state.activeCountry} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
                {state.activeUser.providerName || 'Islamic Financial Institution Portal'}
              </h1>
            </div>
          </div>

          <DemoDataLabel variant="badge" className="bg-blue-900/80 text-blue-200 border-blue-700" />
        </div>

        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Review incoming Shariah financing dossiers, perform credit assessment, verify e-KYC documents, and issue formal financing offers (STEP 15–18).
        </p>
      </div>

      {/* KPI Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              New Applications
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {pendingCount}
          </div>
          <span className="text-[11px] text-blue-700 font-semibold">Requires Assessment</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Under Verification
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {inReviewCount}
          </div>
          <span className="text-[11px] text-slate-500">KYC/Dossier Analysis</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Offers Issued
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
            {offerCount}
          </div>
          <span className="text-[11px] text-amber-700">Awaiting Customer Execution</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Disbursed Facilities
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
            {disbursedCount}
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold">Active Portfolios</span>
        </div>
      </div>

      {/* Main Review Queue (STEP 16) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-700" />
              Incoming Financing Applications Queue (STEP 16)
            </h3>
            <p className="text-xs text-slate-500">
              Live queue of applicants awaiting assessment and financing offer dispatch
            </p>
          </div>
        </div>

        {providerApps.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {providerApps.map((app) => (
              <div
                key={app.id}
                id={`provider-app-row-${app.id}`}
                onClick={() => onReviewApplication(app)}
                className="py-4 px-3 rounded-2xl hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      #{app.applicationNumber}
                    </span>
                    <StatusBadge status={app.status} size="sm" />
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {app.shariahStructure}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {app.userName || app.applicantKyc?.fullName}{' '}
                    <span className="text-slate-400 font-normal">({app.productName})</span>
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>
                      Requested:{' '}
                      <strong className="text-slate-900 font-mono">
                        {formatCurrency(app.requestedAmount, app.country, locale)}
                      </strong>
                    </span>
                    <span>
                      Tenure: <strong className="text-slate-900">{app.requestedTenureYears}y</strong>
                    </span>
                    <span>
                      Monthly Income:{' '}
                      <strong className="text-slate-900 font-mono">
                        {formatCurrency(app.applicantKyc?.monthlyIncome || 0, app.country, locale)}
                      </strong>
                    </span>
                    <span>
                      Docs:{' '}
                      <strong className="text-emerald-800">{app.documents.length} Files</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onReviewApplication(app)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <span>Review Dossier (STEP 17)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            No applications in the queue for this jurisdiction.
          </div>
        )}
      </div>

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer compact />
    </div>
  );
};
