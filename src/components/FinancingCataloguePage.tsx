import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { PRODUCTS } from '../data/products';
import { COUNTRIES } from '../data/countries';
import { FinancingCategoryType, FinancingProduct } from '../types';
import { FinancingCard } from './FinancingCard';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import { Search, Filter, Layers, ArrowRight, X, Sparkles } from 'lucide-react';

interface FinancingCataloguePageProps {
  onApply: (product: FinancingProduct) => void;
  onNavigateToCompare: () => void;
}

export const FinancingCataloguePage: React.FC<FinancingCataloguePageProps> = ({
  onApply,
  onNavigateToCompare,
}) => {
  const { state, clearComparison } = useDemoStore();
  const { t } = useI18n();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;

  // Filter products for active country
  const countryProducts = PRODUCTS.filter((p) => p.country === state.activeCountry);

  const filteredProducts = countryProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shariahStructure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.keyFeatures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const categoryOptions = [
    { id: 'all', label: t('common.all') },
    ...countryConfig.activeCategories.map((cat) => ({
      id: cat,
      label: cat === 'takaful' ? 'Takaful Protection' : t(`category.${cat}` as any),
    })),
  ];

  return (
    <div id="financing-catalogue-page" className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('catalogue.title')} ({countryConfig.name})
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('catalogue.subtitle')}</p>
        </div>

        {/* Selected Compare Floating Action */}
        {state.selectedCompareProductIds.length > 0 && (
          <div className="flex items-center gap-2 bg-emerald-950 text-white px-4 py-2 rounded-2xl shadow-lg animate-fadeIn">
            <span className="text-xs font-bold text-emerald-300">
              {state.selectedCompareProductIds.length} {t('common.selected')}
            </span>
            <button
              type="button"
              onClick={onNavigateToCompare}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>{t('catalogue.compareSelected')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={clearComparison}
              className="p-1 text-slate-400 hover:text-white transition"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search')}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <FinancingCard
              key={product.id}
              product={product}
              onApply={onApply}
              sampleAmount={
                product.country === 'MY' ? 50000 : product.country === 'TR' ? 1200000 : 100000
              }
              sampleTenureYears={product.country === 'MY' ? 7 : product.country === 'TR' ? 4 : 3}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Financing Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or switching to another category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-950 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Regulatory Notice */}
      <RegulatoryDisclaimer compact />
    </div>
  );
};
