import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { PRODUCTS } from '../data/products';
import { COUNTRIES } from '../data/countries';
import { FinancingProduct } from '../types';
import { FinancingCard } from '../components/FinancingCard';
import { StatusBadge } from '../components/StatusBadge';
import { CountryFlagBadge } from '../components/CountryFlagBadge';
import { DemoDataLabel } from '../components/DemoDataLabel';
import { RegulatoryDisclaimer } from '../components/RegulatoryDisclaimer';
import { formatCurrency } from '../services/calculator';
import {
  ArrowRight,
  Calculator,
  Search,
  CheckCircle2,
  FileText,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onApplyProduct: (product: FinancingProduct) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigate,
  onApplyProduct,
}) => {
  const { state } = useDemoStore();
  const { t, locale } = useI18n();

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;
  const countryProducts = PRODUCTS.filter((p) => p.country === state.activeCountry);
  const featuredProducts = countryProducts.filter((p) => p.featured).slice(0, 3);

  // Latest active application
  const latestApp = state.applications.find((a) => a.country === state.activeCountry) || state.applications[0];

  return (
    <div id="customer-dashboard" className="space-y-8 animate-fadeIn pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-900/40">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <CountryFlagBadge country={state.activeCountry} />
            <DemoDataLabel variant="badge" className="bg-emerald-900/80 text-emerald-200 border-emerald-700" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t('dashboard.welcome')}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {t('dashboard.subheading')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('financing')}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t('dashboard.compareFinancing')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('calculator')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{t('dashboard.useCalculator')}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('eligibility')}
              className="px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition border border-amber-500/30 flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Check Eligibility (DSR)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Application Live Status Alert / Offer Banner */}
      {latestApp && (
        <div
          id="active-app-banner"
          className={`p-6 rounded-3xl border transition shadow-sm ${
            latestApp.status === 'OFFER_ISSUED'
              ? 'bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  latestApp.status === 'OFFER_ISSUED'
                    ? 'bg-amber-500 text-slate-950 animate-bounce'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {latestApp.status === 'OFFER_ISSUED' ? (
                  <Sparkles className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    #{latestApp.applicationNumber}
                  </span>
                  <StatusBadge status={latestApp.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {latestApp.productName} • {latestApp.providerName}
                </h3>

                <p className="text-xs text-slate-600">
                  Requested: <strong>{formatCurrency(latestApp.requestedAmount, latestApp.country, locale)}</strong> for{' '}
                  <strong>{latestApp.requestedTenureYears} {t('common.years')}</strong> ({latestApp.shariahStructure})
                </p>

                {latestApp.status === 'OFFER_ISSUED' && (
                  <p className="text-xs font-bold text-emerald-800 pt-1">
                    🎉 Shariah financing offer ready! Approved rate:{' '}
                    {latestApp.offer && `${(latestApp.offer.approvedProfitRate * 100).toFixed(2)}% p.a.`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('applications')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  latestApp.status === 'OFFER_ISSUED'
                    ? 'bg-emerald-800 hover:bg-emerald-950 text-white'
                    : 'bg-slate-900 hover:bg-emerald-950 text-white'
                }`}
              >
                <span>
                  {latestApp.status === 'OFFER_ISSUED' ? 'View & Accept Offer' : 'Track Application'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Shariah Financing Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t('dashboard.recommendedTitle')} ({countryConfig.name})
            </h2>
            <p className="text-xs text-slate-500">
              Verified by independent Shariah supervision boards • {countryConfig.currency}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('financing')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition"
          >
            <span>{t('common.viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <FinancingCard
              key={product.id}
              product={product}
              onApply={onApplyProduct}
              sampleAmount={
                product.country === 'MY' ? 50000 : product.country === 'TR' ? 1200000 : 100000
              }
              sampleTenureYears={product.country === 'MY' ? 7 : product.country === 'TR' ? 4 : 3}
            />
          ))}
        </div>
      </div>

      {/* Core Principles & Regulatory Framework */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">100% Shariah-Compliant</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every product operates strictly without Riba (interest), Gharar (excessive ambiguity), or Maysir (gambling).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Independent Marketplace</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            D8 Capital is a marketplace connecting you with licensed Islamic and participation banks, not a lender.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Transparent Profit Rates & Ibra'</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clear profit margins, standardized Product Disclosure Sheets (PDS), and guaranteed Ibra' rebate terms.
          </p>
        </div>
      </div>

      {/* Regulatory Disclaimer (§25) */}
      <RegulatoryDisclaimer />
    </div>
  );
};
