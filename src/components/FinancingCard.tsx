import React, { useState } from 'react';
import { FinancingProduct } from '../types';
import { useI18n } from '../i18n';
import { useDemoStore } from '../store/DemoStore';
import { PROVIDERS } from '../data/providers';
import { PRODUCT_IMAGES } from '../data/productImages';
import { formatCurrency, formatProfitRate, calculateFinancing } from '../services/calculator';
import { DemoDataLabel } from './DemoDataLabel';
import { PdsModal } from './PdsModal';
import { Check, Plus, ArrowRight, ShieldCheck, FileText, Star } from 'lucide-react';

interface FinancingCardProps {
  product: FinancingProduct;
  onApply: (product: FinancingProduct) => void;
  onViewDetails?: (product: FinancingProduct) => void;
  sampleAmount?: number;
  sampleTenureYears?: number;
}

export const FinancingCard: React.FC<FinancingCardProps> = ({
  product,
  onApply,
  onViewDetails,
  sampleAmount,
  sampleTenureYears,
}) => {
  const { t, locale } = useI18n();
  const { state, toggleCompareProduct } = useDemoStore();
  const [showPds, setShowPds] = useState(false);

  const provider = PROVIDERS.find((p) => p.id === product.providerId);
  const isCompared = state.selectedCompareProductIds.includes(product.id);
  const isTakaful = product.productKind === 'TAKAFUL';
  const productImage = PRODUCT_IMAGES[product.category];

  // Calculate indicative monthly instalment based on provided sample or default
  const defaultAmount = sampleAmount || (product.country === 'MY' ? 50000 : product.country === 'TR' ? 1200000 : 100000);
  const defaultTenure = sampleTenureYears || (product.country === 'MY' ? 7 : product.country === 'TR' ? 4 : 3);
  const calculation = isTakaful
    ? undefined
    : calculateFinancing(defaultAmount, product.annualProfitRate, defaultTenure, product.rateMethod);

  return (
    <>
      <div
        id={`product-card-${product.id}`}
        className={`relative bg-[#111111] rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-[#c4a67e]/40 ${
          product.featured ? 'ring-1 ring-[#c4a67e]/50 border-[#c4a67e]/30' : 'border-white/10'
        }`}
      >
        <div className="relative h-36 overflow-hidden">
          <img
            src={productImage.src}
            alt={productImage.alt}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent" />
          <span className="absolute bottom-3 left-4 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {isTakaful ? 'Takaful Protection' : product.category}
          </span>
        </div>

        {/* Featured Tag */}
        {product.featured && (
          <div className="bg-[#c4a67e] text-black text-[10px] font-mono font-bold uppercase tracking-wider py-1 px-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-black fill-black" />
              Featured Shariah Facility
            </span>
            <span className="opacity-80">Verified Compliance</span>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-4">
          {/* Header: Provider & Shariah Tag */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner border border-white/10"
                style={{
                  backgroundColor: '#181818',
                  color: '#c4a67e',
                }}
              >
                {provider?.logoText || 'IB'}
              </div>
              <div>
                <span className="text-xs font-medium text-white/40 block">
                  {provider?.name || 'Islamic Financial Institution'}
                </span>
                <h3 className="text-base font-serif-luxury font-bold text-white tracking-tight leading-snug">
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-[#c4a67e]/10 text-[#c4a67e] border border-[#c4a67e]/25">
                {product.shariahStructure}
              </span>
            </div>
          </div>

          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[#141414] rounded-xl border border-white/5">
            {isTakaful ? (
              <>
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-white/40 block tracking-wider">
                    Annual Contribution
                  </span>
                  <span className="text-xl font-bold text-[#c4a67e] font-mono block mt-0.5">
                    {formatCurrency(product.takafulData?.annualContribution || 0, product.country, locale)}
                  </span>
                  <span className="text-[10px] text-white/30 font-medium">
                    {product.takafulData?.contributionFrequency}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-white/40 block tracking-wider">
                    Coverage Amount
                  </span>
                  <span className="text-xl font-bold text-white font-mono block mt-0.5">
                    {formatCurrency(product.takafulData?.coverageAmount || 0, product.country, locale)}
                  </span>
                  <span className="text-[10px] text-white/30">Protection benefit</span>
                </div>
              </>
            ) : (
              <>
              <div>
              <span className="text-[9px] uppercase font-mono font-bold text-white/40 block tracking-wider">
                {t('common.profitRate')}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-[#c4a67e] font-mono">
                  {formatProfitRate(product.annualProfitRate)}
                </span>
              </div>
              <span className="text-[10px] text-white/30 font-medium">
                {product.rateMethod === 'flat' ? t('common.flatRate') : t('common.reducingRate')}
              </span>
            </div>

            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-white/40 block tracking-wider">
                {t('common.monthlyInstalment')}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-white font-mono">
                {formatCurrency(calculation?.monthlyInstalment || 0, product.country, locale)}
                </span>
              </div>
              <span className="text-[10px] text-white/30">
                {formatCurrency(defaultAmount, product.country, locale)} / {defaultTenure}y
              </span>
            </div>
              </>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-1.5">
            {product.keyFeatures.slice(0, 2).map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
          </div>

          <DemoDataLabel />
        </div>

        {/* Action Bottom Bar */}
        <div className="p-4 bg-[#0d0d0d] border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Compare Checkbox */}
            <button
              type="button"
              onClick={() => toggleCompareProduct(product.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                isCompared
                  ? 'bg-[#c4a67e] text-black font-semibold shadow-xs'
                  : 'bg-[#141414] text-white/70 border border-white/10 hover:bg-white/5'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {isCompared ? t('common.selected') : t('common.compare')}
            </button>

            {/* PDS Button for Malaysia */}
            {product.pdsData && (
              <button
                type="button"
                onClick={() => setShowPds(true)}
                className="px-2.5 py-1.5 text-xs text-[#c4a67e] hover:text-[#d4b890] font-mono font-medium flex items-center gap-1 transition rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10"
                title="View Product Disclosure Sheet"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDS</span>
              </button>
            )}
          </div>

          {/* Primary Apply CTA */}
          <button
            type="button"
            onClick={() => (isTakaful ? setShowPds(true) : onApply(product))}
            className="px-4 py-2 bg-[#c4a67e] hover:bg-[#d4b890] text-black text-xs font-bold rounded-lg transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isTakaful ? 'View Coverage' : t('common.applyNow')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PDS Modal */}
      {showPds && (
        <PdsModal
          product={product}
          isOpen={showPds}
          onClose={() => setShowPds(false)}
        />
      )}
    </>
  );
};
