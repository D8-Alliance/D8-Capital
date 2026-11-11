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
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

interface ApplicationsListPageProps {
  onSelectApplication: (app: FinancingApplication) => void;
  onNewApplication: () => void;
}

export const ApplicationsListPage: React.FC<ApplicationsListPageProps> = ({
  onSelectApplication,
  onNewApplication,
}) => {
  const { state } = useDemoStore();
  const { t, locale } = useI18n();

  // Filter applications for current user / scenario
  const userApplications = state.applications.filter((a) => a.country === state.activeCountry);

  return (
    <div id="applications-list-page" className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('nav.applications')}
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your Shariah financing applications and review provider decisions
          </p>
        </div>

        <button
          type="button"
          onClick={onNewApplication}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Applications Cards / Table */}
      {userApplications.length > 0 ? (
        <div className="space-y-4">
          {userApplications.map((app) => {
            const hasOffer = app.status === 'OFFER_ISSUED';

            return (
              <div
                key={app.id}
                id={`app-card-${app.id}`}
                onClick={() => onSelectApplication(app)}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 cursor-pointer hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  hasOffer
                    ? 'bg-gradient-to-r from-emerald-50 via-amber-50/40 to-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl shrink-0 ${
                      hasOffer
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {hasOffer ? <Sparkles className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{app.applicationNumber}
                      </span>
                      <CountryFlagBadge country={app.country} showCurrency={false} />
                      <StatusBadge status={app.status} size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{app.productName}</h3>
                    <p className="text-xs text-slate-600">
                      Provider: <strong>{app.providerName}</strong> • Principle:{' '}
                      <span className="font-semibold text-emerald-800">{app.shariahStructure}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      <span className="text-slate-500">
                        Facility Amount:{' '}
                        <strong className="text-slate-900 font-mono">
                          {formatCurrency(app.requestedAmount, app.country, locale)}
                        </strong>
                      </span>
                      <span className="text-slate-500">
                        Tenure: <strong className="text-slate-900">{app.requestedTenureYears} Years</strong>
                      </span>
                      <span className="text-slate-500">
                        Monthly:{' '}
                        <strong className="text-emerald-800 font-mono">
                          {formatCurrency(app.estimatedMonthlyInstalment, app.country, locale)}
                        </strong>
                      </span>
                    </div>

                    {hasOffer && (
                      <div className="mt-2 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Financing Offer Issued! Click to review and execute digital acceptance.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <span>{hasOffer ? 'Review Offer' : 'View Details'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Applications Submitted Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our Shariah-compliant facilities and submit your financing application in minutes.
          </p>
          <button
            type="button"
            onClick={onNewApplication}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-950 transition"
          >
            Start Financing Application
          </button>
        </div>
      )}

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer compact />
    </div>
  );
};
