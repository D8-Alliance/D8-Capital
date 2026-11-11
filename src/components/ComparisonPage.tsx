import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { PRODUCTS } from '../data/products';
import { COUNTRIES } from '../data/countries';
import { FinancingProduct } from '../types';
import { ComparisonTable } from './ComparisonTable';
import { CurrencyInput } from './CurrencyInput';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import { Sliders, RotateCcw, ArrowRight } from 'lucide-react';

interface ComparisonPageProps {
  onApply: (product: FinancingProduct) => void;
  onNavigateToFinancing: () => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  onApply,
  onNavigateToFinancing,
}) => {
  const { state } = useDemoStore();
  const { t } = useI18n();

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;
  const countryProducts = PRODUCTS.filter((p) => p.country === state.activeCountry);

  // If user has chosen specific compare IDs, use them; otherwise compare all country products
  const selectedProducts =
    state.selectedCompareProductIds.length > 0
      ? countryProducts.filter((p) => state.selectedCompareProductIds.includes(p.id))
      : countryProducts;

  // Comparison Parameters
  const defaultAmount =
    state.activeCountry === 'MY' ? 50000 : state.activeCountry === 'TR' ? 1200000 : 100000;
  const defaultTenure = state.activeCountry === 'MY' ? 7 : state.activeCountry === 'TR' ? 4 : 3;

  const [compareAmount, setCompareAmount] = useState<number>(defaultAmount);
  const [compareTenureYears, setCompareTenureYears] = useState<number>(defaultTenure);

  return (
    <div id="comparison-page" className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('compare.title')} ({countryConfig.name})
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('compare.subtitle')}</p>
        </div>

        <button
          type="button"
          onClick={onNavigateToFinancing}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Browse All Facilities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Controls Bar for Amount & Tenure */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Financing Amount Requirement
          </label>
          <CurrencyInput
            id="compare-amount-input"
            value={compareAmount}
            onChange={setCompareAmount}
            country={state.activeCountry}
            step={state.activeCountry === 'TR' ? 50000 : 5000}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Financing Tenure: <span className="text-emerald-800 font-mono">{compareTenureYears} Years</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">
              ({compareTenureYears * 12} Months)
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={state.activeCountry === 'MY' ? 10 : state.activeCountry === 'TR' ? 5 : 5}
            step={1}
            value={compareTenureYears}
            onChange={(e) => setCompareTenureYears(parseInt(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>1 Year</span>
            <span>{state.activeCountry === 'MY' ? '10 Years' : '5 Years'}</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable
        products={selectedProducts}
        sampleAmount={compareAmount}
        sampleTenureYears={compareTenureYears}
        onApply={onApply}
      />

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer />
    </div>
  );
};
